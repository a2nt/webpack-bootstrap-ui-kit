/*
 * Conflicts with 'bootstrap/js/dist/dropdown'
 */
'use strict';

import $ from 'jquery';
import Events from '../_events';
import 'jquery-hoverintent/jquery.hoverIntent.js';
import MainUI from '../_main';

const HoverUI = (($) => {
  // Constants
  const W = window;
  const D = document;
  const $Html = $('html');
  const $Body = $('body');

  const NAME = 'jsHoverUI';
  const DATA_KEY = NAME;

  class HoverUI {
    // Constructor
    constructor(el) {
      console.log(`${NAME}: init`);

      const ui = this;
      const $el = $(el);

      if (
        $el.is(
          '[target="_blank"],.external,[data-toggle="lightbox"],[data-lightbox-gallery]',
        )
      ) {
        return true;
      }

      ui.$el = $el;

      // find parent
      let $parent = $el.parents('.nav-item, .dropdown');
      $parent = $parent && $parent.length ? $parent.first() : null;
      //$parent = $parent ? $parent : $el.parent();
      ui.$parent = $parent;

      // find target
      let $target = $el.data('target');
      $target = $target && $target.length ? $target : null;
      $target = $target
        ? $target
        : $parent
          ? $parent.find('.dropdown-menu').first()
          : null;

      if (!$target || !$target.length) {
        console.warn(`${NAME}: Missing target for:`);
        console.warn($el);
        return;
      }

      ui.$target = $target;

      const $triger = $parent ? $parent : $el;
      ui.$triger = $triger;

      // integrate with dropdown-toggle
      $('[data-toggle="dropdown"]').on('click touch', (e) => {
        console.log(`${NAME}: dropdown click-touch`);
        ui.hide();
      });

      if (!W.isTouch) {
        $triger.hoverIntent({
          sensitivity: 10,
          interval: 50,
          over: () => {
            ui.show();
          },
          out: () => {
            ui.hide();
          },
        });
      }

      $el.off('click touch');
      $el.on('click touch', (e) => {
        const size = MainUI.detectBootstrapScreenSize();
        console.log(`${NAME}: click-touch size: ${size}`);

        if (
          size === 'xs' ||
          !$el.data('allow-click') ||
          (W.IsTouchScreen && !$el.data('allow-touch-click'))
        ) {
          console.log(`${NAME}: click-touch prevent click`);
          e.stopPropagation();
          e.preventDefault();
        }

        if (ui.isShown()) {
          ui.hide();
        } else {
          ui.show();
        }
      });

      $el.data(NAME, ui);
      $triger.addClass(`${NAME}-active`);
    }

    isShown() {
      return this.$target.hasClass('show');
    }

    show() {
      const ui = this;
      ui.$el
        .parents('.dropdown')
        .not('.active')
        .each((i, el) => {
          const $el = $(el);
          $el.find('.dropdown').removeClass('show');
          $el.addClass('show');
        });

      ui.$target.addClass('show');
    }

    hide() {
      const ui = this;
      const $el = ui.$target;
      $el.removeClass('show');
      $el.find('.dropdown-menu').removeClass('show');
      $el.parent('.dropdown').removeClass('show');
    }

    dispose() {
      const ui = this;
      const $el = ui.$el;

      console.log(`${NAME}: dispose`);

      ui.$triger.removeClass(`${NAME}-active`);
      $.removeData($el, DATA_KEY);

      ui.$el = null;
      ui.$parent = null;
      ui.$target = null;
      ui.$triger = null;
    }

    static _jQueryInterface() {
      return this.each(function () {
        // attach functionality to el
        const $el = $(this);
        let data = $el.data(DATA_KEY);

        if (!data) {
          data = new HoverUI(this);
          $el.data(DATA_KEY, data);
        }
      });
    }
  }

  // jQuery interface
  $.fn[NAME] = HoverUI._jQueryInterface;
  $.fn[NAME].Constructor = HoverUI;
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return HoverUI._jQueryInterface;
  };

  // auto-apply
  $('[data-toggle="hover"]').ready(() => {
    $('[data-toggle="hover"]').jsHoverUI();
  });

  // rewrite 'bootstrap/js/dist/dropdown'
  $('[data-toggle="dropdown"]').on('click touch', (e) => {
    e.preventDefault();

    const $el = $(e.currentTarget);
    const $parent = $el.parent('.dropdown');

    // hide siblings
    $parent.parent().find('.dropdown, .dropdown-menu').removeClass('show');

    if ($parent.hasClass('show')) {
      $parent.removeClass('show');
      $parent.find('.dropdown-menu').removeClass('show');
    } else {
      $parent.addClass('show');
      $parent.find('.dropdown-menu').addClass('show');
    }
  });

  return HoverUI;
})($);

export default HoverUI;
