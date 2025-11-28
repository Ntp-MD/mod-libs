// mod-aos.js (Pure JavaScript, ready for CDN)

// Note: We use 'ModAOSInit' to expose the function globally.
const ModAOSInit = (selector = ".mod-aos") => {
  // 1. Setup the Intersection Observer
  // We only observe elements, no need for the Map or scroll tracking
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        const el = entry.target;

        // Check if the element is intersecting (coming into view)
        if (entry.isIntersecting) {
          // 💡 Trigger Reveal: Add the active class to start animation
          el.classList.add("mod-reveal-active");

          // Stop observing this element once it has been animated (one-time reveal)
          observer.unobserve(el);
        }
      });
    },
    {
      // Options: Trigger when 10% of the element is visible
      threshold: 0.1,
    }
  );

  // 2. Find all elements and set initial state
  const els = document.querySelectorAll(selector);

  // We can remove the 500ms timeout now, as Intersection Observer handles timing efficiently
  els.forEach((el) => {
    // Add the idle class to set the initial hidden state
    el.classList.add("mod-reveal-idle");

    // Start observing the element
    observer.observe(el);
  });
};

// 3. Expose the function globally (Necessary for CDN use)
window.ModAOSInit = ModAOSInit;

// 4. Standard DOM Ready Check (Replaces the unreliable setTimeout/jQuery wrapper)
document.addEventListener("DOMContentLoaded", () => {
  // Automatically run the initialization with the default selector
  // Your HTML page should call this if you aren't using the default selector
  ModAOSInit();
});
