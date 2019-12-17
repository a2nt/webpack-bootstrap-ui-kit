"use strict";

import $ from 'jquery';

import Events from './_events';
import Consts from './_consts';

import Spinner from './_components/_ui.spinner';

// AJAX functionality
import AjaxUI from './_components/_ui.ajax';

import FormBasics from './_components/_ui.form.basics';

import SmoothScroll from 'smooth-scroll';
const smoothScroll = SmoothScroll();


const MainUI = (($) => {
  // Constants
  const W = window;
  const D = document;
  const $Body = $('body');

  const NAME = 'MainUI';

  // get browser locale
  //const Locale = $('html').attr('lang').substring(0, 2);

  const $AlertNotify = $('#AlertNotify');
  const $SiteWideMessage = $('#SiteWideMessage');

  // get browser window visibility preferences
  // Opera 12.10, Firefox >=18, Chrome >=31, IE11
  const HiddenName = 'hidden';
  const VisibilityChangeEvent = 'visibilitychange';

  // update visibility state
  D.addEventListener(VisibilityChangeEvent, () => {
    if (D.visibilityState === HiddenName) {
      console.log('Tab: hidden');
      $Body.addClass('is-hidden');
      $Body.trigger('tabHidden');
    } else {
      console.log('Tab: focused');
      $Body.removeClass('is-hidden');
      $Body.trigger('tabFocused');
    }
  });


  // update online/offline state
  const updateOnlineStatus = () => {
    if (!navigator.onLine) {
      console.log('Tab: offline');
      $Body.addClass('is-offline');
      $Body.trigger('offline');
    } else {
      console.log('Tab: online');
      $Body.removeClass('is-offline');
      $Body.trigger('online');
    }
  };

  if (typeof navigator.onLine !== 'undefined') {
    W.addEventListener('offline', () => {
      updateOnlineStatus();
    }, false);

    W.addEventListener('online', () => {
      updateOnlineStatus();
    }, false);

    W.addEventListener('load', () => {
      updateOnlineStatus();
    });
  }

  // scrollTo
  const ScrollTo = (trigger, selector) => {
    smoothScroll.animateScroll(
      D.querySelector(selector),
      trigger, {
        speed: 500,
        offset: -20,
        //easing: 'easeInOutCubic',
        // Callback API
        //before: (anchor, toggle) => {}, // Callback to run before scroll
        //`after: (anchor, toggle) => {} // Callback to run after scroll
      }
    );
  };

  // session ping
  const pingInterval = setInterval(() => {
    if ($Body.hasClass('is-offline')) {
      return;
    }

    $.ajax({
      sync: false,
      async: true,
      cache: false,
      url: '/Security/ping',
      global: false,
      type: 'POST',
      complete(data, datastatus) {
        if (datastatus !== 'success') {
          clearInterval(pingInterval);
          //W.location.reload(false);
        }
      },
    });
  }, 300000); // 5 min in ms

  W.URLDetails = {
    'base': $('base').attr('href'),
    'relative': '/',
    'hash': '',
  };

  class MainUI {
    // Static methods

    static init() {
      this.dispose();

      console.log(`Initializing: ${NAME}`);

      // update location details
      this.updateLocation();

      // mark available offline areas
      if ('caches' in W) {
        $('a.offline').addClass('offline-available');
      }

      this.loadImages();

      // detect bootstrap screen size
      this.detectBootstrapScreenSize();

      // mark external links
      $('a.external,a[rel="external"]').attr('target', '_blank');

      // show encoded emails
      /*$(D).find('.obm').each(() => {
              if ($(this).attr('data-val') !== undefined) {
                const email = $(this).attr('data-val').split('')
                  .reverse()
                  .join('')
                  .slice(0, -8)
                  .replace(/[a-zA-Z]/g, (c) => String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26))
                  .replace('#AT#', '@');
                const attr = $(this).attr('data-val-append');
                if (attr !== undefined && attr !== false) {
                  $(this).append(email);
                }
                if ($(this).find('.sr-only').length > 0) {
                  $(this).find('.sr-only').append(email);
                }
                if ($(this).attr('href') !== undefined) {
                  $(this).attr('href', `mailto:${email}`);
                }
              }
            });*/
      //

      // scroll links
      $('.js-scrollTo').on('click', (e) => {
        e.preventDefault();
        const el = e.currentTarget;
        const $el = $(e.currentTarget);

        ScrollTo(el, $el.attr('data-target'));
      });

      // load external fonts
      if ($('[data-extfont]').length) {
        $.getScript('//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js', () => {
          const fonts = [];

          $('[data-extfont]').each((i, el) => {
            fonts[i] = $(el).attr('data-extfont');
          });

          W.WebFont.load({
            google: {
              families: fonts,
            },
          });
        });
      }

      // data-set links
      $('[data-set-target]').on('click', (e) => {
        const $el = $(e.currentTarget);
        const $target = $($el.data('set-target'));

        if (!$target.length) {
          return;
        }

        $target.each((i, targetEl) => {
          const $targetEl = $(targetEl);
          const tag = $targetEl.prop('tagName').toLowerCase();

          if (tag === 'input' || tag === 'select') {
            $targetEl.val($el.data('set-val'));
          } else if (!$targetEl.hasClass('field')) {
            $targetEl.text($el.data('set-val'));
          }
        });

        $el.trigger(Events.SET_TARGET_UPDATE);
        $target.closest('form').trigger(Events.SET_TARGET_UPDATE);
      });

      // hide spinner
      Spinner.hide(() => {
        $Body.addClass('loaded');
      });

      // fire page printing
      if (W.URLDetails['hash'].indexOf('printpage') > -1) {
        W.print();
      }

      $Body.data(NAME, this);
    }

    static detectBootstrapScreenSize() {
      const $el = $('<div class="env-test"></div>');
      const envs = [...Consts.ENVS];

      $Body.append($el);
      let curEnv = envs.shift();

      for (const env of envs.reverse()) {
        $el.addClass(`d-${env}-none`);
        if ($el.is(':hidden')) {
          curEnv = env;
          break;
        }
      }

      $el.remove();
      $Body.removeClass(envs);
      $Body.addClass(curEnv);

      return curEnv;
    }

    static updateLocation(url) {
      let location = url || W.location.href;
      location = location.replace(W.URLDetails['base'], '/');
      const hash = location.indexOf('#');

      W.URLDetails.relative = location.split('#')[0];
      W.URLDetails.hash = (hash >= 0) ? location.substr(location.indexOf('#')) : '';
    }

    // show site-wide alert
    static alert(msg, cls) {
      $SiteWideMessage.fadeOut('fast');

      $SiteWideMessage.html(`<div class="page-alert"><div class="alert alert-${cls}"><i class="close" data-dismiss="alert">&times;</i>${msg}</div></div>`);
      $SiteWideMessage.find('.page-alert').alert();

      $SiteWideMessage.find('.close[data-dismiss="alert"]').click(() => {
        $SiteWideMessage.fadeOut('slow', () => {
          $SiteWideMessage.find('.page-alert').alert('close');
        });
      });

      $SiteWideMessage.fadeIn('slow');

      if ($AlertNotify.length) {
        $AlertNotify[0].play();
      }

      $(W).trigger('alert-appeared');
    }

    // hide site-wide alert
    static alertHide() {
      if ($SiteWideMessage.length !== 0) {
        $SiteWideMessage.fadeOut('slow', () => {
          $SiteWideMessage.find('.alert').alert('close');
        });
      }

      if (
        $AlertNotify.length &&
        typeof $AlertNotify[0].stop !== 'undefined'
      ) {
        $AlertNotify[0].stop();
      }

      $(W).trigger('alert-removed');
    }

    // load all images
    static loadImages() {
      const $imgs = $Body.find('img');
      const $imgUrls = [];
      const $imgLazyUrls = [];

      // collect image details
      $imgs.each((i, el) => {
        const $el = $(el);
        const src = $el.attr('src');
        const lazySrc = $el.data('lazy-src');

        if (src && src.length) {
          $imgUrls.push(src);
        }
        if (lazySrc && lazySrc.length) {
          $imgLazyUrls.push(lazySrc);
          $el.addClass('loading');

          AjaxUI.preload([lazySrc]).then(() => {
            $el.attr('src', lazySrc);

            $el.addClass('loaded');
            $el.removeClass('loading');

            $el.trigger('image-lazy-loaded');
          });
        }
      });

      // load defined images
      AjaxUI.preload($imgUrls).then(() => {
        $(W).trigger('images-loaded');

        // load lazy images
        AjaxUI.preload($imgLazyUrls).then(() => {
          console.log('All images are loaded!');

          $(W).trigger('images-lazy-loaded');
        });
      });
    }

    static dispose() {
      console.log(`Destroying: ${NAME}`);
    }
  }

  $(W).on(`${Events.AJAX} ${Events.LOADED}`, () => {
    MainUI.init();
  });

  $(W).on('resize', () => {
    MainUI.detectBootstrapScreenSize();
  });

  $(W).on('beforeunload unload', () => {
    Spinner.show(() => {
      $Body.removeClass('loaded');
    });
  });

  W.MainUI = MainUI;

  return MainUI;
})($);

export default MainUI;
