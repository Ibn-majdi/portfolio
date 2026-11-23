/* Cinematic Editorial — redesign preview behaviour.
   --hero-scroll (0..1) drives the hero slices expansion.
   (Custom cursor removed in fix round 2 — native cursor everywhere.) */
(function () {
  var root = document.documentElement;
  var hero = document.querySelector('.ce-hero');
  function updateHeroScroll() {
    if (!hero) return;
    var p = Math.min(Math.max(window.scrollY / window.innerHeight, 0), 1);
    root.style.setProperty('--hero-scroll', p.toFixed(3));
  }
  window.addEventListener('scroll', updateHeroScroll, { passive: true });
  updateHeroScroll();
})();
