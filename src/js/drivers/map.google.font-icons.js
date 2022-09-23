'use strict'

const Obj = {
  init: () => {
    class GoogleMapsHtmlOverlay extends window.google.maps.OverlayView {
      constructor (options) {
        super()
        const ui = this

        ui.setMap(options.map)
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
        ui.div.addEventListener('click', (event) => {
          window.google.maps.event.trigger(ui, 'click')
          if (ui.isFunction(ui.onClick)) ui.onClick()
          event.stopPropagation()
        })

        ui.div.addEventListener('mouseover', (event) => {
          window.google.maps.event.trigger(ui, 'mouseover')
          if (ui.isFunction(ui.onMouseOver)) ui.onMouseOver()
          event.stopPropagation()
        })
      }

      draw () {
        const ui = this

        // Calculate position of div
        const positionInPixels = ui
          .getProjection()
          .fromLatLngToDivPixel(new window.google.maps.LatLng(ui.position))

        // Align HTML overlay relative to original position
        const divOffset = {
          y: undefined,
          x: undefined,
        }

        switch (Array.isArray(ui.align) ? ui.align.join(' ') : '') {
          case 'left top':
            divOffset.y = ui.div.offsetHeight
            divOffset.x = ui.div.offsetWidth
            break
          case 'left center':
            divOffset.y = ui.div.offsetHeight / 2
            divOffset.x = ui.div.offsetWidth
            break
          case 'left bottom':
            divOffset.y = 0
            divOffset.x = ui.div.offsetWidth
            break
          case 'center top':
            divOffset.y = ui.div.offsetHeight
            divOffset.x = ui.div.offsetWidth / 2
            break
          case 'center center':
            divOffset.y = ui.div.offsetHeight / 2
            divOffset.x = ui.div.offsetWidth / 2
            break
          case 'center bottom':
            divOffset.y = 0
            divOffset.x = ui.div.offsetWidth / 2
            break
          case 'right top':
            divOffset.y = ui.div.offsetHeight
            divOffset.x = 0
            break
          case 'right center':
            divOffset.y = ui.div.offsetHeight / 2
            divOffset.x = 0
            break
          case 'right bottom':
            divOffset.y = 0
            divOffset.x = 0
            break
          default:
            divOffset.y = ui.div.offsetHeight / 2
            divOffset.x = ui.div.offsetWidth / 2
        }

        // Set position
        ui.div.style.top = `${positionInPixels.y - divOffset.y}px`
        ui.div.style.left = `${positionInPixels.x - divOffset.x}px`
      }

      getPosition () {
        const ui = this
        return ui.position
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
    }
    return GoogleMapsHtmlOverlay
  },
}

export default Obj
