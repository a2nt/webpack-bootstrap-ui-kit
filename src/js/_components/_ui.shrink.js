'use strict';

import $ from 'jquery';
import Events from '../_events';

const ShrinkUI = (($) => {
  // Constants
  const W = window;
  const D = document;
  const NAME = 'ShrinkUI';

  console.log(`${NAME}: init`);

  $(W).on(`${Events.LOADED} ${Events.SCROLL} ${Events.RESIZE}`, () => {
    if ($('#Navigation > .navbar-collapse').hasClass('show')) {
      return;
    }

    let h1 = $('#SiteWideMessage').height();
    if (!h1) {
      h1 = 0;
    }
    let h2 = $('#SiteWideOffline').height();
    if (!h2) {
      h2 = 0;
    }

    let h3 = $('#Header').height();
    if (!h3) {
      h3 = 0;
    }

    const headerHeight = h1 + h2 + h3;

    if ($(D).scrollTop() > headerHeight) {
      $('body').addClass('shrink');
    } else {
      $('body').removeClass('shrink');
    }
  });

  return ShrinkUI;
})($);

export default ShrinkUI;
