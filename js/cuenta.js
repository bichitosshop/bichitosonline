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
  function getDirecciones(p) { if (Array.isArray(p.direcciones)) return p.direcciones.filter(Boolean); if (p.direccion) return [p.direccion]; return []; }
  let perfil = cargar();

  const N_AVATARS = 10;
  const DEFAULT_AVATAR = 1;              // foto de perfil por defecto (golden con anteojos)
  let avatarSel = perfil.avatar || DEFAULT_AVATAR;

  function render() {
    const nombre = (perfil.nombre || '').trim();
    $('#cpHola').textContent = nombre ? `¡Hola, ${nombre}!` : '¡Hola!';
    $('#cpMail').textContent = perfil.email ? perfil.email : 'Completá tu perfil';
    const avId = perfil.avatar || DEFAULT_AVATAR;   // avatar por defecto para cuentas nuevas
    $('#cpAvatar').innerHTML = `<img src="img/perfil/avatar-${avId}.png?v=2" alt="Foto de perfil" />`;

    let favs = 0;
    try { const f = JSON.parse(localStorage.getItem('bichitos_favs') || '[]'); if (Array.isArray(f)) favs = f.length; } catch (_) {}
    $('#favsSub').textContent = favs === 1 ? '1 producto' : `${favs} productos`;

    const dirs = getDirecciones(perfil);
    $('#dirSub').textContent = dirs.length ? (dirs.length === 1 ? dirs[0] : dirs.length + ' guardadas') : 'Agregar';
  }

  /* ---- direcciones (form) ---- */
  function buildDirInputs(dirs) {
    const list = (dirs && dirs.length) ? dirs : [''];
    $('#inDirs').innerHTML = list.map((d) => `
      <div class="cp-dir-row">
        <input type="text" class="cp-dir-in" placeholder="Calle, número, barrio" autocomplete="street-address" value="${esc(d)}" />
        <button type="button" class="cp-dir-del" aria-label="Quitar dirección">✕</button>
      </div>`).join('');
  }
  function leerDirecciones() {
    return [...$('#inDirs').querySelectorAll('.cp-dir-in')].map((i) => i.value.trim()).filter(Boolean);
  }

  /* ---- Selector de avatares ---- */
  function buildAvatars() {
    let html = '';
    for (let i = 1; i <= N_AVATARS; i++) {
      html += `<button type="button" class="cp-av-btn" data-av="${i}" aria-label="Foto ${i}"><img src="img/perfil/avatar-${i}.png?v=2" alt="" /></button>`;
    }
    $('#avatarGrid').innerHTML = html;
    $('#avatarGrid').addEventListener('click', (e) => {
      const b = e.target.closest('[data-av]');
      if (!b) return;
      avatarSel = +b.dataset.av;
      marcarAvatar();
    });
  }
  function marcarAvatar() {
    $('#avatarGrid').querySelectorAll('.cp-av-btn').forEach((b) => b.classList.toggle('on', +b.dataset.av === avatarSel));
  }

  /* ---- Editar perfil ---- */
  function abrirForm() {
    $('#inNombre').value = perfil.nombre || '';
    $('#inMail').value = perfil.email || '';
    buildDirInputs(getDirecciones(perfil));
    avatarSel = perfil.avatar || DEFAULT_AVATAR;
    marcarAvatar();
    $('#cpForm').hidden = false;
    document.querySelector('.cuenta-perfil').classList.add('editing');
    $('#inNombre').focus();
  }
  function cerrarForm() {
    $('#cpForm').hidden = true;
    document.querySelector('.cuenta-perfil').classList.remove('editing');
  }

  $('#btnEditar').addEventListener('click', abrirForm);
  $('#chipDir').addEventListener('click', abrirForm);
  $('#btnCancelar').addEventListener('click', cerrarForm);
  $('#btnAddDir').addEventListener('click', () => {
    const dirs = leerDirecciones();
    dirs.push('');
    buildDirInputs(dirs);
    const rows = $('#inDirs').querySelectorAll('.cp-dir-in');
    rows[rows.length - 1].focus();
  });
  $('#inDirs').addEventListener('click', (e) => {
    const del = e.target.closest('.cp-dir-del');
    if (!del) return;
    del.closest('.cp-dir-row').remove();
    if (!$('#inDirs').querySelector('.cp-dir-row')) buildDirInputs(['']);
  });
  $('#cpForm').addEventListener('submit', (e) => {
    e.preventDefault();
    perfil.nombre = $('#inNombre').value.trim();
    perfil.email = $('#inMail').value.trim();
    perfil.direcciones = leerDirecciones();
    delete perfil.direccion;
    if (avatarSel) perfil.avatar = avatarSel;
    guardar(perfil);
    render();
    cerrarForm();
  });
  $('#btnCerrar').addEventListener('click', () => {
    if (confirm('¿Cerrar sesión? Se borran tus datos de perfil de este celular.')) {
      localStorage.removeItem(KEY);
      perfil = {};
      avatarSel = DEFAULT_AVATAR;
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

  /* ---- Mis pedidos (historial de lo enviado por WhatsApp) ---- */
  function cargarPedidos() { try { const h = JSON.parse(localStorage.getItem('bichitos_pedidos') || '[]'); return Array.isArray(h) ? h : []; } catch (_) { return []; } }
  let pedidos = [];
  function renderPedidos() {
    pedidos = cargarPedidos();
    $('#pedidosSub').textContent = pedidos.length === 1 ? '1 pedido' : `${pedidos.length} pedidos`;
    const grid = $('#pedidosGrid');
    if (!pedidos.length) {
      grid.innerHTML = '<div class="pedidos-vacio">Todavía no hiciste pedidos.<br>Cuando envíes uno por WhatsApp, va a aparecer acá.</div>';
      return;
    }
    grid.innerHTML = pedidos.slice(0, 4).map((p, i) => {
      const img = (p.items && p.items[0] && p.items[0].img) || '';
      return `<button type="button" class="pedido-card" data-i="${i}">
        <div class="pedido-top">
          <div class="pedido-thumb">${img ? `<img src="${esc(img)}" alt="" loading="lazy" onerror="this.style.display='none'" />` : ''}</div>
          <svg class="pedido-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>
        </div>
        <b class="pedido-n">Pedido #${p.n}</b>
        <span class="pedido-meta">${p.count} ${p.count === 1 ? 'producto' : 'productos'} · ${esc(p.fecha)}</span>
        <span class="pedido-total">${fmt(p.total)}</span>
      </button>`;
    }).join('');
  }

  /* ---- Detalle de pedido + volver a pedir ---- */
  let pedidoActual = null;
  function abrirPedido(p) {
    pedidoActual = p;
    $('#pmTitle').textContent = `Pedido #${p.n}`;
    const items = (p.items || []).map((it) => `
      <div class="pm-item">
        <div class="pm-thumb">${it.img ? `<img src="${esc(it.img)}" alt="" onerror="this.style.display='none'" />` : ''}</div>
        <div class="pm-item-info"><p>${esc(it.nombre)}</p><small>${it.cant} × ${fmt(it.precio)}</small></div>
        <span class="pm-item-sub">${fmt(it.precio * it.cant)}</span>
      </div>`).join('');
    const dir = p.direccion ? `<div class="pm-dir"><b>Enviado a:</b> ${esc(p.direccion)}</div>` : '';
    $('#pmBody').innerHTML =
      `<p class="pm-fecha">${esc(p.fecha)}</p>${items}` +
      `<div class="pm-total"><span>Total</span><b>${fmt(p.total)}</b></div>${dir}`;
    // deshabilitar "volver a pedir" si ningún item tiene id (pedidos viejos)
    $('#pmReorder').disabled = !(p.items || []).some((it) => it.id);
    $('#pedidoModal').hidden = false;
    document.body.style.overflow = 'hidden';
    void $('#pedidoModal').offsetWidth; $('#pedidoModal').classList.add('on');
  }
  function cerrarPedido() { $('#pedidoModal').classList.remove('on'); document.body.style.overflow = ''; setTimeout(() => { $('#pedidoModal').hidden = true; }, 250); }
  function volverAPedir() {
    if (!pedidoActual) return;
    const cart = (pedidoActual.items || []).filter((it) => it.id)
      .map((it) => ({ id: it.id, nombre: it.nombre, precio: it.precio, marca: it.marca || '', cant: it.cant }));
    if (!cart.length) { location.href = 'productos.html'; return; }
    localStorage.setItem('bichitos_carrito', JSON.stringify(cart));
    location.href = 'productos.html';
  }
  $('#pedidosGrid').addEventListener('click', (e) => {
    const card = e.target.closest('.pedido-card[data-i]');
    if (card) abrirPedido(pedidos[+card.dataset.i]);
  });
  $('#pmX').addEventListener('click', cerrarPedido);
  $('#pmOverlay').addEventListener('click', cerrarPedido);
  $('#pmReorder').addEventListener('click', volverAPedir);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#pedidoModal').hidden) cerrarPedido(); });

  buildAvatars();
  render();
  renderPedidos();
})();
