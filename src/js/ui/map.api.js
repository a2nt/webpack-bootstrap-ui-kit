'use strict';

import Events from '../_events';
import Consts from 'js/_consts';

const MapAPI = ((window) => {
    // Constants
    const NAME = 'js-mapapi';
    const MAP_DRIVER = Consts['MAP_DRIVER'];

    class MapAPI {
        // Constructor
        constructor(el) {
            const ui = this;
            const Drv = new MAP_DRIVER();
            const BODY = document.querySelector('body');
            const config = el.dataset;
            config['center'] = [
                config['lng'] ? config['lng'] : BODY.dataset['default-lng'],
                config['lat'] ? config['lat'] : BODY.dataset['default-lat'],
            ];

            /*config['style'] = config['style'] ?
                                  jQuery.parseJSON(config['style']) :
                                  null;

                              config['font-family'] = $BODY.css('font-family');*/

            if (!config['icon']) {
                config['icon'] = '<i class="fas fa-map-marker-alt"></i>';
            }

            console.log(`${NAME}: init ${Drv.getName()}...`);
            ui.drv = Drv;
            ui.el = el;
            ui.config = config;

            Drv.init(el, config);

            el.addEventListener(Events.MAPAPILOADED, () => {
                ui.addMarkers()
            });
        }

        // Public methods
        getMap() {
            return ui.map;
        }

        dispose() {
            const ui = this;

            ui.el = null;
            ui.el.classList.remove(`${NAME}-active`);
        }

        addMarkers() {
            console.log(`${NAME}: addMarkers`);
            const ui = this;
            const el = ui.el;
            const Drv = ui.drv;
            const config = ui.config;

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
                    ui.map.setCenter({
                        lat,
                        lng,
                    });
                });
            } else if (config['lat'] && config['lng']) {
                const lat = config['lat'];
                const lng = config['lng'];

                console.log(
                    `${NAME}: setting up single lat/lng marker lat: ${lat} lng: ${lng}`,
                );

                Drv.addMarker([lng, lat], config);
            }

            el.classList.add(`${NAME}-active`);

            el.dispatchEvent(new Event(Events.MAPLOADED));
            console.log(`${NAME}: Map is loaded`);
        }
    }

    const init = () => {
        console.log(`${NAME}: init`);
        document.querySelectorAll(`.${NAME}`).forEach((el, i) => {
            const map = new MapAPI(el);
        });
    }

    // auto-apply
    window.addEventListener(`${Events.LODEDANDREADY}`, init);
    window.addEventListener(`${Events.AJAX}`, init);

    return MapAPI;
})(window);

export default MapAPI;
