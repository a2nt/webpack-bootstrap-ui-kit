!function(){var e={475:function(e){e.exports=function log(e){false}},329:function(e){Cache.prototype.add||(Cache.prototype.add=function add(e){return this.addAll([e])}),Cache.prototype.addAll||(Cache.prototype.addAll=function addAll(e){var t=this;function NetworkError(e){this.name="NetworkError",this.code=19,this.message=e}return NetworkError.prototype=Object.create(Error.prototype),Promise.resolve().then((function(){if(arguments.length<1)throw new TypeError;return e=e.map((function(e){return e instanceof Request?e:String(e)})),Promise.all(e.map((function(e){"string"===typeof e&&(e=new Request(e));var t=new URL(e.url).protocol;if("http:"!==t&&"https:"!==t)throw new NetworkError("Invalid scheme");return fetch(e.clone())})))})).then((function(n){return Promise.all(n.map((function(n,r){return t.put(e[r],n)})))})).then((function(){}))}),CacheStorage.prototype.match||(CacheStorage.prototype.match=function match(e,t){var n=this;return this.keys().then((function(r){var o;return r.reduce((function(r,a){return r.then((function(){return o||n.open(a).then((function(n){return n.match(e,t)})).then((function(e){return o=e}))}))}),Promise.resolve())}))}),e.exports=self.caches}},t={};function __webpack_require__(n){var r=t[n];if(void 0!==r)return r.exports;var o=t[n]={exports:{}};return e[n](o,o.exports,__webpack_require__),o.exports}!function(){var e="".concat("@a2nt/ss-bootstrap-ui-webpack-boilerplate-react","-sw"),t="".concat("5.1.8","-sw"),n=__webpack_require__(475),r=__webpack_require__(329);if("string"!==typeof e)throw new Error("Cache Name cannot be empty");self.addEventListener("fetch",(function(t){if("GET"===t.request.method){var o=new URL(t.request.url);if(o.pathname.indexOf("admin")>=0||o.pathname.indexOf("Security")>=0||o.pathname.indexOf("/dev")>=0)n("SW: skip admin ".concat(t.request.url));else{var a=t.request.clone(),c=t.request.clone();t.respondWith(fetch(a).then((function(n){var o=n.clone();return r.open(e).then((function(e){var n=t.request.clone();e.put(n,o)})),n})).catch((function(e){return n("SW: fetch failed"),r.match(c)})))}}})),self.addEventListener("activate",(function(o){n("SW: activated: ".concat(t)),o.waitUntil(r.delete(e))})),self.addEventListener("install",(function(e){n("SW: installing version: ".concat(t))}))}()}();