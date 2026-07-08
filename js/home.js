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

  /* ---- Popup de bienvenida: crear cuenta rápida (sin contraseña) ---- */
  (function welcomePopup() {
    const KEY = 'bichitos_perfil', SEEN = 'bichitos_bienvenida';
    let perfil = {};
    try { perfil = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (_) {}
    if ((perfil.nombre && perfil.nombre.trim()) || localStorage.getItem(SEEN)) return; // ya tiene cuenta o ya lo vio
    const escT = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    const el = document.createElement('div');
    el.className = 'welcome-pop';
    el.innerHTML =
      '<div class="welcome-card" role="dialog" aria-label="Bienvenido a BICHITOS SHOP">' +
        '<button class="welcome-x" aria-label="Cerrar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 5l14 14M19 5 5 19"/></svg></button>' +
        '<img class="welcome-pet" src="img/perfil/avatar-1.png?v=2" alt="" />' +
        '<h2>¡Bienvenido a BICHITOS SHOP! 🐾</h2>' +
        '<p>Creá tu cuenta en 10 segundos y hacé tus pedidos más rápido. Sin contraseña.</p>' +
        '<form class="welcome-form" novalidate>' +
          '<input type="text" id="wpNombre" placeholder="Tu nombre" autocomplete="name" />' +
          '<input type="email" id="wpMail" placeholder="Tu email (opcional)" autocomplete="email" />' +
          '<button type="submit" class="welcome-crear">Crear mi cuenta</button>' +
        '</form>' +
        '<button class="welcome-skip">Ahora no</button>' +
      '</div>';
    document.body.appendChild(el);
    void el.offsetWidth; el.classList.add('on');   // reflow forzado (dispara la transición)

    function cerrar() { el.classList.remove('on'); localStorage.setItem(SEEN, '1'); setTimeout(() => el.remove(), 320); }
    el.querySelector('.welcome-x').addEventListener('click', cerrar);
    el.querySelector('.welcome-skip').addEventListener('click', cerrar);
    el.querySelector('.welcome-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = el.querySelector('#wpNombre').value.trim();
      if (!nombre) { el.querySelector('#wpNombre').focus(); return; }
      perfil.nombre = nombre;
      const mail = el.querySelector('#wpMail').value.trim();
      if (mail) perfil.email = mail;
      if (!perfil.avatar) perfil.avatar = 1;              // avatar por defecto
      localStorage.setItem(KEY, JSON.stringify(perfil));
      localStorage.setItem(SEEN, '1');
      el.querySelector('.welcome-card').innerHTML =
        '<img class="welcome-pet" src="img/perfil/avatar-1.png?v=2" alt="" />' +
        '<h2>¡Listo, ' + escT(nombre) + '! 🐾</h2>' +
        '<p>Tu cuenta ya está creada. Podés cambiar tu foto y datos cuando quieras.</p>' +
        '<a class="welcome-crear" href="cuenta.html">Ver mi cuenta</a>';
      setTimeout(cerrar, 3000);
    });
  })();
})();
