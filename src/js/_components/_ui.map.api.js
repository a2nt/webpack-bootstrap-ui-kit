'use strict';

import $ from 'jquery';
import Events from '../_events';

import '../../scss/_components/_ui.map.scss';

import CONSTS from 'js/_consts';

const MapAPI = (($) => {
  // Constants
  const NAME = 'jsMapAPI';
  const DATA_KEY = NAME;
  const $BODY = $('body');

  const MAP_DRIVER = CONSTS['MAP_DRIVER'];
  const W = window;

  class MapAPI {
    // Constructor
    constructor(el) {
      const ui = this;
      const Drv = new MAP_DRIVER();

      ui.$el = $(el);

      const $el = ui.$el;
      const config = $el.data();

      config['center'] = [
        config['lng'] ? config['lng'] : $BODY.data('default-lng'),
        config['lat'] ? config['lat'] : $BODY.data('default-lat'),
      ];

      config['style'] = config['style']
        ? jQuery.parseJSON(config['style'])
        : null;

      config['font-family'] = $BODY.css('font-family');

      if (!config['icon']) {
        config['icon'] = '<i class="fas fa-map-marker-alt"></i>';
      }

      console.log(`${NAME}: init ${Drv.getName()}...`);
      Drv.init($el, config);
      ui.drv = Drv;

      $el.on(Events.MAPAPILOADED, (e) => {
        ui.map = Drv.getMap();

        if (config['geojson']) {
          console.log(`${NAME}: setting up geocode data`);
          Drv.addGeoJson(config);
        } else if (config['address']) {
          console.log(config['address']);
          console.log(`${NAME}: setting up address marker`);
          Drv.geocode(config['address'], (results) => {
            console.log(results);

            const lat = results[0].geometry.location.lat();
            const lng = results[0].geometry.location.lng();

            console.log(
              `${NAME}: setting up single lat/lng marker lat: ${lat} lng: ${lng}`,
            );

            Drv.addMarker([lng, lat], config);
            ui.map.setCenter({ lat, lng });
          });
        } else if (config['lat'] && config['lng']) {
          const lat = config['lat'];
          const lng = config['lng'];

          console.log(
            `${NAME}: setting up single lat/lng marker lat: ${lat} lng: ${lng}`,
          );

          Drv.addMarker([lng, lat], config);
        }

        $el.data(DATA_KEY, ui);
        $el.addClass(`${NAME}-active`);

        $el.trigger(Events.MAPLOADED);
        console.log(`${NAME}: Map is loaded`);
      });
    }

    // Public methods
    getMap() {
      return ui.map;
    }

    dispose() {
      const ui = this;

      ui.$el = null;
      $.removeData(ui.$el[0], DATA_KEY);

      ui.$el.removeClass(`${NAME}-active`);
    }

    static _jQueryInterface() {
      if (typeof W.localStorage !== 'undefined') {
        return this.each(function () {
          // attach functionality to el
          const $el = $(this);
          let data = $el.data(DATA_KEY);

          if (!data) {
            data = new MapAPI(this);
            $el.data(DATA_KEY, data);
          }
        });
      }
    }
  }

  // jQuery interface
  $.fn[NAME] = MapAPI._jQueryInterface;
  $.fn[NAME].Constructor = MapAPI;
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return MapAPI._jQueryInterface;
  };

  // auto-apply
  $(W).on(`${Events.AJAX} ${Events.LOADED}`, () => {
    $('.mapAPI-map-container').jsMapAPI();
  });

  return MapAPI;
})($);

export default MapAPI;
