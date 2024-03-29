import Events from '../_events'

const NAME = 'uiTurnstile'
const SELECTOR = `.${NAME},.js-turnstile`

const init = () => {
  console.log(`${NAME}: init`)

  const captchas = document.querySelectorAll(SELECTOR)
  if (!captchas.length) {
    console.log(`${NAME}: No Captcha fields.`)
    return
  }

  if (!document.querySelector('#captchaAPI') && typeof window.turnstile === 'undefined') {
    loadScript(init)
    return
  }

  renderCaptcha()
}

const renderCaptcha = () => {
  console.log(`${NAME}: renderCaptcha`)

  const captchas = document.querySelectorAll(SELECTOR)

  captchas.forEach((el) => {
    if (el.dataset[NAME] || el.innerHTML.length > 0) {

      if (el.dataset.widgetid) {
        turnstile.reset(el.dataset.widgetid)
      }

      return
    }

    const widgetid = window.turnstile.render(el, {
      sitekey: el.dataset.sitekey,
      callback: function (token) {
        console.log(`${NAME}: Challenge Success ${token}`);
      },
    })

    /*const form = el.closest('form')
    form.addEventListener('submit', () => {
      console.log(`${NAME}: submit`)
      window.turnstile.reset(el.dataset.widgetid)
    })*/

    el.dataset.widgetid = widgetid

    el.dataset[NAME] = true
  })
}

const loadScript = () => {

  console.log(`${NAME}: Loading Captcha API ...`)
  const script = document.createElement('script');
  script.id = 'captchaAPI';
  script.src = `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=renderCaptcha`
  script.async = true

  document.body.append(script)
}

window.renderCaptcha = renderCaptcha

window.addEventListener(`${Events.LODEDANDREADY}`, init)
window.addEventListener(`${Events.AJAX}`, init)
