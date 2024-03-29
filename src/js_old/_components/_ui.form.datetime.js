'use strict'

import $ from 'jquery'

import Events from '../_events'

import 'bootstrap-datepicker/dist/js/bootstrap-datepicker.js'
import 'bootstrap-timepicker/js/bootstrap-timepicker.js'

const DatetimeUI = (($) => {
  // Constants
  const W = window
  const D = document
  const $Body = $('body')

  const NAME = 'jsDatetimeUI'
  const DATA_KEY = NAME

  const datepickerOptions = {
    autoclose: true,
    startDate: 0,
    // todayBtn: true,
    todayHighlight: true,
    clearBtn: true,
  }

  class DatetimeUI {
    constructor (el) {
      console.log(`${NAME}: init`)

      const ui = this
      const $el = $(el)

      ui._el = el

      // datepicker
      if ($el.hasClass('date') || $el.attr('type') === 'date') {
        const defaultDate =
          $el.attr('name').toLowerCase().indexOf('end') !== -1 ? '+4d' : '+3d'

        $el.attr('type', 'text')
        $el.attr('readonly', 'true')
        $el.datepicker(
          $.extend(
            datepickerOptions,
            {
              defaultViewDate: defaultDate,
              multidate: $el.data('multidate'),
            },
            $el.data()
          )
        )
      }

      // timepicker
      else if ($el.hasClass('time') || $el.attr('type') === 'time') {
        $el.attr('readonly', 'true')
        $el
          .timepicker(
            $.extend(
              {
                snapToStep: true,
                icons: {
                  up: 'fas fa-chevron-up',
                  down: 'fas fa-chevron-down',
                },
              },
              $el.data()
            )
          )
          .on('show.timepicker', (e) => {
            const $el = $(e.currentTarget)
            const $dropdown = $Body.find('.bootstrap-timepicker-widget')

            if (!$dropdown.find('[data-action="clear"]').length) {
              $dropdown
                .find('tbody')
                .append(
                  '<tr><td colspan="5"><a href="#" data-action="clear">Clear</a></td></tr>'
                )
            }

            const $clearBtn = $dropdown.find('[data-action="clear"]')
            $clearBtn.on('click', (e) => {
              e.preventDefault()
              $el.timepicker('clear')
              $el.timepicker('hideWidget')
            })
          })
      }
    }

    static dispose () {
      console.log(`${NAME}: dispose`)
    }

    static _jQueryInterface () {
      return this.each(function () {
        // attach functionality to element
        const $el = $(this)
        let data = $el.data(DATA_KEY)

        if (!data) {
          data = new DatetimeUI(this)
          $el.data(DATA_KEY, data)
        }
      })
    }
  }

  // jQuery interface
  $.fn[NAME] = DatetimeUI._jQueryInterface
  $.fn[NAME].Constructor = DatetimeUI
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return DatetimeUI._jQueryInterface
  }

  // auto-apply
  $(window).on(`${NAME}.init ${Events.AJAX} ${Events.LOADED}`, () => {
    $(
      'input.date, input.time,input[type="date"], input[type="time"]'
    ).jsDatetimeUI()
  })

  return DatetimeUI
})($)

export default DatetimeUI
