// browser tab visibility state detection

import Events from '../_events';
import Consts from '../_consts';
import Page from './_page.jsx';

const MainUILinks = ((W) => {
  const NAME = '_main.links';
  const D = document;
  const BODY = D.body;

  class MainUILinks {
    static init() {
      const ui = this;
      ui.GraphPage = null;

      console.log(`${NAME}: init`);

      ui.loaded();

      // history state switch
      W.addEventListener('popstate', (e) => {
        ui.popState(e);
      });
    }

    static loaded() {
      const ui = this;

      D.querySelectorAll('.graphql-page').forEach((el, i) => {
        const el_id = el.getAttribute('href');
        el.setAttribute(`data-${ui.name}-id`, el_id);

        el.addEventListener('click', ui.loadClick);
      });
    }

    static reset() {
      // reset focus
      D.activeElement.blur();

      // remove active and loading classes
      D.querySelectorAll('.graphql-page,.nav-item').forEach((el2) => {
        el2.classList.remove('active');
        el2.classList.remove('loading');
      });
    }

    static popState(e) {
      const ui = this;

      if (!ui.GraphPage) {
        console.log(
          `${NAME}: [popstate] GraphPage is missing. Have to render it first`,
        );

        ui.GraphPage = ReactDOM.render(
          <Page />,
          document.getElementById('MainContent'),
        );
      }

      if (e.state && e.state.page) {
        console.log(`${NAME}: [popstate] load`);
        const state = JSON.parse(e.state.page);

        state.current = null;
        state.popstate = true;

        ui.reset();
        D.querySelectorAll(`[data-${ui.name}-id="${e.state.link}"]`).forEach(
          (el) => {
            el.classList.add('active');
          },
        );

        ui.GraphPage.setState(state);
      } else if (e.state && e.state.landing) {
        console.log(`${NAME}: [popstate] go to landing`);
        W.location.href = e.state.landing;
      } else {
        console.warn(`${NAME}: [popstate] state is missing`);
        console.log(e);
      }
    }

    // link specific event {this} = current link, not MainUILinks
    static loadClick(e) {
      console.groupCollapsed(`${NAME}: load on click`);
      const ui = MainUILinks;
      ui.reset();

      e.preventDefault();

      if (!ui.GraphPage) {
        ui.GraphPage = ReactDOM.render(
          <Page />,
          document.getElementById('MainContent'),
        );
      }

      const el = e.currentTarget;
      const link = el.getAttribute('href') || el.getAttribute('data-href');

      ui.GraphPage.state.current = el;

      el.classList.add('loading');
      ui.GraphPage.load(link)
        .then((response) => {
          el.classList.remove('loading');
          el.classList.add('active');

          if (ui.GraphPage.state.Link) {
            window.history.pushState(
              {
                page: JSON.stringify(ui.GraphPage.state),
                link: el.getAttribute(`data-${ui.name}-id`),
              },
              ui.GraphPage.state.Title,
              ui.GraphPage.state.Link,
            );
          }

          console.groupEnd(`${NAME}: load on click`);
        })
        .catch((e) => {
          console.log(e);

          el.classList.remove('loading');
          el.classList.add('not-found');

          console.groupEnd(`${NAME}: load on click`);
        });
    }
  }

  W.addEventListener(`${Events.LOADED}`, () => {
    MainUILinks.init();
  });

  W.addEventListener(`${Events.AJAX}`, () => {
    MainUILinks.loaded();
  });
})(window);

export default MainUILinks;
