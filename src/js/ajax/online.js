// ping online/offline state switch and detection

import Events from '../_events';
import Consts from '../_consts';

const axios = require('axios');

export default ((W) => {
  const NAME = 'main.online';
  const D = document;
  const BODY = D.body;

  let pingInterval;
  const PING_META = D.querySelector('meta[name="ping"]');

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


  const navigatorStateUpdate = () => {
    if (typeof navigator.onLine !== 'undefined') {
      if (!navigator.onLine) {
        UPDATE_ONLINE_STATUS(false);
      } else {
        UPDATE_ONLINE_STATUS(true);
      }
    }
  };

  W.addEventListener(`${Events.OFFLINE}`, () => {
    UPDATE_ONLINE_STATUS(false);
  });

  W.addEventListener(`${Events.ONLINE}`, () => {
    UPDATE_ONLINE_STATUS(true);
  });

  W.addEventListener(`${Events.LOADED}`, navigatorStateUpdate);
  W.addEventListener(`${Events.AJAX}`, navigatorStateUpdate);
})(window);
