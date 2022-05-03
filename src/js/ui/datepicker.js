import Events from '../_events'
import Datepicker from 'vanillajs-datepicker/Datepicker'

const init = () => {
  document.querySelectorAll('.js-datepicker').forEach((el, i) => {
    const picker = new Datepicker(el)
    el.ui = picker
  })
}

window.addEventListener(`${Events.LODEDANDREADY}`, init)
window.addEventListener(`${Events.AJAX}`, init)

export default Datepicker
