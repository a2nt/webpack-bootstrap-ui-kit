/**
 * Add your global events here
 */
import Events from '../_events';
import Consts from '../_consts';
import Page from './_page.jsx';
const axios = require('axios');

const MainUI = ((W) => {
  const NAME = 'MainUI';
  const D = document;
  const BODY = document.body;

  console.clear();

  console.info(
    `%cUI Kit ${UINAME} ${UIVERSION}`,
    'color:yellow;font-size:14px',
  );
  console.info(
    `%c${UIMetaNAME} ${UIMetaVersion}`,
    'color:yellow;font-size:12px',
  );
  console.info(
    `%chttps://github.com/a2nt/webpack-bootstrap-ui-kit by ${UIAUTHOR}`,
    'color:yellow;font-size:10px',
  );

  console.info(`%cENV: ${process.env.NODE_ENV}`, 'color:green;font-size:10px');
  console.groupCollapsed('Events');
  Object.keys(Events).forEach((k) => {
    console.info(`${k}: ${Events[k]}`);
  });
  console.groupEnd('Events');

  console.groupCollapsed('Consts');
  Object.keys(Consts).forEach((k) => {
    console.info(`${k}: ${Consts[k]}`);
  });
  console.groupEnd('Events');

  console.groupCollapsed('Init');
  console.time('init');

  // update visibility state
  // get browser window visibility preferences
  // Opera 12.10, Firefox >=18, Chrome >=31, IE11
  const HiddenName = 'hidden';
  const VisibilityChangeEvent = 'visibilitychange';

  D.addEventListener(VisibilityChangeEvent, () => {
    if (D.visibilityState === HiddenName) {
      console.log(`${NAME}: Tab: hidden`);

      BODY.classList.add('is-hidden');
      BODY.classList.remove('is-focused');

      W.dispatchEvent(new Event(Events.TABHIDDEN));
    } else {
      console.log(`${NAME}: Tab: focused`);

      BODY.classList.add('is-focused');
      BODY.classList.remove('is-hidden');

      W.dispatchEvent(new Event(Events.TABFOCUSED));
    }
  });

  let pingInterval;
  const PING_META = document.querySelector('meta[name="ping"]');

  let update_online_status_lock = false;
  const UPDATE_ONLINE_STATUS = (online) => {
    if (update_online_status_lock) {
      return;
    }

    update_online_status_lock = true;
    if (online) {
      if (BODY.classList.contains('is-offline')) {
        console.log(`${NAME}: back Online`);
        W.dispatchEvent(new Event(Events.BACKONLINE));
      } else {
        console.log(`${NAME}: Online`);
        W.dispatchEvent(new Event(Events.ONLINE));
      }

      BODY.classList.add('is-online');
      BODY.classList.remove('is-offline');

      if (PING_META && !pingInterval) {
        console.log(`${NAME}: SESSION_PING is active`);
        pingInterval = setInterval(SESSION_PING, 300000); // 5 min in ms
      }
    } else {
      console.log(`${NAME}: Offline`);

      BODY.classList.add('is-offline');
      BODY.classList.remove('is-online');

      clearInterval(pingInterval);
      pingInterval = null;

      W.dispatchEvent(new Event(Events.OFFLINE));
    }

    update_online_status_lock = false;
  };

  // session ping
  let session_ping_lock = false;
  const SESSION_PING = () => {
    if (session_ping_lock || BODY.classList.contains('is-offline')) {
      return;
    }

    const PING_URL = PING_META.getAttribute('content');

    console.log(`${NAME}: session ping`);
    session_ping_lock = true;

    axios
      .post(PING_URL, {})
      .then((resp) => {
        session_ping_lock = false;
        UPDATE_ONLINE_STATUS(true);
      })
      .catch((error) => {
        console.error(error);
        console.warn(`${NAME}: SESSION_PING failed`);

        session_ping_lock = false;
        UPDATE_ONLINE_STATUS(false);
      });
  };

  // current browser online state
  if (typeof navigator.onLine !== 'undefined') {
    if (!navigator.onLine) {
      UPDATE_ONLINE_STATUS(false);
    } else {
      UPDATE_ONLINE_STATUS(true);
    }
  }

  W.addEventListener(`${Events.OFFLINE}`, () => {
    UPDATE_ONLINE_STATUS(false);
  });

  W.addEventListener(`${Events.ONLINE}`, () => {
    UPDATE_ONLINE_STATUS(true);
  });

  // touch/mouse detection
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
      window.matchMedia('(hover: none)').matches,
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

  class MainUI {
    static init() {
      const ui = this;
      console.log(`${NAME}: init`);

      ui.detectCSSScreenSize();
      W.addEventListener(`${Events.RESIZE}`, () => {
        ui.detectCSSScreenSize();
      });

      // store landing page state
      window.history.replaceState(
        { landing: window.location.href },
        document.title,
        window.location.href,
      );
      //

      ui.ajax();
      console.groupEnd('init');
    }

    static ajax() {
      const ui = this;
      console.log(`${NAME}: ajax`);

      document.querySelectorAll('.graphql').forEach((el) => {
        el.addEventListener('click', (e) => {
          e.preventDefault();

          const GraphPage = ReactDOM.render(
            <Page />,
            document.getElementById('MainContent'),
          );

          const el = e.currentTarget;
          const link = el.getAttribute('href') || el.getAttribute('data-href');

          GraphPage.state.current = el;

          GraphPage.load(link);

          window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
              console.log(`${NAME} popstate: load`);
              GraphPage.setState(JSON.parse(e.state.page));
            } else if (e.state && e.state.landing) {
              console.log(`${NAME} popstate: go to landing`);
              window.location.href = e.state.landing;
            } else {
              console.log(`${NAME} popstate: missing`);
              console.log(e);
            }
          });
        });
      });
    }

    static detectCSSScreenSize() {
      const el = D.createElement('div');
      el.className = 'env-test';
      BODY.appendChild(el);

      const envs = [...Consts.ENVS].reverse();
      let curEnv = envs.shift();
      BODY.classList.remove(...envs);

      for (let i = 0; i < envs.length; ++i) {
        const env = envs[i];
        el.classList.add(`d-${env}-none`);

        if (W.getComputedStyle(el).display === 'none') {
          curEnv = env;
          BODY.classList.add(`${curEnv}`);
          break;
        }
      }

      let landscape = true;
      if (W.innerWidth > W.innerHeight) {
        BODY.classList.add('landscape');
        BODY.classList.remove('portrait');
      } else {
        landscape = false;

        BODY.classList.add('portrait');
        BODY.classList.remove('landscape');
      }

      console.log(
        `${NAME}: screen size detected ${curEnv} | landscape ${landscape}`,
      );

      return curEnv;
    }
  }

  W.addEventListener(`${Events.LOADED}`, () => {
    console.log(`${NAME}: Loaded`);

    MainUI.init();

    UPDATE_ONLINE_STATUS(true);
  });
  W.addEventListener(`${Events.AJAX}`, () => {
    MainUI.ajax();

    UPDATE_ONLINE_STATUS(true);
  });

  W.MainUI = MainUI;

  return MainUI;
})(window);

export default MainUI;
