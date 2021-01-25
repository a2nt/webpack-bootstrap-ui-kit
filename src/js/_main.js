'use strict';

import $ from 'jquery';

import Events from './_events';
import Consts from './_consts';

import EventsRouter from './_events.router';
import Spinner from './_components/_ui.spinner';

// AJAX functionality
import AjaxUI from './_components/_ui.ajax';

import FormBasics from './_components/_ui.form.basics';
import HeaderUI from './_components/_ui.header-footer';

import SmoothScroll from 'smooth-scroll';
const smoothScroll = SmoothScroll();

const MainUI = (($) => {
  // Constants
  const W = window;
  const $W = $(W);
  const D = document;
  const $Body = $('body');

  const NAME = 'MainUI';

  console.clear();

  console.info(
    `%cUI Kit ${UINAME} ${UIVERSION}`,
    'color:yellow;font-size:14px',
  );
  console.info(
    `%c${UIMetaNAME} ${UIMetaVersion}`,
    'color:yellow;font-size:12px',
  );
  console.info(
    `%chttps://github.com/a2nt/webpack-bootstrap-ui-kit by ${UIAUTHOR}`,
    'color:yellow;font-size:10px',
  );

  console.groupCollapsed('Events');
  Object.keys(Events).forEach((k) => {
    console.info(`${k}: ${Events[k]}`);
  });
  console.groupEnd('Events');

  console.groupCollapsed('Consts');
  Object.keys(Consts).forEach((k) => {
    console.info(`${k}: ${Consts[k]}`);
  });
  console.groupEnd('Events');

  console.groupCollapsed('Init');
  console.time('init');
  $W.on(`${Events.LODEDANDREADY}`, () => {
    console.groupEnd('Init');
    console.timeEnd('init');

    console.time('Post-init');
    console.groupCollapsed('Post-init');
  });

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
      console.log(`${NAME}: Tab: hidden`);
      $Body.addClass('is-hidden');
      $Body.trigger(Events.TABHIDDEN);
      $W.trigger(Events.TABHIDDEN);
    } else {
      console.log(`${NAME}: Tab: focused`);
      $Body.removeClass('is-hidden');
      $Body.trigger(Events.TABFOCUSED);
      $W.trigger(Events.TABFOCUSED);
    }
  });

  // session ping
  let pingInterval;
  let pingLock = false;
  const sessionPing = () => {
    if (pingLock || $Body.hasClass('is-offline')) {
      return;
    }

    console.log(`${NAME}: session ping`);
    pingLock = true;
    $.ajax({
      sync: false,
      async: true,
      cache: false,
      url: '/Security/ping',
      global: false,
      type: 'POST',
      complete: (data, datastatus) => {
        updateOnlineStatus();
        if (datastatus !== 'success') {
          console.warn(`${NAME}: ping failed`);

          clearInterval(pingInterval);
          pingInterval = null;
        }

        pingLock = false;
      },
    });
  };

  // update online/offline state
  let statusLock = false;
  const updateOnlineStatus = () => {
    if (statusLock) {
      return;
    }
    statusLock = true;

    if (typeof navigator.onLine === 'undefined') {
      return false;
    }

    if (!navigator.onLine) {
      console.log(`${NAME}: Offline`);

      clearInterval(pingInterval);
      pingInterval = null;

      $Body.addClass('is-offline');
      $Body.removeClass('is-online');

      $Body.trigger(Events.OFFLINE);
      $W.trigger(Events.OFFLINE);

      statusLock = false;
      return true;
    }

    if (!pingInterval) {
      pingInterval = setInterval(sessionPing, 300000); // 5 min in ms
    }

    if ($Body.hasClass('is-offline')) {
      sessionPing();

      console.log(`${NAME}: is back online`);
      $Body.trigger(Events.BACKONLINE);
    } else {
      console.log(`${NAME}: Online`);
    }

    $Body.addClass('is-online');
    $Body.removeClass('is-offline');

    $Body.trigger(Events.ONLINE);
    $W.trigger(Events.ONLINE);

    statusLock = false;
    return true;
  };

  W.addEventListener(
    `${Events.OFFLINE}`,
    () => {
      updateOnlineStatus();
    },
    false,
  );

  W.addEventListener(
    `${Events.ONLINE}`,
    () => {
      updateOnlineStatus();
    },
    false,
  );

  $W.on(`${Events.LOADED} ${Events.AJAX}`, () => {
    updateOnlineStatus();
  });

  // scrollTo
  const ScrollTo = (trigger, selector) => {
    smoothScroll.animateScroll(D.querySelector(selector), trigger, {
      speed: 500,
      offset: -20,
      //easing: 'easeInOutCubic',
      // Callback API
      //before: (anchor, toggle) => {}, // Callback to run before scroll
      //`after: (anchor, toggle) => {} // Callback to run after scroll
    });
  };

  W.URLDetails = {
    base: $('base').attr('href'),
    relative: '/',
    hash: '',
  };

  let eventFired = false;
  const setTouchScreen = (bool) => {
    if (W.IsTouchScreen === bool || eventFired) {
      return;
    }

    eventFired = true;

    W.IsTouchScreen = bool;
    $.support.touch = W.IsTouchScreen;

    if (bool) {
      console.log(`${NAME}: Touch screen enabled`);
      $Body.trigger(Events.TOUCHENABLE);
      $W.trigger(Events.TOUCHENABLE);
    } else {
      console.log(`${NAME}: Touch screen disabled`);
      $Body.trigger(Events.TOUCHDISABLED);
      $W.trigger(Events.TOUCHDISABLED);
    }

    // prevent firing touch and mouse events together
    setTimeout(() => {
      eventFired = false;
    }, 200);
  };

  setTouchScreen('ontouchstart' in window || navigator.msMaxTouchPoints > 0);

  // disable touch on mouse events
  /*D.addEventListener('mousemove', () => {
    setTouchScreen(false);
  });

  D.addEventListener('mousedown', () => {
    setTouchScreen(false);
  });*/

  // enable touch screen on touch events
  D.addEventListener('touchmove', () => {
    setTouchScreen(true);
  });
  D.addEventListener('touchstart', () => {
    setTouchScreen(true);
  });

  class MainUI {
    // Static methods

    static init() {
      const ui = this;
      ui.dispose();

      console.log(`${NAME}: init`);

      // update location details
      ui.updateLocation();

      // mark available offline areas
      if ('caches' in W) {
        $('a.offline').addClass('offline-available');
      }

      ui.loadImages();

      // detect bootstrap screen size
      ui.detectBootstrapScreenSize();

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
        console.log(`${NAME}: .js-scrollTo`);

        e.preventDefault();
        const el = e.currentTarget;
        const $el = $(e.currentTarget);

        ScrollTo(el, $el.attr('data-target'));
      });

      // load external fonts
      if ($('[data-extfont]').length) {
        console.log(`${NAME}: loading external fonts [data-extfont]`);
        $.getScript(
          '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js',
          () => {
            const fonts = [];

            $('[data-extfont]').each((i, el) => {
              fonts[i] = $(el).attr('data-extfont');
            });

            W.WebFont.load({
              google: {
                families: fonts,
              },
            });
          },
        );
      }

      // data-set links
      $('[data-set-target]').on('click', (e) => {
        console.log(`${NAME}: [data-set-target]`);

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

      // emulate links
      $('.a[data-href]').on('click', (e) => {
        console.log(`${NAME}: js link processing .a[data-href]`);

        const $el = $(e.currentTarget);
        const href = $el.data('href');
        if (!href.length) {
          console.warn(`${NAME}: .a[data-href] | Missing data-href`);
          console.warn($el);
        }

        W.location.assign(href);
      });

      // set attributes for mobile friendly tables
      $('.typography table').each((i, el) => {
        const $table = $(el);
        let $header = $table.find('thead tr:first-child');
        if (!$header.length) {
          $header = $(el).find('tr:first-child');
        }

        $header.addClass('d-sm-none d-typography-breakpoint-none');

        $header.find('td').each((i, h) => {
          const $h = $(h);
          $table
            .find('tr')
            .find(`td:eq(${i})`)
            .each((i, el) => {
              const $el = $(el);
              if (!$el.attr('data-label')) {
                $el.attr('data-label', $h.text());
              }
            });
        });
      });
      //

      // hide spinner
      Spinner.hide(() => {
        $Body.addClass('loaded');
      });

      // fire page printing
      if (W.URLDetails['hash'].indexOf('printpage') > -1) {
        W.print();
      }

      $Body.data(NAME, ui);
      $W.removeClass('lock-main-init');
    }

    static detectBootstrapScreenSize() {
      const $el = $('<div class="env-test"></div>');
      let envs = [...Consts.ENVS];
      $Body.append($el);

      let curEnv = envs.shift();
      envs = envs.reverse();

      for (let i = 0; i < envs.length; ++i) {
        const env = envs[i];
        $el.addClass(`d-${env}-none`);
        if ($el.is(':hidden')) {
          curEnv = env;
          break;
        }
      }

      $el.remove();
      $Body.removeClass(envs);
      $Body.addClass(curEnv);

      let landscape = true;
      if ($W.width() > $W.height()) {
        $Body.removeClass('portrait');
        $Body.addClass('landscape');
      } else {
        landscape = false;

        $Body.removeClass('landscape');
        $Body.addClass('portrait');
      }

      console.log(
        `${NAME}: screen size detected ${curEnv} | landscape ${landscape}`,
      );

      return curEnv;
    }

    static updateLocation(url) {
      let location = url || W.location.href;
      location = location.replace(W.URLDetails['base'], '/');
      const hash = location.indexOf('#');

      W.URLDetails.relative = location.split('#')[0];
      W.URLDetails.hash =
        hash >= 0 ? location.substr(location.indexOf('#')) : '';
    }

    // show site-wide alert
    static alert(msg, cls) {
      $SiteWideMessage.fadeOut('fast');

      $SiteWideMessage.html(
        `<div class="page-alert"><div class="alert alert-${cls}"><i class="close" data-dismiss="alert">&times;</i>${msg}</div></div>`,
      );
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

      $W.trigger(`${Events.ALLERTAPPEARED}`);
    }

    // hide site-wide alert
    static alertHide() {
      if ($SiteWideMessage.length !== 0) {
        $SiteWideMessage.fadeOut('slow', () => {
          $SiteWideMessage.find('.alert').alert('close');
        });
      }

      if ($AlertNotify.length && typeof $AlertNotify[0].stop !== 'undefined') {
        $AlertNotify[0].stop();
      }

      $W.trigger(`${Events.ALLERTREMOVED}`);
    }

    // load all images
    static loadImages() {
      const $imgs = $Body.find('img').not('.loaded');
      const $imgUrls = [];
      const $imgLazyUrls = [];

      // collect image details
      $imgs.each((i, el) => {
        const $el = $(el);
        const src = $el.attr('src');
        const lazySrc = $el.data('lazy-src');

        if ($el.hasClass('loaded')) {
          return;
        }

        if (src && src.length) {
          $imgUrls.push(src);
        }
        if (lazySrc && lazySrc.length) {
          $imgLazyUrls.push(lazySrc);
          $el.addClass('loading');

          AjaxUI.preload([lazySrc]).then(() => {
            $el.attr('src', lazySrc);

            $el.on(`${Events.LOADED}`, () => {
              $el.addClass('loaded');
              $el.removeClass('loading');

              $el.trigger(`${Events.LAZYIMAGEREADY}`);
            });
          });
        }
      });

      // load lazy backgrounds
      $Body
        .find('[data-lazy-bg]')
        .not('.loaded')
        .each((i, el) => {
          const $el = $(el);
          const lazySrc = $el.data('lazy-bg');

          if ($el.hasClass('loaded')) {
            return;
          }

          if (lazySrc && lazySrc.length) {
            $imgLazyUrls.push(lazySrc);
            $el.addClass('loading');

            AjaxUI.preload([lazySrc]).then(() => {
              $el.css({ 'background-image': `url(${lazySrc})` });

              $el.addClass('loaded');
              $el.removeClass('loading');

              $el.trigger(`${Events.LAZYIMAGEREADY}`);
            });
          }
        });

      // replace img src
      $Body
        .find('[data-src-replace]')
        .not('.loaded')
        .each((i, el) => {
          const $el = $(el);
          const lazySrc = $el.data('src-replace');

          if ($el.hasClass('loaded')) {
            return;
          }

          if (lazySrc && lazySrc.length) {
            $el.addClass('loaded');
            $el.attr('src', lazySrc);
          }
        });

      // load defined images
      AjaxUI.preload($imgUrls).then(() => {
        $W.trigger('images-loaded');

        // load lazy images
        AjaxUI.preload($imgLazyUrls).then(() => {
          console.log(`${NAME}: All images are loaded!`);

          setTimeout(() => {
            $W.trigger(`${Events.LAZYIMAGESREADY}`);

            console.groupEnd('Post-init');
            console.timeEnd('Post-init');
          }, 100);
        });
      });
    }

    static dispose() {
      console.log(`${NAME}: dispose`);
    }
  }

  $W.on(
    `${Events.MAININIT} ${Events.AJAX} ${Events.AJAXMAIN} ${Events.LOADED}`,
    () => {
      if ($W.hasClass('lock-main-init')) {
        console.warn(`${NAME}: locked`);
        return;
      }

      $W.addClass('lock-main-init');
      MainUI.init();
    },
  );

  $W.on(`${Events.RESIZE}`, () => {
    MainUI.detectBootstrapScreenSize();
  });

  $W.on('beforeunload unload', () => {
    Spinner.show(() => {
      $Body.removeClass('loaded');
    });
  });

  // hide spinner on target _blank
  $('[target="_blank"],.external')
    .not('[data-toggle="lightbox"],[data-lightbox-gallery]')
    .on('click submit touch', (e) => {
      console.log(`${NAME}: External link`);

      setTimeout(() => {
        Spinner.hide(() => {
          $Body.addClass('loaded');
        });
      }, 1000);
    });

  W.MainUI = MainUI;

  return MainUI;
})($);

export default MainUI;
