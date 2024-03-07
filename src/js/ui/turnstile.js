import Events from '../_events'

const NAME = 'uiTurnstile'
const SELECTOR = '.cf-turnstile'

const init = () => {
  const captchas = document.querySelectorAll(SELECTOR)
  if (!captchas.length) {
    console.log(`${NAME}: No Captcha fields.`)
    return
  }

  if (typeof window.turnstile === 'undefined') {
    loadScript(init)
    return
  }

  console.log(`${NAME}: init`)
  captchas.forEach((el) => {
    if (el.dataset[NAME] || el.innerHTML.length > 0) {
      return
    }

    window.turnstile.render(el)
    el.dataset[NAME] = true
  })
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
