'use strict';

import MarkerClusterer from '@googlemaps/markerclustererplus';

import Events from '../_events';
import MarkerUI from './map.google.marker';

const GoogleMapsDriver = ((window) => {
  class GoogleMapsDriver {
    getName() {
      return 'GoogleMapsDriver';
    }

    init(el, config = []) {
      const ui = this;

      ui.el = el;
      ui.config = config;
      ui.markers = [];

      window[`init${ui.getName()}`] = () => {
        ui.googleApiLoaded();
      };

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${config['key']}&callback=init${ui.getName()}`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    googleApiLoaded() {
      const ui = this;

      const el = ui.el;
      const config = ui.config;
      const mapDiv = el.querySelector('.mapAPI-map');
      const zoom = config['mapZoom'] && config['mapZoom'] !== '0' ? parseInt(config['mapZoom']) : 10;
      const center = config['center'] && config['center'] !== ',' ?
        {
          lat: config['center'][1],
          lng: config['center'][0],
        } :
        {
          lat: 0,
          lng: 0,
        };
      const style = config['style'] ? config['style'] : null;

      console.log(`${ui.getName()}: API is loaded`);
      // init fontawesome icons
      ui.MarkerUI = MarkerUI.init();

      ui.map = new google.maps.Map(mapDiv, {
        zoom,
        center,
        fullscreenControl: true,
        styles: style,
      });

      ui.default_zoom = zoom;

      mapDiv.classList.add('mapboxgl-map');

      ui.popup = new ui.MarkerUI({
        map: ui.map,
        align: ['center', 'top'],
        divClass: 'mapboxgl-popup popup mapboxgl-popup-anchor-bottom d-none',
        html: '<div class="mapboxgl-popup-tip"></div><div class="mapboxgl-popup-content">' +
                    '<div class="mapboxgl-popup-close-button" type="button" aria-label="Close popup">×</div>' +
                    '<div class="html"></div>' +
                    '</div>',
      });
      ui.popup.setMap(ui.map);

      ui.geocoder = new google.maps.Geocoder();

      ui.cluster = new MarkerClusterer(ui.map, null, {
        styles: [{
          width: 30,
          height: 30,
          className: 'mapboxgl-cluster',
        }],
      });

      el.dispatchEvent(new Event(Events.MAPAPILOADED));
    }

    addMarker(crds, config) {
      const ui = this;

      const pos = {
        lat: crds[1],
        lng: crds[0],
      };

      const marker = new ui.MarkerUI({
        position: pos,
        map: ui.map,
        align: ['center', 'top'],
        html: `<div class="mapboxgl-marker"><div id="Marker${config['id']}" data-id="${config['id']}" class="marker">${config['icon']}</div></div>`,
        onClick: () => {
          const el = document.querySelector(`#Marker${config['id']}`);
          ui.showPopup(pos, config['content']);

          el.dispatchEvent(new Event(Events.MAPMARKERCLICK));
        },
      });

      ui.markers.push(marker);

      ui.cluster.addMarker(marker);

      return marker;
    }

    showPopup(pos, content) {
      const ui = this;
      const popup = ui.popup.getDiv();

      if (ui.config['flyToMarker']) {
        ui.map.setCenter(pos); // panTo
        if (!ui.config['noZoom']) {
          ui.map.setZoom(18);
        }
      }

      // keep it hidden to render content
      popup.style.opacity = '0';
      popup.classList.remove('d-none');

      popup.querySelector('.mapboxgl-popup-content .html').innerHTML = content;

      popup.querySelector('.mapboxgl-popup-close-button').addEventListener('click', (e) => {
        e.preventDefault();
        ui.hidePopup();
      });

      // set position when content was rendered
      ui.popup.setPosition(pos, ['center', 'top']);

      // display popup
      popup.style.opacity = '1';
      popup.style['margin-top'] = '-1rem';
    }

    hidePopup() {
      const ui = this;
      const popup = ui.popup.getDiv();

      popup.classList.add('d-none');
      if (!ui.config['noRestoreBounds'] || ui.config['flyToBounds']) {
        ui.restoreBounds();
      }

      ui.el.dispatchEvent(new Event(Events.MAPPOPUPCLOSE));
    }

    geocode(addr, callback) {
      const ui = this;

      ui.geocoder.geocode(
        {
          address: addr,
        },
        (results, status) => {
          if (status === 'OK') {
            //results[0].geometry.location;

            if (typeof callback === 'function') {
              callback(results);
            }

            return results;
          } else {
            console.error(
              `${ui.getName()}: Geocode was not successful for the following reason: ${status}`,
            );
          }
        },
      );
    }

    reverseGeocode(latLng, callback) {
      const ui = this;

      ui.geocoder.geocode(
        {
          location: latlng,
        },
        (results, status) => {
          if (status === 'OK') {
            //results[0].formatted_address;

            if (typeof callback === 'function') {
              callback(results);
            }

            return results;
          } else {
            console.error(
              `${ui.getName()}: Reverse Geocoding was not successful for the following reason: ${status}`,
            );
          }
        },
      );
    }

    addGeoJson(config) {
      const ui = this;
      const geojson = JSON.parse(config['geojson']);
      const firstMarker = geojson.features[0].geometry.coordinates;
      //Map.setCenter(firstMarker);
      const bounds = new google.maps.LatLngBounds();

      // add markers to map
      geojson.features.forEach((marker) => {
        const id = marker.id;
        const crds = marker.geometry.coordinates;
        const content = marker.properties.content;

        ui.addMarker(crds, {
          id,
          content,
          icon: marker.icon,
          flyToMarker: config['flyToMarker'],
        });

        bounds.extend({
          lat: crds[1],
          lng: crds[0],
        });
      });

      if (ui.markers.length > 1) {
        ui.map.fitBounds(bounds, {
          padding: 30,
        }); //panToBounds
      } else if (ui.markers[0]) {
        ui.map.setCenter(ui.markers[0].getPosition());
      }

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

      if (ui.default_bounds && ui.markers.length > 1) {
        ui.map.fitBounds(ui.default_bounds, {
          padding: 30,
        }); //panToBounds
      } else {
        if (ui.markers[0]) {
          ui.map.setCenter(ui.markers[0].getPosition());
        }

        ui.restoreZoom();
      }
    }

    restoreZoom() {
      const ui = this;

      ui.map.setZoom(ui.default_zoom);
    }
  }

  return GoogleMapsDriver;
})(window);

export default GoogleMapsDriver;
