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

      if (!ui.getCondition()) {
        return;
      }

      ui.$el.data(DATA_KEY, ui);

      ui.toggle();

      ui.$el.on(`change shown.${  FieldUI  } hidden.${  FieldUI}`, (e) => {
        ui.toggle();
      });

      ui.$el.addClass(`${NAME}-active`);

      return ui;
    }

    getDataEl() {
      const ui = this;
      const $el = ui.$el;

      return ($el.is('[type="radio"]') && $el.parents('.optionset').length) ?
        $el.parents('.optionset') : $el;
    }

    getCondition() {
      const ui = this;

      return ui.getDataEl().data('value-toggle');
    }

    getCurrentVal() {
      const ui = this;
      const $el = ui.$el;

      return ($el.attr('type') === 'checkbox') ?
        ($el.is(':checked') ? true : false) :
        ($el.attr('type') === 'radio' ? $Html.find(`[name="${  $el.attr('name')  }"]:checked`).val() : $el.val());
    }

    getTrueTarget() {
      const ui = this;
      const $dataEl = ui.getDataEl();

      let target = $dataEl.data('value-toggle-yes');
      if (!target || !target.length) {
        let target = $dataEl.data('target');
      }

      return ui.getElement(target);
    }

    getFalseTarget() {
      const ui = this;
      const target = ui.getDataEl().data('value-toggle-no');

      return ui.getElement(target);
    }

    getElement(target) {
      return target && target.length && $(target).length ?
        $(target) : false;
    }

    toggle() {
      const ui = this;
      const $el = ui.$el;

      const val = ui.getCurrentVal();
      const $dataEl = ui.getDataEl();

      // coditional toggler
      const condition = ui.getCondition();
      if (!condition) {
        return;
      }

      // yes/no toggler
      const yesNoVal = (
        (condition === true && val && val !== '' && val !== '0') ||
        condition === val
      ) ? true : false;

      const $yesTarget = ui.getTrueTarget();
      const $noTarget = ui.getFalseTarget();

      if (!$el.data(FieldUI).shown || typeof val === 'undefined') {
        ui.toggleElement($yesTarget, false);
        ui.toggleElement($noTarget, false);

        return;
      }

      if (yesNoVal) {
        ui.toggleElement($yesTarget, true);
        ui.toggleElement($noTarget, false);
      } else {
        ui.toggleElement($yesTarget, false);
        ui.toggleElement($noTarget, true);
      }
    }

    toggleElement($el, show) {
      if (!$el.length) {
        return;
      }

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
    $('[data-value-toggle]')
      .not(Events.FORM_FIELDS)
      .find(Events.FORM_FIELDS)
      .jsFormToggleUI();
  });

  return FormToggleUI;
})($);

export default FormToggleUI;
