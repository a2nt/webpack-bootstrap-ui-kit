'use strict';

import StickySidebar from 'sticky-sidebar/src/sticky-sidebar';
import Events from '../_events';

const SidebarUI = (($) => {
  const D = document;
  const W = window;
  const $Body = $('html,body');
  const NAME = 'SidebarUI';
  const CLASSNAME = `js${NAME}`;

  class SidebarUI {
    static init() {
      const ui = this;
      ui.dispose();

      if (!$(`.${CLASSNAME}`).length) {
        return;
      }

      console.log(`Initializing: ${NAME}`);

      const sticky = new StickySidebar(`.${CLASSNAME}`, {
        innerWrapperSelector: `.${CLASSNAME}__inner`,
      });

      $Body.on(`${Events.SCROLL} ${Events.RESIZE}`, (e) => {
        sticky.updateSticky(e);
      });
    }

    static dispose() {
      console.log(`Destroying: ${NAME}`);
    }
  }

  $(W).on(`${Events.AJAX} ${Events.LOADED}`, () => {
    SidebarUI.init();
  });

  W.SidebarUI = new SidebarUI();

  return SidebarUI;
})($);

export default SidebarUI;
