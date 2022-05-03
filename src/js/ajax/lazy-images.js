// browser tab visibility state detection

import Events from '../_events'
import ImageObject from './models/image'

export default ((W) => {
  const NAME = 'main.lazy-images'
  const D = document

  const loadLazyImages = () => {
    console.log(`${NAME}: Load lazy images`)

    D.querySelectorAll('[data-lazy-src]').forEach((el) => {
      el.classList.remove('empty')

      const img = new ImageObject()

      img.load(el.getAttribute('data-lazy-src'), el)
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
