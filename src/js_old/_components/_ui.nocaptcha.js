"use strict";

import $ from "jquery";
import Events from "../lib/_events";

const NoCaptcha = (($) => {
  // Constants
  const $window = $(window);
  const D = document;
  const $Body = $("body");

  const NAME = "jsNoCaptcha";

  class NoCaptcha {
    static init() {
      const ui = this;
      ui.dispose();

      console.log(`${NAME}: init`);

      if (
        $(".g-recaptcha").length &&
        typeof $window[0].grecaptcha === "undefined"
      ) {
        console.log(`${NAME}: Loading Captcha API`);

        $.getScript(
          "https://www.google.com/recaptcha/api.js?render=explicit&hl=en&onload=noCaptchaFieldRender",
          () => {
            this.renderCaptcha();
          }
        );
      } else {
        this.renderCaptcha();
      }
    }

    static dispose() {
      console.log(`${NAME}: dispose`);
    }

    static renderCaptcha() {
      const grecaptcha = $window[0].grecaptcha;
      if (
        typeof grecaptcha === "undefined" ||
        typeof grecaptcha.render === "undefined"
      ) {
        return;
      }

      console.log(`${NAME}: Rendering Captcha`);
      const $_noCaptchaFields = $(".g-recaptcha");

      if (!$(".g-recaptcha").length) {
        console.log(`${NAME}: No Captcha fields`);
        return;
      }

      const submitListener = (e) => {
        const $field = $(e.currentTarget).find(".g-recaptcha");
        grecaptcha.execute($field.data("widgetid"));
      };

      $_noCaptchaFields.each((i, field) => {
        const $field = $(field);

        if ($field.data("widgetid") || $field.html().length) {
          return;
        }

        const $form = $field.data("form")
          ? $(`#${$field.data("form")}`)
          : $field.parents("form");

        const widget_id = grecaptcha.render(field, $field.data());
        $field.data("widgetid", widget_id);

        // For the invisible captcha we need to setup some callback listeners
        if ($field.data("size") === "invisible" && !$field.data("callback")) {
          grecaptcha.execute(widget_id);
          $form.on("submit", submitListener);
        }
      });
    }
  }

  $window.on(`${NAME}.init ${Events.AJAX} ${Events.LOADED}`, () => {
    NoCaptcha.init();
  });

  $window.data(`${NAME}`, NoCaptcha);
  $window[0].noCaptchaFieldRender = NoCaptcha.renderCaptcha;

  return NoCaptcha;
})($);

export default NoCaptcha;
