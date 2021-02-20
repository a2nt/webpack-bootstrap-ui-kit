import Events from '../_events';
import Consts from '../_consts';
import Page from './_page.jsx';

import './_main.visibility';
import './_main.touch';
import './_main.online';
import './_main.css-screen-size';
import './_main.links';
import './_main.lazy-images';
import SpinnerUI from './_main.loading-spinner';

const MainUI = ((W) => {
  const NAME = '_main';
  const D = document;
  const BODY = D.body;

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

  console.info(`%cENV: ${process.env.NODE_ENV}`, 'color:green;font-size:10px');
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

  class MainUI {
    // first time the website initialization
    static init() {
      const ui = this;

      // store landing page state
      W.history.replaceState(
        { landing: W.location.href },
        D.title,
        W.location.href,
      );
      //

      ui.loaded();
    }

    // init AJAX components
    static loaded() {
      const ui = this;
      console.log(`${NAME}: loaded`);
    }
  }

  W.addEventListener(`${Events.LOADED}`, () => {
    MainUI.init();

    SpinnerUI.hide();

    console.groupEnd('init');
    console.timeEnd('init');

    W.dispatchEvent(new Event(Events.LODEDANDREADY));
  });

  W.addEventListener(`${Events.AJAX}`, () => {
    MainUI.loaded();
  });

  W.MainUI = MainUI;

  return MainUI;
})(window);

export default MainUI;
