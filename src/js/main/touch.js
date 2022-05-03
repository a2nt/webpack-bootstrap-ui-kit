// touch/mouse detection

import Events from '../_events'

export default ((W) => {
  const NAME = '_main.touch'
  const D = document
  const BODY = D.body

  let prevTouchEventName
  let touchTimeout
  const SET_TOUCH_SCREEN = (bool, eventName) => {
    if (touchTimeout || eventName === prevTouchEventName) {
      return
    }

    if (bool) {
      console.log(`${NAME}: Touch screen enabled`)

      BODY.classList.add('is-touch')
      BODY.classList.remove('is-mouse')

      W.dispatchEvent(new Event(Events.TOUCHENABLE))
    } else {
      console.log(`${NAME}: Touch screen disabled`)

      BODY.classList.add('is-mouse')
      BODY.classList.remove('is-touch')

      W.dispatchEvent(new Event(Events.TOUCHDISABLED))
    }

    prevTouchEventName = eventName
    // prevent firing touch and mouse events together
    if (!touchTimeout) {
      touchTimeout = setTimeout(() => {
        clearTimeout(touchTimeout)
        touchTimeout = null
      }, 500)
    }
  }

  SET_TOUCH_SCREEN(
    'ontouchstart' in W ||
      navigator.MaxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0 ||
      W.matchMedia('(hover: none)').matches,
    'init'
  )

  D.addEventListener('touchend', (e) => {
    let touch = false
    if (e.type !== 'click') {
      touch = true
    }

    SET_TOUCH_SCREEN(touch, 'click-touchend')
  })

  // disable touch on mouse events
  D.addEventListener('click', (e) => {
    let touch = false
    if (e.type !== 'click') {
      touch = true
    }

    SET_TOUCH_SCREEN(touch, 'click-touchend')
  })
})(window)
