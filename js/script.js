// ============================================
// BICHITOS SHOP — Lógica principal
// ============================================

const WHATSAPP_NUMBER = '5492615081413';
const WHATSAPP_MSG_PREFIX = '🐾 Pedido - BICHITOS SHOP%0A%0A';
const CART_STORAGE_KEY = 'bichitos_carrito';

let productos = [];
let carrito = [];
let mapaCheckout = null;
let markerCheckout = null;
let coordsCheckout = null;
let scrollObserver = null;

document.addEventListener('DOMContentLoaded', () => {
    cargarCarritoStorage();
    aplicarFiltrosURL();
    cargarProductos();
    setupUI();
    initCarousel();
});

// ===== STORAGE =====
function cargarCarritoStorage() {
    try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        if (saved) carrito = JSON.parse(saved);
    } catch (e) {
        carrito = [];
    }
}
function guardarCarritoStorage() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carrito));
}

// ===== IMÁGENES CONTEXTUALES (placeholder hasta cargar las reales) =====
// Devuelve una foto real relacionada al producto según su nombre/categoría.
// Determinista por id para que no parpadee entre renders.
function imagenContextual(p) {
    const n = (p.nombre || '').toLowerCase();
    const id = p.id || 1;
    if (p.categoria === 'gatos') {
        const kw = /gatito|kitten|gato bebe/.test(n) ? 'kitten' : 'cat';
        return `https://loremflickr.com/400/400/${kw}?lock=${id}`;
    }
    // perros: placedog tiene fotos limpias y deterministas por id
    return `https://placedog.net/400/400?id=${(id % 100) + 1}`;
}

// onerror para imágenes: cae al ícono SVG de la categoría sin romper el layout
function imgOnError(iconoCat) {
    return `this.onerror=null;this.src='images/icons/${iconoCat}.svg';this.classList.add('img-fallback')`;
}

// ===== PRODUCTOS =====
async function cargarProductos() {
    try {
        productos = await window.productosAPI.fetchProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        productos = window.productosAPI.getFallbackProducts();
    }
    renderAll();
}

function renderAll() {
    renderProductos();
    renderDestacados();
    renderCarrito();
    guardarCarritoStorage();
}

// Aplica filtros que vienen por query string (categoria / etapa / marca)
function aplicarFiltrosURL() {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('categoria');
    if (cat) {
        document.querySelectorAll('.filtro-btn').forEach(b => {
            const isMatch = b.dataset.categoria === cat;
            b.classList.toggle('active', isMatch);
            b.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
        });
        // Mostrar chips de etapa según categoría
        actualizarEtapaChips(cat);
    }
    const etapa = params.get('etapa');
    if (etapa) {
        document.querySelectorAll('.etapa-btn').forEach(b => {
            const isMatch = b.dataset.etapa === etapa;
            b.classList.toggle('active', isMatch);
            b.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
        });
    }
    const marca = params.get('marca');
    if (marca) {
        const sel = document.getElementById('filtroMarca');
        if (sel) sel.value = marca.toLowerCase();
    }
}

function actualizarEtapaChips(cat) {
    const wrap = document.getElementById('etapaChips');
    if (!wrap) return;
    wrap.innerHTML = '';
    const etapasPerros = [
        { val: '', label: 'Todas las edades' },
        { val: 'adulto',   label: 'Adulto' },
        { val: 'cachorro', label: 'Cachorro' },
        { val: 'senior',   label: 'Senior' },
        { val: 'pequeñas', label: 'Razas Pequeñas' },
        { val: 'especiales', label: 'Especiales' },
    ];
    const etapasGatos = [
        { val: '', label: 'Todos' },
        { val: 'adulto',   label: 'Adulto' },
        { val: 'kitten',   label: 'Kitten' },
        { val: 'senior',   label: 'Senior' },
        { val: 'urinario', label: 'Urinario' },
        { val: 'castrado', label: 'Castrado' },
    ];
    const etapas = cat === 'gatos' ? etapasGatos : (cat === 'perros' ? etapasPerros : []);
    if (etapas.length === 0) { wrap.classList.add('hidden'); return; }
    wrap.classList.remove('hidden');
    const activeEtapa = new URLSearchParams(window.location.search).get('etapa') || '';
    etapas.forEach(e => {
        const btn = document.createElement('button');
        btn.className = 'etapa-btn' + (e.val === activeEtapa ? ' active' : '');
        btn.dataset.etapa = e.val;
        btn.textContent = e.label;
        btn.setAttribute('aria-pressed', e.val === activeEtapa ? 'true' : 'false');
        btn.addEventListener('click', () => {
            document.querySelectorAll('.etapa-btn').forEach(b => {
                b.classList.remove('active'); b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            renderProductos();
        });
        wrap.appendChild(btn);
    });
}

function renderProductos() {
    const grid = document.getElementById('productosGrid');
    if (!grid) return;

    const activeBtn = document.querySelector('.filtro-btn.active');
    let catFilter = activeBtn ? activeBtn.dataset.categoria : 'todas';

    const activeEtapaBtn = document.querySelector('.etapa-btn.active');
    const etapaFilter = activeEtapaBtn ? activeEtapaBtn.dataset.etapa : '';

    const searchTerm = (document.getElementById('buscador')?.value || '').toLowerCase();
    const marcaFilter = (document.getElementById('filtroMarca')?.value || '').toLowerCase();
    const orden = document.getElementById('ordenar')?.value || '';

    let filtrados = productos.filter(p => {
        const matchCat = catFilter === 'todas' || p.categoria === catFilter;
        const matchEtapa = !etapaFilter || p.etapa === etapaFilter;
        const matchSearch = !searchTerm
            || p.nombre.toLowerCase().includes(searchTerm)
            || (p.marca || '').toLowerCase().includes(searchTerm);
        const matchMarca = !marcaFilter || (p.marca || '').toLowerCase().includes(marcaFilter);
        return matchCat && matchEtapa && matchSearch && matchMarca;
    });

    if (orden === 'precio-asc') filtrados.sort((a, b) => a.precio - b.precio);
    else if (orden === 'precio-desc') filtrados.sort((a, b) => b.precio - a.precio);
    else if (orden === 'nombre-az') filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    else if (orden === 'nombre-za') filtrados.sort((a, b) => b.nombre.localeCompare(a.nombre, 'es'));

    if (filtrados.length === 0) {
        grid.innerHTML = '<p class="no-search-msg">No se encontraron productos 😔</p>';
        return;
    }
    const grupos = window.productosAPI.groupByVariants(filtrados);
    grid.innerHTML = grupos.map(g => crearCardGrupo(g)).join('');
    initScrollAnimations(grid);
}

function renderDestacados() {
    const grid = document.getElementById('destacadosGrid');
    if (!grid) return;
    const destacados = productos.filter(p => p.destacado).slice(0, 12);
    if (destacados.length === 0) {
        grid.innerHTML = '<p class="placeholder-msg">Próximamente...</p>';
        return;
    }
    const grupos = window.productosAPI.groupByVariants(destacados);
    grid.innerHTML = grupos.map(g => crearCardGrupo(g)).join('');
    initScrollAnimations(grid);
}

// Badges apilables
function badgesProducto(p) {
    const badges = [];
    if (p.stock === 0) {
        badges.push('<span class="prod-badge badge-agotado">🔴 Agotado</span>');
    } else if (p.stock && p.stock <= 5) {
        badges.push('<span class="prod-badge badge-pocos">🔥 Quedan pocos</span>');
    }
    if (p.oferta) badges.push('<span class="prod-badge badge-oferta">🔥 Oferta</span>');
    if (p.destacado) badges.push('<span class="prod-badge badge-destacado">⭐ Más vendido</span>');
    if (p.envioGratis || p.envio_gratis) badges.push('<span class="prod-badge badge-envio">🚚 Envío gratis</span>');
    if (badges.length === 0) return '';
    return `<div class="prod-badges">${badges.join('')}</div>`;
}

function crearCardGrupo(grupo) {
    const v = grupo.variantes;

    function html(p, idx) {
        const enCarrito = carrito.find(i => i.id === p.id);
        const cant = enCarrito ? enCarrito.cant : 0;
        const subtotal = enCarrito ? p.precio * enCarrito.cant : 0;
        const badges = badgesProducto(p);
        const iconoCat = p.categoria === 'gatos' ? 'cat' : 'dog';
        const fotoUrl = p.imagen || imagenContextual(p);
        const imgHtml = `<img src="${fotoUrl}" alt="${p.nombre}" class="producto-foto" loading="lazy" width="400" height="400" style="width:100%;height:100%;object-fit:cover;" onerror="${imgOnError(iconoCat)}" />`;
        const isSingle = v.length === 1;
        const sinStock = p.stock === 0;
        const kgPills = v.map((varp, vi) =>
            `<button class="kg-pill${vi === idx ? ' active' : ''}" data-base="${grupo._base}" data-varidx="${vi}" aria-label="${varp._peso || varp.nombre}">${varp._peso || (vi + 1)}</button>`
        ).join('');
        const defaultName = isSingle ? p.nombre : grupo._base;

        const addText = window.siteConfig?.buttons?.addToCart?.text || 'Agregar';
        return `
        <div class="producto-card animate-ready${cant > 0 ? ' en-carrito' : ''}" data-base="${grupo._base}">
            <div class="producto-img ${p.categoria}" data-base="${grupo._base}">
                ${badges}
                ${imgHtml}
            </div>
            <div class="producto-body" data-base="${grupo._base}">
                <div class="producto-marca">${p.marca || ''}</div>
                <div class="producto-nombre">${defaultName}</div>
                ${!isSingle ? `<div class="kg-selector">${kgPills}</div>` : ''}
                <div class="card-footer">
                    <span class="producto-precio">$${p.precio.toLocaleString('es-AR')}</span>
                    <div class="card-qty-wrap">
                        <button class="btn-qty-minus" data-id="${p.id}" data-accion="restar"${sinStock || cant === 0 ? ' disabled' : ''} aria-label="Quitar">−</button>
                        <span class="qty-num">${cant > 0 ? cant : ''}</span>
                        <button class="btn-qty-plus" data-id="${p.id}" data-accion="sumar"${sinStock ? ' disabled' : ''} aria-label="${sinStock ? 'Sin stock' : 'Agregar'}">+</button>
                    </div>
                </div>
            </div>
        </div>`;
    }

    return html(v[0], 0);
}

// ===== CARRITO =====
function renderCarrito() {
    const items = document.getElementById('cartItems');
    const total = document.getElementById('cartTotal');
    const count = document.getElementById('cartCount');
    const fab = document.getElementById('cartFab');
    const fabBadge = document.getElementById('cartFabBadge');
    if (!items) return;

    const totalCant = carrito.reduce((s, i) => s + i.cant, 0);
    if (count) {
        count.textContent = totalCant;
        count.classList.remove('bump');
        void count.offsetWidth;
        if (totalCant > 0) count.classList.add('bump');
    }
    if (fab) fab.classList.toggle('visible', totalCant > 0);
    if (fabBadge) fabBadge.textContent = totalCant;

    const totalPrecio = carrito.reduce((s, i) => s + i.precio * i.cant, 0);

    if (carrito.length === 0) {
        items.innerHTML = '<p class="cart-empty">El carrito está vacío</p>';
        if (total) total.textContent = '$0';
        return;
    }

    items.innerHTML = carrito.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.nombre}</div>
                <div class="cart-item-price">$${(item.precio * item.cant).toLocaleString('es-AR')}</div>
                <div class="cart-item-qty">
                    <button class="qty-cart" data-id="${item.id}" data-accion="restar" aria-label="Quitar ${item.nombre}">−</button>
                    <span aria-live="polite">${item.cant}</span>
                    <button class="qty-cart" data-id="${item.id}" data-accion="sumar" aria-label="Agregar ${item.nombre}">+</button>
                </div>
            </div>
            <div class="cart-item-remove" data-id="${item.id}" aria-label="Eliminar ${item.nombre} del carrito">✕</div>
        </div>
    `).join('');

    if (total) total.textContent = '$' + totalPrecio.toLocaleString('es-AR');
}

function agregarAlCarrito(id) {
    const item = carrito.find(i => i.id === id);
    if (item) {
        item.cant++;
    } else {
        const prod = productos.find(p => p.id === id);
        if (!prod) return;
        carrito.push({ ...prod, cant: 1 });
    }
}

function quitarDelCarrito(id) {
    const item = carrito.find(i => i.id === id);
    if (!item) return;
    item.cant--;
    if (item.cant <= 0) carrito = carrito.filter(i => i.id !== id);
}

// ===== EVENT DELEGATION =====
document.addEventListener('click', function (e) {
    // KG pill
    const pill = e.target.closest('.kg-pill');
    if (pill) { cambiarVariante(pill); return; }

    // Qty +/- en card
    const qtyCard = e.target.closest('.btn-qty-plus, .btn-qty-minus');
    if (qtyCard && !qtyCard.disabled) {
        const id = parseInt(qtyCard.dataset.id);
        if (qtyCard.dataset.accion === 'sumar') agregarAlCarrito(id);
        else quitarDelCarrito(id);
        updateCardsCarrito();
        renderCarrito();
        guardarCarritoStorage();
        const fab = document.getElementById('cartFab');
        if (fab) { fab.classList.remove('bump'); void fab.offsetWidth; fab.classList.add('bump'); }
        return;
    }

    // Qty +/- en carrito panel
    const qtyBtn = e.target.closest('.qty-cart');
    if (qtyBtn) {
        const id = parseInt(qtyBtn.dataset.id);
        if (qtyBtn.dataset.accion === 'sumar') agregarAlCarrito(id);
        else quitarDelCarrito(id);
        updateCardsCarrito();
        renderCarrito();
        guardarCarritoStorage();
        return;
    }

    // Eliminar del carrito
    const rem = e.target.closest('.cart-item-remove');
    if (rem) {
        const id = parseInt(rem.dataset.id);
        carrito = carrito.filter(i => i.id !== id);
        updateCardsCarrito();
        renderCarrito();
        guardarCarritoStorage();
        return;
    }
});

function cambiarVariante(pill) {
    const base = pill.dataset.base;
    const idx = parseInt(pill.dataset.varidx);
    const grupos = window.productosAPI.groupByVariants(productos);
    const grupo = grupos.find(g => g._base === base);
    if (!grupo) return;
    const newP = grupo.variantes[idx];
    if (!newP) return;
    const card = pill.closest('.producto-card');
    if (!card) return;
    if (card.dataset._activeIdx == idx) return;
    card.dataset._activeIdx = idx;

    const imgWrap = card.querySelector('.producto-img');
    imgWrap.className = `producto-img ${newP.categoria}`;
    card.querySelectorAll('.prod-badges').forEach(el => el.remove());
    const img = imgWrap.querySelector('img');
    if (img) {
        img.classList.remove('img-fallback');
        const iconoCat = newP.categoria === 'gatos' ? 'cat' : 'dog';
        img.setAttribute('onerror', imgOnError(iconoCat));
        img.src = newP.imagen || imagenContextual(newP);
    }
    const badgesHtml = badgesProducto(newP);
    if (badgesHtml) imgWrap.insertAdjacentHTML('afterbegin', badgesHtml);

    card.querySelector('.producto-precio').textContent = '$' + newP.precio.toLocaleString('es-AR');
    card.querySelectorAll('.kg-pill').forEach(el => el.classList.toggle('active', parseInt(el.dataset.varidx) === idx));
    card.querySelectorAll('.btn-qty-plus, .btn-qty-minus').forEach(el => el.dataset.id = newP.id);
}

// ===== CART PANEL =====
function abrirCarrito() {
    document.getElementById('cartPanel')?.classList.add('open');
    document.getElementById('cartOverlay')?.classList.add('open');
}
function cerrarCarrito() {
    document.getElementById('cartPanel')?.classList.remove('open');
    document.getElementById('cartOverlay')?.classList.remove('open');
}

// ===== CHECKOUT =====
function abrirCheckout() {
    if (carrito.length === 0) return;
    document.getElementById('checkoutModal').classList.add('open');
    actualizarResumenCheckout();
    initMapaCheckout();
    document.getElementById('checkoutName')?.focus();
}
function cerrarCheckout() {
    document.getElementById('checkoutModal').classList.remove('open');
}
function actualizarResumenCheckout() {
    const el = document.getElementById('checkoutResumen');
    if (!el) return;
    const total = carrito.reduce((s, i) => s + i.precio * i.cant, 0);
    const cant = carrito.reduce((s, i) => s + i.cant, 0);
    el.innerHTML = `<strong>${cant}</strong> producto${cant !== 1 ? 's' : ''} — Total: <strong>$${total.toLocaleString('es-AR')}</strong>`;
}
function initMapaCheckout() {
    const container = document.getElementById('checkoutMap');
    if (!container || container._leaflet_id) return;
    mapaCheckout = L.map('checkoutMap').setView([-32.8895, -68.8458], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, attribution: '© OpenStreetMap'
    }).addTo(mapaCheckout);
    mapaCheckout.on('click', function (e) {
        colocarMarcador(e.latlng.lat, e.latlng.lng);
        buscarDireccion(e.latlng.lat, e.latlng.lng);
    });
    setTimeout(() => mapaCheckout.invalidateSize(), 300);
}
function colocarMarcador(lat, lng) {
    coordsCheckout = { lat, lng };
    if (markerCheckout) {
        markerCheckout.setLatLng([lat, lng]);
    } else {
        markerCheckout = L.marker([lat, lng], { draggable: true }).addTo(mapaCheckout);
        markerCheckout.on('dragend', function () {
            const pos = markerCheckout.getLatLng();
            coordsCheckout = { lat: pos.lat, lng: pos.lng };
            buscarDireccion(pos.lat, pos.lng);
        });
    }
    document.getElementById('checkoutAddress').value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}
async function buscarDireccion(lat, lng) {
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=es`);
        const data = await res.json();
        if (data.display_name) document.getElementById('checkoutAddress').value = data.display_name;
    } catch (e) { /* fallback a coordenadas */ }
}
async function buscarEnMapa(query) {
    if (!query.trim()) return;
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&accept-language=es`);
        const data = await res.json();
        if (data.length > 0) {
            const r = data[0];
            mapaCheckout.setView([r.lat, r.lon], 15);
            colocarMarcador(parseFloat(r.lat), parseFloat(r.lon));
        } else {
            alert('No se encontró esa dirección');
        }
    } catch (e) {
        alert('Error al buscar dirección');
    }
}
function usarUbicacionActual() {
    if (!navigator.geolocation) { alert('Tu navegador no soporta geolocalización'); return; }
    navigator.geolocation.getCurrentPosition(
        pos => {
            const { latitude, longitude } = pos.coords;
            mapaCheckout.setView([latitude, longitude], 15);
            colocarMarcador(latitude, longitude);
            buscarDireccion(latitude, longitude);
        },
        () => alert('No pudimos obtener tu ubicación. Permití el acceso o escribí la dirección manualmente.')
    );
}
function enviarWhatsAppCheckout() {
    const nombre = document.getElementById('checkoutName').value.trim();
    const direccion = document.getElementById('checkoutAddress').value.trim();
    if (!nombre) {
        document.getElementById('checkoutName').focus();
        document.getElementById('checkoutName').style.borderColor = '#e74c3c';
        return;
    }
    document.getElementById('checkoutName').style.borderColor = '';

    let mapsLink = '';
    if (coordsCheckout) mapsLink = `https://www.google.com/maps?q=${coordsCheckout.lat},${coordsCheckout.lng}`;

    const lineas = carrito.map(i => {
        const icono = i.categoria === 'gatos' ? '🐱' : '🐶';
        return `${icono} ${i.nombre} x${i.cant} — $${(i.precio * i.cant).toLocaleString('es-AR')}`;
    });
    const total = carrito.reduce((s, i) => s + i.precio * i.cant, 0);

    let mensaje = `${WHATSAPP_MSG_PREFIX}👤 Nombre: ${nombre}%0A`;
    mensaje += `📍 Dirección: ${direccion}%0A`;
    if (mapsLink) mensaje += `🗺️ Mapa: ${mapsLink}%0A`;
    mensaje += `%0A━━━━━  PEDIDO  ━━━━━%0A`;
    mensaje += lineas.join('%0A');
    mensaje += `%0A━━━━━━━━━━━━━━━━━━━%0A💰 Total: $${total.toLocaleString('es-AR')}`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`, '_blank');
    cerrarCheckout();
}

// ===== CARRUSEL HERO =====
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    if (!track) return;
    const slides = Array.from(track.children);
    let current = 0;
    let timer = null;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function goTo(idx) {
        current = (idx + slides.length) % slides.length;
        track.style.transform = `translateX(-${current * 100}%)`;
    }
    function next() { goTo(current + 1); }
    function start() {
        if (reduceMotion) return;
        stop();
        timer = setInterval(next, 5000);
    }
    function stop() { if (timer) clearInterval(timer); }

    const carousel = track.closest('.hero-carousel');
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);

    let startX = 0;
    carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; stop(); }, { passive: true });
    carousel.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 50) { goTo(dx > 0 ? current - 1 : current + 1); }
        start();
    }, { passive: true });

    start();
}

// ===== SEARCH MODAL =====
function abrirSearch() {
    const modal = document.getElementById('searchModal');
    if (!modal) return;
    modal.classList.add('open');
    document.getElementById('searchInput')?.focus();
    document.body.style.overflow = 'hidden';
}
function cerrarSearch() {
    const modal = document.getElementById('searchModal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    const input = document.getElementById('searchInput');
    if (input) input.value = '';
    const res = document.getElementById('searchResults');
    if (res) res.innerHTML = '';
}
function renderSearchResults(term) {
    const res = document.getElementById('searchResults');
    if (!res) return;
    term = term.trim().toLowerCase();
    if (!term) { res.innerHTML = ''; return; }
    const matches = productos.filter(p =>
        p.nombre.toLowerCase().includes(term) || (p.marca || '').toLowerCase().includes(term)
    ).slice(0, 8);
    if (matches.length === 0) {
        res.innerHTML = '<p class="search-no-results">No encontramos nada con eso 😿</p>';
        return;
    }
    res.innerHTML = matches.map(p => {
        const iconoCat = p.categoria === 'gatos' ? 'cat' : 'dog';
        const fotoUrl = p.imagen || imagenContextual(p);
        return `<a class="search-result-item" href="productos.html?categoria=${p.categoria}">
            <img class="search-result-thumb" src="${fotoUrl}" alt="" loading="lazy" onerror="${imgOnError(iconoCat)}" />
            <div>
                <div class="search-result-name">${p.nombre}</div>
                <div class="search-result-price">$${p.precio.toLocaleString('es-AR')}</div>
            </div>
        </a>`;
    }).join('');
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations(scope) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cards = (scope || document).querySelectorAll('.producto-card.animate-ready');
    if (reduceMotion) {
        cards.forEach(c => { c.classList.remove('animate-ready'); });
        return;
    }
    if (!scrollObserver) {
        scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = (el._idx || 0) * 50;
                    setTimeout(() => {
                        el.classList.remove('animate-ready');
                        el.classList.add('animate-in');
                    }, delay);
                    scrollObserver.unobserve(el);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    }
    cards.forEach((c, i) => { c._idx = i % 8; scrollObserver.observe(c); });
}

// ===== MEGA MENU MOBILE =====
function setupMegaMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('open');
            menuToggle.classList.toggle('open', isOpen);
            menuToggle.setAttribute('aria-expanded', isOpen);
            menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
    }
    // Acordeón en mobile: tap en el link con dropdown abre/cierra
    nav?.querySelectorAll('.nav-item').forEach(item => {
        const dropdown = item.querySelector('.nav-dropdown');
        if (!dropdown) return;
        const link = item.querySelector('.nav-link');
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 767) {
                e.preventDefault();
                item.classList.toggle('mobile-open');
            }
        });
    });
}

// ===== SETUP =====
function setupUI() {
    setupMegaMenu();

    document.getElementById('cartToggle')?.addEventListener('click', e => { e.preventDefault(); abrirCarrito(); });
    document.getElementById('cartFab')?.addEventListener('click', () => { if (carrito.length > 0) abrirCarrito(); });
    document.getElementById('cartClose')?.addEventListener('click', cerrarCarrito);
    document.getElementById('cartOverlay')?.addEventListener('click', cerrarCarrito);
    document.getElementById('cartSend')?.addEventListener('click', abrirCheckout);

    document.getElementById('checkoutModalClose')?.addEventListener('click', cerrarCheckout);
    document.getElementById('checkoutModalOverlay')?.addEventListener('click', cerrarCheckout);
    document.getElementById('checkoutSubmit')?.addEventListener('click', enviarWhatsAppCheckout);
    document.getElementById('checkoutUseLocation')?.addEventListener('click', usarUbicacionActual);

    // Search modal
    document.getElementById('searchToggle')?.addEventListener('click', abrirSearch);
    document.getElementById('searchClose')?.addEventListener('click', cerrarSearch);
    document.getElementById('searchModalOverlay')?.addEventListener('click', cerrarSearch);
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let t;
        searchInput.addEventListener('input', () => {
            clearTimeout(t);
            t = setTimeout(() => renderSearchResults(searchInput.value), 300);
        });
    }
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') { cerrarSearch(); cerrarCheckout(); cerrarCarrito(); }
    });

    // Map search
    const mapSearch = document.getElementById('checkoutMapSearch');
    if (mapSearch) {
        let timeout;
        mapSearch.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => buscarEnMapa(mapSearch.value), 500);
        });
        mapSearch.addEventListener('keydown', e => { if (e.key === 'Enter') buscarEnMapa(mapSearch.value); });
    }

    // Filtros categoría
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filtro-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            // Mostrar/ocultar chips de etapa según categoría
            actualizarEtapaChips(btn.dataset.categoria);
            renderProductos();
        });
    });

    // Buscador página productos
    const buscador = document.getElementById('buscador');
    if (buscador) {
        let timeout;
        buscador.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(renderProductos, 300);
        });
    }

    // Filtro marca + orden
    document.getElementById('filtroMarca')?.addEventListener('change', renderProductos);
    document.getElementById('ordenar')?.addEventListener('change', renderProductos);
}

// ===== UPDATE CARDS SIN RE-RENDER =====
function updateCardsCarrito() {
    document.querySelectorAll('.producto-card').forEach(card => {
        const plusBtn = card.querySelector('.btn-qty-plus');
        if (!plusBtn) return;
        const id = parseInt(plusBtn.dataset.id);
        const entry = carrito.find(i => i.id === id);
        const cant = entry ? entry.cant : 0;
        card.classList.toggle('en-carrito', cant > 0);
        const qtyNum = card.querySelector('.qty-num');
        if (qtyNum) qtyNum.textContent = cant > 0 ? cant : '';
        const minusBtn = card.querySelector('.btn-qty-minus');
        if (minusBtn) minusBtn.disabled = cant === 0;
    });
}

// ===== PAW PARTICLES =====
(function initPawParticles() {
    const canvas = document.getElementById('pawCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    const N = 14;
    const R = 22; // collision radius
    const particles = Array.from({ length: N }, () => ({
        x: R + Math.random() * (W - R * 2),
        y: R + Math.random() * (H - R * 2),
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: 16 + Math.random() * 14,
        alpha: 0.05 + Math.random() * 0.07,
        rot: Math.random() * Math.PI * 2,
    }));

    function step() {
        ctx.clearRect(0, 0, W, H);
        for (let i = 0; i < N; i++) {
            const a = particles[i];
            a.x += a.vx; a.y += a.vy;
            if (a.x < R)     { a.x = R;     a.vx = Math.abs(a.vx); }
            if (a.x > W - R) { a.x = W - R; a.vx = -Math.abs(a.vx); }
            if (a.y < R)     { a.y = R;     a.vy = Math.abs(a.vy); }
            if (a.y > H - R) { a.y = H - R; a.vy = -Math.abs(a.vy); }
            for (let j = i + 1; j < N; j++) {
                const b = particles[j];
                const dx = b.x - a.x, dy = b.y - a.y;
                const d2 = dx * dx + dy * dy;
                const min = R * 2;
                if (d2 < min * min && d2 > 0) {
                    const d = Math.sqrt(d2);
                    const nx = dx / d, ny = dy / d;
                    const sep = (min - d) / 2;
                    a.x -= nx * sep; a.y -= ny * sep;
                    b.x += nx * sep; b.y += ny * sep;
                    const dot = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
                    a.vx -= dot * nx; a.vy -= dot * ny;
                    b.vx += dot * nx; b.vy += dot * ny;
                }
            }
            ctx.save();
            ctx.globalAlpha = a.alpha;
            ctx.font = `${a.size}px serif`;
            ctx.translate(a.x, a.y);
            ctx.rotate(a.rot);
            ctx.fillText('🐾', -a.size / 2, a.size / 2);
            ctx.restore();
        }
        requestAnimationFrame(step);
    }
    step();
})();
