'use strict';

import $ from 'jquery';
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

      console.log(`${NAME}: init`);

      const $header = $(`#Header,.js${NAME}`);
      const updateHeader = () => {
        const h = $header.height();
        const s = $Body.scrollTop();
        if (s + 50 > h) {
          $Body.addClass('shrink');
        } else {
          $Body.removeClass('shrink');
        }
      };

      updateHeader();

      const updateFooter = (i, el) => {
        const $el = $(el);
        const footerHeight = $el.height();
        $el.css('height', footerHeight);

        $el.css('margin-top', -footerHeight);
        $el.siblings('.wrapper').css('padding-bottom', footerHeight);
      };

      $('.footer,.jsFooterUI').css('height', 'auto');
      setTimeout(() => {
        $('.footer,.jsFooterUI').each(updateFooter);
      }, 500);
    }

    static dispose() {
      console.log(`${NAME}: dispose`);

      $Body.removeClass('shrink');
      $(`#Header,.js${NAME},.footer,.jsFooterUI,.wrapper`).attr('css', '');
    }
  }

  $(W).on(`${Events.AJAX} ${Events.LOADED}`, () => {
    HeaderUI.init();
  });

  // align event content
  $(W).on(`${Events.RESIZE}`, () => {
    setTimeout(() => {
      HeaderUI.init();
    }, 200);
  });

  W.HeaderUI = new HeaderUI();

  return HeaderUI;
})($);

export default HeaderUI;
