import Events from '../_events'
const NAME = 'uiTurnstile'

const init = () => {
  if (typeof window.turnstile === undefined) {
    return
  }

  console.log(`${NAME}: init`)
  window.turnstile.render('.cf-turnstile')
}

window.addEventListener(`${Events.LODEDANDREADY}`, init)
window.addEventListener(`${Events.AJAX}`, init)
