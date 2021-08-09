// browser tab visibility state detection

import Events from '../_events';
import Consts from '../_consts';

export default ((W) => {
  const NAME = '_main.visibility';
  const D = document;
  const BODY = D.body;

  // update visibility state
  // get browser window visibility preferences
  // Opera 12.10, Firefox >=18, Chrome >=31, IE11
  const HiddenName = 'hidden';
  const VisibilityChangeEvent = 'visibilitychange';

  D.addEventListener(VisibilityChangeEvent, () => {
    if (D.visibilityState === HiddenName) {
      console.log(`${NAME}: Tab: hidden`);

      BODY.classList.add('is-hidden');
      BODY.classList.remove('is-focused');

      W.dispatchEvent(new Event(Events.TABHIDDEN));
    } else {
      console.log(`${NAME}: Tab: focused`);

      BODY.classList.add('is-focused');
      BODY.classList.remove('is-hidden');

      W.dispatchEvent(new Event(Events.TABFOCUSED));
    }
  });
})(window);
