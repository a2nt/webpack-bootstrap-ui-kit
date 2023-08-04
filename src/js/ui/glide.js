import '@glidejs/glide/src/assets/sass/glide.core.scss'
import "../../scss/ui/glide.theme.scss";

import Glide from '@glidejs/glide'
import Events from '@a2nt/ss-bootstrap-ui-webpack-boilerplate-react/src/js/_events'

window.addEventListener(`${Events.LODEDANDREADY}`, () => {
  console.log(`Glide init`);

  document.querySelectorAll('.glide').forEach((el) => {
    const cfg = el.dataset;

    if(cfg.perView === 1 && cfg.bsIndicators) {
      const bullets = document.createElement('div');
      bullets.classList.add('glide__bullets');
      bullets.dataset.glideEl = "controls[nav]";

      let num = el.querySelectorAll('.glide__slide').length;
      num--;
      while (num >= 0) {
        const btn = document.createElement('button');
        btn.classList.add('glide__bullet');
        btn.dataset.glideDir = i;
        bullets.append(btn);
        num--;
      }
      el.append(bullets);
    }

    if(cfg.bsArrows){
      const btns = document.createElement('div');
      btns.classList.add('glide__arrows');
      btns.dataset.glideEl = "controls";

      const prev = document.createElement('button');
      prev.classList.add('glide__arrow', 'glide__arrow--left');
      prev.dataset.glideDir = '<';
      prev.innerText = 'prev';
      btns.append(prev);

      const next = document.createElement('button');
      next.classList.add('glide__arrow', 'glide__arrow--right');
      next.dataset.glideDir = '>';
      next.innerText = 'next';
      btns.append(next);

      el.append(btns);
    }

    new Glide(el,{
      startAt: 0,
      type: 'carousel',
      perView: cfg.perView,
      autoplay: cfg.bsInterval,
    }).mount();
  });
});
