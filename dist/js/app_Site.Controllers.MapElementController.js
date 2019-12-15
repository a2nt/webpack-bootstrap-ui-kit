!function(e){var t={};function n(o){if(t[o])return t[o].exports;var i=t[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(o,i,function(t){return e[t]}.bind(null,i));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/srv/dist/repositories/webpack-bootstrap-ui-kit/dist",n(n.s="./src/js/types/Site.Controllers.MapElementController.js")}({"./src/js/_components/_ui.map.api.js":function(e,t,n){"use strict";var o=n("jquery"),i=n.n(o),a=n("./src/js/_events.js"),r=n.n(a),s=(n("./src/scss/_components/_ui.map.scss"),n("./src/js/_consts.js")),l=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}();!function(e){var t="jsMapAPI",n=t,o=e("body"),i=s.a.MAP_DRIVER,a=window,c=function(){function s(a){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,s);var l=new i;this.$el=e(a);var c=this.$el,u=c.data();u.center=[u.lng?u.lng:o.data("default-lng"),u.lat?u.lat:o.data("default-lat")],u["font-family"]=o.css("font-family"),console.log(t+": initializing "+l.getName()+"..."),this.map=l.init(c,u),c.on(r.a.MAPLOADED,(function(e){l.addGeoJson(u),console.log(t+": Map is loaded")})),c.data(n,this),c.addClass(t+"-active")}return l(s,[{key:"getMap",value:function(){return ui.map}},{key:"dispose",value:function(){this.$el=null,e.removeData(this.$el[0],n),this.$el.removeClass(t+"-active")}}],[{key:"_jQueryInterface",value:function(){if(void 0!==a.localStorage)return this.each((function(){var t=e(this),o=t.data(n);o||(o=new s(this),t.data(n,o))}))}}]),s}();e.fn[t]=c._jQueryInterface,e.fn[t].Constructor=c,e.fn[t].noConflict=function(){return e.fn[t]=JQUERY_NO_CONFLICT,c._jQueryInterface},e(a).on(r.a.AJAX+" "+r.a.LOADED,(function(){e(".mapAPI-map-container").jsMapAPI()}))}(i.a)},"./src/js/_consts.js":function(e,t,n){"use strict";var o=n("jquery"),i=n.n(o),a=n("./src/js/_events.js"),r=n.n(a),s=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}();var l={init:function(){return function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this)),o=n;return o.setMap(e.map),o.position=e.position,o.html=e.html?e.html:'<div class="mapboxgl-marker"><i class="marker-icon fas fa-map-marker-alt"></i></div>',o.divClass=e.divClass,o.align=e.align,o.isDebugMode=e.debug,o.onClick=e.onClick,o.onMouseOver=e.onMouseOver,o.isBoolean=function(e){return"boolean"==typeof e},o.isNotUndefined=function(e){return void 0!==e},o.hasContent=function(e){return e.length>0},o.isString=function(e){return"string"==typeof e},o.isFunction=function(e){return"function"==typeof e},n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,google.maps.OverlayView),s(t,[{key:"onAdd",value:function(){var e=this;e.div=document.createElement("div"),e.div.style.position="absolute",e.isNotUndefined(e.divClass)&&e.hasContent(e.divClass)&&(e.div.className=e.divClass),e.isNotUndefined(e.html)&&e.hasContent(e.html)&&e.isString(e.html)&&(e.div.innerHTML=e.html),e.isBoolean(e.isDebugMode)&&e.isDebugMode&&(e.div.className="debug-mode",e.div.innerHTML='<div style="height: 10px; width: 10px; background: red; border-radius: 100%;"></div><div style="position: absolute; top: 5px; padding: 5px; width: 130px; text-align: center; font-size: 18px; text-transform: uppercase; font-weight: bolder; background: red; color: white; font-family: Arial;">Debug mode</div>',e.div.setAttribute("style","position: absolute;border: 5px dashed red;height: 150px;width: 150px;display: flex;justify-content: center;align-items: center;")),e.getPanes().overlayMouseTarget.appendChild(e.div),google.maps.event.addDomListener(e.div,"click",(function(t){google.maps.event.trigger(e,"click"),e.isFunction(e.onClick)&&e.onClick(),t.stopPropagation()})),google.maps.event.addDomListener(e.div,"mouseover",(function(t){google.maps.event.trigger(e,"mouseover"),e.isFunction(e.onMouseOver)&&e.onMouseOver(),t.stopPropagation()}))}},{key:"draw",value:function(){var e=this,t=e.getProjection().fromLatLngToDivPixel(new google.maps.LatLng(e.position)),n={y:void 0,x:void 0};switch(Array.isArray(e.align)?e.align.join(" "):""){case"left top":n.y=e.div.offsetHeight,n.x=e.div.offsetWidth;break;case"left center":n.y=e.div.offsetHeight/2,n.x=e.div.offsetWidth;break;case"left bottom":n.y=0,n.x=e.div.offsetWidth;break;case"center top":n.y=e.div.offsetHeight,n.x=e.div.offsetWidth/2;break;case"center center":n.y=e.div.offsetHeight/2,n.x=e.div.offsetWidth/2;break;case"center bottom":n.y=0,n.x=e.div.offsetWidth/2;break;case"right top":n.y=e.div.offsetHeight,n.x=0;break;case"right center":n.y=e.div.offsetHeight/2,n.x=0;break;case"right bottom":n.y=0,n.x=0;break;default:n.y=e.div.offsetHeight/2,n.x=e.div.offsetWidth/2}e.div.style.top=t.y-n.y+"px",e.div.style.left=t.x-n.x+"px"}},{key:"getPosition",value:function(){return this.position}},{key:"getDiv",value:function(){return this.div}},{key:"setPosition",value:function(e,t){this.position=e,this.align=t,this.draw()}}]),t}()}},c=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}();var u,p={ENVS:["xs","sm","md","lg","xl","xxl","xxxl"],MAP_DRIVER:(u=i.a,function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}return c(e,[{key:"getName",value:function(){return"GoogleMapsDriver"}},{key:"init",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=this,o=window;n.$el=e,n.config=t,o["init"+n.getName()]=function(){n.googleApiLoaded()},u("body").append('<script async defer src="https://maps.googleapis.com/maps/api/js?key='+t.key+"&callback=init"+n.getName()+'"><\/script>')}},{key:"googleApiLoaded",value:function(){var e=this,t=e.$el,n=e.config,o=t.find(".mapAPI-map"),i=n.mapZoom?n.mapZoom:10,a=n.center?{lat:n.center[1],lng:n.center[0]}:{lat:0,lng:0},s=n.style?n.style:null;console.log(e.getName()+": API is loaded"),e.MarkerUI=l.init(u),e.map=new google.maps.Map(o[0],{zoom:i,center:a,fullscreenControl:!0,styles:s}),e.default_zoom=i,o.addClass("mapboxgl-map"),e.popup=new e.MarkerUI({map:e.map,align:["center","top"],divClass:"mapboxgl-popup popup mapboxgl-popup-anchor-bottom d-none",html:'<div class="mapboxgl-popup-tip"></div><div class="mapboxgl-popup-content"><div class="mapboxgl-popup-close-button" type="button" aria-label="Close popup">×</div><div class="html"></div></div>'}),t.trigger(r.a.MAPLOADED)}},{key:"addMarker",value:function(e,t){var n=this,o={lat:e[1],lng:e[0]};return new n.MarkerUI({position:o,map:n.map,html:'<div class="mapboxgl-marker"><div id="Marker'+t.id+'" data-id="'+t.id+'" class="marker">'+t.icon+"</div></div>",onClick:function(){var e=u("#Marker"+t.id);n.showPopup(o,t.content),e.trigger(r.a.MAPMARKERCLICK)}})}},{key:"showPopup",value:function(e,t){var n=this,o=u(n.popup.getDiv());n.config.flyToMarker&&(n.map.setCenter(e),n.map.setZoom(18)),o.css({opacity:"0"}),o.removeClass("d-none"),n.popup.setPosition(e,["center","top"]),o.find(".mapboxgl-popup-content .html").html(t),o.find(".mapboxgl-popup-close-button").on("click",(function(e){e.preventDefault(),n.hidePopup()})),o.css({"margin-left":"1rem",opacity:"1"})}},{key:"hidePopup",value:function(){u(this.popup.getDiv()).addClass("d-none"),this.restoreBounds(),this.$el.trigger(r.a.MAPPOPUPCLOSE)}},{key:"addGeoJson",value:function(e){var t=this,n=(e.geojson.features[0].geometry.coordinates,new google.maps.LatLngBounds);e.geojson.features.forEach((function(o){var i=o.id,a=o.geometry.coordinates,r=o.properties.content;t.addMarker(a,{id:i,content:r,icon:o.icon,flyToMarker:e.flyToMarker}),n.extend({lat:a[1],lng:a[0]})})),t.map.fitBounds(n,{padding:30}),t.default_bounds=n,t.default_zoom=t.map.getZoom()}},{key:"getMap",value:function(){return this.map}},{key:"getPopup",value:function(){return this.popup}},{key:"restoreBounds",value:function(){this.map.fitBounds(this.default_bounds,{padding:30})}},{key:"restoreZoom",value:function(){this.map.setZoom(this.default_zoom)}}]),e}())};t.a=p},"./src/js/_events.js":function(e,t){e.exports={AJAX:"ajax-load",LOADED:"load",MAPLOADED:"map-loaded",MAPMARKERCLICK:"map-marker-click",MAPPOPUPCLOSE:"map-popup-close",SET_TARGET_UPDATE:"set-target-update",RESTORE_FIELD:"restore-field",FORM_INIT_BASICS:"form-basics",FORM_INIT_STEPPED:"form-init-stepped",FORM_INIT_VALIDATE:"form-init-validate",FORM_INIT_VALIDATE_FIELD:"form-init-validate-field",FORM_INIT_STORAGE:"form-init-storage",FORM_VALIDATION_FAILED:"form-validation-failed",FORM_STEPPED_NEW_STEP:"form-new-step",FORM_STEPPED_FIRST_STEP:"form-first-step",FORM_STEPPED_LAST_STEP:"form-last-step",FORM_FIELDS:"input,textarea,select"}},"./src/js/types/Site.Controllers.MapElementController.js":function(e,t,n){"use strict";n.r(t);var o=n("jquery"),i=n.n(o),a=n("./src/js/_events.js"),r=n.n(a),s=(n("./src/js/_components/_ui.map.api.js"),function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}());var l=function(e){var t=window,n=(document,e("body")),o=function(){function t(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t)}return s(t,null,[{key:"init",value:function(){this.dispose(),console.log("Initializing: LocationUI")}},{key:"initMap",value:function(){e(".mapAPI-map-container").find(".marker").on(""+r.a.MAPMARKERCLICK,(function(t){var o=e(t.currentTarget).data("id");n.find(".locations .location").removeClass("active"),n.find('.locations .location[data-id="'+o+'"]').addClass("active")})),n.find(".locations .location").on("click",(function(t){var o=e(t.currentTarget).data("id");n.find("#Marker"+o).click()})),e(".mapAPI-map-container").on(r.a.MAPPOPUPCLOSE,(function(e){n.find(".locations .location").removeClass("active")}))}},{key:"dispose",value:function(){console.log("Destroying: LocationUI")}}]),t}();return e(t).on(r.a.AJAX+" "+r.a.LOADED,(function(){o.init()})),e(t).on(r.a.MAPLOADED,(function(){o.initMap()})),o}(i.a);t.default=l},"./src/scss/_components/_ui.map.scss":function(e,t){},jquery:function(e,t){e.exports=jQuery}});
//# sourceMappingURL=app_Site.Controllers.MapElementController.js.map