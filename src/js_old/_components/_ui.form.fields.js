'use strict';

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
      ui.shown = true;

      ui.$el.data(DATA_KEY, ui);
      //ui.$actions = ui.$el.parents('form').children('.btn-toolbar,.form-actions');

      ui.vals = {
        val: ui.$el.val(),
        checked: ui.$el.is(':checked'),
      };

      // bootstrap collapse integration
      ui.$el.parents('.optionset').not('.field').removeClass('collapse');
      ui.$collapse = ui.$el
        .parents('.field.collapse')
        .not('.composite')
        .first();
      if (ui.$collapse.length) {
        ui.$el.removeClass('collapse');

        ui.$collapse.on('show.bs.collapse', (e) => {
          ui.show();
        });

        ui.$collapse.on('hidden.bs.collapse', (e) => {
          ui.hide();
        });
      }

      ui.$el.addClass(`${NAME}-active`);

      return ui;
    }

    // Public methods
    dispose() {
      const ui = this;
      const $el = ui.$el;

      $el.removeClass(`${NAME}-active`);
      $.removeData($el[0], DATA_KEY);
    }

    show() {
      const ui = this;
      const $el = ui.$el;

      ui.restore();
      ui.shown = true;

      /*if (ui.$collapse.length) {
        ui.$collapse.collapse('show');
      }

      if ($el.hasClass('collapse')) {
        $el.collapse('show');
      }*/

      $el.trigger(`shown.${NAME}`);
    }

    hide() {
      const ui = this;
      const $el = ui.$el;

      ui.wipe();
      ui.shown = false;

      /*if (ui.$collapse.length) {
        ui.$collapse.collapse('hide');
      }

      if ($el.hasClass('collapse')) {
        $el.collapse('hide');
      }

      $el.trigger('change');*/
      $el.trigger(`hidden.${NAME}`);
    }

    wipe() {
      const ui = this;
      const $el = ui.$el;

      ui.vals = {
        name: $el.attr('name'),
        val: $el.val(),
        checked: $el.is(':checked'),
      };

      $el.val('');
      $el.prop('checked', false);
    }

    restore() {
      const ui = this;
      const $el = ui.$el;
      const checked = ui.vals['checked'];

      $el.val(ui.vals['val']);
      $el.prop('checked', checked);
    }

    addMessage(msg, type = null, scrollTo = true) {
      const ui = this;
      const $field = ui.$el.closest('.field');

      $field.addClass('has-message');
      if (msg) {
        $field.append(`<div class="message alert ${type}">${msg}</div>`);
      }

      if (scrollTo) {
        const pos = $field.offset().top;
        $field.focus();
        $Html.scrollTop(pos - 100);
      }
    }

    removeMessages() {
      const ui = this;
      const $field = ui.$el.closest('.field');

      $field.removeClass('has-message');
      $field.find('.message').remove();
    }

    static _jQueryInterface() {
      return this.each(function () {
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
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return FormFieldUI._jQueryInterface;
  };

  return FormFieldUI;
})($);

export default FormFieldUI;
