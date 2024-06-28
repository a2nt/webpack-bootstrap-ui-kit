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

  // limit clicking rate and hover-touch-click events iterfere
  const LockMenu = (menu, timeout = 200) => {
    menu.locked = true

    if (menu.dropdownTimeout) {
      clearTimeout(menu.dropdownTimeout)
    }

    menu.dropdownTimeout = setTimeout(() => {
      menu.locked = false
    }, timeout)
  }

  // debuging
  const LogMsg = (msg) => {
    //console.log(msg)
  }

  const HideAll = () => {
    LogMsg(`${NAME}: HideAll`)
    // hide others
    document.querySelectorAll('.dropdown-menu').forEach((el, i) => {
      if (el.locked) {
        return
      }

      const next = el.closest('.dropdown')
      if (next) {
        next.classList.remove(...ACTIVECLS)
      }

      el.classList.remove('show')
    })
  }

  const Toggle = (el) => {
    const menu = el.querySelector('.dropdown-menu')
    const isOpennedByToogle = menu.classList.contains('show') && menu.dropdownToggle


    if (!menu) {
      return
    }

    if (menu.locked) {
      return
    }

    LockMenu(menu, 800)
    HideSiblings(el)

    if (isOpennedByToogle) {
      LogMsg(`${NAME}: Toggle hide`)

      el.classList.remove(...ACTIVECLS)
      menu.classList.remove('show')
    } else {
      LogMsg(`${NAME}: Toggle show`)

      el.classList.add(...ACTIVECLS)
      menu.classList.add('show')
    }

    menu.dropdownToggle = true
  }

  const HideSiblings = (el) => {
    const parent = el.parentNode
    if (!parent) {
      return
    }

    [...parent.children].forEach((el2) => {
      if (el === el2) {
        return
      }

      const dropdown = el2.querySelector('.dropdown-menu')
      if (dropdown) {
        dropdown.classList.remove('show')
      }
    })
  }

  const Show = (e) => {
    e.stopPropagation()
    const el = e.currentTarget

    const menu = el.querySelector('.dropdown-menu')
    if (!menu) {
      return
    }

    if (menu.locked) {
      return
    }

    menu.dropdownToggle = false
    //LockMenu(menu)
    LogMsg(`${NAME}: Show`)
    HideSiblings(el)

    el.classList.add(...ACTIVECLS)
    menu.classList.add('show')
  }

  const Hide = (e) => {
    e.stopPropagation()
    const el = e.currentTarget
    const menu = el.querySelector('.dropdown-menu')

    if (!menu) {
      return
    }
    if (menu.locked) {
      return
    }

    menu.dropdownToggle = false
    LockMenu(menu)

    LogMsg(`${NAME}: Hide`)

    el.classList.remove(...ACTIVECLS)
    menu.classList.remove('show')
  }

  const init = () => {
    LogMsg(`${NAME}: init`)

    const clickableEls = document.querySelectorAll(`[data-bs-toggle="dropdown"]`)
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

        LogMsg(`${NAME}: click`)

        if (parent) {
          Toggle(parent)
        }
      })

      el.classList.add(`${NAME}-active`)
      el.classList.add(`${NAME}-click-active`)
    }

    // Hide all for outside clicks
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

    hoverableEls.forEach((el) => {
      const parent = el.closest('.dropdown')
      if (parent) {
        attachHoverEvents(parent)
        // for touch screen
        attachClickEvents(parent)
      }
    })

    clickableEls.forEach((el) => {
      const parent = el.closest('.dropdown')
      if (parent) {
        attachClickEvents(parent)
      }
    })
  }

  window.addEventListener(`${Events.LODEDANDREADY}`, init)
  window.addEventListener(`${Events.AJAX}`, init)
})(window)

export default DropdownHoverUI
