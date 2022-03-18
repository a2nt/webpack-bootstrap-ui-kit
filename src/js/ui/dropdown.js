import Events from '../_events';

/*
 * Bootstrap compatible dropdowns without popover library
 *
 * [data-bs-toggle="hover"] - shows/hides dropdown on mouseover/mouseout
 * [data-bs-toggle="dropdown"], .js-dropdown - shows/hides dropdown on click
 *
 */
const DropdownHoverUI = ((window) => {
  const NAME = 'js-dropdown';

  const HideAll = () => {
    // hide others
    document.querySelectorAll('.dropdown-menu').forEach((el, i) => {
      el.classList.remove('show');
    });
  };

  const Toggle = (el) => {
    HideAll();

    el.querySelector('.dropdown-menu').classList.toggle('show');
  };

  const Show = (e) => {
    const el = e.currentTarget;
    el.querySelector('.dropdown-menu').classList.add('show');
  };

  const Hide = (e) => {
    const el = e.currentTarget;
    el.querySelector('.dropdown-menu').classList.remove('show');
  };

  const init = () => {
    console.log(`${NAME}: init`);

    const clickableEls = document.querySelectorAll(`.${NAME},[data-bs-toggle="dropdown"]`);
    const hoverableEls = document.querySelectorAll(`[data-bs-toggle="hover"]`);

    const attachHoverEvents = (el) => {
      el.addEventListener('mouseover', Show, false);
      el.addEventListener('mouseout', Hide, false);

      el.classList.add(`${NAME}-active`);
    };

    const attachClickEvents = (el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();

        const el = e.currentTarget;
        const parent = el.closest('.dropdown');
        Toggle(parent);
      });

      el.classList.add(`${NAME}-active`);
    };

    // Hide all for outside clicks
    /*document.addEventListener('click', function (event) {
      const isClickInside = clickableEls.contains(event.target);

      if (!isClickInside) {
        HideAll();
      }
    });*/

    document.addEventListener('click', (event) => {
      let breakPath = false;
      const path = event.path || (event.composedPath && event.composedPath());

      if (!path) {
        console.warn('Browser does not provide event path to hide dropdowns on outside click');
      }

      path.forEach((el, i) => {
        if (breakPath) {
          return;
        }

        if (el === document) {
          HideAll();
        }

        if (el.classList && el.classList.contains('dropdown-toggle')) {
          breakPath = true;
          return;
        }
      });
    });

    hoverableEls.forEach((el, i) => {
      const parent = el.closest('.dropdown');
      attachHoverEvents(parent);
    });

    clickableEls.forEach((el, i) => {
      attachClickEvents(el);
    });
  };

  window.addEventListener(`${Events.LODEDANDREADY}`, init);
  window.addEventListener(`${Events.AJAX}`, init);
})(window);

export default DropdownHoverUI;
