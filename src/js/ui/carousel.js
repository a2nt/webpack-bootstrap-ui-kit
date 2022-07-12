import Events from '../_events'
import Carousel from 'bootstrap/js/src/carousel'

const CarouselUI = ((window) => {
  const NAME = 'js-carousel'

  const init = () => {
    console.log(`${NAME}: init`)

    document.querySelectorAll(`.${NAME}`).forEach((el, i) => {
      const interval = el.dataset.bsInterval ? parseInt(el.dataset.bsInterval) : false;
      const carousel = new Carousel(el, {
        interval,
      })
      el.ui = carousel
      const items = el.querySelectorAll('.carousel-item')
      const numberOfItems = parseInt(items.length)

      // create next/prev arrows
      if (el.dataset.bsArrows) {
        const next = document.createElement('button')
        next.classList.add('carousel-control-next')
        next.setAttribute('type', 'button')
        next.setAttribute('aria-label', 'Next Slide')
        next.setAttribute('data-bs-target', el.getAttribute('id'))
        next.setAttribute('data-bs-slide', 'next')
        next.addEventListener('click', (e) => {
          carousel.next()
        })
        next.innerHTML =
          '<span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span>'
        el.appendChild(next)

        const prev = document.createElement('button')
        prev.setAttribute('type', 'button')
        prev.setAttribute('aria-label', 'Previous Slide')
        prev.classList.add('carousel-control-prev')
        prev.setAttribute('data-bs-target', el.getAttribute('id'))
        prev.setAttribute('data-bs-slide', 'prev')
        prev.addEventListener('click', (e) => {
          carousel.prev()
        })
        prev.innerHTML =
          '<span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span>'
        el.appendChild(prev)
      }

      if (el.dataset.bsIndicators) {
        const indicators = document.createElement('div')
        indicators.classList.add('carousel-indicators')
        let i = 0
        while (i < numberOfItems) {
          const ind = document.createElement('button')
          ind.setAttribute('type', 'button')
          ind.setAttribute('aria-label', `Slide to #${i + 1}`)
          if (i === 0) {
            ind.classList.add('active')
          }
          ind.setAttribute('data-bs-target', el.getAttribute('id'))
          ind.setAttribute('data-bs-slide-to', i)

          ind.addEventListener('click', (e) => {
            const target = e.target
            carousel.to(target.getAttribute('data-bs-slide-to'))
            indicators.querySelectorAll('.active').forEach((ind2) => {
              ind2.classList.remove('active')
            })
            target.classList.add('active')
          })

          indicators.appendChild(ind)
          i++
        }

        el.appendChild(indicators)
        el.addEventListener('slide.bs.carousel', (e) => {
          el.querySelectorAll('.carousel-indicators .active').forEach(
            (ind2) => {
              ind2.classList.remove('active')
            }
          )
          el.querySelectorAll(
            `.carousel-indicators [data-bs-slide-to="${e.to}"]`
          ).forEach((ind2) => {
            ind2.classList.add('active')
          })
        })
      }

      if (el.classList.contains('carousel-multislide')) {
        const inner = el.querySelector('.carousel-inner')
        const items = el.querySelectorAll('.carousel-item')

        // fix animation glitch
        inner.style.left = '0px'

        const calculate = new window.ResizeObserver((entries) => {
          const entry = entries[0]
          const el = entry.target
          const rect = entry.contentRect
          const width = rect.width
          // const height = rect.height
          const numToDisplay = Math.min(parseInt(el.dataset.length), numberOfItems)
          const itemWidth = width / numToDisplay

          el.dataset.itemWidth = itemWidth
          el.dataset.numToDisplay = numToDisplay

          el.querySelector('.carousel-inner').style.width = `${numberOfItems * itemWidth}px`
          items.forEach((el, i) => {
            el.style.width = `${itemWidth}px`
          })

          if (numberOfItems === numToDisplay) {
            el.classList.add('js-carousel-no-slide')
            carousel.pause()
          }
        })

        calculate.observe(el)

        el.addEventListener('slide.bs.carousel', (e) => {
          // infinite scroll
          const numToDisplay = Math.min(parseInt(el.dataset.length), numberOfItems)
          if(numberOfItems - numToDisplay < e.to) {
            // disable transition
            //inner.style.transition = 'none'

            inner.querySelectorAll('.carousel-item').forEach((el) => {
              el.classList.remove('active')
            })

            inner.querySelector('.carousel-item:first-child').classList.add('active')
            inner.style.left = '0px'
            e.preventDefault();


            // enable transition
            //inner.style.transition = ''
            return;
          }
          //

          switch (e.direction) {
            case 'left':
              inner.style.left = `${-(e.to * el.dataset.itemWidth)}px`
              break
            case 'right':
              inner.style.left = `${-(e.to * el.dataset.itemWidth)}px`
              break
          }
        })

        el.classList.add(`${NAME}-multislide-active`)
      } else {
        if (items.length === 1) {
          el.classList.add('js-carousel-no-slide')
        }
      }

      if(interval){
        el.ui.cycle();
      }

      el.dataset.ui = el.ui
      el.classList.add(`${NAME}-active`)
    })
  }

  window.addEventListener(`${Events.LODEDANDREADY}`, init)
  window.addEventListener(`${Events.AJAX}`, init)
})(window)

export default CarouselUI
