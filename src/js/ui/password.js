import Events from '../_events'

const PasswordUI = ((window) => {
  const NAME = 'js-password'

  const init = () => {
    console.log(`${NAME}: init`)

    let timer;
    const toggle = (input) => {
      if (input.getAttribute('type') === 'password') {
        show(input)
      } else {
        hide(input)
      }
    }

    const show = (input) => {
      input.setAttribute('type', 'text')
      timer = setTimeout(() => {
        hide(input)
      }, 3000)
    }

    const hide = (input) => {
      input.setAttribute('type', 'password')
      if(timer){
        clearTimeout(timer);
      }
    }

    document.querySelectorAll(`${NAME}-show, .show-password`).forEach((el) => {
      if(el.classList.contains(`${NAME}-active`)){
        return
      }

      el.addEventListener('click', (e) => {
        const input = e.currentTarget.closest('.field').querySelector('input');
        if (!input) {
          return
        }

        toggle(input)
      })

      el.classList.add(`${NAME}-active`)
    })
  }

  window.addEventListener(`${Events.LODEDANDREADY}`, init)
  window.addEventListener(`${Events.AJAX}`, init)
})(window)

export default PasswordUI
