import Events from '../_events';
import Carousel from 'bootstrap/js/src/carousel';

const CarouselUI = ((window) => {
  const NAME = 'js-carousel';

  const init = () => {
    console.log(`${NAME}: init`);
    document.querySelectorAll(`.${NAME}`).forEach((el, i) => {
      const bs = new Carousel(el);
      el.classList.add(`${NAME}-active`);
    });
  };

  window.addEventListener(`${Events.LODEDANDREADY}`, init);
  window.addEventListener(`${Events.AJAX}`, init);
})(window);
export default CarouselUI;
