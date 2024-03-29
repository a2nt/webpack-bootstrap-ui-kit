import Events from '../_events'

/*
 * Bootstrap compatible dropdowns without popover library
 *
 * [data-bs-toggle="hover"] - shows/hides dropdown on mouseover/mouseout
 * [data-bs-toggle="dropdown"], .js-dropdown - shows/hides dropdown on click
 *
 */
const DropdownHoverUI = ((window) => {
  const NAME = 'js-dropdown'
  const ACTIVECLS = ['active', 'active-dropdown']

  const HideAll = () => {
    // hide others
    document.querySelectorAll('.dropdown-menu').forEach((el, i) => {
      const next = el.closest('.dropdown')
      if (next) {
        next.classList.remove(...ACTIVECLS)
      }

      el.classList.remove('show')
    })
  }

  const Toggle = (el) => {
    console.log(`${NAME}: nav toggle`)

    const menu = el.querySelector('.dropdown-menu')
    const isOpenned = menu.classList.contains('show')

    HideAll()

    if (menu && !isOpenned) {
      menu.classList.add('show')
    }
  }

  const Show = (e) => {
    e.stopPropagation()
    const el = e.currentTarget

    el.classList.add(...ACTIVECLS)
    const menu = el.querySelector('.dropdown-menu')
    if (menu) {
      menu.classList.add('show')
    }
  }

  const Hide = (e) => {
    e.stopPropagation()
    const el = e.currentTarget

    el.classList.remove(...ACTIVECLS)
    const menu = el.querySelector('.dropdown-menu')
    if (menu) {
      menu.classList.remove('show')
    }
  }

  const init = () => {
    console.log(`${NAME}: init`)

    const clickableEls = document.querySelectorAll(`.${NAME},[data-bs-toggle="dropdown"],.dropdown-toggle`)
    const hoverableEls = document.querySelectorAll('[data-bs-toggle="hover"]')

    const attachHoverEvents = (el) => {
      if (el.classList.contains(`${NAME}-hover-active`)) {
        return
      }

      el.addEventListener('mouseover', Show, false)
      el.addEventListener('mouseleave', Hide, false)

      el.classList.add(`${NAME}-active`)
      el.classList.add(`${NAME}-hover-active`)
    }

    const attachClickEvents = (el) => {
      if (el.classList.contains(`${NAME}-click-active`)) {
        return
      }

      el.addEventListener('click', (e) => {
        e.preventDefault()

        const el = e.currentTarget
        const parent = el.closest('.dropdown')
        const href = el.getAttribute('href')

        // nav second click
        if (href && el.dataset.firstClick) {
          console.log(`${NAME}: nav second click`)

          e.stopImmediatePropagation()
          if (typeof window.app === 'undefined' || typeof window.app.Router === 'undefined') {
            window.location.href = href
            return
          }

          window.app.Router.openURL(href)
        }


        if (parent) {
          // big screen click
          if (href && window.innerWidth > 768 && parent.classList.contains('active-dropdown')) {
            console.log(`${NAME}: big screen | nav click the dropdown is shown already`)

            e.stopImmediatePropagation()
            if (typeof window.app === 'undefined' || typeof window.app.Router === 'undefined') {
              window.location.href = href
              return
            }

            window.app.Router.openURL(href)
          }

          Toggle(parent)
        }

        el.dataset.firstClick = true
      })

      el.classList.add(`${NAME}-active`)
      el.classList.add(`${NAME}-click-active`)
    }

    // Hide all for outside clicks
    /* document.addEventListener('click', function (event) {
      const isClickInside = clickableEls.contains(event.target)

      if (!isClickInside) {
        HideAll()
      }
    }) */

    document.addEventListener('click', (event) => {
      let breakPath = false
      const path = event.path || (event.composedPath && event.composedPath())

      if (!path) {
        console.warn('Browser does not provide event path to hide dropdowns on outside click')
      }

      path.forEach((el, i) => {
        if (breakPath) {
          return
        }

        if (el === document) {
          HideAll()
        }

        if (el.classList && el.classList.contains('dropdown-toggle')) {
          breakPath = true
        }
      })
    })

    hoverableEls.forEach((el, i) => {
      const parent = el.closest('.dropdown')
      if (parent) {
        attachHoverEvents(parent)
      }
    })

    clickableEls.forEach((el, i) => {
      attachClickEvents(el)
    })
  }

  window.addEventListener(`${Events.LODEDANDREADY}`, init)
  window.addEventListener(`${Events.AJAX}`, init)
})(window)

export default DropdownHoverUI
