/* PORTAL — record-label layout, Ibn Majdi identity.
   Portal motion is bound to scroll position (reversible).
   Entry reveals fire once and never un-reveal.
   Reduced motion / no-JS renders are the finished page. */
(function () {
  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced) root.classList.add('portal-motion');

  /* ---------- portal hero: scroll progress 0..1 ---------- */
  var hero = document.querySelector('.pt-hero');
  function updatePortal() {
    if (!hero) return;
    var total = hero.offsetHeight - window.innerHeight;
    var p = total > 0 ? Math.min(Math.max(-hero.getBoundingClientRect().top / total, 0), 1) : 1;
    root.style.setProperty('--portal', p.toFixed(3));
  }

  /* ---------- statement orb: drift + rotate on scroll ---------- */
  var orb = document.querySelector('.pt-orb');
  function updateOrb() {
    if (!orb) return;
    var sec = orb.closest('.pt-statement');
    var r = sec.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = Math.min(Math.max((vh - r.top) / (vh + r.height), 0), 1);
    var y = (p - 0.5) * 120;
    var rot = (p - 0.5) * 24;
    orb.style.transform = 'translateY(' + y.toFixed(1) + 'px) rotate(' + rot.toFixed(1) + 'deg)';
  }

  function onScroll() { updatePortal(); updateOrb(); }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- throwable deck ---------- */
  var deck = document.querySelector('.pt-deck');
  if (!deck) return;
  var workPage = root.lang === 'ar' ? 'work-ar.html' : 'work.html';
  var cards = Array.prototype.slice.call(deck.querySelectorAll('.pt-card'));
  var dotsWrap = deck.parentElement.querySelector('.pt-dots');
  var dots = [];
  var order = cards.slice(); /* order[0] is on top */
  var throwing = false;

  function baseTransform(i) {
    var x = i * 12, y = -i * 6, s = 1 - i * 0.045, r = (i % 2 === 0 ? -1 : 1) * i * 1.5;
    return { x: x, y: y, s: s, r: r };
  }
  function applyTransform(card, t) {
    card.style.transform = 'translate(' + t.x + 'px,' + t.y + 'px) scale(' + t.s + ') rotate(' + t.r + 'deg)';
  }
  function render() {
    order.forEach(function (card, i) {
      var t = baseTransform(i);
      card.style.zIndex = String(100 - i);
      card.style.pointerEvents = i === 0 ? 'auto' : 'none';
      card.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
      applyTransform(card, t);
    });
    dots.forEach(function (d, i) {
      d.setAttribute('aria-current', order[i] === order[0] ? 'true' : 'false');
    });
  }
  function throwTop(dir) {
    if (throwing || order.length < 2) return;
    throwing = true;
    var top = order[0];
    var w = deck.clientWidth;
    top.classList.add('dragging');
    top.style.transition = 'transform .45s cubic-bezier(.16,1,.3,1), opacity .45s ease';
    top.style.transform = 'translate(' + (dir * w * 1.15) + 'px,-48px) rotate(' + (dir * 18) + 'deg)';
    top.style.opacity = '0';
    setTimeout(function () {
      top.style.transition = '';
      top.style.opacity = '';
      top.classList.remove('dragging');
      order.push(order.shift());
      render();
      throwing = false;
    }, 460);
  }
  function bringToTop(card) {
    if (throwing) return;
    var i = order.indexOf(card);
    if (i <= 0) return;
    order.splice(i, 1);
    order.unshift(card);
    render();
  }

  /* dots */
  cards.forEach(function (card, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', root.lang === 'ar'
      ? 'أظهر البطاقة ' + (i + 1) + ' من ' + cards.length
      : 'Show card ' + (i + 1) + ' of ' + cards.length);
    b.addEventListener('click', function () { bringToTop(card); });
    dotsWrap.appendChild(b);
    dots.push(b);
  });

  /* drag */
  var dragX = null, moved = false, startX = 0;
  var topCard = function () { return order[0]; };
  deck.addEventListener('pointerdown', function (e) {
    if (throwing || e.target.closest('a,button')) return;
    var top = topCard();
    if (e.target !== top && !top.contains(e.target)) return;
    dragX = e.clientX; startX = e.clientX; moved = false;
    top.classList.add('dragging');
    try { top.setPointerCapture(e.pointerId); } catch (err) {}
  });
  deck.addEventListener('pointermove', function (e) {
    if (dragX === null) return;
    var dx = e.clientX - dragX;
    if (Math.abs(dx) > 6) moved = true;
    var top = topCard();
    top.style.transform = 'translate(' + dx + 'px,' + (Math.abs(dx) * 0.06) + 'px) rotate(' + (dx / 14) + 'deg) scale(1.03)';
  });
  function endDrag(e) {
    if (dragX === null) return;
    var dx = e.clientX - dragX;
    dragX = null;
    var top = topCard();
    top.classList.remove('dragging');
    if (Math.abs(dx) > deck.clientWidth * 0.1) {
      throwTop(dx > 0 ? 1 : -1);
    } else {
      render();
    }
  }
  deck.addEventListener('pointerup', endDrag);
  deck.addEventListener('pointercancel', endDrag);

  /* click (not a drag) opens the project */
  deck.addEventListener('click', function (e) {
    if (moved) { moved = false; e.preventDefault(); e.stopPropagation(); return; }
    var card = e.target.closest('.pt-card');
    if (card && card === order[0] && card.dataset.project) {
      location.href = workPage + '?project=' + card.dataset.project;
    }
  }, true);

  /* keyboard: usable without a mouse */
  deck.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); throwTop(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); throwTop(-1); }
  });

  render();
})();
