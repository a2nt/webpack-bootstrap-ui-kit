!function(e){var t={};function o(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,o),i.l=!0,i.exports}o.m=e,o.c=t,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)o.d(n,i,function(t){return e[t]}.bind(null,i));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="/srv/dist/repositories/webpack-bootstrap-ui-kit/dist",o(o.s="./src/js/types/Site.Controllers.MapElementController.js")}({"./src/js/_components/_ui.map.api.js":function(e,t,o){"use strict";var n=o("jquery"),i=o.n(n),a=o("./src/js/_events.js"),r=o.n(a),s=(o("./src/scss/_components/_ui.map.scss"),o("./src/js/_consts.js")),l=function(){function e(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,o,n){return o&&e(t.prototype,o),n&&e(t,n),t}}();!function(e){var t="jsMapAPI",o=t,n=e("body"),i=s.a.MAP_DRIVER,a=window,c=function(){function s(a){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,s);var l=this,c=new i;l.$el=e(a);var u=l.$el,f=u.data();f.center=[f.lng?f.lng:n.data("default-lng"),f.lat?f.lat:n.data("default-lat")],f["font-family"]=n.css("font-family"),console.log(t+": initializing "+c.getName()+"..."),c.init(u,f),l.drv=c,u.on(r.a.MAPAPILOADED,(function(e){l.map=c.getMap(),f.geojson?(console.log(t+": setting up geocode data"),c.addGeoJson(f)):f.address?(console.log(f.address),console.log(t+": setting up address marker"),c.geocode(f.address,(function(e){console.log(e)}))):f.lat&&f.lng&&(console.log(t+": setting up single lat/lng marker"),f.icon||(f.icon='<i class="fas fa-map-marker-alt"></i>'),c.addMarker([f.lng,f.lat],f)),console.log(t+": Map is loaded")})),u.data(o,l),u.addClass(t+"-active"),u.trigger(r.a.MAPLOADED)}return l(s,[{key:"getMap",value:function(){return ui.map}},{key:"dispose",value:function(){this.$el=null,e.removeData(this.$el[0],o),this.$el.removeClass(t+"-active")}}],[{key:"_jQueryInterface",value:function(){if(void 0!==a.localStorage)return this.each((function(){var t=e(this),n=t.data(o);n||(n=new s(this),t.data(o,n))}))}}]),s}();e.fn[t]=c._jQueryInterface,e.fn[t].Constructor=c,e.fn[t].noConflict=function(){return e.fn[t]=JQUERY_NO_CONFLICT,c._jQueryInterface},e(a).on(r.a.AJAX+" "+r.a.LOADED,(function(){e(".mapAPI-map-container").jsMapAPI()}))}(i.a)},"./src/js/_consts.js":function(e,t,o){"use strict";var n=o("jquery"),i=o.n(n),a=o("./src/js/_events.js"),r=o.n(a),s=function(){function e(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,o,n){return o&&e(t.prototype,o),n&&e(t,n),t}}();var l={init:function(){return function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var o=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this)),n=o;return n.setMap(e.map),n.position=e.position,n.html=e.html?e.html:'<div class="mapboxgl-marker"><i class="marker-icon fas fa-map-marker-alt"></i></div>',n.divClass=e.divClass,n.align=e.align,n.isDebugMode=e.debug,n.onClick=e.onClick,n.onMouseOver=e.onMouseOver,n.isBoolean=function(e){return"boolean"==typeof e},n.isNotUndefined=function(e){return void 0!==e},n.hasContent=function(e){return e.length>0},n.isString=function(e){return"string"==typeof e},n.isFunction=function(e){return"function"==typeof e},o}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,google.maps.OverlayView),s(t,[{key:"onAdd",value:function(){var e=this;e.div=document.createElement("div"),e.div.style.position="absolute",e.isNotUndefined(e.divClass)&&e.hasContent(e.divClass)&&(e.div.className=e.divClass),e.isNotUndefined(e.html)&&e.hasContent(e.html)&&e.isString(e.html)&&(e.div.innerHTML=e.html),e.isBoolean(e.isDebugMode)&&e.isDebugMode&&(e.div.className="debug-mode",e.div.innerHTML='<div style="height: 10px; width: 10px; background: red; border-radius: 100%;"></div><div style="position: absolute; top: 5px; padding: 5px; width: 130px; text-align: center; font-size: 18px; text-transform: uppercase; font-weight: bolder; background: red; color: white; font-family: Arial;">Debug mode</div>',e.div.setAttribute("style","position: absolute;border: 5px dashed red;height: 150px;width: 150px;display: flex;justify-content: center;align-items: center;")),e.getPanes().overlayMouseTarget.appendChild(e.div),google.maps.event.addDomListener(e.div,"click",(function(t){google.maps.event.trigger(e,"click"),e.isFunction(e.onClick)&&e.onClick(),t.stopPropagation()})),google.maps.event.addDomListener(e.div,"mouseover",(function(t){google.maps.event.trigger(e,"mouseover"),e.isFunction(e.onMouseOver)&&e.onMouseOver(),t.stopPropagation()}))}},{key:"draw",value:function(){var e=this,t=e.getProjection().fromLatLngToDivPixel(new google.maps.LatLng(e.position)),o={y:void 0,x:void 0};switch(Array.isArray(e.align)?e.align.join(" "):""){case"left top":o.y=e.div.offsetHeight,o.x=e.div.offsetWidth;break;case"left center":o.y=e.div.offsetHeight/2,o.x=e.div.offsetWidth;break;case"left bottom":o.y=0,o.x=e.div.offsetWidth;break;case"center top":o.y=e.div.offsetHeight,o.x=e.div.offsetWidth/2;break;case"center center":o.y=e.div.offsetHeight/2,o.x=e.div.offsetWidth/2;break;case"center bottom":o.y=0,o.x=e.div.offsetWidth/2;break;case"right top":o.y=e.div.offsetHeight,o.x=0;break;case"right center":o.y=e.div.offsetHeight/2,o.x=0;break;case"right bottom":o.y=0,o.x=0;break;default:o.y=e.div.offsetHeight/2,o.x=e.div.offsetWidth/2}e.div.style.top=t.y-o.y+"px",e.div.style.left=t.x-o.x+"px"}},{key:"getPosition",value:function(){return this.position}},{key:"getDiv",value:function(){return this.div}},{key:"setPosition",value:function(e,t){this.position=e,this.align=t,this.draw()}}]),t}()}},c=function(){function e(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,o,n){return o&&e(t.prototype,o),n&&e(t,n),t}}();var u,f={ENVS:["xs","sm","md","lg","xl","xxl","xxxl"],MAP_DRIVER:(u=i.a,function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}return c(e,[{key:"getName",value:function(){return"GoogleMapsDriver"}},{key:"init",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],o=this,n=window;o.$el=e,o.config=t,o.markers=[],n["init"+o.getName()]=function(){o.googleApiLoaded()},u("body").append('<script async defer src="https://maps.googleapis.com/maps/api/js?key='+t.key+"&callback=init"+o.getName()+'"><\/script>')}},{key:"googleApiLoaded",value:function(){var e=this,t=e.$el,o=e.config,n=t.find(".mapAPI-map"),i=o.mapZoom?o.mapZoom:10,a=o.center?{lat:o.center[1],lng:o.center[0]}:{lat:0,lng:0},s=o.style?o.style:null;console.log(e.getName()+": API is loaded"),e.MarkerUI=l.init(u),e.map=new google.maps.Map(n[0],{zoom:i,center:a,fullscreenControl:!0,styles:s}),e.default_zoom=i,n.addClass("mapboxgl-map"),e.popup=new e.MarkerUI({map:e.map,align:["center","top"],divClass:"mapboxgl-popup popup mapboxgl-popup-anchor-bottom d-none",html:'<div class="mapboxgl-popup-tip"></div><div class="mapboxgl-popup-content"><div class="mapboxgl-popup-close-button" type="button" aria-label="Close popup">×</div><div class="html"></div></div>'}),e.geocoder=new google.maps.Geocoder,t.trigger(r.a.MAPAPILOADED)}},{key:"addMarker",value:function(e,t){var o=this,n={lat:e[1],lng:e[0]},i=new o.MarkerUI({position:n,map:o.map,html:'<div class="mapboxgl-marker"><div id="Marker'+t.id+'" data-id="'+t.id+'" class="marker">'+t.icon+"</div></div>",onClick:function(){var e=u("#Marker"+t.id);o.showPopup(n,t.content),e.trigger(r.a.MAPMARKERCLICK)}});return o.markers.push(i),i}},{key:"showPopup",value:function(e,t){var o=this,n=u(o.popup.getDiv());o.config.flyToMarker&&(o.map.setCenter(e),o.map.setZoom(18)),n.css({opacity:"0"}),n.removeClass("d-none"),o.popup.setPosition(e,["center","top"]),n.find(".mapboxgl-popup-content .html").html(t),n.find(".mapboxgl-popup-close-button").on("click",(function(e){e.preventDefault(),o.hidePopup()})),n.css({"margin-left":"1rem",opacity:"1"})}},{key:"hidePopup",value:function(){u(this.popup.getDiv()).addClass("d-none"),this.restoreBounds(),this.$el.trigger(r.a.MAPPOPUPCLOSE)}},{key:"geocode",value:function(e,t){var o=this;o.geocoder.geocode({address:e},(function(e,n){if("OK"===n)return"function"==typeof t&&t(e),e;console.error(o.getName()+": Geocode was not successful for the following reason: "+n)}))}},{key:"reverseGeocode",value:function(e,t){var o=this;o.geocoder.geocode({location:latlng},(function(e,n){if("OK"===n)return"function"==typeof t&&t(e),e;console.error(o.getName()+": Reverse Geocoding was not successful for the following reason: "+n)}))}},{key:"addGeoJson",value:function(e){var t=this,o=(e.geojson.features[0].geometry.coordinates,new google.maps.LatLngBounds);e.geojson.features.forEach((function(n){var i=n.id,a=n.geometry.coordinates,r=n.properties.content;t.addMarker(a,{id:i,content:r,icon:n.icon,flyToMarker:e.flyToMarker}),o.extend({lat:a[1],lng:a[0]})})),t.map.fitBounds(o,{padding:30}),t.default_bounds=o,t.default_zoom=t.map.getZoom()}},{key:"getMap",value:function(){return this.map}},{key:"getPopup",value:function(){return this.popup}},{key:"restoreBounds",value:function(){var e=this;e.default_bounds?e.map.fitBounds(e.default_bounds,{padding:30}):(e.markers[0]&&e.map.setCenter(e.markers[0].getPosition()),e.restoreZoom())}},{key:"restoreZoom",value:function(){this.map.setZoom(this.default_zoom)}}]),e}())};t.a=f},"./src/js/_events.js":function(e,t){e.exports={AJAX:"ajax-load",LOADED:"load",MAPLOADED:"map-loaded",MAPAPILOADED:"map-api-loaded",MAPMARKERCLICK:"map-marker-click",MAPPOPUPCLOSE:"map-popup-close",SCROLL:"scroll",RESIZE:"resize",SET_TARGET_UPDATE:"set-target-update",RESTORE_FIELD:"restore-field",FORM_INIT_BASICS:"form-basics",FORM_INIT_STEPPED:"form-init-stepped",FORM_INIT_VALIDATE:"form-init-validate",FORM_INIT_VALIDATE_FIELD:"form-init-validate-field",FORM_INIT_STORAGE:"form-init-storage",FORM_VALIDATION_FAILED:"form-validation-failed",FORM_STEPPED_NEW_STEP:"form-new-step",FORM_STEPPED_FIRST_STEP:"form-first-step",FORM_STEPPED_LAST_STEP:"form-last-step",FORM_FIELDS:"input,textarea,select"}},"./src/js/types/Site.Controllers.MapElementController.js":function(e,t,o){"use strict";o.r(t);var n=o("jquery"),i=o.n(n),a=o("./src/js/_events.js"),r=o.n(a),s=(o("./src/js/_components/_ui.map.api.js"),function(){function e(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,o,n){return o&&e(t.prototype,o),n&&e(t,n),t}}());var l=function(e){var t=window,o=(document,e("body")),n=function(){function t(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t)}return s(t,null,[{key:"init",value:function(){this.dispose(),console.log("Initializing: LocationUI")}},{key:"initMap",value:function(){e(".mapAPI-map-container").find(".marker").on(""+r.a.MAPMARKERCLICK,(function(t){var n=e(t.currentTarget).data("id");o.find(".locations .location").removeClass("active"),o.find('.locations .location[data-id="'+n+'"]').addClass("active")})),o.find(".locations .location").on("click",(function(t){var n=e(t.currentTarget).data("id");o.find("#Marker"+n).click()})),e(".mapAPI-map-container").on(r.a.MAPPOPUPCLOSE,(function(e){o.find(".locations .location").removeClass("active")}))}},{key:"dispose",value:function(){console.log("Destroying: LocationUI")}}]),t}();return e(t).on(r.a.AJAX+" "+r.a.LOADED,(function(){n.init()})),e(t).on(r.a.MAPLOADED,(function(){n.initMap()})),n}(i.a);t.default=l},"./src/scss/_components/_ui.map.scss":function(e,t){},jquery:function(e,t){e.exports=jQuery}});
//# sourceMappingURL=app_Site.Controllers.MapElementController.js.map