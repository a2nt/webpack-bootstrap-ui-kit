import Events from '../_events'

import Choices from "choices.js";
import "choices.js/src/styles/choices.scss";

const SelectUI = ((window) => {
  const NAME = 'js-select'

  const init = () => {
    console.log(`${NAME}: init`)
    document.querySelector('select:not([readonly],.no-select2)')

    document.querySelectorAll(`.${NAME},select:not([readonly],.no-select2)`).forEach((el) => {
      if(el.classList.contains(`${NAME}-active`)){
        return
      }

      new Choices(el, {
        allowHTML: true,
        shouldSort: (el.dataset.shouldSort === 'true'),
      });

      el.classList.add(`${NAME}-active`)
    })
  }

  window.addEventListener(`${Events.LODEDANDREADY}`, init)
  window.addEventListener(`${Events.AJAX}`, init)
})(window)

export default SelectUI
