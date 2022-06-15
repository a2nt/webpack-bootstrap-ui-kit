'use strict'

const Obj = {
  init: () => {
    class GoogleMapsHtmlOverlay extends window.google.maps.OverlayView {
      constructor (options) {
        super()
        const ui = this

        ui.ownerMap = options.map
        // ui.setMap(options.map);
        ui.position = options.position
        ui.html = options.html
          ? options.html
          : '<div class="mapboxgl-marker"><i class="marker-icon fas fa-map-marker-alt"></i></div>'
        ui.divClass = options.divClass
        ui.align = options.align
        ui.isDebugMode = options.debug
        ui.onClick = options.onClick
        ui.onMouseOver = options.onMouseOver

        ui.isBoolean = (arg) => {
          if (typeof arg === 'boolean') {
            return true
          } else {
            return false
          }
        }

        ui.isNotUndefined = (arg) => {
          if (typeof arg !== 'undefined') {
            return true
          } else {
            return false
          }
        }

        ui.hasContent = (arg) => {
          if (arg.length > 0) {
            return true
          } else {
            return false
          }
        }

        ui.isString = (arg) => {
          if (typeof arg === 'string') {
            return true
          } else {
            return false
          }
        }

        ui.isFunction = (arg) => {
          if (typeof arg === 'function') {
            return true
          } else {
            return false
          }
        }
      }

      onAdd () {
        const ui = this

        // Create div element.
        ui.div = document.createElement('div')
        ui.div.style.position = 'absolute'

        // Validate and set custom div class
        if (ui.isNotUndefined(ui.divClass) && ui.hasContent(ui.divClass)) { ui.div.className = ui.divClass }

        // Validate and set custom HTML
        if (
          ui.isNotUndefined(ui.html) &&
          ui.hasContent(ui.html) &&
          ui.isString(ui.html)
        ) { ui.div.innerHTML = ui.html }

        // If debug mode is enabled custom content will be replaced with debug content
        if (ui.isBoolean(ui.isDebugMode) && ui.isDebugMode) {
          ui.div.className = 'debug-mode'
          ui.div.innerHTML =
            '<div style="height: 10px; width: 10px; background: red; border-radius: 100%;"></div>' +
            '<div style="position: absolute; top: 5px; padding: 5px; width: 130px; text-align: center; font-size: 18px; text-transform: uppercase; font-weight: bolder; background: red; color: white; font-family: Arial;">Debug mode</div>'
          ui.div.setAttribute(
            'style',
            'position: absolute;' +
              'border: 5px dashed red;' +
              'height: 150px;' +
              'width: 150px;' +
              'display: flex;' +
              'justify-content: center;' +
              'align-items: center;'
          )
        }

        // Add element to clickable layer
        ui.getPanes().overlayMouseTarget.appendChild(ui.div)

        // Add listeners to the element.
        window.google.maps.event.addDomListener(ui.div, 'click', (event) => {
          window.google.maps.event.trigger(ui, 'click')
          if (ui.isFunction(ui.onClick)) ui.onClick()
          event.stopPropagation()
        })

        window.google.maps.event.addDomListener(ui.div, 'mouseover', (event) => {
          window.google.maps.event.trigger(ui, 'mouseover')
          if (ui.isFunction(ui.onMouseOver)) ui.onMouseOver()
          event.stopPropagation()
        })
      }

      draw () {
        const ui = this

        let div = document.querySelector('.popup')
        if (!div.length) {
          div = ui.div
        }

        // Calculate position of div
        const projection = ui.getProjection()

        if (!projection) {
          console.log('GoogleMapsHtmlOverlay: current map is missing')
          return null
        }

        const positionInPixels = projection.fromLatLngToDivPixel(
          ui.getPosition()
        )

        // Align HTML overlay relative to original position
        const offset = {
          y: undefined,
          x: undefined,
        }
        const divWidth = div.offsetWidth
        const divHeight = div.offsetHeight

        switch (Array.isArray(ui.align) ? ui.align.join(' ') : '') {
          case 'left top':
            offset.y = divHeight
            offset.x = divWidth
            break
          case 'left center':
            offset.y = divHeight / 2
            offset.x = divWidth
            break
          case 'left bottom':
            offset.y = 0
            offset.x = divWidth
            break
          case 'center top':
            offset.y = divHeight
            offset.x = divWidth / 2
            break
          case 'center center':
            offset.y = divHeight / 2
            offset.x = divWidth / 2
            break
          case 'center bottom':
            offset.y = 0
            offset.x = divWidth / 2
            break
          case 'right top':
            offset.y = divHeight
            offset.x = 0
            break
          case 'right center':
            offset.y = divHeight / 2
            offset.x = 0
            break
          case 'right bottom':
            offset.y = 0
            offset.x = 0
            break
          default:
            offset.y = divHeight / 2
            offset.x = divWidth / 2
            break
        }

        // Set position
        ui.div.style.top = `${positionInPixels.y - offset.y}px`
        ui.div.style.left = `${positionInPixels.x - offset.x}px`
      }

      getPosition () {
        const ui = this
        return new window.google.maps.LatLng(ui.position)
      }

      getDiv () {
        const ui = this
        return ui.div
      }

      setPosition (position, align) {
        const ui = this
        ui.position = position
        ui.align = align
        ui.draw()
      }

      remove () {
        const ui = this
        ui.setMap(null)
        ui.div.remove()
      }

      // emulate window.google.maps.Marker functionality for compatibility (for example with @googlemaps/markerclustererplus)
      getDraggable () {
        return false
      }
    }
    return GoogleMapsHtmlOverlay
  },
}

export default Obj
