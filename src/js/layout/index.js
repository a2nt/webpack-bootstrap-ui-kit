import Events from '../_events'

const LayoutUI = ((window) => {
  const NAME = '_layout'

  const initFonts = () => {
    console.log(`${NAME}: initFonts`)

    const css = document.createElement('link')
    css.rel = 'stylesheet'
    css.type = 'text/css'
    css.media = 'all'
    css.href =
      'https://fonts.googleapis.com/css?family=Roboto:ital,wght@0,400;0,700;1,400&display=swap'
    document.getElementsByTagName('head')[0].appendChild(css)
  }

  const initAnalytics = () => {
    console.log(`${NAME}: initAnalytics`)
    /* google analytics */
    /* (function(i, s, o, g, r, a, m) {
                  i['GoogleAnalyticsObject'] = r;
                  (i[r] =
                    i[r] ||
                    function() {
                      (i[r].q = i[r].q || []).push(arguments);
                    }),
                    (i[r].l = 1 * new Date());
                  (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
                  a.async = 1;
                  a.src = g;
                  m.parentNode.insertBefore(a, m);
                })(
                  window,
                  document,
                  'script',
                  '//www.google-analytics.com/analytics.js',
                  'ga',
                );
                ga('create', 'UA-********-*', 'auto');
                ga('send', 'pageview'); */
  }

  // set attributes for mobile friendly tables
  const initMobileTables = () => {
    document.querySelectorAll('.typography table').forEach((el) => {
      const header = el.querySelector('thead tr:first-child')
      if (!header) {
        return
      }
      header.classList.add('d-typography-breakpoint-none')

      header.querySelectorAll('td').forEach((h) => {
        el.querySelectorAll(`td:eq(${i})`)
          .forEach((el) => {
            if (!el.dataset.label) {
              el.dataset.label = h.innerText
            }
          });
      });
    });
  }

  window.addEventListener(`${Events.LOADED}`, () => {
    initFonts()
    initAnalytics()
    initMobileTables()
  })
})(window)
export default LayoutUI
