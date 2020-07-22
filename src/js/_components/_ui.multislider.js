'use strict';

import $ from 'jquery';
import Events from '../_events';
import MainUI from '../_main';

import 'hammerjs/hammer';
import 'jquery-hammerjs/jquery.hammer';

import '../../scss/_components/_ui.multislider.scss';

const W = window;

const MultiSlider = (($) => {
  // Constants
  const NAME = 'jsMultiSlider';
  const DATA_KEY = NAME;
  const $BODY = $('body');

  class MultiSlider {
    // Constructor
    constructor(el) {
      this.dispose();

      const ui = this;
      const $el = $(el);
      ui.$el = $el;
      ui.sliding = false;

      $el.wrap(`<div class="${NAME}-container"></div>`);
      ui.$elContainer = $el.parent(`.${NAME}-container`);

      $el.wrap(`<div class="${NAME}-slides-container"></div>`);
      ui.$slidesContainer = $el.parent(`.${NAME}-slides-container`);

      ui.addControls();
      ui.calculate();

      $(W).on('resize', () => {
        ui.$elContainer
          .find('.act-slider-prev,.act-slider-next')
          .removeClass('disabled');
        ui.calculate();
      });

      ui.$elContainer.addClass(`${NAME}-active`);
      $el.addClass(`${NAME}-active`);
    }

    calculate() {
      const ui = this;

      ui.$slides = ui.$el.find('.slide');
      ui.numberOfSlides = ui.$slides.length;

      ui.containerWidth = ui.$el.parent().width();
      ui.maxPos = ui.numberOfSlides - ui.numToDisplay();
      ui.slideWidth = ui.containerWidth / ui.numToDisplay();

      ui.$slides.css('width', `${ui.slideWidth}px`);
      ui.$el.css('width', ui.slideWidth * ui.numberOfSlides);

      ui.currPos = 0;
      ui.slide(0);
    }

    numToDisplay() {
      const ui = this;

      const size = MainUI.detectBootstrapScreenSize();

      let num = ui.$el.data(`length-${size}`);
      num = num ? num : ui.$el.data('length');

      return num ? num : 1;
    }

    addControls() {
      const ui = this;

      const $e = ui.$el;
      // actions
      ui.$elContainer.append(
        '<div class="slider-actions">' +
          '<a href="#" class="act act-slider-prev"><i class="fas fa-chevron-left"></i><b class="sr-only">Prev</b></a>' +
          '<a href="#" class="act act-slider-next"><i class="fas fa-chevron-right"></i><b class="sr-only">Next</b></a>' +
          '</div>',
      );

      ui.$prevBtn = ui.$elContainer.find('.act-slider-prev');
      ui.$nextBtn = ui.$elContainer.find('.act-slider-next');

      ui.$prevBtn.on('click', (e) => {
        e.preventDefault();

        if ($(e.currentTarget).hasClass('disabled')) {
          return false;
        }

        ui.prev();
      });

      ui.$nextBtn.on('click', (e) => {
        e.preventDefault();

        if ($(e.currentTarget).hasClass('disabled')) {
          return false;
        }

        ui.next();
      });

      // init touch swipes
      $e.hammer().bind('swipeleft panleft', (e) => {
        ui.next();
      });

      $e.hammer().bind('swiperight panright', (e) => {
        ui.prev();
      });
    }

    next() {
      const ui = this;
      if (ui.sliding) {
        return;
      }

      ui.currPos++;
      ui.slide(ui.currPos);
    }

    prev() {
      const ui = this;
      if (ui.sliding) {
        return;
      }
      ui.currPos--;
      ui.slide(ui.currPos);
    }

    slide(pos) {
      const ui = this;
      if (ui.sliding) {
        return;
      }

      ui.sliding = true;
      if (ui.$nextBtn.length) {
        if (pos >= ui.maxPos) {
          ui.$nextBtn.addClass('disabled');
        } else {
          ui.$nextBtn.removeClass('disabled');
        }
      }

      if (ui.$prevBtn.length) {
        if (pos <= 0) {
          ui.$prevBtn.addClass('disabled');
        } else {
          ui.$prevBtn.removeClass('disabled');
        }
      }

      ui.$el.animate(
        {
          left: `${-(pos * ui.slideWidth)}px`,
        },
        'slow',
        'swing',
        () => {
          ui.sliding = false;
        },
      );
    }

    dispose() {
      const ui = this;

      if (ui.$elContainer) {
        ui.$el.parent().find('.slider-actions').remove();
      }

      if (ui.$el) {
        ui.$el.hammer().unbind('swipeleft panleft swiperight panright');
      }

      console.log(`Disposing: ${NAME}`);

      ui.$el = null;
    }

    static _jQueryInterface() {
      return this.each(() => {
        // attach functionality to el
        const $el = $(this);
        let data = $el.data(DATA_KEY);

        if (!data) {
          data = new MultiSlider(this);
          $el.data(DATA_KEY, data);
        }
      });
    }
  }

  // jQuery interface
  $.fn[NAME] = MultiSlider._jQueryInterface;
  $.fn[NAME].Constructor = MultiSlider;
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return MultiSlider._jQueryInterface;
  };

  // auto-apply
  $(W).on(Events.LODEDANDREADY, () => {
    console.log(`Initializing: ${NAME}`);

    $(`.${NAME}`).jsMultiSlider();
  });

  return MultiSlider;
})($);

export default MultiSlider;
