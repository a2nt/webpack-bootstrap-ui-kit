"use strict";

import $ from "jquery";

import Events from "../_events";
import CookieUI from "./_ui.cookie";

const FlyoutUI = (($) => {
  const W = window;
  const D = document;
  const $Body = $("body");

  const NAME = "FlyoutUI";
  const COOKIE = `${NAME}-hide`;
  const TIMEOUT = 2000;

  class FlyoutUI {
    static init() {
      console.log(`${NAME}: init`);
      const ui = this;

      ui.$modal = $(`.flyout-${NAME}`);

      if (!ui.$modal.length) {
        return false;
      }

      const $close = ui.$modal.find(`.flyout-${NAME}__close`);
      ui.$modal.data(NAME, ui);

      if ($close.length) {
        $close.on("click", () => {
          ui.hide();
        });
      }

      const hide = CookieUI.get(COOKIE);

      if (!$close.length || !hide || hide !== "true") {
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

      CookieUI.set(COOKIE, "true", 1);
      ui.$modal.removeClass(`flyout-${NAME}__active`);
    }
  }

  $(W).on(`${NAME}.init ${Events.AJAX} ${Events.LOADED}`, () => {
    FlyoutUI.init();
  });

  W.FlyoutUI = FlyoutUI;

  return FlyoutUI;
})($);

export default FlyoutUI;
