'use strict';
/*
 * UI Basics 
 */
//import $ from 'jquery';
import '../scss/app.scss';

import Events from './_events';
import MainUI from './_components/_main';

/*
 * Extra functionality
 */
import '@a2nt/meta-lightbox-react/src/js/app';
import './_ui/_ui.carousel';
//import './_ui/_ui.instagram.feed';

/*
 * AJAX functionality
 */
import './_ajax/_main.links';
import './_ajax/_main.online';
import './_ajax/_main.lazy-images';

/*
 * Site specific modules
 */
import './_layout';

//import 'hammerjs/hammer';
//import 'jquery-hammerjs/jquery.hammer';

// Routie
//import 'pouchdb/dist/pouchdb';
//import './_components/routes/index';

// conflicts with _components/_ui.hover.js (shows dropdown on hover)
//import 'bootstrap/js/dist/dropdown';
/*import './_components/_ui.hover';

import './_components/_ui.carousel';
import './_components/_ui.menu';

import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/tooltip';
import 'bootstrap/js/dist/popover';
import 'bootstrap/js/dist/scrollspy';
import 'bootstrap/js/dist/tab';*/
//

// Offcanvas menu
//import 'offcanvas-bootstrap/dist/js/bootstrap.offcanvas';

// Uncomment it to enable meta-lightbox zooming on hover
//import 'jquery-zoom/jquery.zoom';

// FlyoutUI
//import FlyoutUI from './_components/_ui.flyout';

// Sticky sidebar
//import SidebarUI from './_components/_ui.sidebar';

// Toggle bootstrap form fields
//import FormToggleUI from './_components/_ui.form.fields.toggle';

// Bootstrap Date & Time fields
//import FormDatetime from './_components/_ui.form.datetime';

// Stepped forms functionality
//import FormStepped from './_components/_ui.form.stepped';

// Forms validation functionality
//import FormValidate from './_components/_ui.form.validate';

// Store forms data into localStorage
//import FormStorage from './_components/_ui.form.storage';

// client-side images cropping
//import FormCroppie from './_components/_ui.form.croppie';

// Google NoCaptcha fields
//import NoCaptcha from './_components/_ui.nocaptcha';

// youtube video preview image
//import './_components/_ui.video.preview';

//import Confirmation from 'bootstrap-confirmation2/dist/bootstrap-confirmation';
//import Table from 'bootstrap-table/dist/bootstrap-table';

// Map UI
//import MapApi from './_components/_ui.map.api';

//import FormSelect2 from './_components/_ui.form.select2';

//import './_main';
//import './_layout';

// Google Analytics
//import './_components/drivers/_google.track.external.links';

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
