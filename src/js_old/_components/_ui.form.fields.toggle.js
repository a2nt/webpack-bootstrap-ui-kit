'use strict'

import $ from 'jquery'
import Events from '../_events'

import FormBasics from './_ui.form.basics'

const FormToggleUI = (($) => {
  // Constants
  const NAME = 'jsFormToggleUI'
  const DATA_KEY = NAME
  const W = window
  const $Html = $('html, body')
  const FieldUI = 'jsFormFieldUI'

  class FormToggleUI {
    constructor ($el) {
      const ui = this
      ui.$el = $el

      if (!ui.getCondition()) {
        console.warn(`${NAME}: no condition found`)
        return
      }

      ui.toggle()

      ui.$el.on(`change shown.${FieldUI} hidden.${FieldUI}`, (e) => {
        ui.toggle()
      })

      ui.$el.addClass(`${NAME}-active`)
      ui.$el.data(DATA_KEY, ui)

      return ui
    }

    getDataEl () {
      const ui = this
      const $el = ui.$el

      return $el.is('[type="radio"],[type="checkbox"]') &&
        $el.parents('.optionset,.checkboxset').length
        ? $el.parents('.optionset,.checkboxset')
        : $el
    }

    getCondition () {
      const ui = this

      return ui.getDataEl().data('value-toggle')
    }

    getCurrentVal () {
      const ui = this
      const $el = ui.$el

      if ($el.attr('type') === 'checkbox') {
        if ($el.parents('.checkboxset').length && $el.is(':checked')) {
          return $el.val()
        }

        return !!$el.is(':checked')
      }

      if ($el.attr('type') === 'radio') {
        return $Html.find(`[name="${$el.attr('name')}"]:checked`).val()
      }

      return $el.val()
    }

    getTrueTarget () {
      const ui = this
      const $dataEl = ui.getDataEl()

      // compatibility params
      const target = $dataEl.data('value-toggle-yes')
      if (!target || !target.length) {
        return ui.getElement($dataEl.data('target'))
      }

      return ui.getElement(target)
    }

    getFalseTarget () {
      const ui = this
      const $dataEl = ui.getDataEl()

      // compatibility params
      const target = $dataEl.data('value-toggle-no')
      if (!target || !target.length) {
        return ui.getElement($dataEl.data('value-toggle-false'))
      }

      return ui.getElement(target)
    }

    getElement (target) {
      return target && target.length && $(target).length ? $(target) : false
    }

    toggle () {
      const ui = this
      const $el = ui.$el

      const val = ui.getCurrentVal()
      const $dataEl = ui.getDataEl()

      // conditional toggler
      const condition = ui.getCondition()
      if (!condition) {
        return
      }

      // yes/no toggler
      const yesNoVal =
        !!((condition === true && val && val !== '' && val !== '0') ||
        condition === val)

      const $yesTarget = ui.getTrueTarget()
      const $noTarget = ui.getFalseTarget()
      const elUI = $el.data(FieldUI)

      if ((elUI && !elUI.shown) || typeof val === 'undefined') {
        ui.toggleElement($yesTarget, false)
        ui.toggleElement($noTarget, false)

        return
      }

      if (yesNoVal) {
        ui.toggleElement($yesTarget, true)
        ui.toggleElement($noTarget, false)
      } else {
        ui.toggleElement($yesTarget, false)
        ui.toggleElement($noTarget, true)
      }
    }

    toggleElement ($el, show) {
      if (!$el.length) {
        return
      }

      const ui = this
      const action = show ? 'show' : 'hide'

      $el.filter('div.collapse').each((i, el) => {
        const $el = $(el)

        $el.collapse(action)
      })

      $el.trigger(`${action}.${NAME}`)
    }

    dispose () {
      const ui = this
      const $el = ui.$el

      $el.removeClass(`${NAME}-active`)
      $.removeData(this._el, DATA_KEY)
      this._el = null
    }

    static _jQueryInterface () {
      return this.each((i, el) => {
        // attach functionality to el
        const $el = $(el)
        let data = $el.data(DATA_KEY)

        if (!data) {
          data = new FormToggleUI($el)
          $el.data(DATA_KEY, data)
        }
      })
    }

    static validate () {
      return $(Events.FORM_FIELDS).each((i, el) => {
        const $el = $(el)
        const name = $el.attr('name')

        if ($(`[name="${name}"]`).length > 1) {
          console.warn(
            `${NAME}: Module malfunction duplicate "${name}" elements found`
          )
        }
      })
    }
  }

  // jQuery interface
  $.fn[NAME] = FormToggleUI._jQueryInterface
  $.fn[NAME].Constructor = FormToggleUI
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return FormToggleUI._jQueryInterface
  }

  // auto-apply
  $(W).on(`${Events.LODEDANDREADY}`, () => {
    // FormToggleUI.validate();
    $(Events.FORM_FIELDS).filter('[data-value-toggle]').jsFormToggleUI()

    $('[data-value-toggle]')
      .not(Events.FORM_FIELDS)
      .find(Events.FORM_FIELDS)
      .jsFormToggleUI()
  })

  return FormToggleUI
})($)

export default FormToggleUI
