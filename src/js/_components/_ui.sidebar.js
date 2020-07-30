'use strict';

//import StickySidebar from 'sticky-sidebar/src/sticky-sidebar';
import Events from '../_events';

const SidebarUI = (($) => {
  const D = document;
  const W = window;
  const $Body = $('body');
  const NAME = 'SidebarUI';
  const CLASSNAME = `js${NAME}`;
  const CONTENTHOLDER = 'content-holder';
  const INNERWRAPPER = `${CLASSNAME}__inner`;

  class SidebarUI {
    static init() {
      const ui = this;
      ui.dispose();

      if (!$(`.${CLASSNAME}`).length) {
        return;
      }

      console.log(`Initializing: ${NAME}`);
      //const fontSize = parseInt($Body.css('font-size'));
      const fontSize = 0;
      const contentElement = $(`.${CONTENTHOLDER}`)[0];
      console.log(contentElement);

      //$(`.${CLASSNAME}`).wrapInner(`<div class="${INNERWRAPPER}"></div>`);
      const $el = $(`.${CLASSNAME}`);
      const $innerWrapper = $(`.${INNERWRAPPER}`);

      /*const sticky = new StickySidebar(`.${CLASSNAME}`, {
        topSpacing: fontSize,
        bottomSpacing: fontSize,
        containerSelector: CONTENTHOLDER,
        innerWrapperSelector: INNERWRAPPER,
      });*/

      $el.addClass(`${CLASSNAME}-active`);

      $Body.on(`${Events.SCROLL} ${Events.RESIZE}`, (e) => {
        const contentOffset = parseInt(contentElement.offsetTop) + fontSize;
        const contentOffsetHeight = parseInt(contentElement.offsetHeight) - fontSize;
        const sidebarWidth = $el[0].offsetWidth;


        const scrollPos = parseInt($Body.scrollTop());

        // normal pos
        if(contentOffset >= scrollPos){
          $innerWrapper.attr('style', '');
        }else if(scrollPos >= (contentOffset + contentOffsetHeight - $innerWrapper[0].offsetHeight)){
          // bottom pos
            $innerWrapper.attr('style', `position:absolute;bottom:${fontSize}px`);
        }else {
           // scrolled pos
          $innerWrapper.attr('style', `position:fixed;top:${fontSize}px;width:${sidebarWidth}px`);
        }

      });
    }

    static dispose() {
      console.log(`Destroying: ${NAME}`);
    }
  }

  $(W).on(`${Events.LODEDANDREADY}`, () => {
    SidebarUI.init();
  });

  W.SidebarUI = new SidebarUI();

  return SidebarUI;
})($);

export default SidebarUI;
