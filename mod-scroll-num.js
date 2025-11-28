/**
 * * @param {string} selector - The CSS selector for the number elements (Default: ".set_num").
 */
window.ModCounterInit = function (selector = ".set_num") {
  // Check if jQuery is loaded (CRITICAL DEPENDENCY CHECK)
  if (typeof jQuery === "undefined") {
    console.error("ModCounterInit Error: jQuery is required but was not found. Please load the jQuery CDN first.");
    return;
  }

  // Safety check for the original 'AppName' condition (If needed, otherwise remove)
  if (typeof AppName !== "undefined" && AppName !== "AppClient") {
    return;
  }

  // 1. Core Animation Function (Internal use only)
  function ModNumberRun(obj, start, end, duration, onComplete = () => {}, options = {}) {
    const { decimals = false, decimalPlaces = 2 } = options;
    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      let value = progress * (end - start) + start;

      // Set current value
      // We ensure we only display the integer part during animation for cleaner look
      obj.innerHTML = Math.floor(value).toLocaleString();

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        // Final value formatting
        if (decimals) {
          value = value.toFixed(decimalPlaces);
        } else {
          value = Math.floor(value);
        }
        obj.innerHTML = parseFloat(value).toLocaleString();
        onComplete();
      }
    };

    window.requestAnimationFrame(step);
  }

  // 2. Initialize jQuery ready state
  $(document).ready(function () {
    const elements = document.querySelectorAll(selector);
    let animatedElements = new Map();
    let lastScrollTop = window.pageYOffset;

    // Helper function to check scroll direction
    function getScrollDirection() {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      const direction = st > lastScrollTop ? "down" : "up"; // FIX: Down is scroll-down, Up is scroll-up
      lastScrollTop = st <= 0 ? 0 : st;
      return direction;
    }

    // Main scroll handler function
    function handleScroll() {
      const direction = getScrollDirection();

      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top;
        const elementBottom = rect.bottom;
        const windowHeight = window.innerHeight;

        const animationState = animatedElements.get(element) || { animated: false };

        // Trigger condition: Element must be between 50% of screen height and the bottom edge
        const triggerZone = elementTop <= windowHeight * 0.75 && elementBottom >= 0;

        // We simplify the trigger logic for this pattern:
        // Only animate if scrolling DOWN and entering the trigger zone, OR scrolling UP and entering the trigger zone.
        if (triggerZone && !animationState.animated) {
          const startValue = parseFloat(element.getAttribute("data-start") || 0);
          const endValue = parseFloat(element.getAttribute("data-stop") || element.getAttribute("data-value"));
          const options = {
            // Note: If data-decimals is NOT present or is set to "true", decimals will be true.
            decimals: element.getAttribute("data-decimals") !== "false",
            decimalPlaces: parseInt(element.getAttribute("data-places")) || 2,
          };

          // The onComplete callback resets the animated state
          const onComplete = () => {
            // Mark as complete, but allow re-animation if scrolled away and back (if needed later)
            // For a counter, usually we want it to run once. We keep the map update here.
          };

          ModNumberRun(element, startValue, endValue, 1500, onComplete, options);
          animationState.animated = true;
        } else if (!triggerZone) {
          // Reset animation state when element is completely out of view (allowing re-animation)
          animationState.animated = false;
        }

        animatedElements.set(element, animationState);
      });
    }

    // Attach the scroll listener using jQuery
    $(window).scroll(handleScroll);

    // Run an initial check on load
    $(window).on("load", function () {
      animatedElements.clear();
      lastScrollTop = window.pageYOffset;
      handleScroll(); // Initial check
    });
  });
};
