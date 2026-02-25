// ModScrollNum - Number Animation Library
// Usage: ModScrollNum.init() or ModScrollNum.init({ duration: 1500, once: false, showDecimal: true })
// HTML: <div class="set_num" data-start="0" data-stop="100" data-decimals="false" data-places="2"></div>

window.ModScrollNum = (function () {
  const defaultConfig = { duration: 1500, once: false, showDecimal: true };
  const easeOutQuad = (t) => t * (2 - t);
  let observer = null;
  let isInitialized = false;

  function createObserver(config) {
    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          const data = el.dataset;

          if (entry.isIntersecting) {
            if (data.animating === "true") return;

            let startTime = null;
            const startVal = +data.start || 0;
            const endVal = +(data.stop || data.value);

            const step = (timestamp) => {
              startTime = startTime || timestamp;
              const progress = Math.min((timestamp - startTime) / config.duration, 1);
              const currentValue = easeOutQuad(progress) * (endVal - startVal) + startVal;

              const useDec = data.decimals !== "false" && config.showDecimal;
              const places = +data.places || 2;

              const displayValue = useDec ? currentValue.toFixed(places) : Math.floor(currentValue);
              el.innerHTML = Number(displayValue).toLocaleString(undefined, {
                minimumFractionDigits: useDec ? places : 0,
                maximumFractionDigits: useDec ? places : 0,
              });

              if (progress < 1) {
                requestAnimationFrame(step);
              } else {
                data.animating = "false";
                if (data.once === "true" || config.once) observer.unobserve(el);
              }
            };

            data.animating = "true";
            requestAnimationFrame(step);
          } else if (data.once !== "true" && !config.once) {
            data.animating = "false";
          }
        });
      },
      { threshold: 0.2 },
    );
  }

  console.log("ModScrollNum library loaded successfully");

  return {
    init: function (selector = ".set_num", customConfig = {}) {
      const config = { ...defaultConfig, ...customConfig };
      observer = createObserver(config);
      isInitialized = true;

      if (typeof jQuery !== "undefined") {
        $(selector).each((_, el) => observer.observe(el));
      } else {
        document.querySelectorAll(selector).forEach((el) => observer.observe(el));
      }

      console.log("ModScrollNum initialized with selector:", selector);
    },

    destroy: function () {
      if (observer) {
        observer.disconnect();
        observer = null;
        isInitialized = false;
      }
    },

    observe: function (element) {
      if (!observer) {
        observer = createObserver(defaultConfig);
      }
      observer.observe(element);
    },

    unobserve: function (element) {
      if (observer) {
        observer.unobserve(element);
      }
    },

    isInitialized: function () {
      return isInitialized;
    },
  };
})();

// Auto-initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    if (typeof jQuery !== "undefined") {
      $(document).ready(() => {
        ModScrollNum.init(".set_num");
      });
    } else {
      ModScrollNum.init(".set_num");
    }
  });
} else {
  // DOM already loaded
  if (typeof jQuery !== "undefined") {
    $(document).ready(() => {
      ModScrollNum.init(".set_num");
    });
  } else {
    ModScrollNum.init(".set_num");
  }
}
