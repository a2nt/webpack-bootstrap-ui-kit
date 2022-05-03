'use strict'

import $ from 'jquery'

import Events from '../_events'
import 'jquery.instagramFeed/jquery.instagramFeed'

const InstagramFeed = (($) => {
  // Constants
  const NAME = 'jsInstagramFeed'
  const DATA_KEY = NAME
  const W = window
  const D = document

  class InstagramFeed {
    constructor (el) {
      const ui = this
      const $el = $(el)

      ui._el = el
      ui.dispose()

      console.log(`${NAME}: init`)
      $el.data(DATA_KEY, this)

      const ID = $el.data('username') + $el.data('tag')

      $.instagramFeed({
        username: $el.data('username'),
        tag: $el.data('tag') || null,
        display_profile: $el.data('display-profile'),
        display_biography: $el.data('display-biography'),
        display_gallery: $el.data('display-gallery'),
        display_captions: $el.data('display-captions'),
        cache_time: 120,
        callback: (data) => {
          console.log(`${NAME}: data response received`)

          $el.append(`<div class="${NAME}-list row"></div>`)
          const $list = $el.find(`.${NAME}-list`)

          data.edge_owner_to_timeline_media.edges.forEach((el, i) => {
            const item = el.node
            const preview = ui.ig_media_preview(item.media_preview)

            $list.append(
              `<div class="a col ${NAME}-item"` +
                ` data-lightbox-gallery="${NAME}-${ID}" data-href="${item.display_url}" data-force="image">` +
                `<img id="${NAME}-${ID}-${item.id}" src="${item.display_url}" alt="${item.accessibility_caption}"` +
                `style="background:url(${preview})" />` +
                '</div>'
            )
          })

          $(W).trigger('MetaLightboxUI.init')
        },
        styling: false,
        items: $el.data('items'),
        lazy_load: true,
        on_error: (e) => {
          console.error(`${NAME}: ${e}`)
        },
      })

      $el.addClass(`${NAME}-active`)
    }

    ig_media_preview (base64data) {
      const jpegtpl =
          '/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsaGikdKUEmJkFCLy8vQkc/Pj4/R0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0cBHSkpNCY0PygoP0c/NT9HR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR//AABEIABQAKgMBIgACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AA=='
      const t = atob(base64data)
      const p = t.slice(3).split('')
      const o = t
        .substring(0, 3)
        .split('')
        .map((e) => {
          return e.charCodeAt(0)
        })
      const c = atob(jpegtpl).split('')
      c[162] = String.fromCharCode(o[1])
      c[160] = String.fromCharCode(o[2])
      return base64data
        ? `data:image/jpeg;base64,${btoa(c.concat(p).join(''))}`
        : null
    }

    // Public methods
    dispose () {
      console.log(`${NAME}: dispose`)
      const ui = this

      const $el = $(ui._el)
      $.removeData(ui._el, DATA_KEY)
      ui._el = null
      $el.removeClass(`${NAME}-active`)
    }
  }

  const init = () => {
    $(`.${NAME}`).each((i, el) => {
      new InstagramFeed(el)
    })
  }

  // auto-apply
  $(W).on(`${NAME}.init ${Events.AJAX} ${Events.LOADED}`, () => {
    init()
  })

  return InstagramFeed
})($)

export default InstagramFeed
