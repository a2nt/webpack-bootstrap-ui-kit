'use strict'

import $ from 'jquery'

import 'select2/dist/js/select2.js'
import Events from '../_events'

const FormSelect2 = (($) => {
  // Constants
  const NAME = 'jsFormSelect2'
  const DATA_KEY = NAME
  const $Html = $('html, body')
  const W = window
  const D = document

  class FormSelect2 {
    constructor (el) {
      const ui = this
      const $el = $(el)

      ui._el = el
      ui.dispose()

      console.log(`${NAME}: init`)
      $el.data(DATA_KEY, this)

      const $fields = $el.find(Events.FORM_FIELDS)

      const $selectFields = $el
        .find('select:not([readonly])')
        .not('.no-select2')

      $selectFields.each((i, el) => {
        $(el).select2()
      })

      $el.addClass(`${NAME}-active`)
      $el.trigger(Events.FORM_INIT_BASICS)
    }

    // Public methods
    dispose () {
      console.log(`${NAME}: dispose`)
      const ui = this

      const $el = $(ui._el)

      const $selectFields = $el
        .find('select:not([readonly])')
        .not('.no-select2')
      $selectFields.each((i, el) => {
        const $el = $(el)
        if ($el.hasClass('select2-hidden-accessible')) {
          $el.select2('destroy')
        }
      })

      $.removeData(ui._el, DATA_KEY)
      ui._el = null
      $el.removeClass(`${NAME}-active`)
    }

    static _jQueryInterface () {
      return this.each(() => {
        // attach functionality to el
        const $el = $(this)
        let data = $el.data(DATA_KEY)

        if (!data) {
          data = new FormSelect2(this)
          $el.data(DATA_KEY, data)
        }
      })
    }
  }

  // jQuery interface
  $.fn[NAME] = FormSelect2._jQueryInterface
  $.fn[NAME].Constructor = FormSelect2
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return FormSelect2._jQueryInterface
  }

  const init = () => {
    $('form').jsFormSelect2()
  }

  // auto-apply
  $(W).on(`${NAME}.init ${Events.AJAX} ${Events.LOADED}`, () => {
    init()
  })

  return FormSelect2
})($)

export default FormSelect2
