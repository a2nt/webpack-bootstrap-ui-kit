'use strict';

import Events from '../_events';

const HeaderUI = (($) => {
  const D = document;
  const W = window;
  const $Body = $('html,body');
  const NAME = 'HeaderUI';
  const CLASSNAME = `js${NAME}`;

  class HeaderUI {
    static init() {
      const ui = this;
      ui.dispose();

      if (!$(`.${CLASSNAME}`).length) {
        return;
      }

      console.log(`Initializing: ${NAME}`);

      const $header = $('#Header,.jsHeaderUI');
      const updateHeader = () => {
        const h = $header.height();
        const s = $Body.scrollTop();
        if (s > h) {
          $Body.addClass('shrink');
        } else {
          $Body.removeClass('shrink');
        }
      };

      updateHeader();
      $Body.on('scroll resize', () => {
        updateHeader();
      });

      const updateFooter = (i, el) => {
        const $el = $(el);
        $el.css('height', 'auto');
        const footerHeight = $el.height();

        $el.css('margin-top', -footerHeight);
        $el.siblings('.wrapper').css('padding-bottom', footerHeight);
      };

      $('.footer,.jsFooterUI').each(updateFooter);
    }

    static dispose() {
      console.log(`Destroying: ${NAME}`);
    }
  }

  $(W).on(`${Events.AJAX} ${Events.LOADED}`, () => {
    HeaderUI.init();
  });

  W.HeaderUI = new HeaderUI();

  return HeaderUI;
})($);

export default HeaderUI;
