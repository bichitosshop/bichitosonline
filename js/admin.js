/* ============================================================
   BICHITOS SHOP — Panel administrador (mobile-first)
   Login "coquito" · precio por costo+% · variantes por card ·
   subir foto de la galería → link · ofertas · ocultar · undo ·
   marcador verde de precio actualizado · publicar a GitHub.
   ============================================================ */
(function () {
  'use strict';

  /* ---- Config GitHub (mismo repo que la web) ---- */
  const GITHUB_OWNER = 'bichitosshop';
  const GITHUB_REPO = 'bichitosonline';
  const GITHUB_BRANCH = 'main';
  const TOKEN_KEY = 'bichitos_gh_token';
  const PASS = 'coquito';
  const MAX_UNDO = 40;

  /* ---- Utilidades ---- */
  const $ = (s) => document.querySelector(s);
  const fmt = (n) => '$' + Math.round(n || 0).toLocaleString('es-AR');
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const hoy = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const fechaCorta = (iso) => { if (!iso) return ''; const [y, m, d] = iso.split('-'); return d + '/' + m; };
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const grupoKey = (p) => p.grupo || p.nombre;
  const num = (v) => { const n = parseFloat(String(v).replace(',', '.')); return isNaN(n) ? 0 : n; };

  function precioFinal(v) {
    const c = num(v.costo), g = num(v.ganancia);
    if (c > 0) return Math.round(c * (1 + g / 100));
    return Math.round(num(v.precio));
  }

  /* ---- Estado ---- */
  let productos = [];      // copia de trabajo
  let baseline = [];       // último estado publicado
  let historial = [];      // pila de deshacer (snapshots)
  let filtro = 'todos';
  let q = '';
  let token = localStorage.getItem(TOKEN_KEY) || '';
  let editandoKey = null;  // grupo en edición ('__nuevo__' para alta)

  /* ============================================================
     TOAST
     ============================================================ */
  let toastT;
  function toast(msg, tipo) {
    const el = $('#toast');
    el.textContent = msg;
    el.className = 'adm-toast show ' + (tipo || 'info');
    clearTimeout(toastT);
    toastT = setTimeout(() => { el.className = 'adm-toast'; }, tipo === 'error' ? 5000 : 2800);
  }

  /* ============================================================
     LOGIN
     ============================================================ */
  function mostrarApp() { $('#loginScreen').hidden = true; $('#app').hidden = false; }
  function intentarLogin() {
    const val = ($('#pass').value || '').trim().toLowerCase();
    if (val === PASS) {
      sessionStorage.setItem('bichitos_admin_ok', '1');
      mostrarApp();
      cargarDatos();
    } else {
      $('#loginCard').classList.remove('shake'); void $('#loginCard').offsetWidth;
      $('#loginCard').classList.add('shake');
      $('#loginErr').hidden = false;
      $('#pass').value = '';
    }
  }

  /* ============================================================
     CARGA DE DATOS
     ============================================================ */
  async function cargarDatos() {
    $('#lista').innerHTML = '<div class="adm-cargando">Cargando productos…</div>';
    try {
      const res = await fetch('productos.json?cb=' + Date.now());
      const data = await res.json();
      productos = Array.isArray(data) ? data : (data.productos || []);
      // asegurar campos nuevos
      productos.forEach((p) => {
        if (p.grupo == null) p.grupo = p.nombre;
        if (p.medida == null) p.medida = '';
        if (p.costo == null) p.costo = 0;
        if (p.ganancia == null) p.ganancia = 0;
        if (p.oculto == null) p.oculto = false;
        if (p.precio_actualizado == null) p.precio_actualizado = '';
        if (p.actualizado == null) p.actualizado = '';
      });
      baseline = clone(productos);
      historial = [];
      render();
    } catch (err) {
      $('#lista').innerHTML = '<div class="adm-cargando">No se pudieron cargar los productos.<br>Revisá tu conexión y recargá.</div>';
    }
  }

  /* ============================================================
     UNDO
     ============================================================ */
  function snapshot() {
    historial.push(clone(productos));
    if (historial.length > MAX_UNDO) historial.shift();
    actualizarUndo();
  }
  function deshacer() {
    if (!historial.length) return;
    productos = historial.pop();
    actualizarUndo();
    render();
    toast('Cambio revertido', 'info');
  }
  function actualizarUndo() {
    const fab = $('#undoFab');
    fab.hidden = historial.length === 0;
    $('#undoCount').textContent = historial.length;
  }

  /* ============================================================
     AGRUPADO + FILTRO (para la lista del admin)
     ============================================================ */
  function grupos() {
    const t = q.trim().toLowerCase();
    const map = new Map();
    for (const p of productos) {
      const k = grupoKey(p);
      if (!map.has(k)) map.set(k, { key: k, variants: [] });
      map.get(k).variants.push(p);
    }
    let gs = [...map.values()];
    gs.forEach((g) => g.variants.sort((a, b) => (parseFloat(a.medida) || 0) - (parseFloat(b.medida) || 0)));
    gs = gs.filter((g) => {
      if (filtro === 'ofertas') return g.variants.some((v) => v.oferta);
      if (filtro === 'ocultos') return g.variants.some((v) => v.oculto);
      if (filtro === 'sincosto') return g.variants.some((v) => !(num(v.costo) > 0));
      if (filtro === 'perros' || filtro === 'gatos' || filtro === 'accesorios') return g.variants.some((v) => (v.categoria || '') === filtro);
      return true;
    });
    if (t) gs = gs.filter((g) => {
      const hay = (g.key + ' ' + g.variants.map((v) => `${v.nombre} ${v.marca || ''} ${v.medida || ''}`).join(' ')).toLowerCase();
      return hay.includes(t);
    });
    gs.sort((a, b) => String(a.key).localeCompare(String(b.key), 'es'));
    return gs;
  }

  /* ============================================================
     RENDER LISTA
     ============================================================ */
  function imgThumb(p) {
    if (p.imagen) return p.imagen;
    return p.categoria === 'gatos' ? 'https://loremflickr.com/200/200/cat?lock=' + p.id : 'https://placedog.net/200/200?id=' + p.id;
  }

  function cardGrupo(g) {
    const vs = g.variants;
    const p0 = vs[0];
    const multi = vs.length > 1;
    const precios = vs.map(precioFinal);
    const min = Math.min(...precios), max = Math.max(...precios);
    const precioTxt = multi && min !== max ? ('desde ' + fmt(min)) : fmt(min);
    const cambioHoy = vs.some((v) => v.precio_actualizado === hoy());
    const oculto = vs.every((v) => v.oculto) && vs.length > 0;
    const oferta = vs.some((v) => v.oferta);
    const ultima = vs.map((v) => v.actualizado || v.precio_actualizado).filter(Boolean).sort().pop();
    const sinCosto = vs.some((v) => !(num(v.costo) > 0));

    const chips = [];
    if (oferta) chips.push('<span class="adm-chip chip-of">Oferta</span>');
    if (oculto) chips.push('<span class="adm-chip chip-oc">Oculto</span>');
    if (sinCosto) chips.push('<span class="adm-chip chip-sc">Falta costo</span>');

    const medidas = multi
      ? `<div class="adm-card-medidas">${vs.map((v) => `<span>${esc(v.medida || '—')} · ${fmt(precioFinal(v))}</span>`).join('')}</div>`
      : '';

    return `
    <article class="adm-card${cambioHoy ? ' verde' : ''}${oculto ? ' es-oculto' : ''}" data-key="${esc(g.key)}">
      ${ultima ? `<span class="adm-card-fecha">✎ ${fechaCorta(ultima)}</span>` : ''}
      <div class="adm-card-top">
        <img class="adm-card-img" src="${esc(imgThumb(p0))}" alt="" loading="lazy" onerror="this.style.visibility='hidden'" />
        <div class="adm-card-info">
          <p class="adm-card-nom">${esc(g.key)}</p>
          <p class="adm-card-marca">${esc(p0.marca || '')}${multi ? ' · ' + vs.length + ' medidas' : ''}</p>
          <p class="adm-card-precio">${precioTxt}</p>
          ${chips.length ? `<div class="adm-card-chips">${chips.join('')}</div>` : ''}
        </div>
      </div>
      ${medidas}
      <div class="adm-card-acc">
        <button class="adm-btn adm-btn-edit" data-edit="${esc(g.key)}">Editar</button>
        <button class="adm-btn adm-btn-ghost" data-toggle-oc="${esc(g.key)}">${oculto ? 'Mostrar' : 'Ocultar'}</button>
      </div>
    </article>`;
  }

  function render() {
    const gs = grupos();
    $('#lista').innerHTML = gs.length
      ? gs.map(cardGrupo).join('')
      : '<div class="adm-cargando">No hay productos con ese filtro.</div>';
    // contador
    const totalGrupos = new Set(productos.map(grupoKey)).size;
    $('#contador').textContent = gs.length + ' de ' + totalGrupos;
    // barra publicar
    const cambios = contarCambios();
    const bar = $('#publicarBar');
    bar.hidden = cambios === 0;
    $('#publicarTxt').textContent = cambios === 1 ? '1 cambio sin publicar' : cambios + ' cambios sin publicar';
    document.body.classList.toggle('con-publicar', cambios > 0);
    // filtros activos
    document.querySelectorAll('.adm-fpill').forEach((b) => b.classList.toggle('on', b.dataset.f === filtro));
    actualizarUndo();
  }

  function contarCambios() {
    // cuenta productos que difieren del baseline (por id)
    const base = new Map(baseline.map((p) => [p.id, JSON.stringify(p)]));
    let n = 0;
    const vistos = new Set();
    for (const p of productos) {
      vistos.add(p.id);
      if (base.get(p.id) !== JSON.stringify(p)) n++;
    }
    for (const p of baseline) if (!vistos.has(p.id)) n++; // eliminados
    return n;
  }

  /* ============================================================
     ACCIONES RÁPIDAS EN LA LISTA
     ============================================================ */
  function toggleOculto(key) {
    const vs = productos.filter((p) => grupoKey(p) === key);
    if (!vs.length) return;
    const nuevo = !vs.every((v) => v.oculto);
    snapshot();
    vs.forEach((v) => { v.oculto = nuevo; v.actualizado = hoy(); });
    render();
    toast(nuevo ? 'Producto ocultado del catálogo' : 'Producto visible de nuevo', 'ok');
  }

  /* ============================================================
     EDITOR DE PRODUCTO (una card = un grupo con variantes)
     ============================================================ */
  function nuevaId() { return (productos.reduce((m, p) => Math.max(m, +p.id || 0), 0) + 1); }

  function abrirEditor(key) {
    editandoKey = key;
    let vs;
    if (key === '__nuevo__') {
      vs = [{ id: nuevaId(), nombre: '', grupo: '', marca: '', categoria: 'perros', etapa: 'adulto', medida: '', costo: 0, ganancia: 0, precio: 0, imagen: '', descripcion: '', destacado: false, oferta: false, envio_gratis: false, oculto: false, stock: 10, precio_actualizado: '', actualizado: '' }];
    } else {
      vs = clone(productos.filter((p) => grupoKey(p) === key)).sort((a, b) => (parseFloat(a.medida) || 0) - (parseFloat(b.medida) || 0));
    }
    const p0 = vs[0];
    $('#edTitulo').textContent = key === '__nuevo__' ? 'Nuevo producto' : 'Editar producto';
    $('#edGrupo').value = key === '__nuevo__' ? '' : (p0.grupo || '');
    $('#edMarca').value = p0.marca || '';
    $('#edCategoria').value = p0.categoria || 'perros';
    setEditorImg(p0.imagen || '');
    $('#btnEliminar').style.display = key === '__nuevo__' ? 'none' : '';
    renderVariantes(vs);
    const ed = $('#editor');
    ed.hidden = false;
    requestAnimationFrame(() => ed.classList.add('on'));
    ed.querySelector('.adm-ed-scroll').scrollTop = 0;
  }

  function cerrarEditor() {
    const ed = $('#editor');
    ed.classList.remove('on');
    setTimeout(() => { ed.hidden = true; }, 300);
  }

  let editorImg = '';
  function setEditorImg(url) {
    editorImg = url || '';
    const box = $('#edImgBox');
    if (editorImg) {
      box.innerHTML = `<img src="${esc(editorImg)}" alt="" /><span class="adm-img-ok">Foto cargada</span>`;
    } else {
      box.innerHTML = '<span class="adm-img-vacia">Sin foto</span>';
    }
  }

  function varRowHTML(v) {
    const pf = precioFinal(v);
    const auto = num(v.costo) > 0;
    return `
    <div class="adm-var" data-id="${v.id}">
      <div class="adm-var-head">
        <input class="adm-inp v-medida" placeholder="Medida (ej: 8 Kg)" value="${esc(v.medida || '')}" />
        <button class="adm-var-del" data-delvar="${v.id}" aria-label="Quitar medida" title="Quitar esta medida">✕</button>
      </div>
      <div class="adm-var-precios">
        <label class="adm-field">
          <span>Costo</span>
          <input class="adm-inp v-costo" type="number" inputmode="decimal" min="0" placeholder="0" value="${v.costo ? v.costo : ''}" />
        </label>
        <label class="adm-field">
          <span>Ganancia %</span>
          <input class="adm-inp v-ganancia" type="number" inputmode="decimal" min="0" placeholder="0" value="${v.ganancia ? v.ganancia : ''}" />
        </label>
        <div class="adm-field">
          <span>Precio final</span>
          <div class="v-precio ${auto ? 'auto' : 'manual'}">${fmt(pf)}</div>
        </div>
      </div>
      <label class="adm-field adm-field-manual" ${auto ? 'hidden' : ''}>
        <span>Precio a mano (si no cargás costo)</span>
        <input class="adm-inp v-precman" type="number" inputmode="decimal" min="0" placeholder="0" value="${!auto && v.precio ? v.precio : ''}" />
      </label>
      <label class="adm-check">
        <input type="checkbox" class="v-oferta" ${v.oferta ? 'checked' : ''} />
        <span>Mostrar en <b>Ofertas</b></span>
      </label>
    </div>`;
  }

  function renderVariantes(vs) {
    $('#variantes').innerHTML = vs.map(varRowHTML).join('');
    $('#variantes').dataset.count = vs.length;
  }

  // recalcular precio en vivo dentro del editor
  function recalcVar(row) {
    const costo = num(row.querySelector('.v-costo').value);
    const gan = num(row.querySelector('.v-ganancia').value);
    const man = num(row.querySelector('.v-precman').value);
    const auto = costo > 0;
    const pf = auto ? Math.round(costo * (1 + gan / 100)) : Math.round(man);
    const el = row.querySelector('.v-precio');
    el.textContent = fmt(pf);
    el.className = 'v-precio ' + (auto ? 'auto' : 'manual');
    row.querySelector('.adm-field-manual').hidden = auto;
  }

  function leerEditor() {
    const grupo = $('#edGrupo').value.trim();
    const marca = $('#edMarca').value.trim();
    const categoria = $('#edCategoria').value;
    const rows = [...$('#variantes').querySelectorAll('.adm-var')];
    const vs = rows.map((row) => {
      const id = +row.dataset.id;
      const medida = row.querySelector('.v-medida').value.trim();
      const costo = num(row.querySelector('.v-costo').value);
      const ganancia = num(row.querySelector('.v-ganancia').value);
      const precman = num(row.querySelector('.v-precman').value);
      const oferta = row.querySelector('.v-oferta').checked;
      return { id, medida, costo, ganancia, precman, oferta };
    });
    return { grupo, marca, categoria, vs };
  }

  function guardarProducto() {
    const d = leerEditor();
    if (!d.grupo) { toast('Ponele un nombre al producto', 'error'); $('#edGrupo').focus(); return; }
    if (!d.vs.length) { toast('Agregá al menos una medida', 'error'); return; }

    snapshot();
    const key = editandoKey;
    // base previa (para conservar campos no editados)
    const previos = new Map(productos.filter((p) => grupoKey(p) === key).map((p) => [p.id, p]));
    const idsNuevos = new Set(d.vs.map((v) => v.id));

    const compuestos = d.vs.map((v) => {
      const prev = previos.get(v.id) || { id: v.id, categoria: d.categoria, etapa: 'adulto', descripcion: '', destacado: false, envio_gratis: false, oculto: false, stock: 10, precio_actualizado: '', actualizado: '' };
      const nuevoPrecio = v.costo > 0 ? Math.round(v.costo * (1 + v.ganancia / 100)) : Math.round(v.precman);
      const precioCambio = Math.round(prev.precio || 0) !== nuevoPrecio;
      return Object.assign({}, prev, {
        id: v.id,
        grupo: d.grupo,
        marca: d.marca,
        categoria: d.categoria,
        medida: v.medida,
        nombre: v.medida ? (d.grupo + ' x ' + v.medida) : d.grupo,
        costo: v.costo,
        ganancia: v.ganancia,
        precio: nuevoPrecio,
        oferta: v.oferta,
        imagen: editorImg,
        precio_actualizado: precioCambio ? hoy() : (prev.precio_actualizado || ''),
        actualizado: hoy(),
      });
    });

    // reemplazar en productos: quitar los del grupo viejo + los que ya no están, agregar compuestos
    productos = productos.filter((p) => grupoKey(p) !== key || idsNuevos.has(p.id));
    // quitar los viejos del grupo que fueron reemplazados (por id)
    productos = productos.filter((p) => !compuestos.some((c) => c.id === p.id));
    productos.push(...compuestos);

    render();
    cerrarEditor();
    toast('Producto guardado', 'ok');
  }

  function eliminarProducto() {
    if (editandoKey === '__nuevo__') { cerrarEditor(); return; }
    const g = editandoKey;
    if (!confirm('¿Eliminar este producto y todas sus medidas? Esta acción no se puede deshacer una vez publicada.')) return;
    snapshot();
    productos = productos.filter((p) => grupoKey(p) !== g);
    render();
    cerrarEditor();
    toast('Producto eliminado', 'ok');
  }

  /* ---- subir imagen desde la galería ---- */
  function comprimir(file, maxPx, calidad) {
    maxPx = maxPx || 900; calidad = calidad || 0.82;
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = function () {
        let w = img.width, h = img.height;
        if (w > maxPx || h > maxPx) { if (w >= h) { h = Math.round(h * maxPx / w); w = maxPx; } else { w = Math.round(w * maxPx / h); h = maxPx; } }
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        c.toBlob(resolve, 'image/jpeg', calidad);
      };
      img.src = url;
    });
  }
  function blobBase64(blob) {
    return new Promise((resolve) => { const r = new FileReader(); r.onload = (e) => resolve(e.target.result.split(',')[1]); r.readAsDataURL(blob); });
  }
  function ghFetch(path, opts) {
    opts = opts || {};
    return fetch('https://api.github.com/repos/' + GITHUB_OWNER + '/' + GITHUB_REPO + '/contents/' + path,
      Object.assign({}, opts, { headers: Object.assign({ Authorization: 'Bearer ' + token, 'Content-Type': 'application/json', Accept: 'application/vnd.github+json' }, opts.headers || {}) }));
  }

  async function subirImagen(file) {
    if (!(await asegurarToken())) return;
    const box = $('#edImgBox');
    box.classList.add('subiendo');
    box.innerHTML = '<span class="adm-img-vacia">Subiendo foto…</span>';
    try {
      const blob = await comprimir(file, 900, 0.82);
      const base64 = await blobBase64(blob);
      const filename = 'prod_' + Date.now() + '.jpg';
      const ghPath = 'images/productos/' + filename;
      const res = await ghFetch(ghPath, { method: 'PUT', body: JSON.stringify({ message: 'Foto producto: ' + filename, content: base64, branch: GITHUB_BRANCH }) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message || ('GitHub ' + res.status)); }
      const url = 'https://' + GITHUB_OWNER + '.github.io/' + GITHUB_REPO + '/' + ghPath;
      box.classList.remove('subiendo');
      setEditorImg(url);
      toast('Foto lista (se ve online en ~1 min)', 'ok');
    } catch (err) {
      box.classList.remove('subiendo');
      setEditorImg(editorImg);
      toast('No se pudo subir la foto: ' + err.message, 'error');
    }
  }

  /* ============================================================
     PUBLICAR A GITHUB (productos.json)
     ============================================================ */
  function asegurarToken() {
    return new Promise((resolve) => {
      if (token) { resolve(true); return; }
      $('#tokenModal').hidden = false;
      $('#tokenInput').value = '';
      $('#tokenInput').focus();
      tokenResolve = resolve;
    });
  }
  let tokenResolve = null;
  function guardarToken() {
    const val = $('#tokenInput').value.trim();
    if (!val.startsWith('ghp_') && !val.startsWith('github_pat_')) { toast('El token empieza con ghp_ o github_pat_', 'error'); return; }
    token = val; localStorage.setItem(TOKEN_KEY, token);
    $('#tokenModal').hidden = true;
    if (tokenResolve) { tokenResolve(true); tokenResolve = null; }
    toast('GitHub conectado', 'ok');
  }
  function cancelarToken() {
    $('#tokenModal').hidden = true;
    if (tokenResolve) { tokenResolve(false); tokenResolve = null; }
  }

  async function publicar() {
    if (contarCambios() === 0) { toast('No hay cambios para publicar', 'info'); return; }
    if (!(await asegurarToken())) return;
    const btn = $('#btnPublicar');
    btn.disabled = true; btn.classList.add('cargando');
    const txtPrev = btn.textContent; btn.textContent = 'Publicando…';
    try {
      let sha;
      const check = await ghFetch('productos.json');
      if (check.ok) { const d = await check.json(); sha = d.sha; }
      const contenido = JSON.stringify(productos, null, 2);
      const base64 = btoa(unescape(encodeURIComponent(contenido)));
      const body = { message: 'Actualización de productos desde el panel', content: base64, branch: GITHUB_BRANCH };
      if (sha) body.sha = sha;
      const res = await ghFetch('productos.json', { method: 'PUT', body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message || ('GitHub ' + res.status)); }
      baseline = clone(productos);
      historial = [];
      render();
      toast('¡Publicado! Se ve en la web en ~1 minuto', 'ok');
    } catch (err) {
      toast('No se pudo publicar: ' + err.message, 'error');
    } finally {
      btn.disabled = false; btn.classList.remove('cargando'); btn.textContent = txtPrev;
    }
  }

  /* ============================================================
     EVENTOS
     ============================================================ */
  $('#btnLogin').addEventListener('click', intentarLogin);
  $('#pass').addEventListener('keydown', (e) => { if (e.key === 'Enter') intentarLogin(); });
  $('#pass').addEventListener('input', () => { $('#loginErr').hidden = true; });

  $('#buscar').addEventListener('input', (e) => { q = e.target.value; render(); });
  document.querySelectorAll('.adm-fpill').forEach((b) => b.addEventListener('click', () => { filtro = b.dataset.f; render(); }));

  $('#btnNuevo').addEventListener('click', () => abrirEditor('__nuevo__'));
  $('#undoFab').addEventListener('click', deshacer);
  $('#btnPublicar').addEventListener('click', publicar);

  // lista (delegado)
  $('#lista').addEventListener('click', (e) => {
    const ed = e.target.closest('[data-edit]'); if (ed) { abrirEditor(ed.dataset.edit); return; }
    const oc = e.target.closest('[data-toggle-oc]'); if (oc) { toggleOculto(oc.dataset.toggleOc); return; }
  });

  // editor
  $('#edCerrar').addEventListener('click', cerrarEditor);
  $('#btnGuardarProd').addEventListener('click', guardarProducto);
  $('#btnEliminar').addEventListener('click', eliminarProducto);
  $('#btnAddVar').addEventListener('click', () => {
    const cont = $('#variantes');
    const wrap = document.createElement('div');
    wrap.innerHTML = varRowHTML({ id: nuevaId() + cont.children.length, medida: '', costo: 0, ganancia: 0, precio: 0, oferta: false });
    cont.appendChild(wrap.firstElementChild);
    cont.lastElementChild.querySelector('.v-medida').focus();
  });
  $('#variantes').addEventListener('input', (e) => {
    if (e.target.matches('.v-costo, .v-ganancia, .v-precman')) recalcVar(e.target.closest('.adm-var'));
  });
  $('#variantes').addEventListener('click', (e) => {
    const del = e.target.closest('[data-delvar]');
    if (del) {
      if ($('#variantes').querySelectorAll('.adm-var').length <= 1) { toast('Tiene que quedar al menos una medida', 'error'); return; }
      del.closest('.adm-var').remove();
    }
  });
  $('#imgFile').addEventListener('change', (e) => { const f = e.target.files[0]; if (f) subirImagen(f); e.target.value = ''; });

  // token
  $('#tokenGuardar').addEventListener('click', guardarToken);
  $('#tokenCancelar').addEventListener('click', cancelarToken);

  /* ============================================================
     INIT
     ============================================================ */
  if (sessionStorage.getItem('bichitos_admin_ok') === '1') { mostrarApp(); cargarDatos(); }
  else { $('#pass').focus(); }
})();
