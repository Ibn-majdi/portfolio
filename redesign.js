/* Cinematic Editorial — redesign preview behaviour.
   1) --hero-scroll (0..1) drives the hero slices expansion.
   2) Custom 8px difference-blend cursor on fine pointers. */
(function () {
  var root = document.documentElement;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --hero-scroll */
  var hero = document.querySelector('.ce-hero');
  function updateHeroScroll() {
    if (!hero) return;
    var p = Math.min(Math.max(window.scrollY / window.innerHeight, 0), 1);
    root.style.setProperty('--hero-scroll', p.toFixed(3));
  }
  window.addEventListener('scroll', updateHeroScroll, { passive: true });
  updateHeroScroll();

  /* Custom cursor — fine pointers only, skipped on reduced motion */
  if (matchMedia('(pointer:fine)').matches && !reduced) {
    var dot = document.createElement('div');
    dot.className = 'ce-cursor';
    dot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(dot);
    var x = window.innerWidth / 2, y = window.innerHeight / 2;
    var tx = x, ty = y, scale = 1, tScale = 1;
    window.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; }, { passive: true });
    document.addEventListener('mouseover', function (e) {
      tScale = e.target.closest('a,button,summary,input,textarea,select,.ce-slice,[data-open-product]') ? 4 : 1;
    });
    root.classList.add('ce-cursor-on');
    (function loop() {
      x += (tx - x) * 0.2; y += (ty - y) * 0.2; scale += (tScale - scale) * 0.2;
      dot.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) translate(-50%,-50%) scale(' + scale.toFixed(2) + ')';
      requestAnimationFrame(loop);
    })();
  }
})();
