"use strict";

import $ from 'jquery';

import Events from '../_events';
import CookieUI from './_ui.cookie';

const FlyoutUI = (($) => {
  const W = window;
  const D = document;
  const $Body = $('body');

  const NAME = 'FlyoutUI';
  const COOKIE = `${NAME}-hide`;
  const TIMEOUT = 2000;

  class FlyoutUI {
    static init() {
      const ui = this;

      ui.$modal = $(`.flyout-${NAME}`);
      const hide = CookieUI.get(COOKIE);

      if (ui.$modal.length && (!hide || hide !== 'true')) {
        ui.$modal.data(NAME, ui);

        const $close = ui.$modal.find(`.flyout-${NAME}__close`);

        if ($close.length) {
          $close.on('click', () => {
            ui.hide();
          });
        }

        setTimeout(() => {
          ui.show();
        }, TIMEOUT);
      }
    }

    static show(callback) {
      const ui = this;

      ui.$modal.addClass(`flyout-${NAME}__active`);
    }

    static hide(callback) {
      const ui = this;

      CookieUI.set(COOKIE, 'true', 1);
      ui.$modal.removeClass(`flyout-${NAME}__active`);
    }
  }

  $(W).on(`${Events.AJAX} ${Events.LOADED}`, () => {
    FlyoutUI.init();
  });

  W.FlyoutUI = FlyoutUI;

  return FlyoutUI;
})($);

export default FlyoutUI;
