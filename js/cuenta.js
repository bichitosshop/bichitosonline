/* ============================================================
   BICHITOS SHOP — Mi cuenta (perfil local + favoritos + recomendados)
   Sin backend: el perfil se guarda en localStorage de este dispositivo.
   ============================================================ */
(function () {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const KEY = 'bichitos_perfil';
  const fmt = (n) => '$' + (n || 0).toLocaleString('es-AR');
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function cargar() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (_) { return {}; } }
  function guardar(p) { localStorage.setItem(KEY, JSON.stringify(p)); }
  let perfil = cargar();

  const AVATAR_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7"/></svg>';

  function render() {
    const nombre = (perfil.nombre || '').trim();
    $('#cpHola').textContent = nombre ? `¡Hola, ${nombre}!` : '¡Hola!';
    $('#cpMail').textContent = perfil.email ? perfil.email : 'Completá tu perfil';
    $('#cpAvatar').innerHTML = nombre ? `<span class="cp-initial">${esc(nombre[0].toUpperCase())}</span>` : AVATAR_SVG;

    let favs = 0;
    try { const f = JSON.parse(localStorage.getItem('bichitos_favs') || '[]'); if (Array.isArray(f)) favs = f.length; } catch (_) {}
    $('#favsSub').textContent = favs === 1 ? '1 producto' : `${favs} productos`;

    $('#dirSub').textContent = perfil.direccion ? perfil.direccion : 'Agregar';
  }

  /* ---- Editar perfil ---- */
  function abrirForm() {
    $('#inNombre').value = perfil.nombre || '';
    $('#inMail').value = perfil.email || '';
    $('#inDir').value = perfil.direccion || '';
    $('#cpForm').hidden = false;
    $('#inNombre').focus();
  }
  function cerrarForm() { $('#cpForm').hidden = true; }

  $('#btnEditar').addEventListener('click', abrirForm);
  $('#chipDir').addEventListener('click', abrirForm);
  $('#btnCancelar').addEventListener('click', cerrarForm);
  $('#cpForm').addEventListener('submit', (e) => {
    e.preventDefault();
    perfil.nombre = $('#inNombre').value.trim();
    perfil.email = $('#inMail').value.trim();
    perfil.direccion = $('#inDir').value.trim();
    guardar(perfil);
    render();
    cerrarForm();
  });
  $('#btnCerrar').addEventListener('click', () => {
    if (confirm('¿Cerrar sesión? Se borran tus datos de perfil de este celular.')) {
      localStorage.removeItem(KEY);
      perfil = {};
      render();
    }
  });

  /* ---- Recomendados (reusa el catálogo) ---- */
  (async function reco() {
    try {
      const prods = await window.productosAPI.fetchProducts();
      const vis = prods.filter((p) => !p.oculto)
        .sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));
      const seen = new Set(), sel = [];
      for (const p of vis) {
        const k = p.grupo || p.nombre;
        if (seen.has(k)) continue;
        seen.add(k); sel.push(p);
        if (sel.length >= 4) break;
      }
      if (!sel.length) { $('#reco').closest('.cuenta-sec').hidden = true; return; }
      $('#reco').innerHTML = sel.map((p) => {
        const of = p.oferta && (+p.descuento || 0) > 0;
        const precio = of ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
        const img = p.imagen || (p.categoria === 'gatos' ? `https://loremflickr.com/200/200/cat?lock=${p.id}` : `https://placedog.net/200/200?id=${p.id}`);
        return `<a class="reco-card" href="productos.html">
          <div class="reco-img"><img src="${esc(img)}" alt="" loading="lazy" /></div>
          <p class="reco-name">${esc(p.grupo || p.nombre)}</p>
          <span class="reco-price">${fmt(precio)}</span>
        </a>`;
      }).join('');
    } catch (_) {
      const sec = $('#reco').closest('.cuenta-sec');
      if (sec) sec.hidden = true;
    }
  })();

  render();
})();
