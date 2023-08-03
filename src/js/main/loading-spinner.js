// browser tab visibility state detection

// import Events from '../_events'

const NAME = '_main.loading-spinner'
const SPINNER = document.getElementById('PageLoading')

class SpinnerUI {
  static show () {
    console.log(`${NAME}: show`)
    SPINNER.classList.remove('d-none')
  }

  static hide () {
    console.log(`${NAME}: hide`)
    SPINNER.classList.add('d-none')
  }
}

export default SpinnerUI
