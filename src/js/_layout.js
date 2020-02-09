'use strict';

import $ from 'jquery';

import Events from './_events';

const LayoutUI = ($ => {
  // Constants
  const W = window;
  const D = document;
  const $Body = $('body');

  const NAME = 'LayoutUI';

  const datepickerOptions = {
    autoclose: true,
    startDate: 0,
    //todayBtn: true,
    todayHighlight: true,
    clearBtn: true,
  };

  class LayoutUI {
    static init() {
      const ui = this;
      ui.dispose();

      console.log(`Initializing: ${NAME}`);
      // your custom UI

      // Fire further js when layout is ready
      $(W).trigger(Events.LODEDANDREADY);

      // Custom fonts
      $Body.append(
        '<link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,400i,700,700i&display=swap" rel="stylesheet">',
      );

      /*google analytics */
      /*(function(i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        (i[r] =
          i[r] ||
          function() {
            (i[r].q = i[r].q || []).push(arguments);
          }),
          (i[r].l = 1 * new Date());
        (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m);
      })(
        window,
        document,
        'script',
        '//www.google-analytics.com/analytics.js',
        'ga',
      );
      ga('create', 'UA-********-*', 'auto');
      ga('send', 'pageview');*/
    }

    static dispose() {
      console.log(`Destroying: ${NAME}`);
    }
  }

  $(W).on(`${Events.AJAX} ${Events.LOADED}`, () => {
    LayoutUI.init();
  });

  W.LayoutUI = LayoutUI;

  return LayoutUI;
})($);

export default LayoutUI;
