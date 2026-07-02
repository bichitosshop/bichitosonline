/* ============================================================
   BICHITOS SHOP — Homepage JS (independiente, vanilla)
   ============================================================ */
(function () {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const WHATSAPP = '5492615081413';

  /* ---- Menú lateral (hamburguesa) ---- */
  const panel = $('#navPanel');
  const overlay = $('#navOverlay');
  const toggle = $('#menuToggle');

  function openNav() {
    overlay.hidden = false;
    requestAnimationFrame(() => { overlay.classList.add('on'); panel.classList.add('on'); });
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    overlay.classList.remove('on');
    panel.classList.remove('on');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => { overlay.hidden = true; }, 320);
  }
  toggle?.addEventListener('click', openNav);
  $('#navClose')?.addEventListener('click', closeNav);
  overlay?.addEventListener('click', closeNav);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && panel.classList.contains('on')) closeNav(); });

  /* ---- Badge del carrito (lee el carrito guardado) ---- */
  function syncCartBadge() {
    const badge = $('#cartBadge');
    if (!badge) return;
    let count = 0;
    try {
      const saved = JSON.parse(localStorage.getItem('bichitos_carrito') || '[]');
      if (Array.isArray(saved)) count = saved.reduce((s, i) => s + (i.cant || 0), 0);
    } catch (_) {}
    badge.textContent = count;
    badge.classList.toggle('on', count > 0);
  }
  syncCartBadge();
  window.addEventListener('storage', syncCartBadge);

  /* ---- Banner WhatsApp: confirma antes de redirigir ---- */
  $('#bannerWsp')?.addEventListener('click', function () {
    const ok = window.confirm('¿Querés que te llevemos a WhatsApp para escribirnos?');
    if (ok) {
      const msg = encodeURIComponent('¡Hola BICHITOS SHOP! 🐾 Tengo una consulta sobre sus productos.');
      window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, '_blank', 'noopener');
    }
  });

  /* ---- Sombra/hairline del header al scrollear ---- */
  const header = $('#header');
  addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', scrollY > 6);
  }, { passive: true });
})();
