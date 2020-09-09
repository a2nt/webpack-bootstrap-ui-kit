'use strict';

import Events from '../_events';

const ImagePositionUI = (($) => {
  const D = document;
  const W = window;
  const $Body = $('html,body');
  const NAME = 'ImagePositionUI';
  const CLASSNAME = `js${NAME}`;

  class ImagePositionUI {
    static init() {
      const ui = this;
      ui.dispose();

      if (!$(`.${CLASSNAME}`).length) {
        return;
      }

      console.log(`${NAME}: init`);
      $(`.${CLASSNAME}`).on('click', (e) => {
        e.preventDefault();
        console.log(e);
      });
    }

    static dispose() {
      console.log(`${NAME}: dispose`);
    }
  }

  $(W).on(`${NAME}.init ${Events.AJAX} ${Events.LOADED}`, () => {
    ImagePositionUI.init();
  });

  W.ImagePositionUI = new ImagePositionUI();

  return ImagePositionUI;
})($);

export default ImagePositionUI;
