'use strict'

import $ from 'jquery'

const CookieUI = (($) => {
  const D = document
  const W = window

  class CookieUI {
    static get (name) {
      return D.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=')
        return parts[0] === name ? decodeURIComponent(parts[1]) : r
      }, '')
    }

    static set (name, value, days = 7, path = '/') {
      const expires = new Date(Date.now() + days * 864e5).toUTCString()
      D.cookie = `${name}=${encodeURIComponent(
        value
      )}; expires=${expires}; path=${path}`
    }
  }

  // W.CookieUI = new CookieUI();

  return CookieUI
})($)

export default CookieUI
