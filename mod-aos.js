// mod-aos.js (Final CDN Version - FIXED)

const ModAOSInit = (selector = ".mod-aos") => {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        const el = entry.target;

        if (entry.isIntersecting) {
          // 🛑 CRITICAL FIX: Remove the hidden state class first!
          el.classList.remove("mod-reveal-idle");

          // Trigger Reveal: Add the active class to start animation
          el.classList.add("mod-reveal-active");

          observer.unobserve(el);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  const els = document.querySelectorAll(selector);

  els.forEach((el) => {
    // Add the idle class to set the initial hidden state
    el.classList.add("mod-reveal-idle");
    observer.observe(el);
  });
};

window.ModAOSInit = ModAOSInit;
// REMOVED: document.addEventListener block
