if (AppName === "AppClient") {
  setTimeout(() => {
    $(() => {
      const els = document.querySelectorAll(".mod-aos");
      const stateMap = new Map();
      let lastScrollY = window.scrollY;
      const NONE_SCROLL_UP = false; // TOGGLE // --- ELIMINATE THESE JAVASCRIPT STYLE VARIABLES --- // const settings = { distants: 50, durations: 1 }; // const idleStyle = `opacity: 0; transform: translateY(${settings.distants}px);`; // const triggerStyle = `opacity ${settings.durations}s ease, transform ${settings.durations}s ease`; // ----------------------------------------------------

      const windowH = window.innerHeight;

      els.forEach((el) => {
        // 💡 NEW: Apply the base and idle classes
        el.classList.add("mod-reveal-idle");
        // Note: The base class 'content' should already be on the elements
      });

      const handleScroll = (isInitialLoad = false) => {
        const currentScrollY = window.scrollY;
        const direction = currentScrollY > lastScrollY ? "down" : "up";
        lastScrollY = currentScrollY;

        els.forEach((el, index) => {
          const rect = el.getBoundingClientRect();
          let st = stateMap.get(el) || { animated: false };

          if (!st.animated && rect.bottom > 0 && rect.top < windowH && (direction === "down" || isInitialLoad)) {
            // 💡 NEW: Trigger animation by adding the active class
            el.classList.add("mod-reveal-active");
            st.animated = true;
          }

          if (st.animated && direction === "up") {
            if (NONE_SCROLL_UP === true) {
              if (rect.top >= windowH) {
                // 💡 NEW: Reset animation by removing the active class
                el.classList.remove("mod-reveal-active");
                st.animated = false;
              }
            } else {
              if (!isInitialLoad && index !== 0 && (rect.top >= windowH || rect.bottom >= windowH)) {
                // 💡 NEW: Reset animation by removing the active class
                el.classList.remove("mod-reveal-active");
                st.animated = false;
              }
            }
          }
          stateMap.set(el, st);
        });
      };

      $(window).on("scroll resize", () => handleScroll(false));

      handleScroll(true);
    });
  }, 500);
}
