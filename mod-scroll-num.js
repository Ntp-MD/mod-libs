/**
 * @param {string} selector - CSS selector (default: ".set_num")
 * @param {object} config
 *   - once: true  (run once, default)
 *   - duration: 1500
 *
 * HTML:
 * <div class="set_num" data-start="0" data-stop="100" data-decimals="false"></div>
 *
 * JS:
 * ModNumInit();
 * ModNumInit(".set_num", { once: false });
 */
window.ModNumInit = function (selector = ".set_num", config = {}) {
  if (typeof jQuery === "undefined") {
    console.error("ModNumInit Error: jQuery is required.");
    return;
  }

  if (typeof AppName !== "undefined" && AppName !== "AppClient") return;

  const settings = {
    once: true,
    duration: 1500,
    ...config,
  };

  function ModNumberRun(el, start, end, duration, options = {}) {
    const { decimals = false, decimalPlaces = 2 } = options;
    let startTs = null;

    function step(ts) {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / duration, 1);
      let v = start + (end - start) * p;

      el.innerHTML = Math.floor(v).toLocaleString();

      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        v = decimals ? v.toFixed(decimalPlaces) : Math.floor(v);
        el.innerHTML = Number(v).toLocaleString();
      }
    }

    requestAnimationFrame(step);
  }

  $(function () {
    const elements = document.querySelectorAll(selector);
    const state = new Map();

    function handleScroll() {
      const vh = window.innerHeight;

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const inView = rect.top <= vh * 0.75 && rect.bottom >= 0;

        const s = state.get(el) || { done: false };

        const allowRepeat = !settings.once || el.getAttribute("data-repeat") === "true";

        if (!inView || (s.done && !allowRepeat)) return;

        const start = parseFloat(el.getAttribute("data-start")) || 0;
        const end = parseFloat(el.getAttribute("data-stop")) || parseFloat(el.getAttribute("data-value"));

        if (isNaN(end)) return;

        ModNumberRun(el, start, end, settings.duration, {
          decimals: el.getAttribute("data-decimals") !== "false",
          decimalPlaces: parseInt(el.getAttribute("data-places")) || 2,
        });

        s.done = true;
        state.set(el, s);
      });
    }

    $(window).on("scroll", handleScroll);
    $(window).on("load", handleScroll);
  });
};
