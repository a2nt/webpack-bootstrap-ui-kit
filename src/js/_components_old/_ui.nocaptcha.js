'use strict';

import $ from 'jquery';
import Events from '../_events';
import Spinner from './_ui.spinner';

const NoCaptcha = (($) => {
  // Constants
  const W = window;
  const D = document;
  const $Body = $('body');

  const NAME = 'NoCaptcha';

  class NoCaptcha {
    static init() {
      const ui = this;
      ui.dispose();

      console.log(`${NAME}: init`);

      if ($('.g-recaptcha').length && typeof grecaptcha === 'undefined') {
        console.log(`${NAME}: Loading Captcha API`);

        $.getScript(
          'https://www.google.com/recaptcha/api.js?render=explicit&hl=en&onload=noCaptchaFieldRender',
          () => {
            this.renderCaptcha();
          },
        );
      } else {
        this.renderCaptcha();
      }
    }

    static dispose() {
      console.log(`${NAME}: dispose`);
    }

    static renderCaptcha() {
      console.log(`${NAME}: Rendering Captcha`);

      const $_noCaptchaFields = $('.g-recaptcha');

      if (!$('.g-recaptcha').length) {
        console.log(`${NAME}: No Captcha fields`);
        return;
      }

      const submitListener = (e) => {
        const $field = $(e.currentTarget).find('.g-recaptcha');
        grecaptcha.execute($field.data('widgetid'));
      };

      $_noCaptchaFields.each((i, field) => {
        const $field = $(field);

        if ($field.data('widgetid') || $field.html().length) {
          return;
        }

        const $form = $field.data('form')
          ? $(`#${$field.data('form')}`)
          : $field.parents('form');

        const widget_id = grecaptcha.render(field, $field.data());
        $field.data('widgetid', widget_id);

        // For the invisible captcha we need to setup some callback listeners
        if ($field.data('size') === 'invisible' && !$field.data('callback')) {
          grecaptcha.execute(widget_id);
          $form.on('submit', submitListener);
        }
      });
    }
  }

  $(W).on(`${NAME}.init ${Events.AJAX} ${Events.LOADED}`, () => {
    NoCaptcha.init();
  });

  W.NoCaptcha = NoCaptcha;
  W.noCaptchaFieldRender = NoCaptcha.renderCaptcha;

  return NoCaptcha;
})($);

export default NoCaptcha;
