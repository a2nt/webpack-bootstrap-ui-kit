const axios = require("axios");

const NAME = "ajax.models.image";

const API_STATIC = document.querySelector('meta[name="api_static_domain"]');
const API_STATIC_URL = API_STATIC
  ? API_STATIC.getAttribute("content")
  : `${window.location.protocol}//${window.location.host}`;

console.log(`${NAME} [static url]: ${API_STATIC_URL}`);

class ImageObject {
  constructor() {
  }

  load(url, el) {
    const imageUrl = url.startsWith("http") ? url : API_STATIC_URL + url;

    if(el) {
      el.classList.add("loading");
      el.classList.remove("loading__network-error");
    }
    
    // offline response will be served by caching service worker
    const promise = new Promise((resolve, reject) => {
      axios
        .get(imageUrl, {
          responseType: "blob",
        })
        .then((response) => {
          const reader = new FileReader(); // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/FileReader
          reader.readAsDataURL(response.data);
          reader.onload = () => {
            const imageDataUrl = reader.result;
            if(el){
              //el.setAttribute("src", imageDataUrl);
              el.classList.remove("loading");
              el.classList.add("loading__success");
            }

            resolve(imageDataUrl);
          };
        })
        .catch((e) => {
          //el.setAttribute('src', imageUrl);

          if (e.response) {
            switch (e.response.status) {
              case 404:
                msg = "Not Found.";
                break;
              case 500:
                msg = "Server issue, please try again latter.";
                break;
              default:
                msg = "Something went wrong.";
                break;
            }

            console.error(`${NAME} [${imageUrl}]: ${msg}`);
          } else if (e.request) {
            msg = "No response received";
            console.error(`${NAME} [${imageUrl}]: ${msg}`);
          } else {
            console.error(`${NAME} [${imageUrl}]: ${e.message}`);
          }

          if(el){
            el.classList.remove("loading");
            el.classList.add("loading__network-error");
            el.classList.add("empty");
          }

          reject();
        });
    });

    return promise;
  }
}

export default ImageObject;
