// touch/mouse detection

import Events from '../_events';
import Consts from '../_consts';

export default ((W) => {
  const NAME = '_main.touch';
  const D = document;
  const BODY = D.body;

  let prev_touch_event_name;
  let touch_timeout;
  const SET_TOUCH_SCREEN = (bool, event_name) => {
    if (touch_timeout || event_name === prev_touch_event_name) {
      return;
    }

    if (bool) {
      console.log(`${NAME}: Touch screen enabled`);

      BODY.classList.add('is-touch');
      BODY.classList.remove('is-mouse');

      W.dispatchEvent(new Event(Events.TOUCHENABLE));
    } else {
      console.log(`${NAME}: Touch screen disabled`);

      BODY.classList.add('is-mouse');
      BODY.classList.remove('is-touch');

      W.dispatchEvent(new Event(Events.TOUCHDISABLED));
    }

    prev_touch_event_name = event_name;
    // prevent firing touch and mouse events together
    if (!touch_timeout) {
      touch_timeout = setTimeout(() => {
        clearTimeout(touch_timeout);
        touch_timeout = null;
      }, 500);
    }
  };

  SET_TOUCH_SCREEN(
    'ontouchstart' in W ||
      navigator.MaxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0 ||
      W.matchMedia('(hover: none)').matches,
    'init',
  );

  D.addEventListener('touchend', (e) => {
    let touch = false;
    if (e.type !== 'click') {
      touch = true;
    }

    SET_TOUCH_SCREEN(touch, 'click-touchend');
  });

  // disable touch on mouse events
  D.addEventListener('click', (e) => {
    let touch = false;
    if (e.type !== 'click') {
      touch = true;
    }

    SET_TOUCH_SCREEN(touch, 'click-touchend');
  });
})(window);
