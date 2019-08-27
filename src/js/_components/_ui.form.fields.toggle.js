import $ from 'jquery';
import Events from '../_events';

const FormToggleUI = (($) => {
  // Constants
  const NAME = 'jsFormToggleUI';
  const DATA_KEY = NAME;
  const W = window;
  const $Html = $('html, body');
  const FieldUI = 'jsFormFieldUI';

  class FormToggleUI {

    constructor($el) {
      const ui = this;

      ui.$el = $el;
      ui.$el.data(DATA_KEY, ui);

      ui.toggle();

      ui.$el.on(`change shown.${  FieldUI  } hidden.${  FieldUI}`, (e) => {
        ui.toggle();
      });

      ui.$el.addClass(`${NAME}-active`);

      return ui;
    }

    toggle() {
      const ui = this;
      const $el = ui.$el;

      const val = ($el.attr('type') === 'checkbox') ?
        ($el.is(':checked') ? true : false) :
        ($el.attr('type') === 'radio' ? $Html.find(`[name="${  $el.attr('name')  }"]:checked`).val() : $el.val());

      const $dataEl = ($el.is('[type="radio"]') && $el.parents('.optionset').length) ?
        $el.parents('.optionset') : $el;

      const yesNoVal = val && val !== '' && val !== '0' ? true : false;
      const $yesTarget = $($dataEl.data('value-toggle-yes'));
      const $noTarget = $($dataEl.data('value-toggle-no'));

      if (!$el.data(FieldUI).shown || typeof val === 'undefined') {
        if ($yesTarget.length) {
          ui.toggleElement($yesTarget, false);
        }
        if ($noTarget.length) {
          ui.toggleElement($noTarget, false);
        }

        return;
      }

      if (yesNoVal) {
        if ($yesTarget.length) {
          ui.toggleElement($yesTarget, true);
        }
        if ($noTarget.length) {
          ui.toggleElement($noTarget, false);
        }
      } else {
        if ($yesTarget.length) {
          ui.toggleElement($yesTarget, false);
        }
        if ($noTarget.length) {
          ui.toggleElement($noTarget, true);
        }
      }
    }

    toggleElement($el, show) {
      const ui = this;
      const action = show ? 'show' : 'hide';

      $el.filter('div.collapse').each((i, el) => {
        const $el = $(el);

        $el.collapse(action);
      });

      $el.trigger(`${action  }.${  NAME}`);
    }

    dispose() {
      const ui = this;
      const $el = ui.$el;

      $el.removeClass(`${NAME}-active`);
      $.removeData(this._el, DATA_KEY);
      this._el = null;
    }

    static _jQueryInterface() {
      return this.each((i, el) => {
        // attach functionality to el
        const $el = $(el);
        let data = $el.data(DATA_KEY);

        if (!data) {
          data = new FormToggleUI($el);
          $el.data(DATA_KEY, data);
        }
      });
    }

    static validate() {
      return $(Events.FORM_FIELDS).each((i, el) => {
        const $el = $(el);
        const name = $el.attr('name');

        if ($(`[name="${  name  }"]`).length > 1) {
          console.log(`${NAME  }: Module malfunction duplicate "${  name  }" elements found`);
        }
      });
    }
  }

  // jQuery interface
  $.fn[NAME] = FormToggleUI._jQueryInterface;
  $.fn[NAME].Constructor = FormToggleUI;
  $.fn[NAME].noConflict = function() {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return FormToggleUI._jQueryInterface;
  };

  // auto-apply
  $(W).on(`${Events.AJAX} ${Events.LOADED}`, () => {
    //FormToggleUI.validate();
    $(Events.FORM_FIELDS).filter('[data-value-toggle]').jsFormToggleUI();
    $('[data-value-toggle]').not(Events.FORM_FIELDS).find(Events.FORM_FIELDS).jsFormToggleUI();
  });

  return FormToggleUI;
})($);

export default FormToggleUI;
