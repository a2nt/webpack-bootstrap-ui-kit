import $ from 'jquery';
import Events from '../_events';

const FormValidateField = (($) => {
  // Constants
  const NAME = 'jsFormValidateField';
  const DATA_KEY = NAME;
  const $Html = $('html, body');

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

      // browser checks + required
      if (
        !ui.$el[0].checkValidity() ||
        ($el.hasClass('required') &&
          (!val.length ||
            !val.trim().length ||
            (ui.isHtml(val) && !$(val).text().length)))
      ) {
        valid = false;
      }

      // validate URL
      if ($el.hasClass('url') && val.length && !this.valideURL(val)) {
        valid = false;
        msg =
          'URL must start with http:// or https://. For example: https://your-domain.com/';
      }

      this.removeError();

      // extra checks
      if (extraChecks) {
        extraChecks.forEach((check) => {
          valid = valid && check();
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
      const pos = $field.offset().top;

      ui.removeError();

      $field.addClass('error');
      if (msg) {
        fieldUI.addMessage(msg, 'alert-error alert-danger', scrollTo);
      } else if (scrollTo) {
        $field.focus();
        $Html.scrollTop(pos - 100);
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
