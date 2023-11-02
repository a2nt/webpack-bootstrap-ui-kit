import Events from '../_events'

const NAME = 'uiTurnstile'
const SELECTOR = '.cf-turnstile'

const init = () => {
  if (!document.querySelectorAll(SELECTOR).length) {
    console.log(`${NAME}: No Captcha fields.`)
    return
  }

  if (typeof window.turnstile === 'undefined') {
    loadScript(init)
    return
  }

  console.log(`${NAME}: init`)
  window.turnstile.render(SELECTOR)
}


window.turnstileFieldRender = init

const loadScript = (callback) => {
  if (typeof window.turnstile !== 'undefined') {
    callback()
  }

  console.log(`${NAME}: Loading Captcha API ...`)

  const script = document.createElement('script');
  script.id = 'captchaAPI';
  script.src = `https://challenges.cloudflare.com/turnstile/v0/api.js?hl=${document.querySelector('html').getAttribute('lang').substr(0, 2)}`
  script.async = true
  script.onload = function () {
    console.log(`${NAME}: Turnstile Captcha API is loaded.`)
    callback()
  }

  document.body.append(script)
}

window.addEventListener(`${Events.LODEDANDREADY}`, init)
window.addEventListener(`${Events.AJAX}`, init)
