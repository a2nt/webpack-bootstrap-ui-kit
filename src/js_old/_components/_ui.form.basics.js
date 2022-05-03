'use strict'

import $ from 'jquery'

import Events from '../_events'
import SpinnerUI from './_ui.spinner'
import FormFieldUI from './_ui.form.fields'

const FormBasics = (($) => {
  // Constants
  const NAME = 'jsFormBasics'
  const DATA_KEY = NAME
  const $Html = $('html, body')
  const W = window
  const D = document

  class FormBasics {
    constructor (el) {
      const ui = this
      const $el = $(el)

      ui._el = el
      ui.dispose()

      console.log(`${NAME}: init`)
      $el.data(DATA_KEY, this)

      // $('[data-inputmask]').inputmask();

      const $fields = $el.find(Events.FORM_FIELDS)
      // init fields ui
      $fields.each((i, el) => {
        // skip some fields here
        new FormFieldUI(el)
      })

      $fields.each((e, el) => {
        const $el = $(el)

        if ($el.hasClass('required') || $el.attr('aria-required')) {
          $el.closest('.field').addClass('required')
        }
      })

      const $radioOptions = $el.find('input[type="radio"]')
      $radioOptions.each((e, el) => {
        const $el = $(el)

        if ($el.is(':checked')) {
          $el.parents('.radio').addClass('checked')
        }
      })

      $radioOptions.on('change', (e) => {
        const $el = $(e.currentTarget)
        const $parent = $el.parents('.radio')

        $parent.siblings('.radio').each((i, el) => {
          const $el = $(el)

          if (!$el.find('input').is(':checked')) {
            $el.removeClass('checked')
          }
        })

        if ($el.is(':checked')) {
          $parent.addClass('checked')
        }
      })

      $el.on('submit', (e) => {
        setTimeout(() => {
          if (!$el.find('.error').length) {
            SpinnerUI.show()
          }
        }, 100)
      })

      $('.field.password .show-password').on('click', (e) => {
        console.log(`${NAME}: .field.password .show-password (click)`)

        const $el = $(e.currentTarget)
        const $field = $el.siblings('input')
        const $icon = $el.find('.fas')
        const attr = $field.attr('type')

        if (attr === 'password') {
          $field.attr('type', 'text')
          $icon.removeClass('fa-eye').addClass('fa-eye-slash')
        } else {
          $field.attr('type', 'password')
          $icon.removeClass('fa-eye-slash').addClass('fa-eye')
        }
      })

      $el.addClass(`${NAME}-active`)
      $el.trigger(Events.FORM_INIT_BASICS)
    }

    // Public methods
    dispose () {
      console.log(`${NAME}: dispose`)
      const ui = this

      const $el = $(ui._el)
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
          data = new FormBasics(this)
          $el.data(DATA_KEY, data)
        }
      })
    }
  }

  // jQuery interface
  $.fn[NAME] = FormBasics._jQueryInterface
  $.fn[NAME].Constructor = FormBasics
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return FormBasics._jQueryInterface
  }

  const init = () => {
    $('form').jsFormBasics()
  }

  // auto-apply
  $(W).on(`${NAME}.init ${Events.AJAX} ${Events.LOADED}`, () => {
    init()
  })

  return FormBasics
})($)

export default FormBasics
