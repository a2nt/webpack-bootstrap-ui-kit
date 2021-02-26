// api-less instagram feed

// Visitor network maybe temporary banned by Instagram because of too many requests from external websites
// so it isn't very stable implementation. You should have something for the fall-back.

import Events from '../_events';
import Consts from '../_consts';
import InstagramFeed from '@jsanahuja/instagramfeed/src/InstagramFeed';

export default ((W) => {
  const NAME = '_ui.instagram.feed';
  const D = document;
  const BODY = D.body;

  const ig_media_preview = (base64data) => {
    const jpegtpl =
            '/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsaGikdKUEmJkFCLy8vQkc/Pj4/R0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0cBHSkpNCY0PygoP0c/NT9HR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR//AABEIABQAKgMBIgACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AA==',
      t = atob(base64data),
      p = t.slice(3).split(''),
      o = t
        .substring(0, 3)
        .split('')
        .map((e) => {
          return e.charCodeAt(0);
        }),
      c = atob(jpegtpl).split('');
    c[162] = String.fromCharCode(o[1]);
    c[160] = String.fromCharCode(o[2]);
    return base64data ?
      `data:image/jpeg;base64,${btoa(c.concat(p).join(''))}` :
      null;
  };

  const loadFeed = () => {
    console.log(`${NAME}: loading`);

    D.querySelectorAll(`.jsInstagramFeed`).forEach((el, i) => {
      const ID = `InstagramFeed${i}`;
      const dataset = el.dataset;

      el.classList.add(`${NAME}-loading`);
      el.classList.remove(`${NAME}-loaded`, `${NAME}-error`);

      new InstagramFeed({
        username: dataset['username'],
        tag: dataset['tag'] || null,
        display_profile: dataset['display-profile'],
        display_biography: dataset['display-biography'],
        display_gallery: dataset['display-gallery'],
        display_captions: dataset['display-captions'],
        cache_time: dataset['cache_time'] || 360,
        items: dataset['items'] || 12,
        styling: false,
        lazy_load: true,
        callback: (data) => {
          console.log(`${NAME}: data response received`);

          const list = D.createElement('div');
          list.classList.add(`${NAME}-list`, 'row');
          el.appendChild(list);

          data['edge_owner_to_timeline_media']['edges'].forEach(
            (el, i) => {
              const item = el['node'];
              const preview = ig_media_preview(item['media_preview']);

              list.innerHTML +=
                                `<div class="a col ${NAME}-item"` +
                                ` data-gallery="${NAME}-${ID}" data-href="${item['display_url']}" data-toggle="lightbox" data-force="image">` +
                                `<img id="${NAME}-${ID}-${item['id']}" src="${item['display_url']}" alt="${item['accessibility_caption']}"` +
                                `style="background:url(${preview})" />` +
                                '</div>';
            },
          );

          el.classList.remove(`${NAME}-loading`);
          el.classList.add(`${NAME}-loaded`);

          W.dispatchEvent(new Event('MetaWindow.initLinks'));
          W.dispatchEvent(new Event(`${NAME}.loaded`));
        },
        on_error: (e) => {
          console.error(`${NAME}: ${e}`);

          el.classList.remove(`${NAME}-loading`);
          el.classList.add(`${NAME}-error`);

          W.dispatchEvent(new Event(`${NAME}.error`));
        },
      });
    });
  };

  W.addEventListener(`${Events.LODEDANDREADY}`, loadFeed);
  W.addEventListener(`${Events.AJAX}`, loadFeed);
})(window);
