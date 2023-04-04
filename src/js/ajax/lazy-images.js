// browser tab visibility state detection

import Events from '../_events'
import ImageObject from './models/image'

export default ((W) => {
  const NAME = 'main.lazy-images'
  const D = document

  const loadLazyImages = () => {
    console.log(`${NAME}: Load lazy images`)
    const base = document.querySelector('base')
    const baseURL = base ? base.getAttribute('href') : '/'


    D.querySelectorAll('[data-lazy-src]').forEach((el) => {
      el.classList.remove('empty')

      const img = new ImageObject()
      let imgURL = el.getAttribute('data-lazy-src')
      if (!imgURL.startsWith('http://') && !imgURL.startsWith('https://')) {
        imgURL = baseURL + el.getAttribute('data-lazy-src')
      }

      // remove double slash
      imgURL = imgURL.replace(/([^:]\/)\/+/g, "$1")

      img.load(imgURL, el)
        .then((result) => {
          el.setAttribute('src', result)
        })
        .catch(() => {
          el.classList.add('empty')
        })
    })

    D.querySelectorAll('[data-lazy-bg]').forEach((el) => {
      el.classList.remove('empty')
      const img = new ImageObject()

      img.load(el.getAttribute('data-lazy-bg'), el)
        .then((result) => {
          el.style.backgroundImage = `url(${result})`
        })
        .catch((e) => {
          el.classList.add('empty')
        })
    })
  }

  W.addEventListener(`${Events.LODEDANDREADY}`, loadLazyImages)
  W.addEventListener(`${Events.AJAX}`, loadLazyImages)
})(window)
