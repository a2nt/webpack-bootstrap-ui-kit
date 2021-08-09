'use strict';

import '../scss/test-build.scss';
import '@a2nt/meta-lightbox-js/src/js/test-build';

import Events from './_events';
import MainUI from './main';

/*
 * AJAX functionality
 */
import './ajax/links';
import './ajax/online';
import './ajax/lazy-images';

import './layout';

if (process.env.NODEENV === 'development') {
  // mocking service worker
  const regeneratorRuntime = require('regenerator-runtime');
  const {
    worker,
  } = require('../mocks/browser');
  worker.start({
    serviceWorker: {
      url: 'graphql/mockServiceWorker.js',
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
                                          .register(`${baseHref}appsw.js?v=${version}`)
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
