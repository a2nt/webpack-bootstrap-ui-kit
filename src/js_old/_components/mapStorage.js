'use strict'

import mapbox from 'mapbox-gl'

window.offlineMaps = {}

window.offlineMaps.eventManager = {
  _events: {},

  on: function (event, action) {
    console.log(`event.on: ${event}`)
    if (!(event in this._events)) {
      this._events[event] = []
    }
    this._events[event].push(action)
    return this
  },

  off: function (event) {
    console.log(`event.off: ${event}`)
    delete this._events[event]
    return this
  },

  fire: function (event) {
    console.log(`event.fire: ${event}`)
    const events = this._events
    if (event in events) {
      const actions = events[event]
      const args = Array.prototype.slice.call(arguments, 1)
      for (let i = 0, l = actions.length; i < l; i++) {
        const action = actions[i]
        if (action instanceof Function) {
          action.apply(null, args)
        } else {
          this.fire.apply(this, [action].concat(args))
        }
      }
    }
    return this
  },
};

(function (window, emr, undefined) {
  const getIndexedDBStorage = function () {
    const indexedDB =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB

    const IndexedDBImpl = function () {
      const self = this
      let db = null
      const request = indexedDB.open('TileStorage')

      request.onsuccess = function () {
        db = this.result
        emr.fire('storageLoaded', self)
      }

      request.onerror = function (error) {
        console.log(error)
      }

      request.onupgradeneeded = function () {
        const store = this.result.createObjectStore('tile', { keyPath: 'key' })
        store.createIndex('key', 'key', { unique: true })
      }

      this.add = function (key, value) {
        const transaction = db.transaction(['tile'], 'readwrite')
        const objectStore = transaction.objectStore('tile')
        objectStore.put({ key, value })
      }

      this.delete = function (key) {
        const transaction = db.transaction(['tile'], 'readwrite')
        const objectStore = transaction.objectStore('tile')
        objectStore.delete(key)
      }

      this.get = function (key, successCallback, errorCallback) {
        const transaction = db.transaction(['tile'], 'readonly')
        const objectStore = transaction.objectStore('tile')
        const result = objectStore.get(key)
        result.onsuccess = function () {
          successCallback(this.result ? this.result.value : undefined)
        }
        result.onerror = errorCallback
      }
    }

    return indexedDB ? new IndexedDBImpl() : null
  }

  const getWebSqlStorage = function () {
    const openDatabase = window.openDatabase

    const WebSqlImpl = function () {
      const self = this
      const db = openDatabase(
        'TileStorage',
        '1.0',
        'Tile Storage',
        5 * 1024 * 1024
      )
      db.transaction((tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS tile (key TEXT PRIMARY KEY, value TEXT)',
          [],
          () => {
            emr.fire('storageLoaded', self)
          }
        )
      })

      this.add = function (key, value) {
        db.transaction((tx) => {
          tx.executeSql('INSERT INTO tile (key, value) VALUES (?, ?)', [
            key,
            value,
          ])
        })
      }

      this.delete = function (key) {
        db.transaction((tx) => {
          tx.executeSql('DELETE FROM tile WHERE key = ?', [key])
        })
      }

      this.get = function (key, successCallback, errorCallback) {
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT value FROM tile WHERE key = ?',
            [key],
            (tx, result) => {
              successCallback(
                result.rows.length ? result.rows.item(0).value : undefined
              )
            },
            errorCallback
          )
        })
      }
    }

    return openDatabase ? new WebSqlImpl() : null
  }

  emr.on('storageLoad', () => {
    const storage = getIndexedDBStorage() || getWebSqlStorage() || null
    if (!storage) {
      emr.fire('storageLoaded', null)
    }
  })
})(window, window.offlineMaps.eventManager);

(function (window, emr, mapbox, MM, undefined) {
  const StorageRequestManager = function (storage) {
    MM.RequestManager.apply(this, [])
    this._storage = storage
  }

  StorageRequestManager.prototype._imageToDataUri = function (image) {
    const canvas = window.document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height

    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0)

    return canvas.toDataURL('image/png')
  }

  StorageRequestManager.prototype._createTileImage = function (
    id,
    coord,
    value,
    cache
  ) {
    const img = window.document.createElement('img')
    img.id = id
    img.style.position = 'absolute'
    img.coord = coord
    this.loadingBay.appendChild(img)
    if (cache) {
      img.onload = this.getLoadCompleteWithCache()
      img.crossOrigin = 'Anonymous'
    } else {
      img.onload = this.getLoadComplete()
    }
    img.onerror = this.getLoadComplete()
    img.src = value
  }

  StorageRequestManager.prototype._loadTile = function (id, coord, url) {
    const self = this
    if (this._storage) {
      this._storage.get(
        id,
        (value) => {
          if (value) {
            self._createTileImage(id, coord, value, false)
          } else {
            self._createTileImage(id, coord, url, true)
          }
        },
        () => {
          self._createTileImage(id, coord, url, true)
        }
      )
    } else {
      self._createTileImage(id, coord, url, false)
    }
  }

  StorageRequestManager.prototype.processQueue = function (sortFunc) {
    if (sortFunc && this.requestQueue.length > 8) {
      this.requestQueue.sort(sortFunc)
    }
    while (
      this.openRequestCount < this.maxOpenRequests &&
      this.requestQueue.length > 0
    ) {
      let request = this.requestQueue.pop()
      if (request) {
        this.openRequestCount++
        this._loadTile(request.id, request.coord, request.url)
        request = request.id = request.coord = request.url = null
      }
    }
  }

  StorageRequestManager.prototype.getLoadCompleteWithCache = function () {
    if (!this._loadComplete) {
      const theManager = this
      this._loadComplete = function (e) {
        // e = e || window.event;

        const img = e.srcElement || e.target
        img.onload = img.onerror = null

        if (theManager._storage) {
          theManager._storage.add(this.id, theManager._imageToDataUri(this))
        }

        theManager.loadingBay.removeChild(img)
        theManager.openRequestCount--
        delete theManager.requestsById[img.id]

        if (
          e.type === 'load' &&
          (img.complete || (img.readyState && img.readyState === 'complete'))
        ) {
          theManager.dispatchCallback('requestcomplete', img)
        } else {
          theManager.dispatchCallback('requesterror', {
            element: img,
            url: `${img.src}`,
          })
          img.src = null
        }

        setTimeout(theManager.getProcessQueue(), 0)
      }
    }
    return this._loadComplete
  }

  MM.extend(StorageRequestManager, MM.RequestManager)

  const StorageLayer = function (provider, parent, name, storage) {
    this.parent = parent || document.createElement('div')
    this.parent.style.cssText =
      'position: absolute; top: 0px; left: 0px;' +
      'width: 100%; height: 100%; margin: 0; padding: 0; z-index: 0'
    this.name = name
    this.levels = {}
    this.requestManager = new StorageRequestManager(storage)
    this.requestManager.addCallback('requestcomplete', this.getTileComplete())
    this.requestManager.addCallback('requesterror', this.getTileError())
    if (provider) {
      this.setProvider(provider)
    }
  }

  MM.extend(StorageLayer, MM.Layer)

  const StorageTemplatedLayer = function (template, subdomains, name, storage) {
    return new StorageLayer(
      new MM.Template(template, subdomains),
      null,
      name,
      storage
    )
  }

  emr.on('mapLoad', (storage) => {
    const map = mapbox.map('map')
    map.addLayer(
      new StorageTemplatedLayer(
        'http://{S}.tile.osm.org/{Z}/{X}/{Y}.png',
        ['a', 'b', 'c'],
        undefined,
        storage
      )
    )
    map.ui.zoomer.add()
    map.ui.zoombox.add()
    map.centerzoom({ lat: 53.902254, lon: 27.56185 }, 13)
  })
})(window, window.offlineMaps.eventManager, mapbox, MM);

(function (emr) {
  emr.on('storageLoaded', 'mapLoad')
  emr.fire('storageLoad')
})(window.offlineMaps.eventManager)
