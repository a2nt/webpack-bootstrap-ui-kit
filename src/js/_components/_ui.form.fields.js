import $ from 'jquery';
import Events from '../_events';

const FormFieldUI = (($) => {
  // Constants
  const NAME = 'jsFormFieldUI';
  const DATA_KEY = NAME;
  const $Html = $('html, body');

  class FormFieldUI {

    constructor(el) {
      const ui = this;

      ui.$el = $(el);
      ui.$el.data(DATA_KEY, this);
      ui.shown = true;
      //ui.$actions = ui.$el.parents('form').children('.btn-toolbar,.form-actions');

      ui.vals = {
        'val': ui.$el.val(),
        'checked': ui.$el.is(':checked'),
      };

      ui.$el.addClass(`${NAME}-active`);
    }

    // Public methods
    dispose() {
      const ui = this;
      const $el = ui.$el;

      $el.removeClass(`${NAME}-active`);
      $.removeData(this._el, DATA_KEY);
      this._el = null;
    }

    show() {
      const ui = this;
      const $el = ui.$el;

      ui.restore();
      ui.shown = true;

      if ($el.hasClass('collapse')) {
        $el.collapse('show');
      }

      $el.trigger('change');
    }

    hide() {
      const ui = this;
      const $el = ui.$el;

      ui.wipe();
      ui.shown = false;

      if ($el.hasClass('collapse')) {
        $el.collapse('hide');
      }

      $el.trigger('change');
    }

    wipe() {
      const ui = this;
      const $el = ui.$el;

      if (!ui.shown) {
        return;
      }

      ui.vals = {
        'name': $el.attr('name'),
        'val': $el.val(),
        'checked': $el.is(':checked'),
      };

      $el.val('');
      $el.prop('checked', false);
    }

    restore() {
      const ui = this;
      const $el = ui.$el;

      $el.val(ui.vals['val']);
      $el.prop('checked', ui.vals['checked']);
    }

    static _jQueryInterface() {
      return this.each(function() {
        // attach functionality to el
        const $el = $(this);
        let data = $el.data(DATA_KEY);

        if (!data) {
          data = new FormFieldUI(this);
          $el.data(DATA_KEY, data);
        }
      });
    }
  }

  // jQuery interface
  $.fn[NAME] = FormFieldUI._jQueryInterface;
  $.fn[NAME].Constructor = FormFieldUI;
  $.fn[NAME].noConflict = function() {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return FormFieldUI._jQueryInterface;
  };

  return FormFieldUI;
})($);

export default FormFieldUI;
