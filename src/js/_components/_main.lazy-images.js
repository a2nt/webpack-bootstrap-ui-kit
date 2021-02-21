// browser tab visibility state detection

import Events from '../_events';
import Consts from '../_consts';

const axios = require('axios');

export default ((W) => {
  const NAME = '_main.lazy-images';
  const D = document;
  const BODY = D.body;

  const API_STATIC = document.querySelector('meta[name="api_static_domain"]');
  const API_STATIC_URL = API_STATIC
    ? API_STATIC.getAttribute('content')
    : `${window.location.protocol}//${window.location.host}`;

  console.log(`${NAME} [static url]: ${API_STATIC_URL}`);

  const loadLazyImages = () => {
    console.log(`${NAME}: Load lazy images`);

    D.querySelectorAll(`[data-lazy-src]`).forEach((el) => {
      el.classList.remove('empty');
      el.classList.add('loading');
      el.classList.remove('loading__network-error');

      const attr = el.getAttribute('data-lazy-src');
      const imageUrl = attr.startsWith('http') ? attr : API_STATIC_URL + attr;

      // offline response will be served by caching service worker
      axios
        .get(imageUrl, {
          responseType: 'blob',
        })
        .then((response) => {
          const reader = new FileReader(); // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/FileReader
          reader.readAsDataURL(response.data);
          reader.onload = () => {
            const imageDataUrl = reader.result;
            el.setAttribute('src', imageDataUrl);
            el.classList.remove('loading');
            el.classList.add('loading__success');
          };
        })
        .catch((e) => {
          //el.setAttribute('src', imageUrl);

          if (e.response) {
            switch (e.response.status) {
              case 404:
                msg = 'Not Found.';
                break;
              case 500:
                msg = 'Server issue, please try again latter.';
                break;
              default:
                msg = 'Something went wrong.';
                break;
            }

            console.error(`${NAME} [${imageUrl}]: ${msg}`);
          } else if (e.request) {
            msg = 'No response received';
            console.error(`${NAME} [${imageUrl}]: ${msg}`);
          } else {
            console.error(`${NAME} [${imageUrl}]: ${e.message}`);
          }

          el.classList.remove('loading');
          el.classList.add('loading__network-error');
          el.classList.add('empty');
        });
    });
  };

  W.addEventListener(`${Events.LODEDANDREADY}`, loadLazyImages);
  W.addEventListener(`${Events.AJAX}`, loadLazyImages);
})(window);
