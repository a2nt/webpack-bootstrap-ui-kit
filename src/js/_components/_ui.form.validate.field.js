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
        console.warn(`Browser check validity is failed #${$el.attr('id')}`);
      }

      // required
      if (
        $el.hasClass('required') &&
        (!val.length ||
          !val.trim().length ||
          (ui.isHtml(val) && !$(val).text().length))
      ) {
        valid = false;
        console.warn(`Required field is missing #${$el.attr('id')}`);
      }

      // validate URL
      if ($el.hasClass('url') && val.length && !this.valideURL(val)) {
        valid = false;
        msg =
          'URL must start with http:// or https://. For example: https://your-domain.com/';
        console.warn(`Wrong URL #${$el.attr('id')}`);
      }

      this.removeError();

      // extra checks
      if (extraChecks) {
        extraChecks.forEach((check) => {
          const result = check();
          valid = valid && result;
          if (!result) {
            console.log(check);
            console.warn(`Extra check is failed #${$el.attr('id')}`);
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
      const pattern = new RegExp(
        '^(https?:\\/\\/){1}' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$',
        'i',
      ); // fragment locator
      return pattern.test(str);
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
