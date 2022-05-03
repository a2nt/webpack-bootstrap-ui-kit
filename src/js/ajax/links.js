// browser tab visibility state detection

import Events from '../_events'
import Consts from '../_consts'
import Page from './models/page.jsx'

import { getParents } from '../main/funcs'

import { Collapse } from 'bootstrap'

import SpinnerUI from '../main/loading-spinner'

const MainUILinks = ((W) => {
  const NAME = 'main.links'
  const D = document
  const BODY = D.body

  class MainUILinks {
    window
    static init () {
      const ui = this
      ui.GraphPage = null

      console.log(`${NAME}: init`)

      ui.loaded()

      // history state switch
      W.addEventListener('popstate', (e) => {
        ui.popState(e)
      })
    }

    static loaded () {
      const ui = this

      D.querySelectorAll('.graphql-page').forEach((el, i) => {
        const el_id = el.getAttribute('href')
        el.setAttribute(`data-${ui.name}-id`, el_id)

        el.addEventListener('click', ui.loadClick)
      })
    }

    static setActiveLinks (link) {
      const ui = this
      D.querySelectorAll(`[data-${ui.name}-id="${link}"]`).forEach((el) => {
        el.classList.add('active')
      })
    }

    static reset () {
      // reset focus
      D.activeElement.blur()

      // remove active and loading classes
      D.querySelectorAll('.graphql-page,.nav-item').forEach((el2) => {
        el2.classList.remove('active', 'loading')
      })
    }

    static popState (e) {
      const ui = this

      SpinnerUI.show()

      if (e.state && e.state.page) {
        console.log(`${NAME}: [popstate] load`)
        const state = JSON.parse(e.state.page)

        state.current = null
        state.popstate = true

        ui.reset()
        ui.setActiveLinks(e.state.link)

        if (!ui.GraphPage) {
          console.log(
            `${NAME}: [popstate] GraphPage is missing. Have to render it first`
          )

          ui.GraphPage = ReactDOM.render(
            <Page />,
            document.getElementById('MainContent')
          )
        }

        ui.GraphPage.setState(state)
        SpinnerUI.hide()

        window.dispatchEvent(new Event(Events.AJAX))
      } else if (e.state && e.state.landing) {
        console.log(`${NAME}: [popstate] go to landing`)
        W.location.href = e.state.landing
      } else {
        console.warn(`${NAME}: [popstate] state is missing`)
        console.log(e)
        SpinnerUI.hide()
      }
    }

    // link specific event {this} = current event, not MainUILinks
    static loadClick (e) {
      console.groupCollapsed(`${NAME}: load on click`)
      e.preventDefault()

      const ui = MainUILinks
      const el = e.currentTarget

      SpinnerUI.show()

      ui.reset()
      el.classList.add('loading')
      el.classList.remove('response-404', 'response-500', 'response-523')
      BODY.classList.add('ajax-loading')

      // hide parent mobile nav
      const navs = getParents(el, '.collapse')
      if (navs.length) {
        navs.forEach((nav) => {
          const collapseInst = Collapse.getInstance(nav)
          if (collapseInst) {
            collapseInst.hide()
          }
        })
      }

      // hide parent dropdown
      /* const dropdowns = getParents(el, '.dropdown-menu');
                                      if (dropdowns.length) {
                                        const DropdownInst = Dropdown.getInstance(dropdowns[0]);
                                        DropdownInst.hide();
                                      } */

      if (!ui.GraphPage) {
        ui.GraphPage = ReactDOM.render(
          <Page />,
          document.getElementById('MainContent')
        )
      }

      const link = el.getAttribute('href') || el.getAttribute('data-href')

      ui.GraphPage.state.current = el

      ui.GraphPage.load(link)
        .then((response) => {
          BODY.classList.remove('ajax-loading')
          el.classList.remove('loading')
          el.classList.add('active')

          D.loading_apollo_link = null

          if (ui.GraphPage.state.Link) {
            window.history.pushState(
              {
                page: JSON.stringify(ui.GraphPage.state),
                link: el.getAttribute(`data-${ui.name}-id`),
              },
              ui.GraphPage.state.Title,
              ui.GraphPage.state.Link
            )

            ui.setActiveLinks(ui.GraphPage.state.Link)
          }

          SpinnerUI.hide()

          window.dispatchEvent(new Event(Events.AJAX))
          console.groupEnd(`${NAME}: load on click`)
        })
        .catch((e) => {
          console.error(`${NAME}: loading error`)
          console.log(e)

          /* BODY.classList.remove('ajax-loading');
                                                                                el.classList.remove('loading'); */
          el.classList.add('error', `response-${e.status}`)
          /* switch (e.status) {
                                                                                    case 500:
                                                                                        break;
                                                                                    case 404:
                                                                                        el.classList.add('not-found');
                                                                                        break;
                                                                                    case 523:
                                                                                        el.classList.add('unreachable');
                                                                                        break;
                                                                                } */

          // SpinnerUI.hide();

          // window.dispatchEvent(new Event(Events.AJAX));
          console.groupEnd(`${NAME}: load on click`)

          console.log(`${NAME}: reloading page ${link}`)

          // fallback loading
          W.location.href = link
        })
    }
  }

  W.addEventListener(`${Events.LOADED}`, () => {
    MainUILinks.init()
  })

  W.addEventListener(`${Events.AJAX}`, () => {
    MainUILinks.loaded()
  })

  // fallback
  /* W.addEventListener(`${Events.APOLLO_ERROR}`, (e) => {
                            console.error(`${NAME}: [APOLLO_ERROR] loading failure, reloading the page`);
                            //W.dispatchEvent(new Event(Events.OFFLINE));
                            if (D.loading_apollo_link) {
                                W.location.href = D.loading_apollo_link;
                            }
                        }); */
})(window)

export default MainUILinks
