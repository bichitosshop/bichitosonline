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

  /* ---- Bottom-nav: activo según la URL actual ----
     Los íconos PNG no cambian de color por CSS, así que el activo
     intercambia el src por su variante -teal. */
  function setActiveNav() {
    const path = location.pathname.split('/').pop() || 'index.html';
    const params = new URLSearchParams(location.search);
    let key = 'inicio';
    if (path === 'productos.html') {
      if (params.get('wishlist') === '1') key = 'favoritos';
      else if ((params.get('categoria') || '') === 'ofertas') key = 'ofertas';
      else key = 'categorias';
    } else if (path === 'blog.html') key = 'blog';
    else if (path === 'contacto.html') key = 'contacto';
    else if (path === 'cuenta.html') key = 'cuenta';   // no está en la bottom-nav: no resalta ninguno

    document.querySelectorAll('.bottom-nav a[data-nav]').forEach((a) => {
      const on = a.dataset.nav === key;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
      const img = a.querySelector('img');
      if (img) {
        const base = img.getAttribute('src').replace('-teal.png', '.png');
        img.setAttribute('src', on ? base.replace('.png', '-teal.png') : base);
      }
    });
  }
  setActiveNav();
})();
