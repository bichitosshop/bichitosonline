// ============================================
// BICHITOS SHOP — Config Loader v3
// Aplica tema, tipografía, botones, elementos,
// título-línea, marcas y modo edición visual.
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
    aplicarTitleLine();
    aplicarElementos();
    aplicarSecciones();
    aplicarOrdenSecciones();
    aplicarStore();
    aplicarBanners();
    aplicarBrands();
    aplicarLogo();
    aplicarCards();
}

// ── Tema ──────────────────────────────────────────────────────────────
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
        ensureFont(cfg.fontFamily);
        root.style.setProperty('--font', `'${cfg.fontFamily}', -apple-system, BlinkMacSystemFont, sans-serif`);
    }
}

// ── Botones ───────────────────────────────────────────────────────────
function aplicarBotones() {
    const btns = window.siteConfig?.buttons;
    document.getElementById('cfg-btn-styles')?.remove();
    if (!btns) return;
    const css = [];

    if (btns.addToCart) {
        const b = btns.addToCart;
        const props = [];
        if (b.bg)       props.push(`background: ${b.bg} !important`);
        if (b.color)    props.push(`color: ${b.color} !important`);
        if (b.radius !== undefined) props.push(`border-radius: ${b.radius}px !important`);
        if (b.paddingV) props.push(`padding-top: ${b.paddingV}px !important; padding-bottom: ${b.paddingV}px !important`);
        if (props.length) css.push(`.btn-add-cart { ${props.join('; ')} }`);
        if (b.text) document.querySelectorAll('.btn-add-cart .btn-text').forEach(el => { el.textContent = b.text; });
    }
    if (btns.cartSend) {
        const b = btns.cartSend;
        const props = [];
        if (b.bg)     props.push(`background: ${b.bg} !important`);
        if (b.color)  props.push(`color: ${b.color} !important`);
        if (b.radius !== undefined) props.push(`border-radius: ${b.radius}px !important`);
        if (props.length) css.push(`.btn-cart-send { ${props.join('; ')} }`);
        if (b.text) document.querySelectorAll('.btn-cart-send').forEach(el => { el.textContent = b.text; });
    }
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
    if (css.length) {
        const s = document.createElement('style');
        s.id = 'cfg-btn-styles';
        s.textContent = css.join('\n');
        document.head.appendChild(s);
    }
}

// ── Tamaños ───────────────────────────────────────────────────────────
function aplicarTamanios() {
    const sizes = window.siteConfig?.sizes;
    document.getElementById('cfg-size-styles')?.remove();
    if (!sizes) return;
    const css = [];
    if (sizes.heroHeight) {
        const h = parseInt(sizes.heroHeight);
        css.push(`@media (min-width: 1024px) { .hero-carousel { height: ${h}px !important; } }`);
        css.push(`@media (min-width: 768px) and (max-width: 1023px) { .hero-carousel { height: ${Math.round(h*.72)}px !important; } }`);
        css.push(`@media (max-width: 767px) { .hero-carousel { height: ${Math.round(h*.25)}px !important; } }`);
    }
    if (sizes.productImageHeight) {
        css.push(`.producto-img { height: ${sizes.productImageHeight}px !important; aspect-ratio: unset !important; }`);
    }
    if (css.length) {
        const s = document.createElement('style');
        s.id = 'cfg-size-styles';
        s.textContent = css.join('\n');
        document.head.appendChild(s);
    }
}

// ── Línea decorativa de títulos ───────────────────────────────────────
function aplicarTitleLine() {
    const tl = window.siteConfig?.titleLine;
    document.getElementById('cfg-title-line')?.remove();
    const stops = tl?.stops?.length ? tl.stops : ['#FF6B35', '#f1c40f', '#2EC4B6'];
    const dir   = tl?.direction ?? 90;
    const h     = tl?.height ?? 4;
    const w     = tl?.width  ?? 80;
    const blur  = tl?.blur   ?? 0;
    const grad  = `linear-gradient(${dir}deg, ${stops.join(', ')})`;
    const s = document.createElement('style');
    s.id = 'cfg-title-line';
    s.textContent = `.section-title::after { background: ${grad} !important; height: ${h}px !important; width: ${w}px !important; ${blur > 0 ? `filter: blur(${blur}px) !important;` : ''} }`;
    document.head.appendChild(s);
}

// ── Estilos por elemento ──────────────────────────────────────────────
function aplicarElementos() {
    const elements = window.siteConfig?.elements;
    document.getElementById('cfg-element-styles')?.remove();
    if (!elements || !Object.keys(elements).length) return;

    const css = [];
    const BP = { desktop:'(min-width: 1024px)', tablet:'(min-width: 768px) and (max-width: 1023px)', mobile:'(max-width: 767px)' };

    Object.entries(elements).forEach(([id, cfg]) => {
        if (!cfg) return;
        const hasImage = !!cfg.image;
        // Imagen del elemento (reemplaza ícono/texto por <img>)
        applyElementImage(id, cfg.image, cfg);
        // Actualizar texto del elemento (solo si no hay imagen)
        if (!hasImage && cfg.text !== undefined) {
            document.querySelectorAll(`[data-edit-id="${id}"]`).forEach(el => {
                if (el.children.length === 0) {
                    el.textContent = cfg.text;
                } else {
                    // Tiene hijos (ej: link con ícono SVG): cambiar solo el primer
                    // nodo de texto, preservando los elementos hijos.
                    let tn = Array.from(el.childNodes).find(n => n.nodeType === 3 && n.textContent.trim());
                    if (tn) tn.textContent = cfg.text;
                    else el.insertBefore(document.createTextNode(cfg.text), el.firstChild);
                }
            });
        }
        // Ocultar elemento (en modo edición se ve atenuado para poder reactivarlo)
        if (cfg.hidden) {
            if (document.body.classList.contains('bx-edit')) {
                css.push(`[data-edit-id="${id}"] { opacity: .3 !important; outline: 2px dashed #ef4444 !important; }`);
            } else {
                css.push(`[data-edit-id="${id}"] { display: none !important; }`);
            }
        }
        // Estilos base
        const base = propsToCSS(cfg.styles || {});
        if (base) css.push(`[data-edit-id="${id}"] { ${base} }`);
        // Estilos responsive
        if (cfg.responsive) {
            Object.entries(cfg.responsive).forEach(([bp, styles]) => {
                const mq = BP[bp]; if (!mq) return;
                const props = propsToCSS(styles);
                if (props) css.push(`@media ${mq} { [data-edit-id="${id}"] { ${props} } }`);
            });
        }
        // Font para ese elemento
        if (cfg.styles?.fontFamily) ensureFont(cfg.styles.fontFamily);
        // Posición para FABs (position:fixed elements)
        if (cfg.position) {
            const p = cfg.position;
            const fabProps = [];
            if (p.bottom !== undefined) { fabProps.push(`bottom: ${p.bottom}px`); fabProps.push(`top: auto`); }
            if (p.top    !== undefined) { fabProps.push(`top: ${p.top}px`);       fabProps.push(`bottom: auto`); }
            if (p.right  !== undefined) { fabProps.push(`right: ${p.right}px`);   fabProps.push(`left: auto`); }
            if (p.left   !== undefined) { fabProps.push(`left: ${p.left}px`);     fabProps.push(`right: auto`); }
            if (fabProps.length) css.push(`[data-edit-id="${id}"] { ${fabProps.join(';')} !important; }`);
        }
        // Tamaño para FABs
        if (cfg.size) {
            css.push(`[data-edit-id="${id}"] { width: ${cfg.size}px !important; height: ${cfg.size}px !important; font-size: ${Math.round(cfg.size * 0.42)}px !important; }`);
        }
    });

    if (css.length) {
        const s = document.createElement('style');
        s.id = 'cfg-element-styles';
        s.textContent = css.join('\n');
        document.head.appendChild(s);
    }
}

// Reemplaza el contenido de un elemento (texto/ícono) por una imagen, o lo restaura
function applyElementImage(id, src, cfg) {
    cfg = cfg || {};
    document.querySelectorAll(`[data-edit-id="${id}"]`).forEach(el => {
        const isFab = el.dataset.editType === 'fab';
        let imgEl = el.querySelector(':scope > img.elem-img-custom');
        if (src) {
            // Ocultar hijos originales (preservar el badge del carrito y la propia imagen)
            Array.from(el.children).forEach(child => {
                if (child.classList.contains('elem-img-custom')) return;
                if (child.classList.contains('cart-fab-badge')) return;
                child.dataset.hiddenByImg = '1';
                child.style.display = 'none';
            });
            // Ocultar nodos de texto sueltos (emoji 🛒, "BICHITOS", etc.)
            el.childNodes.forEach(node => {
                if (node.nodeType === 3 && node.textContent.trim()) {
                    if (node._origText === undefined) node._origText = node.textContent;
                    node.textContent = '';
                }
            });
            if (!imgEl) {
                imgEl = document.createElement('img');
                imgEl.className = 'elem-img-custom';
                imgEl.alt = '';
                el.insertBefore(imgEl, el.firstChild);
            }
            imgEl.src = src;
            const ox = cfg.imageOffsetX || 0, oy = cfg.imageOffsetY || 0;
            const tf = `transform:translate(${ox}px,${oy}px);`;
            if (cfg.imageSize) {
                // Tamaño explícito (ancho en px) — anula los defaults
                imgEl.style.cssText = `width:${cfg.imageSize}px;height:auto;max-width:none;object-fit:contain;display:${isFab?'block':'inline-block'};vertical-align:middle;${tf}`;
            } else if (isFab) {
                imgEl.style.cssText = `width:62%;height:62%;object-fit:contain;display:block;${tf}`;
            } else {
                imgEl.style.cssText = `max-height:56px;width:auto;max-width:100%;object-fit:contain;display:inline-block;vertical-align:middle;${tf}`;
            }
        } else {
            // Restaurar contenido original
            Array.from(el.children).forEach(child => {
                if (child.dataset.hiddenByImg) { child.style.display = ''; delete child.dataset.hiddenByImg; }
            });
            el.childNodes.forEach(node => {
                if (node.nodeType === 3 && node._origText !== undefined) {
                    node.textContent = node._origText;
                    delete node._origText;
                }
            });
            if (imgEl) imgEl.remove();
        }
    });
}

function propsToCSS(styles) {
    if (!styles) return '';
    const p = [];
    if (styles.color)         p.push(`color: ${styles.color} !important`);
    if (styles.fontSize)      p.push(`font-size: ${styles.fontSize}px !important`);
    if (styles.fontFamily)    p.push(`font-family: '${styles.fontFamily}', sans-serif !important`);
    if (styles.textAlign)     p.push(`text-align: ${styles.textAlign} !important`);
    if (styles.fontWeight)    p.push(`font-weight: ${styles.fontWeight} !important`);
    if (styles.letterSpacing) p.push(`letter-spacing: ${styles.letterSpacing}px !important`);
    if (styles.background)    p.push(`background: ${styles.background} !important`);
    if (styles.opacity !== undefined) p.push(`opacity: ${styles.opacity} !important`);
    if (styles.marginTop    !== undefined) p.push(`margin-top: ${styles.marginTop}px !important`);
    if (styles.marginBottom !== undefined) p.push(`margin-bottom: ${styles.marginBottom}px !important`);
    return p.join('; ');
}

// ── Secciones: mostrar/ocultar ─────────────────────────────────────────
function aplicarSecciones() {
    const sec = window.siteConfig?.sections;
    if (!sec) return;
    const toggle = (sel, vis) => { const el = document.querySelector(sel); if (el) el.style.display = vis ? '' : 'none'; };
    toggle('.categorias',     sec.categorias    !== false);
    toggle('.marcas-section', sec.marcas        !== false);
    toggle('.destacados',     sec.destacados    !== false);
}

// ── Orden de secciones ────────────────────────────────────────────────
function aplicarOrdenSecciones() {
    const order = window.siteConfig?.sectionsOrder;
    const main  = document.getElementById('main');
    if (!order || !main) return;
    const map = {
        categorias: main.querySelector('.categorias'),
        marcas:     main.querySelector('.marcas-section'),
        destacados: main.querySelector('.destacados'),
    };
    order.forEach(k => { if (map[k]) main.appendChild(map[k]); });
}

// ── Store info ────────────────────────────────────────────────────────
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

// ── Banners ───────────────────────────────────────────────────────────
function aplicarBanners() {
    const banners = window.siteConfig?.banners;
    const track   = document.getElementById('carouselTrack');
    if (!track || !banners?.length) return;
    const activos = banners.filter(b => b.active !== false);
    if (!activos.length) return;
    track.innerHTML = activos.map(b =>
        `<div class="carousel-slide" style="background:url('${b.image}') center/cover no-repeat;" data-banner-id="${b.id}"></div>`
    ).join('');
}

// ── Brands: chips con logo opcional ──────────────────────────────────
function aplicarBrands() {
    const brands = window.siteConfig?.brands;
    const track  = document.getElementById('marcasTrack');
    if (!track) return;

    // Solo reconstruir si hay config de marcas
    if (!brands?.length) return;

    // Inyectar CSS para chips con logo si no existe
    if (!document.getElementById('cfg-brand-css')) {
        const s = document.createElement('style');
        s.id = 'cfg-brand-css';
        s.textContent = `
          .marca-chip-link { text-decoration: none; }
          .marca-chip-logo { display: inline-flex; align-items: center; gap: 6px; }
          .marca-chip-logo img { height: 22px; width: auto; object-fit: contain; vertical-align: middle; }
        `;
        document.head.appendChild(s);
    }

    function chipHTML(b) {
        const inner = b.logo
            ? `<span class="marca-chip marca-chip-logo"><img src="${b.logo}" alt="${b.name}" loading="lazy" onerror="this.style.display='none'" />${b.name}</span>`
            : `<span class="marca-chip">${b.name}</span>`;
        return b.link ? `<a class="marca-chip-link" href="${b.link}">${inner}</a>` : inner;
    }

    const html = brands.map(chipHTML).join('');
    track.innerHTML = html + html; // duplicar para marquee infinito
}

// ── Fuente dinámica ───────────────────────────────────────────────────
function ensureFont(fontFamily) {
    if (!fontFamily || fontFamily === 'Inter') return;
    const id = 'cfg-font-' + fontFamily.replace(/\s+/g, '-').toLowerCase();
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g,'+')}:wght@400;500;600;700;800;900&display=swap`;
    document.head.appendChild(link);
}

// ── Logo imagen opcional (con tamaño y posición) ──────────────────────
function aplicarLogo() {
    const cfg  = window.siteConfig || {};
    const img  = cfg.logoImage;
    const h    = cfg.logoSize ? parseInt(cfg.logoSize) : 36;   // alto en px
    const ox   = cfg.logoOffsetX || 0;
    const oy   = cfg.logoOffsetY || 0;
    document.querySelectorAll('.logo').forEach(logoEl => {
        const bichitosSpan = logoEl.querySelector('.logo-bichitos');
        const shopSpan     = logoEl.querySelector('.logo-shop');
        const svgEl        = logoEl.querySelector('.logo-svg');
        let imgEl = logoEl.querySelector('.logo-img-custom');
        if (img) {
            if (bichitosSpan) bichitosSpan.style.display = 'none';
            if (shopSpan)     shopSpan.style.display     = 'none';
            if (svgEl)        svgEl.style.display        = 'none';
            if (!imgEl) {
                imgEl = document.createElement('img');
                imgEl.className = 'logo-img-custom';
                imgEl.alt = 'BICHITOS SHOP';
                logoEl.insertBefore(imgEl, logoEl.firstChild);
            }
            imgEl.src = img;
            imgEl.style.cssText = `height:${h}px;width:auto;object-fit:contain;display:block;max-width:320px;transform:translate(${ox}px,${oy}px)`;
        } else {
            if (bichitosSpan) bichitosSpan.style.display = '';
            if (shopSpan)     shopSpan.style.display     = '';
            if (svgEl)        svgEl.style.display        = '';
            if (imgEl)        imgEl.style.display        = 'none';
        }
    });
}

// ── Tarjetas de producto: tamaños de texto y bordes ───────────────────
function aplicarCards() {
    const c = window.siteConfig?.cards;
    document.getElementById('cfg-card-styles')?.remove();
    if (!c) return;
    const css = [];
    if (c.nameSize)  css.push(`.producto-nombre { font-size: ${c.nameSize}px !important; }`);
    if (c.priceSize) css.push(`.producto-precio { font-size: ${c.priceSize}px !important; }`);
    if (c.brandSize) css.push(`.producto-marca  { font-size: ${c.brandSize}px !important; }`);
    if (c.radius !== undefined && c.radius !== '') css.push(`.producto-card { border-radius: ${c.radius}px !important; }`);
    if (css.length) {
        const s = document.createElement('style');
        s.id = 'cfg-card-styles';
        s.textContent = css.join('\n');
        document.head.appendChild(s);
    }
}

// ── MODO EDICIÓN VISUAL ───────────────────────────────────────────────
let _editActive = false;

const EDIT_CSS = `
  body.edit-active [data-edit-id] {
    outline: 2px dashed rgba(255,107,53,0.45) !important;
    outline-offset: 3px !important;
    cursor: pointer !important;
    transition: outline-color 0.15s !important;
  }
  body.edit-active [data-edit-id]:hover {
    outline: 2.5px solid #FF6B35 !important;
    background-color: rgba(255,107,53,0.04) !important;
  }
  body.edit-active [data-edit-id].edit-sel {
    outline: 3px solid #FF6B35 !important;
    outline-offset: 3px !important;
    box-shadow: 0 0 0 7px rgba(255,107,53,0.12) !important;
  }
  body.edit-active * { user-select: none; pointer-events: none; }
  body.edit-active [data-edit-id] { pointer-events: auto !important; }
`;

function enableEditMode() {
    _editActive = true;
    document.body.classList.add('edit-active');
    if (!document.getElementById('cfg-edit-css')) {
        const s = document.createElement('style');
        s.id = 'cfg-edit-css';
        s.textContent = EDIT_CSS;
        document.head.appendChild(s);
    }
    // Listener a nivel documento (capture) — intercepta antes de que el <a> navegue
    document.addEventListener('click', _globalEditCapture, true);
}

function disableEditMode() {
    _editActive = false;
    document.body.classList.remove('edit-active');
    document.removeEventListener('click', _globalEditCapture, true);
    document.querySelectorAll('[data-edit-id].edit-sel').forEach(x => x.classList.remove('edit-sel'));
}

function _globalEditCapture(e) {
    if (!_editActive) return;
    // Bloquear toda navegación / acción por defecto
    e.preventDefault();
    e.stopImmediatePropagation();

    // Buscar el [data-edit-id] más cercano al punto de click
    const el = e.target.closest('[data-edit-id]');
    if (!el) return;

    const editId   = el.dataset.editId;
    const editType = el.dataset.editType || 'text';

    document.querySelectorAll('[data-edit-id].edit-sel').forEach(x => x.classList.remove('edit-sel'));
    el.classList.add('edit-sel');

    const comp    = window.getComputedStyle(el);
    const savedEl = window.siteConfig?.elements?.[editId] || {};

    const info = {
        editId,
        type: editType,
        text: savedEl.text ?? el.textContent.trim(),
        styles: {
            color:         savedEl.styles?.color         || _rgbToHex(comp.color) || '',
            fontSize:      savedEl.styles?.fontSize      || Math.round(parseFloat(comp.fontSize)) || '',
            fontFamily:    savedEl.styles?.fontFamily    || comp.fontFamily?.split(',')[0]?.trim().replace(/['"]/g,'') || '',
            textAlign:     savedEl.styles?.textAlign     || comp.textAlign || '',
            fontWeight:    savedEl.styles?.fontWeight    || comp.fontWeight || '',
            letterSpacing: savedEl.styles?.letterSpacing ?? (parseFloat(comp.letterSpacing) || 0),
            background:    savedEl.styles?.background    || '',
        },
        responsive: savedEl.responsive || {},
        position: savedEl.position || null,
        size:     savedEl.size     || null,
        image:    savedEl.image    || '',
    };

    if (window.parent !== window) {
        window.parent.postMessage({ type: 'BICHITOS_ELEMENT_SELECTED', info }, '*');
    }
}

function _rgbToHex(rgb) {
    if (!rgb || rgb === 'transparent') return '';
    if (rgb.startsWith('#')) return rgb;
    const m = rgb.match(/\d+/g);
    if (!m || m.length < 3) return '';
    return '#' + m.slice(0,3).map(n => (+n).toString(16).padStart(2,'0')).join('');
}

// ── postMessage: editor en vivo ───────────────────────────────────────
window.addEventListener('message', e => {
    if (e.data?.type === 'BICHITOS_CONFIG') {
        window.siteConfig = e.data.config;
        aplicarConfig();
    }
    if (e.data?.type === 'BICHITOS_EDIT_MODE') {
        if (e.data.active) enableEditMode();
        else disableEditMode();
    }
});

// ── Init ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    await cargarSiteConfig();
    if (window.parent !== window) {
        window.parent.postMessage({ type: 'BICHITOS_READY' }, '*');
    }
});
