// ============================================
// BICHITOS SHOP — Config Loader
// Lee site-config.json y aplica tema + banners + secciones al sitio
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
    aplicarTema();
    aplicarSecciones();
    aplicarStore();
    aplicarBanners();
}

// ── Tema: inyecta CSS variables en :root ──────────────────────────────
function aplicarTema() {
    const cfg = window.siteConfig?.theme;
    if (!cfg) return;
    const root = document.documentElement;
    if (cfg.colorPrimary)    root.style.setProperty('--blue',   cfg.colorPrimary);
    if (cfg.colorAccent)     root.style.setProperty('--orange', cfg.colorAccent);
    if (cfg.colorTeal)       root.style.setProperty('--teal',   cfg.colorTeal);
    if (cfg.colorBackground) root.style.setProperty('--cream',  cfg.colorBackground);
    if (cfg.borderRadius)    root.style.setProperty('--radius-sm', cfg.borderRadius + 'px');
    if (cfg.fontFamily)      root.style.setProperty('--font', `'${cfg.fontFamily}', -apple-system, sans-serif`);
}

// ── Secciones: muestra u oculta según config ──────────────────────────
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

// ── Store info: nombre, footer, whatsapp ──────────────────────────────
function aplicarStore() {
    const s = window.siteConfig?.store;
    if (!s) return;
    // Footer tagline
    const tagline = document.querySelector('.footer-grid > div:first-child p');
    if (tagline && s.footerTagline) tagline.textContent = s.footerTagline;
    // Footer copyright
    const copy = document.querySelector('.footer-bottom p');
    if (copy && s.copyright) copy.textContent = '© ' + s.copyright;
    // Horarios
    const horarios = document.querySelector('.footer-grid .horarios-weekday');
    if (horarios && s.scheduleWeekdays) horarios.textContent = s.scheduleWeekdays;
    const finde = document.querySelector('.footer-grid .horarios-weekend');
    if (finde && s.scheduleWeekend) finde.textContent = s.scheduleWeekend;
    // Links WA
    if (s.whatsapp) {
        document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
            a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + s.whatsapp);
        });
    }
}

// ── Banners: reconstruye slides del carrusel ──────────────────────────
function aplicarBanners() {
    const banners = window.siteConfig?.banners;
    const track = document.getElementById('carouselTrack');
    if (!track || !banners || banners.length === 0) return;

    const activos = banners.filter(b => b.active !== false);
    if (activos.length === 0) return;

    track.innerHTML = activos.map((b, i) => {
        return `<div class="carousel-slide" style="background:url('${b.image}') center/cover no-repeat;" data-banner-id="${b.id}"></div>`;
    }).join('');
}

// ── Live preview: escucha mensajes del editor visual ─────────────────
window.addEventListener('message', e => {
    if (e.data?.type === 'BICHITOS_CONFIG') {
        window.siteConfig = e.data.config;
        aplicarTema();
        aplicarSecciones();
        aplicarStore();
        aplicarBanners();
    }
});

// ── Iniciar al cargar el DOM ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    await cargarSiteConfig();
    // Avisar al editor que el iframe está listo
    if (window.parent !== window) {
        window.parent.postMessage({ type: 'BICHITOS_READY' }, '*');
    }
});
