import Events from '../_events'
import Consts from '../_consts'
import SpinnerUI from './loading-spinner'

const MainUI = ((window) => {
  const NAME = '_main'
  const BODY = document.body

  console.info(
    `%cUI Kit ${UINAME} ${UIVERSION}`,
    'color:yellow;font-size:14px'
  )
  console.info(
    `%c${UIMetaNAME} ${UIMetaVersion}`,
    'color:yellow;font-size:12px'
  )
  console.info(
    `%chttps://github.com/a2nt/webpack-bootstrap-ui-kit by ${UIAUTHOR}`,
    'color:yellow;font-size:10px'
  )

  console.info(`%cENV: ${process.env.NODE_ENV}`, 'color:green;font-size:10px')
  console.groupCollapsed('Events')
  Object.keys(Events).forEach((k) => {
    console.info(`${k}: ${Events[k]}`)
  })
  console.groupEnd('Events')

  console.groupCollapsed('Consts')
  Object.keys(Consts).forEach((k) => {
    console.info(`${k}: ${Consts[k]}`)
  })
  console.groupEnd('Events')

  console.groupCollapsed('Init')
  console.time('init')

  class MainUI {
    // first time the website initialization
    static init () {
      const ui = this

      // store landing page state
      window.history.replaceState(
        {
          landing: window.location.href,
        },
        document.title,
        window.location.href
      )
      //

      ui.loaded()
    }

    // init AJAX components
    static loaded () {
      // const ui = this
      console.log(`${NAME}: loaded`)
    }

    static unloaded () {
      console.log(`${NAME}: unloaded`)

      SpinnerUI.show()
      BODY.classList.remove('loaded')
    }
  }

  const documentInit = () => {
    MainUI.init()

    BODY.classList.add('loaded')
    SpinnerUI.hide()

    console.groupEnd('init')
    console.timeEnd('init')

    window.addEventListener(`${Events.LOADED}`, (event) => {
      window.dispatchEvent(new Event(Events.LODEDANDREADY))
    })
  }

  if (document.readyState === 'loading') { // Loading hasn't finished yet
    document.addEventListener(`${Events.DOMLOADED}`, documentInit)
  } else {
    documentInit()
  }

  window.addEventListener(`${Events.AJAX}`, () => {
    MainUI.loaded()
  })

   window.addEventListener('beforeunload', () => {
      MainUI.unloaded()
    })

  window.MainUI = MainUI

  return MainUI
})(window)

export default MainUI
