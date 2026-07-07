/* ============================================================
   BICHITOS SHOP — Página de productos (mockup cards)
   Reusa window.productosAPI para los datos. Carrito en localStorage.
   ============================================================ */
(function () {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const WHATSAPP = '5492615081413';
  const KEY = 'bichitos_carrito';
  const fmt = (n) => '$' + (n || 0).toLocaleString('es-AR');
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const enOferta = (p) => !!(p.oferta && (+p.descuento || 0) > 0);
  const precioEf = (p) => enOferta(p) ? Math.round(p.precio * (1 - (+p.descuento) / 100)) : p.precio;

  let PRODUCTOS = [];
  let filtro = (new URLSearchParams(location.search).get('categoria') || 'todos').toLowerCase();
  let ofCat = 'perros';   // categoría dentro de Ofertas (perros/gatos/accesorios o 'todas')
  let q = '';
  let cart = cargarCart();
  let favs = new Set(cargarFavs());
  let wishlistMode = new URLSearchParams(location.search).get('wishlist') === '1';

  function cargarCart() { try { const c = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(c) ? c : []; } catch (_) { return []; } }
  function guardarCart() { localStorage.setItem(KEY, JSON.stringify(cart)); }
  function cargarFavs() { try { const f = JSON.parse(localStorage.getItem('bichitos_favs') || '[]'); return Array.isArray(f) ? f : []; } catch (_) { return []; } }
  function guardarFavs() { localStorage.setItem('bichitos_favs', JSON.stringify([...favs])); }

  /* ---- imágenes ---- */
  function imgFor(p) {
    if (p.imagen) return p.imagen;
    return p.categoria === 'gatos'
      ? `https://loremflickr.com/400/400/cat?lock=${p.id}`
      : `https://placedog.net/400/400?id=${p.id}`;
  }
  function imgErr(p) {
    const icon = p.categoria === 'gatos' ? 'cat' : 'dog';
    return `this.onerror=null;this.src='images/icons/${icon}.svg';this.classList.add('img-fallback')`;
  }

  /* ---- estado: variante (medida) elegida por grupo ---- */
  const selVar = new Map(); // clave de grupo -> id de la variante elegida
  const grupoKey = (p) => p.grupo || p.nombre;

  /* ---- filtro + agrupado por grupo (variantes de medida en una card) ---- */
  function visibleGroups() {
    const t = q.trim().toLowerCase();
    const map = new Map();
    for (const p of PRODUCTOS) {
      if (p.oculto) continue;                 // ocultos no aparecen en la web
      const k = grupoKey(p);
      if (!map.has(k)) map.set(k, { key: k, grupo: k, variants: [] });
      map.get(k).variants.push(p);
    }
    let groups = [...map.values()].filter((g) => {
      if (wishlistMode) return g.variants.some((v) => favs.has(v.id));
      if (filtro === 'ofertas') {
        if (!g.variants.some((v) => v.oferta)) return false;          // SOLO ofertas reales
        return ofCat === 'todas' || g.variants[0].categoria === ofCat; // filtro por categoría dentro de ofertas
      }
      if (filtro !== 'todos') return g.variants.some((v) => v.categoria === filtro);
      return true;
    }).filter((g) => {
      if (!t) return true;
      const hay = (g.grupo + ' ' + g.variants.map((v) => `${v.nombre} ${v.marca || ''}`).join(' ')).toLowerCase();
      return hay.includes(t);
    });
    groups.forEach((g) => g.variants.sort((a, b) => (parseFloat(a.medida) || 0) - (parseFloat(b.medida) || 0)));
    groups.sort((a, b) => String(a.grupo).localeCompare(String(b.grupo), 'es'));
    return groups;
  }

  /* ---- helper: reconstruir un grupo desde su clave ---- */
  function groupForKey(key) {
    const variants = PRODUCTOS.filter((x) => !x.oculto && grupoKey(x) === key)
      .sort((a, b) => (parseFloat(a.medida) || 0) - (parseFloat(b.medida) || 0));
    return variants.length ? { key, grupo: key, variants } : null;
  }
  function activeVar(g) { return g.variants.find((v) => v.id === selVar.get(g.key)) || g.variants[0]; }

  /* ---- render cards ---- */
  // Solo el interior de .pcard-body (lo que cambia al interactuar; la imagen NO se toca)
  function cardBodyHTML(g, p) {
    const vs = g.variants;
    const multi = vs.length > 1;
    const cant = (cart.find((i) => i.id === p.id) || {}).cant || 0;
    const sinStock = p.stock === 0 || p.agotado;
    const title = multi ? g.grupo : p.nombre;
    const sub = multi ? (p.marca || '') : (p.descripcion || p.marca || '');

    const sizes = multi ? `
        <div class="pcard-sizes" role="group" aria-label="Elegí el tamaño">
          ${vs.map((v) => `<button class="pcard-size${v.id === p.id ? ' on' : ''}" data-size="${v.id}">${esc(v.medida || '—')}</button>`).join('')}
        </div>` : '';

    let footer;
    if (sinStock) {
      footer = '<span class="pcard-add" style="background:#eee;color:#999;cursor:default">Sin stock</span>';
    } else if (cant > 0) {
      footer = `
        <div class="pcard-cart">
          <div class="pcard-qty">
            <button data-q="-1" data-id="${p.id}" aria-label="Restar">−</button>
            <span class="pcard-qn">${cant}</span>
            <button data-q="1" data-id="${p.id}" aria-label="Sumar">+</button>
          </div>
          <button class="pcard-trash" data-del="${p.id}" aria-label="Quitar del pedido">
            <img src="img/icons/ic-trash.png" alt="" />
          </button>
        </div>
        <div class="pcard-subtotal">Subtotal: <b>${fmt(precioEf(p) * cant)}</b></div>`;
    } else {
      footer = `<button class="pcard-add" data-add="${p.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/><path d="M3 4h2l2.2 11.2a1 1 0 0 0 1 .8h8.3a1 1 0 0 0 1-.8L20 7.5H6"/></svg>
          Agregar al carrito
        </button>`;
    }
    const priceBlock = enOferta(p)
      ? `<span class="pcard-pricewrap"><span class="pcard-oldprice">${fmt(p.precio)}</span><span class="pcard-price">${fmt(precioEf(p))}</span></span>`
      : `<span class="pcard-price">${fmt(p.precio)}</span>`;
    return `
        <p class="pcard-name">${esc(title)}</p>
        <span class="pcard-sub">${esc(sub)}</span>
        ${sizes}
        ${priceBlock}
        ${footer}`;
  }

  // Etiqueta de la esquina: -X% si la variante activa tiene descuento, sino OFERTA si hay alguna oferta
  function flagFor(g, p) {
    if (enOferta(p)) return '-' + (+p.descuento) + '%';
    return g.variants.some((v) => v.oferta) ? 'OFERTA' : '';
  }

  function cardHTML(g) {
    const p = activeVar(g);
    const cant = (cart.find((i) => i.id === p.id) || {}).cant || 0;
    const flag = flagFor(g, p);
    const favOn = favs.has(p.id) ? ' on' : '';
    return `
    <article class="pcard${cant > 0 ? ' in-cart' : ''}" data-id="${p.id}" data-gkey="${esc(g.key)}">
      <div class="pcard-img" data-zoom="${esc(imgFor(p))}">
        ${flag ? `<span class="pcard-flag">${flag}</span>` : ''}
        <button class="pcard-fav${favOn}" data-fav="${p.id}" aria-label="Favorito">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 5.6a5.4 5.4 0 0 0-7.7 0L12 6.7l-1.1-1.1a5.4 5.4 0 1 0-7.7 7.7L12 22l8.8-8.7a5.4 5.4 0 0 0 0-7.7z"/></svg>
        </button>
        <img src="${imgFor(p)}" alt="${esc(p.nombre)}" loading="lazy" width="400" height="400" onerror="${imgErr(p)}" />
      </div>
      <div class="pcard-body">${cardBodyHTML(g, p)}</div>
    </article>`;
  }

  // Actualiza UNA card en el lugar (sin recrear la imagen ni tocar el resto de la grilla)
  function refreshCard(card) {
    if (!card) return;
    const g = groupForKey(card.dataset.gkey);
    if (!g) return;
    const p = activeVar(g);
    const cant = (cart.find((i) => i.id === p.id) || {}).cant || 0;
    card.classList.toggle('in-cart', cant > 0);
    card.dataset.id = p.id;
    const fav = card.querySelector('.pcard-fav');
    if (fav) { fav.dataset.fav = p.id; fav.classList.toggle('on', favs.has(p.id)); }
    const box = card.querySelector('.pcard-img');
    if (box) {
      box.dataset.zoom = imgFor(p);
      // la etiqueta -X% / OFERTA puede cambiar según la medida elegida
      const txt = flagFor(g, p);
      let flagEl = box.querySelector('.pcard-flag');
      if (txt) {
        if (!flagEl) { flagEl = document.createElement('span'); flagEl.className = 'pcard-flag'; box.insertBefore(flagEl, box.firstChild); }
        flagEl.textContent = txt;
      } else if (flagEl) { flagEl.remove(); }
    }
    card.querySelector('.pcard-body').innerHTML = cardBodyHTML(g, p);
  }
  function syncAllCards() { document.querySelectorAll('.pcard').forEach(refreshCard); }

  /* ---- zoom de imagen (tocar para agrandar, tocar de nuevo para cerrar) ---- */
  function openZoom(src, alt) {
    let z = document.getElementById('pzoom');
    if (!z) {
      z = document.createElement('div');
      z.id = 'pzoom'; z.className = 'pzoom';
      z.innerHTML = '<img alt="" />';
      z.addEventListener('click', closeZoom);
      document.body.appendChild(z);
    }
    const im = z.querySelector('img');
    im.src = src; im.alt = alt || '';
    document.body.style.overflow = 'hidden';
    void z.offsetWidth;              // fuerza reflow para que la transición dispare
    z.classList.add('on');
  }
  function closeZoom() {
    const z = document.getElementById('pzoom');
    if (z) z.classList.remove('on');
    document.body.style.overflow = '';
  }

  function render() {
    const esOfertas = filtro === 'ofertas' && !wishlistMode;
    document.body.classList.toggle('is-ofertas', esOfertas);
    const groups = visibleGroups();
    const titulo = wishlistMode ? 'Favoritos' : ({ perros: 'Perros', gatos: 'Gatos', ofertas: 'Ofertas', todos: 'Todos los productos' }[filtro] || 'Productos');
    $('#catTitle').textContent = titulo;
    $('#catCount').textContent = `${groups.length} ${groups.length === 1 ? 'producto' : 'productos'}`;
    const vacio = esOfertas
      ? '<div class="prod-empty"><b>No hay ofertas en esta categoría</b>Probá con otra categoría o mirá todas las ofertas.</div>'
      : '<div class="prod-empty"><b>No encontramos nada</b>Probá con otra palabra o cambiá la categoría.</div>';
    $('#grid').innerHTML = groups.length ? groups.map(cardHTML).join('') : vacio;
    document.querySelectorAll('#mainPills .fpill').forEach((b) => b.classList.toggle('act', b.dataset.cat === filtro));
    document.querySelectorAll('#ofertasPills .fpill').forEach((b) => b.classList.toggle('act', b.dataset.ofcat === ofCat));
  }

  /* ---- carrito ---- */
  function addCart(id, card) {
    const it = cart.find((i) => i.id === id);
    if (it) it.cant++;
    else {
      const p = PRODUCTOS.find((x) => x.id === id);
      if (!p) return;
      cart.push({ id: p.id, nombre: p.nombre, precio: precioEf(p), marca: p.marca || '', cant: 1 });
    }
    guardarCart();
    if (card) refreshCard(card); else syncAllCards();
    syncBar(); if ($('#sheet').classList.contains('on')) renderSheet();
  }
  function setQty(id, d, card) {
    const it = cart.find((i) => i.id === id);
    if (!it) return;
    it.cant += d;
    if (it.cant <= 0) cart = cart.filter((i) => i.id !== id);
    guardarCart();
    if (card) refreshCard(card);
    syncBar(); if ($('#sheet').classList.contains('on')) renderSheet();
  }
  function totales() { return cart.reduce((a, i) => { a.n += i.cant; a.t += i.precio * i.cant; return a; }, { n: 0, t: 0 }); }

  function syncBar() {
    const { n, t } = totales();
    const badge = $('#cartBadge');
    if (badge) { badge.textContent = n; badge.classList.toggle('on', n > 0); }
    $('#orderBar').classList.toggle('on', n > 0);
    document.body.classList.toggle('has-order-bar', n > 0);
    $('#barCount').textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
    $('#barTotal').textContent = fmt(t);
  }

  /* ---- sheet ticket ---- */
  function renderSheet() {
    const ls = [...cart].sort((a, b) => String(a.nombre).localeCompare(String(b.nombre), 'es'));
    const vacio = ls.length === 0;
    $('#ticketBox').hidden = vacio;
    $('#sheetEmpty').hidden = !vacio;
    $('#sheetWa').style.display = vacio ? 'none' : 'flex';
    $('#tItems').innerHTML = ls.map((i) => `
      <div class="titem">
        <div class="titem-mini" data-id="${i.id}">
          <button data-q="-1" aria-label="Quitar uno">−</button>
          <span class="titem-q">${i.cant}</span>
          <button data-q="1" aria-label="Sumar uno">+</button>
        </div>
        <div class="titem-info"><p>${esc(i.nombre)}</p><small>${fmt(i.precio)} c/u</small></div>
        <span class="titem-sub">${fmt(i.precio * i.cant)}</span>
      </div>`).join('');
    $('#tTotal').textContent = fmt(totales().t);
    $('#sheetWa').href = waLink(ls);
  }
  function waLink(ls) {
    const cuerpo = ls.map((i) => `• ${i.cant}× ${i.nombre} — ${fmt(i.precio * i.cant)}`).join('\n');
    const msg = `¡Hola BICHITOS SHOP! 🐾 Quiero hacer este pedido:\n\n${cuerpo}\n\nTotal: ${fmt(totales().t)}\n\n¿Cómo coordinamos la entrega?`;
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  }
  function openSheet() { renderSheet(); $('#sheet').classList.add('on'); $('#sheetOverlay').classList.add('on'); }
  function closeSheet() { $('#sheet').classList.remove('on'); $('#sheetOverlay').classList.remove('on'); syncAllCards(); }
  function removeItem(id, card) { cart = cart.filter((i) => i.id !== id); guardarCart(); if (card) refreshCard(card); else syncAllCards(); syncBar(); if ($('#sheet').classList.contains('on')) renderSheet(); }

  /* ---- eventos ---- */
  document.addEventListener('click', (e) => {
    const size = e.target.closest('[data-size]');
    if (size) {
      const id = parseInt(size.dataset.size);
      const p = PRODUCTOS.find((x) => x.id === id);
      if (p) { selVar.set(grupoKey(p), id); refreshCard(size.closest('.pcard')); }
      return;
    }
    const cardQ = e.target.closest('.pcard-qty [data-q]');
    if (cardQ) { setQty(parseInt(cardQ.dataset.id), parseInt(cardQ.dataset.q), cardQ.closest('.pcard')); return; }
    const del = e.target.closest('[data-del]');
    if (del) { removeItem(parseInt(del.dataset.del), del.closest('.pcard')); return; }
    const add = e.target.closest('[data-add]');
    if (add) { addCart(parseInt(add.dataset.add), add.closest('.pcard')); return; }
    const fav = e.target.closest('[data-fav]');
    if (fav) {
      const id = parseInt(fav.dataset.fav);
      if (favs.has(id)) favs.delete(id); else favs.add(id);
      guardarFavs();
      if (wishlistMode) render(); else fav.classList.toggle('on');
      return;
    }
    // tocar la imagen → agrandar
    const zoom = e.target.closest('.pcard-img img');
    if (zoom) { const box = zoom.closest('.pcard-img'); openZoom(box ? box.dataset.zoom : zoom.src, zoom.alt); return; }
    // botones "Ver todas las ofertas" (banner superior + inferior) → todas las categorías juntas
    const verTodas = e.target.closest('[data-oferta-todas]');
    if (verTodas) { filtro = 'ofertas'; wishlistMode = false; ofCat = 'todas'; q = ''; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    // pills de categoría DENTRO de ofertas (perros/gatos/accesorios, sin "todos")
    const ofPill = e.target.closest('[data-ofcat]');
    if (ofPill) { ofCat = ofPill.dataset.ofcat; render(); return; }
    const pill = e.target.closest('.fpill[data-cat]');
    if (pill) { filtro = pill.dataset.cat; wishlistMode = false; q = ''; const b = $('#buscador'); if (b) b.value = ''; render(); return; }
    const mini = e.target.closest('.titem-mini [data-q]');
    if (mini) { setQty(parseInt(mini.closest('.titem-mini').dataset.id), parseInt(mini.dataset.q)); return; }
    if (e.target.closest('#orderBar') || e.target.closest('#openCart')) { openSheet(); return; }
    if (e.target.closest('#sheetClose') || e.target.closest('#sheetOverlay')) { closeSheet(); return; }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeZoom(); closeSheet(); } });

  const buscador = $('#buscador');
  if (buscador) buscador.addEventListener('input', (e) => { q = e.target.value; render(); });

  function primeraCatOferta() {
    for (const c of ['perros', 'gatos', 'accesorios']) {
      if (PRODUCTOS.some((p) => p.oferta && p.categoria === c)) return c;
    }
    return 'perros';
  }

  /* ---- init ---- */
  (async function init() {
    try {
      PRODUCTOS = await window.productosAPI.fetchProducts();
    } catch (err) {
      $('#grid').innerHTML = '<div class="prod-empty"><b>No pudimos cargar los productos</b>Probá recargar la página.</div>';
      return;
    }
    if (filtro === 'ofertas' && !wishlistMode) ofCat = primeraCatOferta();
    render(); syncBar();
  })();
})();
