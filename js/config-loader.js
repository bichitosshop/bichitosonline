// ============================================
// BICHITOS SHOP — Config Loader v2
// Lee site-config.json y aplica tema, tipografía, botones,
// tamaños, secciones y banners al sitio en tiempo real.
// ============================================

window.siteConfig = null;
const CONFIG_PATH = 'site-config.json';

async function cargarSiteConfig() {
    try {
        const r = await fetch(CONFIG_PATH + '?v=' + Date.now());
        if (!r.ok) throw new Error('no config');
        window.siteConfig = await r.json();
    } catch {
        window.siteConfig = null;
    }
    aplicarConfig();
}

function aplicarConfig() {
    aplicarTema();
    aplicarBotones();
    aplicarTamanios();
    aplicarSecciones();
    aplicarOrdenSecciones();
    aplicarStore();
    aplicarBanners();
}

// ── Tema: variables CSS + fuente dinámica ──────────────────────────────
function aplicarTema() {
    const cfg = window.siteConfig?.theme;
    if (!cfg) return;
    const root = document.documentElement;

    if (cfg.colorPrimary)    root.style.setProperty('--blue',   cfg.colorPrimary);
    if (cfg.colorAccent)     root.style.setProperty('--orange', cfg.colorAccent);
    if (cfg.colorTeal)       root.style.setProperty('--teal',   cfg.colorTeal);
    if (cfg.colorBackground) root.style.setProperty('--cream',  cfg.colorBackground);
    if (cfg.borderRadius)    root.style.setProperty('--radius-sm', cfg.borderRadius + 'px');

    if (cfg.fontFamily) {
        // Cargar Google Font dinámicamente
        let link = document.getElementById('cfg-google-font');
        if (!link) {
            link = document.createElement('link');
            link.id = 'cfg-google-font';
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
        const fam = cfg.fontFamily.replace(/ /g, '+');
        link.href = `https://fonts.googleapis.com/css2?family=${fam}:wght@400;500;600;700;800;900&display=swap`;
        root.style.setProperty('--font', `'${cfg.fontFamily}', -apple-system, BlinkMacSystemFont, sans-serif`);
    }
}

// ── Botones: inyecta CSS + actualiza textos ────────────────────────────
function aplicarBotones() {
    const btns = window.siteConfig?.buttons;
    document.getElementById('cfg-btn-styles')?.remove();
    if (!btns) return;

    const css = [];

    // Botón "Agregar"
    if (btns.addToCart) {
        const b = btns.addToCart;
        const props = [];
        if (b.bg)         props.push(`background: ${b.bg} !important`);
        if (b.color)      props.push(`color: ${b.color} !important`);
        if (b.radius !== undefined) props.push(`border-radius: ${b.radius}px !important`);
        if (b.paddingV)   props.push(`padding-top: ${b.paddingV}px !important; padding-bottom: ${b.paddingV}px !important`);
        if (props.length) css.push(`.btn-add-cart { ${props.join('; ')} }`);
        // Actualizar texto en botones ya renderizados
        if (b.text) {
            document.querySelectorAll('.btn-add-cart .btn-text').forEach(el => {
                el.textContent = b.text;
            });
        }
    }

    // Botón "Enviar pedido por WhatsApp" (carrito)
    if (btns.cartSend) {
        const b = btns.cartSend;
        const props = [];
        if (b.bg)     props.push(`background: ${b.bg} !important`);
        if (b.color)  props.push(`color: ${b.color} !important`);
        if (b.radius !== undefined) props.push(`border-radius: ${b.radius}px !important`);
        if (props.length) css.push(`.btn-cart-send { ${props.join('; ')} }`);
        if (b.text) {
            document.querySelectorAll('.btn-cart-send').forEach(el => { el.textContent = b.text; });
        }
    }

    // Botón Checkout
    if (btns.checkout) {
        const b = btns.checkout;
        const props = [];
        if (b.bg)     props.push(`background: ${b.bg} !important`);
        if (b.color)  props.push(`color: ${b.color} !important`);
        if (b.radius !== undefined) props.push(`border-radius: ${b.radius}px !important`);
        if (props.length) css.push(`#checkoutSubmit { ${props.join('; ')} }`);
        const el = document.getElementById('checkoutSubmit');
        if (el && b.text) el.textContent = b.text;
    }

    if (css.length > 0) {
        const style = document.createElement('style');
        style.id = 'cfg-btn-styles';
        style.textContent = css.join('\n');
        document.head.appendChild(style);
    }
}

// ── Tamaños: hero height, product image height ─────────────────────────
function aplicarTamanios() {
    const sizes = window.siteConfig?.sizes;
    document.getElementById('cfg-size-styles')?.remove();
    if (!sizes) return;

    const css = [];

    if (sizes.heroHeight) {
        const h = parseInt(sizes.heroHeight);
        const hMid = Math.round(h * 0.72);
        const hSm  = Math.round(h * 0.25);
        css.push(`@media (min-width: 1024px) { .hero-carousel { height: ${h}px !important; } }`);
        css.push(`@media (min-width: 768px) and (max-width: 1023px) { .hero-carousel { height: ${hMid}px !important; } }`);
        css.push(`@media (max-width: 767px) { .hero-carousel { height: ${hSm}px !important; } }`);
    }

    if (sizes.productImageHeight) {
        css.push(`.producto-img { height: ${sizes.productImageHeight}px !important; aspect-ratio: unset !important; }`);
    }

    if (css.length > 0) {
        const style = document.createElement('style');
        style.id = 'cfg-size-styles';
        style.textContent = css.join('\n');
        document.head.appendChild(style);
    }
}

// ── Secciones: mostrar/ocultar ─────────────────────────────────────────
function aplicarSecciones() {
    const sec = window.siteConfig?.sections;
    if (!sec) return;
    const toggle = (selector, visible) => {
        const el = document.querySelector(selector);
        if (el) el.style.display = visible ? '' : 'none';
    };
    toggle('.categorias',     sec.categorias    !== false);
    toggle('.marcas-section', sec.marcas        !== false);
    toggle('.destacados',     sec.destacados    !== false);
}

// ── Orden de secciones: reordena el DOM ────────────────────────────────
function aplicarOrdenSecciones() {
    const order = window.siteConfig?.sectionsOrder;
    const main  = document.getElementById('main');
    if (!order || !main || order.length === 0) return;

    const map = {
        categorias: main.querySelector('.categorias'),
        marcas:     main.querySelector('.marcas-section'),
        destacados: main.querySelector('.destacados'),
    };
    // appendChild mueve nodos existentes — perfecto para reordenar
    order.forEach(key => { if (map[key]) main.appendChild(map[key]); });
}

// ── Store info: footer, WhatsApp ───────────────────────────────────────
function aplicarStore() {
    const s = window.siteConfig?.store;
    if (!s) return;

    const tagline = document.querySelector('.footer-grid > div:first-child p');
    if (tagline && s.footerTagline) tagline.textContent = s.footerTagline;

    const copy = document.querySelector('.footer-bottom p');
    if (copy && s.copyright) copy.textContent = '© ' + s.copyright;

    if (s.whatsapp) {
        document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
            a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + s.whatsapp);
        });
    }
}

// ── Banners: reconstruye el carrusel ──────────────────────────────────
function aplicarBanners() {
    const banners = window.siteConfig?.banners;
    const track   = document.getElementById('carouselTrack');
    if (!track || !banners || banners.length === 0) return;

    const activos = banners.filter(b => b.active !== false);
    if (activos.length === 0) return;

    track.innerHTML = activos.map(b =>
        `<div class="carousel-slide" style="background:url('${b.image}') center/cover no-repeat;" data-banner-id="${b.id}"></div>`
    ).join('');
}

// ── postMessage: actualización en vivo desde el editor ────────────────
window.addEventListener('message', e => {
    if (e.data?.type === 'BICHITOS_CONFIG') {
        window.siteConfig = e.data.config;
        aplicarConfig();
    }
});

// ── Init ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    await cargarSiteConfig();
    // Avisar al editor que el iframe está listo
    if (window.parent !== window) {
        window.parent.postMessage({ type: 'BICHITOS_READY' }, '*');
    }
});
