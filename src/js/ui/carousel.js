import Events from "../_events";
import Carousel from "bootstrap/js/src/carousel";

const CarouselUI = ((window) => {
  const NAME = "js-carousel";

  const init = () => {
    console.log(`${NAME}: init`);

    document.querySelectorAll(`.${NAME}`).forEach((el, i) => {
      const carousel = new Carousel(el);
      // create next/prev arrows
      if (el.dataset.bsArrows) {
        const next = document.createElement("button");
        next.classList.add("carousel-control-next");
        next.setAttribute("type", "button");
        next.setAttribute("aria-label", "Next Slide");
        next.setAttribute("data-bs-target", el.getAttribute("id"));
        next.setAttribute("data-bs-slide", "next");
        next.addEventListener("click", (e) => {
          carousel.next();
        });
        next.innerHTML =
          '<span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span>';
        el.appendChild(next);

        const prev = document.createElement("button");
        prev.setAttribute("type", "button");
        prev.setAttribute("aria-label", "Previous Slide");
        prev.classList.add("carousel-control-prev");
        prev.setAttribute("data-bs-target", el.getAttribute("id"));
        prev.setAttribute("data-bs-slide", "prev");
        prev.addEventListener("click", (e) => {
          carousel.prev();
        });
        prev.innerHTML =
          '<span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span>';
        el.appendChild(prev);
      }

      if (el.dataset.bsIndicators) {
        const indicators = document.createElement("div");
        indicators.classList.add("carousel-indicators");
        const items = el.querySelectorAll(".carousel-item");
        let i = 0;
        while (i < items.length) {
          const ind = document.createElement("button");
          ind.setAttribute("type", "button");
          ind.setAttribute("aria-label", `Slide to #${i + 1}`);
          if (i == 0) {
            ind.classList.add("active");
          }
          ind.setAttribute("data-bs-target", el.getAttribute("id"));
          ind.setAttribute("data-bs-slide-to", i);

          ind.addEventListener("click", (e) => {
            const target = e.target;
            carousel.to(target.getAttribute("data-bs-slide-to"));
            indicators.querySelectorAll(".active").forEach((ind2) => {
              ind2.classList.remove("active");
            });
            target.classList.add("active");
          });

          indicators.appendChild(ind);
          i++;
        }

        el.appendChild(indicators);
        el.addEventListener("slide.bs.carousel", (e) => {
          el.querySelectorAll(".carousel-indicators .active").forEach(
            (ind2) => {
              ind2.classList.remove("active");
            }
          );
          el.querySelectorAll(
            `.carousel-indicators [data-bs-slide-to="${e.to}"]`
          ).forEach((ind2) => {
            ind2.classList.add("active");
          });
        });
      }
      el.classList.add(`${NAME}-active`);
    });
  };

  window.addEventListener(`${Events.LODEDANDREADY}`, init);
  window.addEventListener(`${Events.AJAX}`, init);
})(window);

export default CarouselUI;
