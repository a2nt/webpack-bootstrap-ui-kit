import Events from '../_events'
import Datepicker from 'vanillajs-datepicker/Datepicker'

const init = () => {
  document.querySelectorAll('input.js-datepicker').forEach((el, i) => {
    if( el.dataset.ui ){
      return
    }

    const datesNum = el.dataset.datesNum;

    const picker = new Datepicker(el,{
      buttonClass: 'btn',
      autohide: true,
      maxNumberOfDates: datesNum ? datesNum : 1,
    })

    el.addEventListener('changeDate', (e) => {
      e.currentTarget.dispatchEvent(new Event('change'));
    })

    el.ui = picker
    el.dataset.ui = true
  })
}

window.addEventListener(`${Events.LODEDANDREADY}`, init)
window.addEventListener(`${Events.AJAX}`, init)

export default Datepicker
