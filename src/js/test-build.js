'use strict';

import '../scss/test-build.scss';
import '@a2nt/meta-lightbox-js/src/js/test-build';

import Events from './_events';
import MainUI from './_main';

/*
 * AJAX functionality
 */
import './_ajax/_links';
import './_ajax/_online';
import './_ajax/_lazy-images';

import './_layout';

if (process.env.NODE_ENV === 'development') {
  // mocking service worker
  const regeneratorRuntime = require('regenerator-runtime');
  const {
    worker,
  } = require('../mocks/browser');
  worker.start({
    serviceWorker: {
      url: '_graphql/mockServiceWorker.js',
      options: {
        scope: '/',
      },
    },
  });

  // caching service worker (set injectClient: false at webpack.config.serve.js)
  /*if ('serviceWorker' in navigator) {
                              const baseHref = (document.getElementsByTagName('base')[0] || {}).href;
                              const version = (document.querySelector('meta[name="swversion"]') || {})
                                .content;
                              if (baseHref) {
                                navigator.serviceWorker
                                  .register(`${baseHref}app_sw.js?v=${version}`)
                                  .then(() => {
                                    console.log('SW: Registered');
                                  });
                              }
                            }*/
}

function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(
  require.context('../img/', false, /\.(png|jpe?g|svg)$/),
);
const fontAwesome = importAll(
  require.context('font-awesome', false, /\.(otf|eot|svg|ttf|woff|woff2)$/),
);
