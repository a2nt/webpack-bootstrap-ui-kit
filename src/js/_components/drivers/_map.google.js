'use strict';

import $ from 'jquery';
import Events from '../../_events';
import MarkerUI from './_map.google.marker';

const GoogleMapsDriver = (($) => {
  class GoogleMapsDriver {

    getName() {
      return 'GoogleMapsDriver';
    }

    init($el, config = []) {
      const ui = this;
      const W = window;

      ui.$el = $el;
      ui.config = config;

      W[`init${ui.getName()}`] = () => {
        ui.googleApiLoaded();
      };

      $('body').append(`<script async defer src="https://maps.googleapis.com/maps/api/js?key=${config['key']}&callback=init${ui.getName()}"></script>`);
    }

    googleApiLoaded() {
      const ui = this;
      const $el = ui.$el;
      const config = ui.config;
      const $mapDiv = $el.find('.mapAPI-map');

      const zoom = (config['mapZoom'] ? config['mapZoom'] : 10);
      const center = (config['center'] ? {
        lat: config['center'][1],
        lng: config['center'][0],
      } : {
        lat: 0,
        lng: 0,
      });
      const style = (config['style'] ? config['style'] : null);

      console.log(`${ui.getName()}: API is loaded`);
      // init fontawesome icons
      ui.MarkerUI = MarkerUI.init($);

      ui.map = new google.maps.Map($mapDiv[0], {
        zoom,
        center,
        'fullscreenControl': true,
        'styles': style,
      });

      ui.default_zoom = zoom;

      $mapDiv.addClass('mapboxgl-map');


      ui.popup = new ui.MarkerUI({
        'map': ui.map,
        'align': ['center', 'top'],
        'divClass': 'mapboxgl-popup popup mapboxgl-popup-anchor-bottom d-none',
        'html': '<div class="mapboxgl-popup-tip"></div><div class="mapboxgl-popup-content">' +
          '<div class="mapboxgl-popup-close-button" type="button" aria-label="Close popup">×</div>' +
          '<div class="html"></div>' +
          '</div>',
      });



      $el.trigger(Events.MAPLOADED);
    }

    addMarker(crds, config) {
      const ui = this;
      const pos = {
        lat: crds[1],
        lng: crds[0],
      };


      const marker = new ui.MarkerUI({
        'position': pos,
        'map': ui.map,
        'html': `<div class="mapboxgl-marker"><div id="Marker${ config['id'] }" data-id="${ config['id'] }" class="marker">${ config['icon'] }</div></div>`,
        'onClick': () => {
          const $el = $(`#Marker${ config['id'] }`);
          ui.showPopup(pos, config['content']);

          $el.trigger(Events.MAPMARKERCLICK);
        },
      });


      return marker;
    }

    showPopup(pos, content) {
      const ui = this;
      const $popup = $(ui.popup.getDiv());

      if (ui.config['flyToMarker']) {
        ui.map.setCenter(pos); // panTo
        ui.map.setZoom(18);
      }

      $popup.css({
        'opacity': '0',
      });
      $popup.removeClass('d-none');

      ui.popup.setPosition(pos, ['center', 'top']);
      $popup.find('.mapboxgl-popup-content .html').html(content);

      $popup.find('.mapboxgl-popup-close-button').on('click', (e) => {
        e.preventDefault();
        ui.hidePopup();
      });

      $popup.css({
        'margin-left': '1rem',
        'opacity': '1',
      });
    }

    hidePopup() {
      const ui = this;
      const $popup = $(ui.popup.getDiv());

      $popup.addClass('d-none');
      ui.restoreBounds();

      ui.$el.trigger(Events.MAPPOPUPCLOSE);
    }

    addGeoJson(config) {
      const ui = this;

      const firstMarker = config['geojson'].features[0].geometry.coordinates;
      //Map.setCenter(firstMarker);
      const bounds = new google.maps.LatLngBounds();

      // add markers to map
      config['geojson'].features.forEach((marker) => {
        const id = marker.id;
        const crds = marker.geometry.coordinates;
        const content = marker.properties.content;

        ui.addMarker(crds, {
          id,
          content,
          'icon': marker.icon,
          'flyToMarker': config['flyToMarker'],
        });

        bounds.extend({
          lat: crds[1],
          lng: crds[0],
        });
      });

      ui.map.fitBounds(bounds, {
        padding: 30,
      }); //panToBounds

      ui.default_bounds = bounds;
      ui.default_zoom = ui.map.getZoom();
    }

    getMap() {
      const ui = this;
      return ui.map;
    }

    getPopup() {
      const ui = this;
      return ui.popup;
    }

    restoreBounds() {
      const ui = this;

      ui.map.fitBounds(ui.default_bounds, {
        padding: 30,
      }); //panToBounds
    }

    restoreZoom() {
      const ui = this;

      ui.map.setZoom(ui.default_zoom);
    }
  }

  return GoogleMapsDriver;
})($);

export default GoogleMapsDriver;
