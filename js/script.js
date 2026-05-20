const WHATSAPP_NUMBER = '5492615081413';
const WHATSAPP_MSG_PREFIX = '🐾 Pedido - BICHITOS SHOP%0A%0A';
const CART_STORAGE_KEY = 'bichitos_carrito';

let productos = [];
let carrito = [];

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
                ${cant > 0 ? `<div class="producto-subtotal">🛒 $${subtotal.toLocaleString('es-AR')} ${cant === 1 ? '<span class="badge-added">✅ Agregado</span>' : ''}</div>` : ''}
            </div>
        </div>
    `;
}

function renderCarrito() {
    const items = document.getElementById('cartItems');
    const total = document.getElementById('cartTotal');
    const count = document.getElementById('cartCount');
    const floatBar = document.getElementById('checkoutFloat');
    const floatTotal = document.getElementById('checkoutFloatTotal');
    const floatCount = document.getElementById('checkoutFloatCount');
    if (!items) return;

    const totalCant = carrito.reduce((s, i) => s + i.cant, 0);
    if (count) count.textContent = totalCant;

    const totalPrecio = carrito.reduce((s, i) => s + i.precio * i.cant, 0);

    if (floatBar) {
        floatBar.classList.toggle('visible', carrito.length > 0);
    }
    if (floatTotal) {
        floatTotal.textContent = '$' + totalPrecio.toLocaleString('es-AR');
    }
    if (floatCount) {
        floatCount.textContent = totalCant === 1 ? '1 producto' : totalCant + ' productos';
    }

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

function enviarWhatsApp() {
    if (carrito.length === 0) return alert('El carrito está vacío');
    const lineas = carrito.map(i => {
        const icono = i.categoria === 'gatos' ? '🐱' : '🐶';
        return `${icono} ${i.nombre} x${i.cant} — $${(i.precio * i.cant).toLocaleString('es-AR')}`;
    });
    const total = carrito.reduce((s, i) => s + i.precio * i.cant, 0);
    const mensaje = `${WHATSAPP_MSG_PREFIX}${lineas.join('%0A')}%0A━━━━━━━━━━━━━━━━━━━%0A💰 Total: $${total.toLocaleString('es-AR')}%0A%0A📍 Dirección: [completar]%0A💬 Nombre: [completar]`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`, '_blank');
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
    document.getElementById('cartClose')?.addEventListener('click', cerrarCarrito);
    document.getElementById('cartOverlay')?.addEventListener('click', cerrarCarrito);
    document.getElementById('cartSend')?.addEventListener('click', enviarWhatsApp);
    document.getElementById('checkoutFloatSend')?.addEventListener('click', enviarWhatsApp);

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
