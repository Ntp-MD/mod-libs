// scroll-reveal-legacy.js (The original jQuery-based code, wrapped)

/**
 * Initializes the legacy scroll-event animation.
 * @param {string} selector - The CSS selector for elements (e.g., '.content').
 */
window.ScrollRevealLegacyInit = function (selector = ".content") {
  // Check AppName or return immediately if not needed
  if (typeof AppName !== "undefined" && AppName !== "AppClient") {
    return;
  }

  // Since this code is highly dependent on jQuery, we must ensure jQuery is ready
  setTimeout(() => {
    // Use the standard jQuery DOM ready wrapper
    $(() => {
      // 1. SELECT TARGETS using the provided selector
      const els = document.querySelectorAll(selector);

      // --- YOUR ORIGINAL LOGIC BEGINS HERE ---
      const stateMap = new Map();
      let lastScrollY = window.scrollY;
      const NONE_SCROLL_UP = false; // switch mode

      const settings = { distants: 50, durations: 1 };
      const windowH = window.innerHeight;

      // Inline Styles (Maintain the original logic):
      const idleStyle = `opacity: 0; transform: translateY(${settings.distants}px);`;
      const triggerStyle = `opacity ${settings.durations}s ease, transform ${settings.durations}s ease`;

      els.forEach((el) => {
        el.style.cssText = `${idleStyle} transition: ${triggerStyle}`;
      });

      const handleScroll = (isInitialLoad = false) => {
        const currentScrollY = window.scrollY;
        const direction = currentScrollY > lastScrollY ? "down" : "up";
        lastScrollY = currentScrollY;

        els.forEach((el, index) => {
          const rect = el.getBoundingClientRect(); // 🛑 Performance impact
          let st = stateMap.get(el) || { animated: false };

          if (!st.animated && rect.bottom > 0 && rect.top < windowH && (direction === "down" || isInitialLoad)) {
            el.style.cssText = `opacity: 1; transform: translateY(0); transition: ${triggerStyle}`;
            st.animated = true;
          }

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
      // --- YOUR ORIGINAL LOGIC ENDS HERE ---

      // Attach the heavy scroll listener
      $(window).on("scroll resize", () => handleScroll(false));

      // Initial check
      handleScroll(true);
    });
  }, 500);
};
// Note: The function is attached to window.ScrollRevealLegacyInit above for global access.
