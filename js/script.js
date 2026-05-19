const WHATSAPP_NUMBER = '5492615081413';
const WHATSAPP_MSG_PREFIX = '🐾 Pedido - BICHITOS SHOP%0A%0A';

const PRODUCTOS_FALLBACK = [
    { id:1, nombre:'Estampa Plus perro RAZAS PEQUEÑAS x 8 Kg', categoria:'perros', precio:29180, destacado:true, marca:'Estampa' },
    { id:2, nombre:'Estampa Plus perro x 15 Kg', categoria:'perros', precio:50690, destacado:true, marca:'Estampa' },
    { id:3, nombre:'Estampa Plus perro x 20 Kg', categoria:'perros', precio:65148, destacado:false, marca:'Estampa' },
    { id:4, nombre:'Estampa plus RAZA PEQUEÑA X 15 KG', categoria:'perros', precio:53160, destacado:false, marca:'Estampa' },
    { id:5, nombre:'ESTAMPA RAZA PEQUEÑA X 3KG (3 unid)', categoria:'perros', precio:37695, destacado:false, marca:'Estampa' },
    { id:6, nombre:'Estampa Criadores x 15 Kg', categoria:'perros', precio:42898, destacado:false, marca:'Estampa' },
    { id:7, nombre:'Estampa Criadores x 20 Kg', categoria:'perros', precio:55173, destacado:false, marca:'Estampa' },
    { id:8, nombre:'Estampa Criadores x 8kg', categoria:'perros', precio:23547, destacado:false, marca:'Estampa' },
    { id:9, nombre:'Estampa Plus Cachorro x 15 Kg', categoria:'perros', precio:57475, destacado:false, marca:'Estampa' },
    { id:10, nombre:'Estampa Plus Cachorro x 8kg', categoria:'perros', precio:31553, destacado:false, marca:'Estampa' },
    { id:11, nombre:'Estampa Plus Gato x15kg', categoria:'gatos', precio:60300, destacado:true, marca:'Estampa' },
    { id:12, nombre:'Estampa Plus Gato x 8kg', categoria:'gatos', precio:33106, destacado:false, marca:'Estampa' },
    { id:13, nombre:'Estampa Gato x 1 kg (pack x8 u)', categoria:'gatos', precio:39679, destacado:false, marca:'Estampa' },
    { id:14, nombre:'Valiant Criadores x 20 Kg', categoria:'perros', precio:47398, destacado:false, marca:'Valiant' },
    { id:15, nombre:'Estampa Insignia Perro Adulto x 20kg', categoria:'perros', precio:109015, destacado:true, marca:'Insignia' },
    { id:16, nombre:'Estampa Insignia Perro Adulto x 3kg', categoria:'perros', precio:20941, destacado:false, marca:'Insignia' },
    { id:17, nombre:'Estampa Insignia Perro Adulto x 15 kg', categoria:'perros', precio:81761, destacado:false, marca:'Insignia' },
    { id:18, nombre:'Estampa Insignia Perro Cachorro x 8kg', categoria:'perros', precio:50290, destacado:false, marca:'Insignia' },
    { id:19, nombre:'Estampa Insignia Perro Cachorro x 3kg', categoria:'perros', precio:22491, destacado:false, marca:'Insignia' },
    { id:20, nombre:'Estampa Insignia Perro Mordida Pequeña x 8kg', categoria:'perros', precio:48913, destacado:false, marca:'Insignia' },
    { id:21, nombre:'Estampa Insignia Perro Mordida Pequeña x 3kg', categoria:'perros', precio:21962, destacado:false, marca:'Insignia' },
    { id:22, nombre:'Jaspe Adulto x 20 kg', categoria:'perros', precio:40307, destacado:false, marca:'Jaspe' },
    { id:23, nombre:'Jaspe Adulto MP x 20 kg', categoria:'perros', precio:44150, destacado:false, marca:'Jaspe' },
    { id:24, nombre:'Jaspe Adulto x 8 kg', categoria:'perros', precio:16590, destacado:false, marca:'Jaspe' },
    { id:25, nombre:'Jaspe Adulto MP x 8 kg', categoria:'perros', precio:18174, destacado:false, marca:'Jaspe' },
    { id:26, nombre:'Jaspe Adulto x 3 kg (4u)', categoria:'perros', precio:32149, destacado:false, marca:'Jaspe' },
    { id:27, nombre:'Jaspe Adulto MP x 3kg (4u)', categoria:'perros', precio:35174, destacado:false, marca:'Jaspe' },
    { id:28, nombre:'Jaspe Cachorro x 15 kg', categoria:'perros', precio:39158, destacado:false, marca:'Jaspe' },
    { id:29, nombre:'Jaspe Cach Premium x 15 kg', categoria:'perros', precio:51555, destacado:false, marca:'Jaspe' },
    { id:30, nombre:'Jaspe Cach Premium x 1,5kg (8u)', categoria:'perros', precio:70648, destacado:false, marca:'Jaspe' },
    { id:31, nombre:'Jaspe Gato x 10 kg', categoria:'gatos', precio:31456, destacado:false, marca:'Jaspe' },
    { id:32, nombre:'Jaspe Gato x 1 kg (12u)', categoria:'gatos', precio:51249, destacado:false, marca:'Jaspe' },
    { id:33, nombre:'Jaspe Gato x 20 kg', categoria:'gatos', precio:59862, destacado:false, marca:'Jaspe' },
    { id:34, nombre:'Jaspe Gato Premium x 8 kg', categoria:'gatos', precio:32877, destacado:false, marca:'Jaspe' },
    { id:35, nombre:'Jaspe Gato Premium x 1kg (12u)', categoria:'gatos', precio:74088, destacado:false, marca:'Jaspe' },
    { id:36, nombre:'Jaspe Premium x 20 kg', categoria:'perros', precio:61626, destacado:false, marca:'Jaspe' },
    { id:37, nombre:'Jaspe Premium x 1,5kg (8u)', categoria:'perros', precio:63322, destacado:false, marca:'Jaspe' },
    { id:38, nombre:'Jaspe Premium x 15 Kg', categoria:'perros', precio:46229, destacado:false, marca:'Jaspe' },
    { id:39, nombre:'Jaspe Premium MP x 8 Kg', categoria:'perros', precio:28254, destacado:false, marca:'Jaspe' },
    { id:40, nombre:'Jaspe Premium MP x 15 Kg', categoria:'perros', precio:48466, destacado:false, marca:'Jaspe' },
    { id:41, nombre:'Jaspe Premium MP x1,5kg (8u)', categoria:'perros', precio:66397, destacado:false, marca:'Jaspe' },
    { id:42, nombre:'Jaspe Criadores x 20 kg', categoria:'perros', precio:49368, destacado:false, marca:'Jaspe' },
    { id:43, nombre:'Liwué x 15 kg', categoria:'perros', precio:21487, destacado:false, marca:'Liwué' },
    { id:44, nombre:'Liwué x 20 kg', categoria:'perros', precio:28465, destacado:false, marca:'Liwué' },
    { id:45, nombre:'Liwué Gato x 10 kg', categoria:'gatos', precio:24577, destacado:false, marca:'Liwué' },
    { id:46, nombre:'Liwué Gato x 20 kg', categoria:'gatos', precio:46601, destacado:false, marca:'Liwué' },
    { id:47, nombre:'Liwue Plus x 20 Kg', categoria:'perros', precio:33083, destacado:false, marca:'Liwué' },
    { id:48, nombre:'Vagoneta Gourmet x 15 Kg', categoria:'perros', precio:29169, destacado:false, marca:'Vagoneta' },
    { id:49, nombre:'Vagoneta Gourmet x 20 Kg', categoria:'perros', precio:38896, destacado:false, marca:'Vagoneta' },
    { id:50, nombre:'Vagoneta Gourmet x 1,5Kg (x6u)', categoria:'perros', precio:25610, destacado:false, marca:'Vagoneta' },
    { id:51, nombre:'Vagoneta CARNE Y CEREALES x20Kg', categoria:'perros', precio:38896, destacado:false, marca:'Vagoneta' },
    { id:52, nombre:'Vagoneta TRADICIONAL x 8 Kg', categoria:'perros', precio:16127, destacado:false, marca:'Vagoneta' },
    { id:53, nombre:'Vagoneta Raza Pequeña x 15 Kg', categoria:'perros', precio:30571, destacado:false, marca:'Vagoneta' },
    { id:54, nombre:'Vagoneta Raza Pequeña x 8 Kg', categoria:'perros', precio:16745, destacado:false, marca:'Vagoneta' },
    { id:55, nombre:'Vagoneta Raza Pequeña x 1,5 Kg (x6u)', categoria:'perros', precio:26831, destacado:false, marca:'Vagoneta' },
    { id:56, nombre:'Vagoneta Cachorro x 15 Kg', categoria:'perros', precio:40370, destacado:false, marca:'Vagoneta' },
    { id:57, nombre:'Vagoneta Cachorro x 1,5 Kg (x6u)', categoria:'perros', precio:33980, destacado:false, marca:'Vagoneta' },
    { id:58, nombre:'Dr Perrot x 20 Kg', categoria:'perros', precio:37345, destacado:false, marca:'Dr Perrot' },
    { id:59, nombre:'Dr Perrot x 15 Kg', categoria:'perros', precio:28007, destacado:false, marca:'Dr Perrot' },
    { id:60, nombre:'Dr Perrot x 1,5 Kg (pack x6u)', categoria:'perros', precio:23065, destacado:false, marca:'Dr Perrot' },
    { id:61, nombre:'Vagoneta Gato x 10 Kg', categoria:'gatos', precio:32335, destacado:false, marca:'Vagoneta' },
    { id:62, nombre:'Vagoneta Gato x 20 Kg', categoria:'gatos', precio:62340, destacado:false, marca:'Vagoneta' },
    { id:63, nombre:'Vagoneta Gato x 1 Kg (pack x8u)', categoria:'gatos', precio:35357, destacado:false, marca:'Vagoneta' },
    { id:64, nombre:'Vagoneta Gato Gourmet x 10 Kg', categoria:'gatos', precio:32335, destacado:false, marca:'Vagoneta' },
    { id:65, nombre:'Vagoneta Gato Gourmet x 20 Kg', categoria:'gatos', precio:62340, destacado:false, marca:'Vagoneta' },
    { id:66, nombre:'Vagoneta Gato Gourmet x 1 Kg (pack x8u)', categoria:'gatos', precio:35357, destacado:false, marca:'Vagoneta' },
    { id:67, nombre:'Vagoneta Gatito x 10 Kg', categoria:'gatos', precio:34545, destacado:false, marca:'Vagoneta' },
    { id:68, nombre:'Vagoneta Gatito x 0,5 Kg (pack x12u)', categoria:'gatos', precio:30536, destacado:false, marca:'Vagoneta' }
];

let productos = [];
let carrito = [];

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    setupUI();
});

async function cargarProductos() {
    try {
        if (typeof SHEET_CSV_URL !== 'undefined') {
            const resp = await fetch(SHEET_CSV_URL + '?v=' + Date.now());
            const csv = await resp.text();
            productos = parseCSV(csv);
        } else {
            throw new Error('Usando datos locales');
        }
    } catch {
        productos = PRODUCTOS_FALLBACK;
    }
    productos = productos.map(p => {
        if (p.precio_proveedor && !p.precio) {
            p.precio = Math.round(p.precio_proveedor * 1.35);
        }
        return p;
    });
    renderAll();
}

function parseCSV(csv) {
    const lines = csv.split('\n').filter(l => l.trim());
    if (lines.length < 2) return PRODUCTOS_FALLBACK;
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const results = [];
    for (let i = 1; i < lines.length; i++) {
        const vals = lines[i].split(',').map(v => v.trim());
        if (vals.length < 2) continue;
        const item = {};
        headers.forEach((h, idx) => { item[h] = vals[idx] || ''; });
        if (!item.nombre) continue;
        results.push({
            id: i,
            nombre: item.nombre,
            categoria: (item.categoria || '').toLowerCase(),
            precio: parseInt(item.precio_final) || parseInt(item.precio) || 0,
            precio_proveedor: parseInt(item.precio_proveedor) || 0,
            margen: parseInt(item.margen) || 35,
            imagen: item.imagen || '',
            destacado: (item.destacado || '').toUpperCase() === 'SI',
            marca: (item.nombre || '').split(' ')[0]
        });
    }
    return results.length ? results : PRODUCTOS_FALLBACK;
}

function renderAll() {
    renderProductos();
    renderDestacados();
    renderCarrito();
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
        grid.innerHTML = '<p style="text-align:center;padding:40px;color:#999;">No se encontraron productos 😔</p>';
        return;
    }
    grid.innerHTML = filtrados.map(p => crearCard(p)).join('');
}

function renderDestacados() {
    const grid = document.getElementById('destacadosGrid');
    if (!grid) return;
    const destacados = productos.filter(p => p.destacado).slice(0, 8);
    if (destacados.length === 0) {
        grid.innerHTML = '<p style="text-align:center;padding:20px;color:#999;">Próximamente...</p>';
        return;
    }
    grid.innerHTML = destacados.map(p => crearCard(p)).join('');
}

function crearCard(p) {
    const icono = p.categoria === 'gatos' ? '🐱' : '🐶';
    const enCarrito = carrito.find(i => i.id === p.id);
    const cant = enCarrito ? enCarrito.cant : 0;
    const imgHtml = p.imagen
        ? `<img src="${p.imagen}" alt="${p.nombre}" style="width:100%;height:100%;object-fit:cover;" />`
        : `<span style="font-size:3.5rem;">${icono}</span>`;
    return `
        <div class="producto-card">
            <div class="producto-img ${p.categoria}">${imgHtml}</div>
            <div class="producto-body">
                <div class="producto-marca">${p.marca || ''}</div>
                <div class="producto-nombre">${p.nombre}</div>
                <div class="producto-precio">$${p.precio.toLocaleString('es-AR')}</div>
                <div class="producto-cantidad">
                    <button class="qty-btn" data-id="${p.id}" data-accion="restar">−</button>
                    <span>${cant}</span>
                    <button class="qty-btn" data-id="${p.id}" data-accion="sumar">+</button>
                </div>
            </div>
        </div>
    `;
}

function renderCarrito() {
    const items = document.getElementById('cartItems');
    const total = document.getElementById('cartTotal');
    const count = document.getElementById('cartCount');
    if (!items) return;

    const totalCant = carrito.reduce((s, i) => s + i.cant, 0);
    if (count) count.textContent = totalCant;

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
                    <button class="qty-cart" data-id="${item.id}" data-accion="restar">−</button>
                    <span>${item.cant}</span>
                    <button class="qty-cart" data-id="${item.id}" data-accion="sumar">+</button>
                </div>
            </div>
            <div class="cart-item-remove" data-id="${item.id}">✕</div>
        </div>
    `).join('');

    const totalPrecio = carrito.reduce((s, i) => s + i.precio * i.cant, 0);
    if (total) total.textContent = '$' + totalPrecio.toLocaleString('es-AR');
}

document.addEventListener('click', function(e) {
    const qtyBtn = e.target.closest('.qty-btn, .qty-cart');
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
        } else {
            const item = carrito.find(i => i.id === id);
            if (!item) return;
            item.cant--;
            if (item.cant <= 0) carrito = carrito.filter(i => i.id !== id);
        }
        renderAll();
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
        menuToggle.addEventListener('click', () => nav.classList.toggle('open'));
    }

    document.getElementById('cartToggle')?.addEventListener('click', e => {
        e.preventDefault();
        abrirCarrito();
    });
    document.getElementById('cartClose')?.addEventListener('click', cerrarCarrito);
    document.getElementById('cartOverlay')?.addEventListener('click', cerrarCarrito);
    document.getElementById('cartSend')?.addEventListener('click', enviarWhatsApp);

    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
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
