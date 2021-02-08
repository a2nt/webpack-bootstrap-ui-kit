'use strict';

import $ from 'jquery';
import Events from '../_events';

const FormValidateField = (($) => {
  // Constants
  const NAME = 'jsFormValidateField';
  const DATA_KEY = NAME;
  const $Body = $('body');

  const FieldUI = 'jsFormFieldUI';

  class FormValidateField {
    constructor(el) {
      const ui = this;
      const $el = $(el);

      ui.$el = $el;

      ui._actions = $el.parents('form').children('.btn-toolbar,.form-actions');
      $el.data(DATA_KEY, this);

      // prevent browsers checks (will do it using JS)
      $el.attr('novalidate', 'novalidate');

      $el.on('change focusout', (e) => {
        ui.validate(false);
      });

      $el.addClass(`${NAME}-active`);
      $el.trigger(Events.FORM_INIT_VALIDATE_FIELD);
    }

    // Public methods
    dispose() {
      const $el = ui.$el;

      $el.removeClass(`${NAME}-active`);
      $.removeData(ui.$el[0], DATA_KEY);
      ui.$el = null;
    }

    validate(scrollTo = true) {
      const ui = this;
      const $el = ui.$el;

      const $field = $el.closest('.field');
      const extraChecks = $el.data(`${NAME}-extra`);
      let valid = true;
      let msg = null;

      const val = $el.val();

      // browser checks
      if (!ui.$el[0].checkValidity()) {
        valid = false;
        console.warn(
          `${NAME}: Browser check validity is failed #${$el.attr('id')}`,
        );
      }

      let unmaskedVal = val;
      if (typeof $el.inputmask === 'function') {
        unmaskedVal = $el.inputmask('unmaskedvalue');
      }

      // required
      if (
        $el.hasClass('required') &&
        (!unmaskedVal.length ||
          !unmaskedVal.trim().length ||
          (ui.isHtml(val) && !$(unmaskedVal).text().length))
      ) {
        valid = false;
        console.warn(`${NAME}: Required field is missing #${$el.attr('id')}`);
      }

      // validate URL
      if (
        $el.hasClass('url') &&
        unmaskedVal.length &&
        !ui.valideURL(unmaskedVal)
      ) {
        valid = false;

        msg =
          'Invalid URL: URL must start with http:// or https://. For example: https://your-domain.com/bla-bla/?p1=b&p2=a#tag';
        console.warn(`${NAME}: Wrong URL #${$el.attr('id')}`);
      }

      // maxlength
      const maxLength = $el.attr('maxlength');
      if (unmaskedVal.length && maxLength && maxLength.length) {
        if (unmaskedVal.length > maxLength) {
          valid = false;

          msg = `The value is limited to ${maxLength} chars`;
          console.warn(`${NAME}: Too long value #${$el.attr('id')}`);
        }
      }

      // minlength
      const minLength = $el.attr('minlength');
      if (unmaskedVal.length && minLength && minLength.length) {
        if (unmaskedVal.length < minLength) {
          valid = false;

          msg = `The value should contain more than ${minLength} chars`;
          console.warn(`${NAME}: Too short value #${$el.attr('id')}`);
        }
      }

      this.removeError();

      // extra checks
      if (extraChecks) {
        extraChecks.forEach((check) => {
          const result = check($el);
          valid = valid && result;
          if (!result) {
            console.log(check);
            console.warn(`${NAME}: Extra check is failed #${$el.attr('id')}`);
          }
        });
      }

      if (valid) {
        return true;
      }

      this.setError(scrollTo, msg);

      return false;
    }

    isHtml(str) {
      const doc = new DOMParser().parseFromString(str, 'text/html');
      return Array.from(doc.body.childNodes).some(
        (node) => node.nodeType === 1,
      );
    }

    valideURL(str) {
      let url;

      try {
        url = new URL(str);
      } catch (_) {
        return false;
      }

      return url.protocol === 'http:' || url.protocol === 'https:';
    }

    setError(scrollTo = true, msg = null) {
      const ui = this;
      const fieldUI = ui.$el.data(FieldUI);

      const $field = ui.$el.closest('.field');

      const bodyScroll = $Body.scrollTop();
      const pos = $field[0].getBoundingClientRect().top; //$field.offset().top;

      const rowCorrection = parseInt($field.css('font-size')) * 4;
      ui.removeError();

      $field.addClass('error');
      if (msg) {
        fieldUI.addMessage(msg, 'alert-error alert-danger', scrollTo);
      } else if (pos && scrollTo) {
        $field.focus();
        $Body.scrollTop(bodyScroll + pos - rowCorrection);
      }
    }

    removeError() {
      const ui = this;
      const fieldUI = ui.$el.data(FieldUI);

      const $field = ui.$el.closest('.field');

      $field.removeClass('error');

      $field.removeClass('holder-error');
      $field.removeClass('holder-validation');
      $field.find('.alert-error').remove();
    }

    static _jQueryInterface() {
      return this.each(function () {
        // attach functionality to el
        const $el = $(this);
        let data = $el.data(DATA_KEY);

        if (!data) {
          data = new FormValidateField(this);
          $el.data(DATA_KEY, data);
        }
      });
    }
  }

  // jQuery interface
  $.fn[NAME] = FormValidateField._jQueryInterface;
  $.fn[NAME].Constructor = FormValidateField;
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return FormValidateField._jQueryInterface;
  };

  return FormValidateField;
})($);

export default FormValidateField;
