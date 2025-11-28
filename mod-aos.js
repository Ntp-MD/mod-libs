/**
 * scroll-reveal-legacy.js
 * * NOTE: This script requires jQuery to be loaded BEFORE this file.
 * It uses the less efficient scroll-event listener method.
 * @param {string} selector - The CSS selector for elements (e.g., '.content').
 * @param {object} options - Configuration options.
 * @param {boolean} options.scrollUp - If true, elements DO NOT reset on scroll up. (Default: false)
 */
window.ModAosInit = function (selector = ".content", options = {}) {
  // Check if jQuery is loaded (CRITICAL DEPENDENCY CHECK)
  if (typeof jQuery === "undefined") {
    console.error("ModAosInit Error: jQuery is required but was not found. Please load the jQuery CDN first.");
    return;
  }

  // Safety check for the original 'AppName' condition, now made optional
  if (typeof AppName !== "undefined" && AppName !== "AppClient") {
    return;
  }

  // Use the standard jQuery DOM ready wrapper and the original 500ms delay
  setTimeout(() => {
    $(() => {
      // 1. SELECT TARGETS using the provided selector
      const els = document.querySelectorAll(selector);

      // 2. CONFIGURATION & STATE
      const stateMap = new Map();
      let lastScrollY = window.scrollY;

      // 💡 FIX: Use the 'options' object to set the toggle
      const NONE_SCROLL_UP = options.scrollUp === true;

      const settings = { distants: 50, durations: 1 };
      const windowH = window.innerHeight;

      // Inline Styles: (Using your original variables)
      const idleStyle = `opacity: 0; transform: translateY(${settings.distants}px);`;
      const triggerStyle = `opacity ${settings.durations}s ease, transform ${settings.durations}s ease`;

      // 3. INITIAL SETUP
      els.forEach((el) => {
        el.style.cssText = `${idleStyle} transition: ${triggerStyle}`;
      });

      // 4. SCROLL HANDLER (Inefficient but functional logic)
      const handleScroll = (isInitialLoad = false) => {
        const currentScrollY = window.scrollY;
        const direction = currentScrollY > lastScrollY ? "down" : "up";
        lastScrollY = currentScrollY;

        els.forEach((el, index) => {
          const rect = el.getBoundingClientRect();
          let st = stateMap.get(el) || { animated: false };

          // ANIMATION TRIGGER (Scroll Down or Initial Load)
          if (!st.animated && rect.bottom > 0 && rect.top < windowH && (direction === "down" || isInitialLoad)) {
            el.style.cssText = `opacity: 1; transform: translateY(0); transition: ${triggerStyle}`;
            st.animated = true;
          }

          // RESET TRIGGER (Scroll Up)
          if (st.animated && direction === "up") {
            if (NONE_SCROLL_UP === true) {
              if (rect.top >= windowH) {
                el.style.cssText = `${idleStyle} transition: ${triggerStyle}`;
                st.animated = false;
              }
            } else {
              if (!isInitialLoad && index !== 0 && (rect.top >= windowH || rect.bottom >= windowH)) {
                el.style.cssText = `${idleStyle} transition: ${triggerStyle}`;
                st.animated = false;
              }
            }
          }
          stateMap.set(el, st);
        });
      };

      // 5. ATTACH LISTENERS
      $(window).on("scroll resize", () => handleScroll(false));

      // Initial check to reveal elements currently in view
      handleScroll(true);
    });
  }, 500);
};
