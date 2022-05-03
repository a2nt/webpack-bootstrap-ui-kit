'use strict'

// import $ from 'jquery';
import mapBoxGL from 'mapbox-gl'

import Events from '../../_events'

const MapBoxDriver = (($) => {
  class MapBoxDriver {
    getName () {
      return 'MapBoxDriver'
    }

    init ($el, config = []) {
      const ui = this

      mapBoxGL.accessToken = config.key

      ui.map = new mapBoxGL.Map({
        container: $el.find('.mapAPI-map')[0],
        center: config.center ? config.center : [0, 0],
        // hash: true,
        style: config.style
          ? config.style
          : 'mapbox://styles/mapbox/streets-v9',
        localIdeographFontFamily: config['font-family'],
        zoom: config.mapZoom ? config.mapZoom : 10,
        attributionControl: false,
        antialias: true,
        accessToken: config.key,
      })
        .addControl(
          new mapBoxGL.AttributionControl({
            compact: true,
          })
        )
        .addControl(new mapBoxGL.NavigationControl(), 'top-right')
        .addControl(
          new mapBoxGL.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
          }),
          'bottom-right'
        )
        .addControl(
          new mapBoxGL.ScaleControl({
            maxWidth: 80,
            unit: 'metric',
          }),
          'top-left'
        )
        .addControl(new mapBoxGL.FullscreenControl())

      ui.map.on('load', (e) => {
        $el.trigger(Events.MAPAPILOADED)
      })

      ui.popup = new mapBoxGL.Popup({
        closeOnClick: false,
        className: 'popup',
      })
    }

    addMarker (crds, config) {
      const ui = this

      // create a DOM el for the marker
      const $el = $(
        `<div id="Marker${config.id}" data-id="${config.id}" class="marker">${config.icon}</div>`
      )

      $el.on('click', (e) => {
        ui.popup.setLngLat(crds).setHTML(config.content).addTo(ui.map)

        if (config.flyToMarker) {
          ui.map.flyTo({
            center: crds,
            zoom: 17,
          })
        }

        $(e.currentTarget).trigger(Events.MAPMARKERCLICK)
      })

      // add marker to map
      const marker = new mapBoxGL.Marker($el[0]).setLngLat(crds).addTo(ui.map)

      return marker
    }

    addGeoJson (config) {
      const ui = this
      // Insert the layer beneath any symbol layer.
      /* if (config['3d']) {
              const layers = Map.getStyle().layers;
              let labelLayerId;
              for (let i = 0; i < layers.length; i++) {
                if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
                  labelLayerId = layers[i].id;
                  break;
                }
              }

              Map.addLayer({
                'id': '3d-buildings',
                'source': 'composite',
                'source-layer': 'building',
                'filter': ['==', 'extrude', 'true'],
                'type': 'fill-extrusion',flyToBounds
                'minzoom': 15,
                'paint': {
                  'fill-extrusion-color': '#aaa',

                  // use an 'interpolate' expression to add a smooth transition effect to the
                  // buildings as the user zooms in
                  'fill-extrusion-height': [
                    "interpolate", ["linear"],
                    ["zoom"],
                    15, 0,
                    15.05, ["get", "height"],
                  ],
                  'fill-extrusion-base': [
                    "interpolate", ["linear"],
                    ["zoom"],
                    15, 0,
                    15.05, ["get", "min_height"],
                  ],
                  'fill-extrusion-opacity': .6,
                },
              }, labelLayerId);
            } */

      const firstMarker = config.geojson.features[0].geometry.coordinates
      // Map.setCenter(firstMarker);
      const bounds = new mapBoxGL.LngLatBounds(firstMarker, firstMarker)

      // add markers to map
      config.geojson.features.forEach((marker) => {
        const id = marker.id
        const crds = marker.geometry.coordinates
        const content = marker.properties.content

        ui.addMarker(crds, {
          id,
          content,
          icon: marker.icon,
          flyToMarker: config.flyToMarker,
        })

        bounds.extend(crds)
      })

      ui.map.fitBounds(bounds, {
        padding: 30,
      })

      ui.popup.on('close', (e) => {
        if (config.flyToBounds) {
          ui.map.fitBounds(bounds, {
            padding: 30,
          })
        }

        $(e.currentTarget).trigger(Events.MAPPOPUPCLOSE)
      })
    }

    getMap () {
      const ui = this
      return ui.map
    }

    getPopup () {
      const ui = this
      return ui.popup
    }
  }

  return MapBoxDriver
})($)

export default MapBoxDriver
