// browser tab visibility state detection

import Events from "../_events";
import Consts from "../_consts";

export default ((W) => {
  const NAME = "_main.css-screen-size";
  const D = document;
  const BODY = D.body;

  const detectCSSScreenSize = () => {
    const el = D.createElement("div");
    el.className = "env-test";
    BODY.appendChild(el);

    const envs = [...Consts.ENVS].reverse();
    let curEnv = envs.shift();
    BODY.classList.remove(...envs);

    for (let i = 0; i < envs.length; ++i) {
      const env = envs[i];
      el.classList.add(`d-${env}-none`);

      if (W.getComputedStyle(el).display === "none") {
        curEnv = env;
        BODY.classList.add(`${curEnv}`);
        break;
      }
    }

    let landscape = true;
    if (W.innerWidth > W.innerHeight) {
      BODY.classList.add("landscape");
      BODY.classList.remove("portrait");
    } else {
      landscape = false;

      BODY.classList.add("portrait");
      BODY.classList.remove("landscape");
    }

    console.log(
      `${NAME}: screen size detected ${curEnv} | landscape ${landscape}`
    );

    BODY.removeChild(el);

    return curEnv;
  };

  W.addEventListener(`${Events.LOADED}`, detectCSSScreenSize);

  W.addEventListener(`${Events.RESIZE}`, detectCSSScreenSize);
})(window);
