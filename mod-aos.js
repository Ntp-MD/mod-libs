// mod-aos.js (Final CDN Version)

// Note: The function itself remains the same, but the automatic execution is removed.
const ModAOSInit = (selector = ".mod-aos") => {
  // The selector default is changed to match the CSS base class name

  // 1. Setup the Intersection Observer
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        const el = entry.target;

        if (entry.isIntersecting) {
          el.classList.add("mod-reveal-active");
          observer.unobserve(el);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  // 2. Find all elements and set initial state
  const els = document.querySelectorAll(selector);

  els.forEach((el) => {
    el.classList.add("mod-reveal-idle");
    observer.observe(el);
  });
};

// 3. Expose the function globally (CRITICAL LINE)
window.ModAOSInit = ModAOSInit;

// 4. ***REMOVE THE AUTOMATIC document.addEventListener BLOCK***
// The user will call the function directly in their HTML.
