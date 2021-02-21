// browser tab visibility state detection

import Events from '../_events';
import Consts from '../_consts';
import Page from './_page.jsx';

import { getParents } from './_main.funcs';
import { Collapse } from 'bootstrap';
import SpinnerUI from './_main.loading-spinner';

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

      SpinnerUI.show();

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

        if (!ui.GraphPage) {
          console.log(
            `${NAME}: [popstate] GraphPage is missing. Have to render it first`,
          );

          ui.GraphPage = ReactDOM.render(
            <Page />,
            document.getElementById('MainContent'),
          );
        }

        ui.GraphPage.setState(state);
        SpinnerUI.hide();
      } else if (e.state && e.state.landing) {
        console.log(`${NAME}: [popstate] go to landing`);
        W.location.href = e.state.landing;
      } else {
        console.warn(`${NAME}: [popstate] state is missing`);
        console.log(e);
        SpinnerUI.hide();
      }
    }

    // link specific event {this} = current event, not MainUILinks
    static loadClick(e) {
      console.groupCollapsed(`${NAME}: load on click`);
      const ui = MainUILinks;
      ui.reset();

      e.preventDefault();

      const el = e.currentTarget;

      // hide parent mobile nav
      const navs = getParents(el, '.collapse');
      if (navs.length) {
        navs.forEach((nav) => {
          const collapseInst = Collapse.getInstance(nav);
          if (collapseInst) {
            collapseInst.hide();
          }
        });
      }

      // hide parent dropdown
      /*const dropdowns = getParents(el, '.dropdown-menu');
      if (dropdowns.length) {
        const DropdownInst = Dropdown.getInstance(dropdowns[0]);
        DropdownInst.hide();
      }*/

      if (!ui.GraphPage) {
        ui.GraphPage = ReactDOM.render(
          <Page />,
          document.getElementById('MainContent'),
        );
      }

      const link = el.getAttribute('href') || el.getAttribute('data-href');

      ui.GraphPage.state.current = el;

      el.classList.add('loading');

      SpinnerUI.show();
      BODY.classList.add('ajax-loading');

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

          BODY.classList.remove('ajax-loading');
          SpinnerUI.hide();
          console.groupEnd(`${NAME}: load on click`);
        })
        .catch((e) => {
          console.log(e);

          el.classList.remove('loading');
          el.classList.add(`response-${e.status}`);
          /*switch (e.status) {
            case 404:
              el.classList.add('not-found');
              break;
            case 523:
              el.classList.add('unreachable');
              break;
          }*/

          BODY.classList.remove('ajax-loading');
          SpinnerUI.hide();
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