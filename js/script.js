const WHATSAPP_NUMBER = '5492615081413';
const WHATSAPP_MSG_PREFIX = '🐾 Pedido - BICHITOS SHOP%0A%0A';
const CART_STORAGE_KEY = 'bichitos_carrito';

let productos = [];
let carrito = [];
let mapaCheckout = null;
let markerCheckout = null;
let coordsCheckout = null;

document.addEventListener('DOMContentLoaded', () => {
    cargarCarritoStorage();
    cargarProductos();
    setupUI();
});

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

function renderProductos() {
    const grid = document.getElementById('productosGrid');
    if (!grid) return;
    const params = new URLSearchParams(window.location.search);
    let catFilter = params.get('categoria') || 'todas';
    const activeBtn = document.querySelector('.filtro-btn.active');
    if (activeBtn) catFilter = activeBtn.dataset.categoria;
    const searchTerm = (document.getElementById('buscador')?.value || '').toLowerCase();

    const filtrados = productos.filter(p => {
        const matchCat = catFilter === 'todas' || p.categoria === catFilter;
        const matchSearch = !searchTerm || p.nombre.toLowerCase().includes(searchTerm);
        return matchCat && matchSearch;
    });

    if (filtrados.length === 0) {
        grid.innerHTML = '<p class="no-search-msg">No se encontraron productos 😔</p>';
        return;
    }
    grid.innerHTML = filtrados.map(p => crearCard(p)).join('');
}

function renderDestacados() {
    const grid = document.getElementById('destacadosGrid');
    if (!grid) return;
    const destacados = productos.filter(p => p.destacado).slice(0, 8);
    if (destacados.length === 0) {
        grid.innerHTML = '<p class="placeholder-msg">Próximamente...</p>';
        return;
    }
    grid.innerHTML = destacados.map(p => crearCard(p)).join('');
}

function badgeStock(p) {
    if (p.stock === 0) return '<span class="prod-badge badge-agotado">🔴 Agotado</span>';
    if (p.stock && p.stock <= 5) return '<span class="prod-badge badge-pocos">🔥 Quedan pocos</span>';
    if (p.destacado) return '<span class="prod-badge badge-destacado">⭐ Más vendido</span>';
    if (p.oferta) return '<span class="prod-badge badge-oferta">🔥 Oferta</span>';
    return '';
}

function crearCard(p) {
    const icono = p.categoria === 'gatos' ? '🐱' : '🐶';
    const enCarrito = carrito.find(i => i.id === p.id);
    const cant = enCarrito ? enCarrito.cant : 0;
    const subtotal = enCarrito ? p.precio * enCarrito.cant : 0;
    const badge = badgeStock(p);
    const imgHtml = p.imagen
        ? `<img src="${p.imagen}" alt="${p.nombre}" loading="lazy" width="400" height="400" style="width:100%;height:100%;object-fit:cover;" />`
        : `<span class="producto-img-fallback" aria-hidden="true">${icono}</span>`;
    return `
        <div class="producto-card${cant > 0 ? ' en-carrito' : ''}">
            <div class="producto-img ${p.categoria}">
                ${badge}
                ${imgHtml}
            </div>
            <div class="producto-body">
                <div class="producto-marca">${p.marca || ''}</div>
                <div class="producto-nombre">${p.nombre}</div>
                <div class="producto-precio">$${p.precio.toLocaleString('es-AR')}</div>
                <div class="qty-selector">
                    <button class="qty-btn" data-id="${p.id}" data-accion="restar" aria-label="Quitar ${p.nombre}">−</button>
                    <span class="qty-cant" aria-live="polite">${cant}</span>
                    <button class="qty-btn" data-id="${p.id}" data-accion="sumar" aria-label="Agregar ${p.nombre}">+</button>
                </div>
                ${cant === 0 ? `<button class="btn-add-cart" data-id="${p.id}" data-accion="sumar" aria-label="Agregar ${p.nombre}">🛒 Agregar</button>` : ''}
                ${cant > 0 ? `<div class="producto-subtotal">🛒 $${subtotal.toLocaleString('es-AR')}</div>` : ''}
            </div>
        </div>
    `;
}

function renderCarrito() {
    const items = document.getElementById('cartItems');
    const total = document.getElementById('cartTotal');
    const count = document.getElementById('cartCount');
    const fab = document.getElementById('cartFab');
    const fabBadge = document.getElementById('cartFabBadge');
    if (!items) return;

    const totalCant = carrito.reduce((s, i) => s + i.cant, 0);
    if (count) count.textContent = totalCant;
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

document.addEventListener('click', function(e) {
    const qtyBtn = e.target.closest('.qty-btn, .qty-cart, .btn-add-cart');
    if (qtyBtn) {
        const id = parseInt(qtyBtn.dataset.id);
        if (qtyBtn.dataset.accion === 'sumar') {
            const item = carrito.find(i => i.id === id);
            if (item) {
                item.cant++;
            } else {
                const prod = productos.find(p => p.id === id);
                if (!prod) return;
                carrito.push({ ...prod, cant: 1 });
            }
            renderAll();
        } else {
            const item = carrito.find(i => i.id === id);
            if (!item) return;
            item.cant--;
            if (item.cant <= 0) carrito = carrito.filter(i => i.id !== id);
            renderAll();
        }
        return;
    }
    const rem = e.target.closest('.cart-item-remove');
    if (rem) {
        const id = parseInt(rem.dataset.id);
        carrito = carrito.filter(i => i.id !== id);
        renderAll();
        return;
    }
});

function abrirCarrito() {
    document.getElementById('cartPanel')?.classList.add('open');
    document.getElementById('cartOverlay')?.classList.add('open');
}

function cerrarCarrito() {
    document.getElementById('cartPanel')?.classList.remove('open');
    document.getElementById('cartOverlay')?.classList.remove('open');
}

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
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(mapaCheckout);
    mapaCheckout.on('click', function(e) {
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
        markerCheckout.on('dragend', function() {
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
        if (data.display_name) {
            document.getElementById('checkoutAddress').value = data.display_name;
        }
    } catch (e) {
        // fallback a coordenadas
    }
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
    if (!navigator.geolocation) {
        alert('Tu navegador no soporta geolocalización');
        return;
    }
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
    if (coordsCheckout) {
        mapsLink = `https://www.google.com/maps?q=${coordsCheckout.lat},${coordsCheckout.lng}`;
    }

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

function setupUI() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
        });
    }

    document.getElementById('cartToggle')?.addEventListener('click', e => {
        e.preventDefault();
        abrirCarrito();
    });
    document.getElementById('cartFab')?.addEventListener('click', () => {
        if (carrito.length > 0) abrirCarrito();
    });
    document.getElementById('cartClose')?.addEventListener('click', cerrarCarrito);
    document.getElementById('cartOverlay')?.addEventListener('click', cerrarCarrito);
    document.getElementById('cartSend')?.addEventListener('click', abrirCheckout);
    document.getElementById('checkoutModalClose')?.addEventListener('click', cerrarCheckout);
    document.getElementById('checkoutModalOverlay')?.addEventListener('click', cerrarCheckout);
    document.getElementById('checkoutSubmit')?.addEventListener('click', enviarWhatsAppCheckout);
    document.getElementById('checkoutUseLocation')?.addEventListener('click', usarUbicacionActual);

    const searchInput = document.getElementById('checkoutMapSearch');
    if (searchInput) {
        let timeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => buscarEnMapa(searchInput.value), 500);
        });
        searchInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') buscarEnMapa(searchInput.value);
        });
    }

    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filtro-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            renderProductos();
        });
    });

    const buscador = document.getElementById('buscador');
    if (buscador) {
        let timeout;
        buscador.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(renderProductos, 300);
        });
    }
}
