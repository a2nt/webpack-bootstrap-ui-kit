import Events from '../_events';
import Datepicker from 'vanillajs-datepicker/Datepicker';

const init = () => {
    document.querySelectorAll('.js-calendar').forEach((el, i) => {
        const picker = new Datepicker(el);
      });
  };

window.addEventListener(`${Events.LODEDANDREADY}`, init);
window.addEventListener(`${Events.AJAX}`, init);

export default Datepicker;
