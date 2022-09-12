import Events from '../_events'

const CaptchaUI = ((window) => {
  const NAME = 'js-captcha'

  const init = () => {
    console.log(`${NAME}: init`)

    const submitListener = (e) => {
      console.log(`${NAME}: Validating Captcha ...`)
      const field = e.currentTarget.querySelectorAll(`.${NAME}, .g-recaptcha`).forEach((el) => {
        grecaptcha.execute(el.dataset.widgetid)
      })
    }

    const attachCaptcha = () => {
      console.log(`${NAME}: Rendering Captcha ...`)

      const fields = document.querySelectorAll(`.${NAME}, .g-recaptcha`)
      const grecaptcha = window.grecaptcha

      fields.forEach((el, i) => {
        if (el.dataset.widgetid || el.innerHTML !== '') {
          // already initialized
          return
        }

        const form = el.closest(form)
        const widgetid = grecaptcha.render(el, el.dataset)
        el.dataset.widgetid = widgetid

        if(el.dataset.size === 'invisible' && !el.dataset.callback){
          grecaptcha.execute(widgetid)
          form.addEventListener('submit', submitListener)
        }

        el.classList.add(`${NAME}-active`)
        el.dispatchEvent(new Event(`${NAME}-ready`))
      })
    }

    const loadScript = (callback) => {
      if(typeof window.grecaptcha !== 'undefined'){
        callback()
      }

      console.log(`${NAME}: Loading Captcha API ...`)

      const script = document.createElement('script');
      script.id = 'captchaAPI';
      script.src = `https://www.google.com/recaptcha/api.js?render=explicit&hl=${  document.querySelector('html').getAttribute('lang').substr(0,2)}`
      script.async = true
      script.onload = function() {
        console.log(`${NAME}: Captcha API is loaded.`)
        callback()
      }

      document.body.append(script)
    }

    if(document.querySelectorAll('.g-recaptcha').length){
      loadScript(attachCaptcha);
    }else{
      console.log(`${NAME}: No Captcha fields.`)
    }

    window.noCaptchaFieldRender = attachCaptcha
  }

  window.addEventListener(`${Events.LODEDANDREADY}`, init)
  window.addEventListener(`${Events.AJAX}`, init)
})(window)

export default CaptchaUI
