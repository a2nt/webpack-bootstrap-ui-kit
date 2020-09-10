/**
 * Route side-wide events
 */

const EventsUI = (($) => {
  const on = $.fn.on;
  const off = $.fn.off;

  // Constants
  const W = window;
  const $W = $(W);
  const D = document;
  const $Body = $('body');

  const NAME = 'EventsUI';

  class EventsUI {
    static process(el, args) {
      let modEl = el;
      const eventName = args[0];
      const tagName = typeof el !== undefined ? $(el).prop('tagName') : null;

      switch (tagName) {
        case 'HTML':
        case 'BODY':
          modEl = $W;
          break;
      }

      return [modEl, args];
    }
  }

  // rewrite jQuery functions
  $.fn.on = function () {
    const result = EventsUI.process(this, arguments);
    return on.apply(...result);
  };

  $.fn.off = function () {
    const result = EventsUI.process(this, arguments);
    return off.apply(...result);
  };

  const scrollTop = $.fn.scrollTop;
  // rewrite scrollTop
  $.fn.scrollTop = function () {
    let el = this;
    const args = arguments;

    const tagName = typeof el !== undefined ? $(el).prop('tagName') : null;

    switch (tagName) {
      case 'HTML':
      case 'BODY':
        el = $W;
        break;
    }

    return scrollTop.apply(el, args);
  };
})($);

export default EventsUI;
