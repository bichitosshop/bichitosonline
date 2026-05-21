# BICHITOS SHOP — Documento Maestro del Proyecto

> Proyecto: Tienda online de alimentos para mascotas (Mendoza)
> Dominio: https://bichitosshop.github.io/bichitosonline/
> Repo: https://github.com/bichitosshop/bichitosonline
> Stack: HTML5 + CSS3 + JS vanilla estático — Hosting: GitHub Pages — Sin backend

---

## 1. ARQUITECTURA DEL SITIO

### Páginas
| Archivo | Propósito |
|---------|-----------|
| `index.html` | Home: topbar, mega-menú, carrusel hero, categorías casita, slider marcas, destacados |
| `productos.html` | Grid completo con filtros (categoría + marca + búsqueda + orden) |
| `contacto.html` | Información de contacto |

### Archivos clave
| Archivo | Rol |
|---------|-----|
| `css/style.css` | Todos los estilos (~2070 líneas) |
| `js/api-service.js` | Clase `ProductosAPI`: fetch CSV, parseo, 68 productos fallback, agrupación por variantes |
| `js/config.js` | `SHEET_CSV_URL` + `WA_NUMBER` |
| `js/script.js` | Toda la lógica: carrito, renderizado, carrusel, search modal, checkout con mapa Leaflet, animaciones |
| `productos-ejemplo.csv` | Plantilla CSV con los 68 productos para importar a Google Sheets |
| `GUIA-GOOGLE-SHEETS.md` | Instrucciones para la clienta sobre cómo editar productos |
| `MASTER-DOC.md` | Este documento |
| `PROMPT-REDISENO.md` | Prompt original de rediseño con respuestas del dueño |

---

## 2. SISTEMA DE DISEÑO ACTUAL

### Variables CSS (`:root` en style.css)

```css
--blue: #1B3B5A;        /* Color principal (azul petróleo) */
--blue-dark: #0f2a40;
--orange: #FF6B35;       /* CTAs, badges, logo BICHITOS */
--orange-dark: #e55a2b;
--teal: #2EC4B6;         /* Acento, topbar, logo SHOP */
--teal-dark: #25a89c;
--yellow: #f1c40f;       /* Acento */
--cream: #FFFDF7;        /* Fondo general */
--gray: #5a6a7a;
--gray-dark: #1B3B5A;    /* Texto principal */
--black: #0d0d0d;
--whatsapp: #25D366;
--whatsapp-dark: #1da851;
--white: #FFFFFF;
--orange-glow: rgba(255,107,53,0.35);
--font: 'Inter', system-ui, -apple-system, sans-serif;
```

### Radios, sombras, animaciones
- `--radius-sm: 12px`, `--radius-md: 20px`, `--radius-lg: 30px`, `--radius-full: 9999px`
- `--shadow`, `--shadow-lg`, `--shadow-sm`, `--shadow-orange`, `--shadow-teal`
- Curvas: `--bounce` (cubic-bezier(0.34,1.56,0.64,1)), `--smooth` (cubic-bezier(0.16,1,0.3,1))
- `--fast: 0.2s`, `--norm: 0.35s`, `--slow: 0.6s`
- Base: `html { font-size: 14px }` — todos los rem escalan desde acá

### Keyframes de animación
| Nombre | Uso |
|--------|-----|
| `bounce-in` | Cards de producto al hacer scroll (scale + translate) |
| `fade-in` | Contenido del carrusel |
| `pop-in` | Badges al aparecer |
| `wiggle` | Hover en fallback de imagen (🐶🐱 rotan) |
| `slide-up` | Categorías al hacer scroll |
| `pulse` | Badges en hover |
| `shimmer` | Topbar (gradiente animado) |
| `wa-pulse` | WhatsApp FAB |
| `cart-highlight` | FAB del carrito al agregar ítem |
| `spin` | Spinner en botón "Agregando…" |
| `slide-down` | Search modal abre |
| `marquee` | Slider de marcas (22s loop) |

---

## 3. FUNCIONALIDADES IMPLEMENTADAS

### Estructurales
- **Topbar**: "📦 Envío gratis en Gran Mendoza" con shimmer
- **Header sticky**: mega-menú desktop (dropdowns hover) + acordeón mobile
- **Logo**: `BICHITOS` (naranja) + `SHOP` (azul), tratamiento tipográfico, sin emoji
- **Search modal**: fullscreen overlay con blur, input con debounce 300ms, filtra productos desde cualquier página
- **WhatsApp FAB**: botón flotante verde a la izquierda con pulse infinito
- **Cart FAB**: botón flotante a la derecha con badge contador

### Hero (Home)
- **Carrusel de 3 slides**: auto-play 5s, pausa en hover, touch swipe, flechas, dots con aria-live
- Slides con fondos de color sólido (#1B3B5A / #FF6B35 / #2EC4B6) + overlay + texto + CTA
- `prefers-reduced-motion` desactiva auto-play
- Flechas visibles en hover (desktop), siempre visibles en touch devices

### Categorías (Home)
- **Forma de casita de perro**: `clip-path: polygon(50% 0%, 100% 12%, 100% 100%, 0% 100%, 0% 12%)`
- Placeholder: emoji 🐶/🐱 grande hasta que se tengan PNGs recortados
- Redirigen a `productos.html?categoria=perros` / `productos.html?categoria=gatos`

### Slider de marcas (Home)
- Marquee infinito con `@keyframes` CSS (22s)
- Marcas: Estampa, Jaspe, Vagoneta, Liwué, Dr Perrot, Valiant
- Pausa en hover
- `mask-image` con gradiente para fade en bordes

### Catálogo de productos
- **68 productos** hardcodeados como fallback en `api-service.js`
- **Google Sheets como CMS**: load desde CSV público. Cache de 5 min. Fallback si no hay conexión.
- **CSV parser** mejorado: soporta quoting, campos `es_oferta` y `envio_gratis` (columna `'SI'` = true)
- **Filtros**: categoría (perros/gatos/todas) + marca (dropdown dinámico) + búsqueda por texto + orden (precio asc/desc, nombre A-Z/Z-A)
- **Filtros combinables**: todos pueden activarse simultáneamente
- **Selector KG**: productos que comparten nombre base (ej: "Estampa Plus perro x 15 Kg" y "... x 20 Kg") se agrupan en una card con pills de peso `.kg-pill`. Al switchear: cambia precio, imagen, badges y estado de stock.

### Cards de producto (estilo PetCo adaptado)
- Imagen 1:1 (200px altura) con fallback emoji 🐶/🐱
- **Badges** apilables: 🔴 Agotado > 🔥 Quedan pocos > 🔥 Oferta > ⭐ Más vendido > 🚚 Envío gratis
- Marca (teal uppercase), nombre, selector KG, precio
- **Botón 3 estados**: "Agregar" → "Agregando…" (400ms con spinner) → "✓ Agregado" (900ms en verde)
- **Stock=0**: botón deshabilitado, muestra "Sin stock", KG pills deshabilitadas
- Diseño ultra-compacto: badges `.45rem` con emoji `.55rem`

### Carrito de compras
- **localStorage** con clave `bichitos_carrito`
- **Panel lateral** que se desliza desde la derecha (`.cart-panel`)
- Selector de cantidad (− / +) en cada ítem
- Cálculo de subtotal automático
- Badge actualizado con `aria-live="polite"`

### Checkout
- **Modal** con formulario: nombre + dirección
- **Mapa Leaflet** (OpenStreetMap, sin API key)
  - Click en mapa → coloca marcador → reverse geocoding con Nominatim
  - Botón "📍 Mi ubicación" (geolocalización del navegador)
  - Input de búsqueda de direcciones con debounce (300ms)
- **WhatsApp**: al enviar, genera mensaje con nombre, dirección, link de Google Maps con coordenadas, y detalle completo del carrito

### Animaciones
- **Scroll**: IntersectionObserver — cards bounce-in con staggered delay al hacer scroll
- **Micro-interacciones**: KG pills hover lift + active scale, badges hover pulse, botones active scale (0.95), cart FAB pulse al agregar
- Todo respeta `prefers-reduced-motion`

### Accesibilidad (WCAG 2.1 AA)
- Skip-to-content link
- `aria-label` en todos los icon-only buttons (search, cart, WA, hamburguesa, arrows, dots, close)
- `aria-live="polite"` en contador de carrito, resultados de búsqueda
- `aria-expanded` en menú mobile
- Touch targets ≥ 44×44px
- `prefers-reduced-motion` para animaciones
- Color contrast ≥ 4.5:1

---

## 4. GOOGLE SHEETS COMO CMS

### Columnas del Sheet
```
nombre, categoria, precio, precio_proveedor, margen, imagen, destacado, stock, es_oferta, envio_gratis
```

### Cómo funciona
1. La clienta edita el Sheet en Google
2. `js/config.js` apunta a la URL pública CSV
3. `api-service.js` hace fetch con `?v=timestamp` (evita caché)
4. Si el sheet no responde, usa los 68 productos de fallback

### Cómo subir imágenes de producto
1. https://imgbb.com → Subir foto → "Enlace directo"
2. Pegar link en columna `imagen` del Sheet

---

## 5. PENDIENTES Y COSAS A MEJORAR

### Diseño visual (para la próxima IA)
- [ ] **Imágenes de carrusel**: reemplazar fondos de color sólido con imágenes reales de animales/productos (el dueño las va a buscar y mejorar con IA)
- [ ] **PNGs recortados para categorías**: reemplazar emojis 🐶🐱 con PNGs de perro/gato recortados sin fondo (remove.bg)
- [ ] **Imágenes de producto**: los 68 productos no tienen imágenes reales todavía — el dueño las va a buscar y mejorar con IA
- [ ] **Afinar diseño visual general**: colores, espaciado, tipografía, consistencia visual
- [ ] **Badges**: si el dueño quiere emojis más grandes o diseño más notorio, ajustar
- [ ] **Carrusel**: agregar imágenes de banner reales cuando estén listas

### Funcionalidades pendientes (para implementar)
- [ ] **Precios escalonados**: precio tachado, actual y contado (el dueño dijo "solo precio actual por ahora")
- [ ] **Cross-selling**: productos relacionados al agregar al carrito
- [ ] **Slider de marcas**: logos visuales en vez de texto (cuando tenga los logos)

### Problemas conocidos
- Los nombres de producto con coma (ej: "1,5kg") rompían el CSV — se arregló con quoting y parser mejorado
- El selector KG usaba `card.outerHTML` que perdía event listeners — se arregló con event delegation en `document`
- `enrichWithImages()` no se llamaba en `cargarProductos()` — se arregló (bug que rompía el KG selector)
- Productos sin imagen muestran emoji 🐶/🐱 como fallback
- Los 68 productos fallback no tienen imágenes reales todavía

---

## 6. REFERENCIA VISUAL: PetCo Market

Sitio de referencia: https://www.petcomarket.com.ar

### Lo que lo hace profesional
- **Paleta**: azul petróleo (`#1b4f72`) + naranja (`#ff6701`) + amarillo (`#f1c40f`)
- **Tipografía**: Outfit (Google Fonts) — acá usamos Inter
- **Cards de producto**:
  - Selector de KG en pills
  - Precio escalonado (tachado → actual → contado)
  - Badges de oferta ("Envío gratis", "20% OFF 🔥")
  - Imagen real del producto 480×480px webp
  - Feedback de add-to-cart con loading + check
- **Hero**: carrusel full-width con imágenes de banners
- **Categorías**: grid con fotos reales de animales + nombre
- **Marcas**: slider de logos (Royal Canin, Eukanuba, Purina, etc.)
- **Testimonios**: con foto de cliente + nombre real
- **WhatsApp flotante**: botón permanente

### Lo que NO podemos replicar (requiere backend)
- Calculadora de envío
- Cuentas de usuario
- Blog/CMS
- Variantes por SKU

---

## 7. CONVENIOS DE CÓDIGO

### HTML
- Semántico: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- `aria-label` en botones sin texto
- `loading="lazy"` en imágenes
- No inline styles (excepción: `object-fit` dinámico en cards)

### CSS
- kebab-case: `.producto-card`, `.qty-selector`
- Grid para layouts 2D, Flexbox para 1D
- Mobile-first: base = mobile, `@media (min-width: 768px)` = desktop
- CSS custom properties para colores, sombras, radios
- `prefers-reduced-motion` en animaciones

### JavaScript
- `const` / `let` (no `var`)
- Arrow functions, template literals, `async/await`
- Event delegation en `document` para elementos dinámicos
- `data-*` attributes: `data-id`, `data-accion`, `data-categoria`, `data-bg`, `data-base`, `data-varidx`
- Nombres en español para UI, inglés para datos/utilidades
- `fetch()` con `async/await` (no XMLHttpRequest)

---

## 8. RESPUESTAS DEL DUEÑO (del cuestionario)

| Aspecto | Decisión |
|---------|----------|
| Personalidad | Divertida y juguetona |
| Logo | Solo tipográfico — BICHITOS (naranja) SHOP (azul) |
| Hero | Carrusel de banners interactivos |
| Categorías | Casita de perro con PNG recortado (placeholders por ahora) |
| Cards | Completas como PetCo — badges, precio escalonado (solo actual por ahora), KG, feedback 3 estados |
| Tipografía | Inter desde Google Fonts |
| Paleta | Mantener azul + naranja |
| Menú | Megamenú con dropdown + acordeón mobile |
| Animaciones | Divertidas y notorias (con prefers-reduced-motion) |
| FABs | Carrito (derecha) + WhatsApp (izquierda) |
| Footer | Básico |
| Extra | Slider de marcas en home |

---

## 9. SKILLS Y HERRAMIENTAS

Skills de opencode instaladas en `.opencode/skills/`:
- `ui-ux-pro-max/` — guías de diseño UI/UX
- `design/` — guías de diseño visual
- `frontend-design/` — diseño frontend general
- `redesign-existing/` — rediseño de sitios existentes
- `ecommerce-product-card-ux/` — UX de cards de producto ecommerce

---

## 10. COMANDOS ÚTILES

```bash
# Ver el sitio localmente
python3 -m http.server 3000 --directory "/Users/Juani/Documents/BICHITOS SHOP"

# Publicar cambios
git add -A && git commit -m "mensaje" && git push

# Ver estado
git status
```
