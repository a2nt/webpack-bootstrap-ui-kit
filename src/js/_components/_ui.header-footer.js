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

      //console.log(`Initializing: ${NAME}`);

      const $header = $(`#Header,.js${NAME}`);
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
      $Body.removeClass('shrink');
      $(`#Header,.js${NAME},.footer,.jsFooterUI,.wrapper`).attr('css', '');
    }
  }

  $(W).on(`${Events.AJAX} ${Events.LOADED}`, () => {
    HeaderUI.init();
  });

  W.HeaderUI = new HeaderUI();

  return HeaderUI;
})($);

export default HeaderUI;
