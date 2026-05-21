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
| `index.html` | Home: hero, categorías, productos destacados |
| `productos.html` | Grid completo con filtros (perros/gatos) + búsqueda |
| `contacto.html` | Información de contacto |

### Archivos clave
| Archivo | Rol |
|---------|-----|
| `css/style.css` | Todos los estilos (1 solo archivo, ~1250 líneas) |
| `js/api-service.js` | Clase `ProductosAPI`: fetch CSV, parseo, 68 productos fallback, agrupación por variantes |
| `js/config.js` | `SHEET_CSV_URL` — URL pública del Google Sheet en CSV |
| `js/script.js` | Toda la lógica: carrito, renderizado, checkout con mapa Leaflet |
| `productos-ejemplo.csv` | Plantilla CSV con los 68 productos para importar a Google Sheets |
| `GUIA-GOOGLE-SHEETS.md` | Instrucciones para la clienta sobre cómo editar productos |

---

## 2. SISTEMA DE DISEÑO ACTUAL

### Variables CSS (`:root` en style.css)

```css
--blue: #1B3B5A;        /* Color principal (azul petróleo) */
--blue-dark: #0f2a40;
--orange: #FF6B35;       /* CTAs, badges */
--orange-dark: #e55a2b;
--teal: #2EC4B6;         /* Acento secundario */
--yellow: #f1c40f;       /* Acento */
--cream: #FFFDF7;        /* Fondo general */
--gray: #5a6a7a;
--gray-dark: #1B3B5A;    /* Texto principal */
--black: #0d0d0d;
--font: system-ui stack; /* Sin Google Fonts */
```

### Radios, sombras, animaciones
- `--radius-sm: 12px`, `--radius-md: 20px`, `--radius-lg: 30px`, `--radius-full: 9999px`
- `--shadow`, `--shadow-lg`, `--shadow-orange`, `--shadow-teal`
- Curvas: `--bounce`, `--smooth` (cubic-bezier)
- `--fast: 0.2s`, `--norm: 0.35s`, `--slow: 0.6s`

### Paleta de colores ANTERIOR (reemplazada)
Si se quiere volver a la paleta original "juguetona":
- Naranja: `#FF7F2A` / Teal: `#2EC4B6` / Amarillo: `#FFD166` / Crema: `#FFF8F0`

---

## 3. FUNCIONALIDADES IMPLEMENTADAS

### Catálogo de productos
- **68 productos** hardcodeados como fallback en `api-service.js` (marcas: Estampa, Jaspe, Vagoneta, Liwué, Dr Perrot, Valiant)
- **Google Sheets como CMS**: los productos se cargan desde un CSV público. Si no hay conexión, usa los 68 de respaldo.
- **Cache de 5 minutos**: no refetch innecesario
- **Filtros**: por categoría (perros/gatos/todas) + búsqueda por texto
- **Selector KG**: productos que comparten nombre base (ej: "Estampa Plus perro x 15 Kg" y "... x 20 Kg") se agrupan en una card con pills de peso (`.kg-pill`)
- **Stock**: badge "🔥 Quedan pocos" (≤5), "🔴 Agotado" (0), "⭐ Más vendido" (destacado)

### Carrito de compras
- **localStorage** con clave `bichitos_carrito`
- **Panel lateral** que se desliza desde la derecha (`.cart-panel`)
- **FAB** (botón flotante abajo a la derecha) con contador
- Selector de cantidad (− / +) en cada ítem
- Cálculo de subtotal automático

### Checkout
- **Modal** con formulario: nombre + dirección
- **Mapa Leaflet** (OpenStreetMap, sin API key)
  - Click en mapa → coloca marcador → reverse geocoding con Nominatim
  - Botón "📍 Mi ubicación" (geolocalización del navegador)
  - Input de búsqueda de direcciones con debounce (300ms)
- **WhatsApp**: al enviar, genera mensaje con nombre, dirección, link de Google Maps con coordenadas, y detalle completo del carrito

### Diseño responsive
- Mobile-first (`@media (min-width: 768px)` para desktop)
- Header sticky con backdrop-filter blur
- Menú hamburguesa en mobile

### Accesibilidad (WCAG 2.1 AA)
- Skip-to-content link
- `aria-label` en botones sin texto
- `aria-live="polite"` en contador de carrito y resultados
- Touch targets ≥ 44×44px
- `prefers-reduced-motion` para animaciones

---

## 4. GOOGLE SHEETS COMO CMS

### Columnas del Sheet
```
nombre, categoria, precio, precio_proveedor, margen, imagen, destacado, stock
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

### Diseño visual (prioridad alta)
- [ ] **Hero**: actualmente solo texto + gradientes. Se probaron fotos de Unsplash pero no gustaron. Pendiente definir imagen/ilustración.
- [ ] **Categorías**: actualmente gradientes naranja/teal con emoji. Pendiente implementar diseño "casita de perro" con:
  - `clip-path` en forma de casa (techo triangular)
  - PNG de animal recortado sin fondo (sacado con remove.bg)
  - Fondo blanco
- [ ] **Tipografía**: actualmente system-ui stack. Considerar Outfit (como PetCo Market) u otra fuente más profesional via Google Fonts.
- [ ] **Paleta**: se cambió a azul petróleo + naranja. Evaluar si gusta o volver a la original.
- [ ] **Refuerzo visual de marca**: logos de marcas (Estampa, Vagoneta, etc.), slider de marcas como PetCo.

### Funcionalidades pendientes
- [ ] **Variantes en Google Sheet**: columnas `variante_de` y `variante_peso` para que la clienta pueda agrupar productos manualmente desde el Sheet (actualmente se agrupan automática por nombre)
- [ ] **Precios escalonados**: mostrar precio anterior (tachado), precio actual, y precio contado/efectivo (como PetCo)
- [ ] **Feedback de add-to-cart**: estado "Agregando..." → "✓ Listo!" en el botón
- [ ] **Cross-selling**: modal al agregar al carrito mostrando productos relacionados
- [ ] **Badges de descuento**: "Envío gratis", "20% OFF 🔥" en las cards
- [ ] **WhatsApp flotante**: botón permanente además del FAB del carrito (referencia PetCo)
- [ ] **Sección de marcas**: slider con logos de las marcas que venden
- [ ] **Testimonios**: sección con reseñas de clientes en la home
- [ ] **Newsletter**: captación de emails en el footer

### Problemas conocidos
- Los nombres de producto con coma (ej: "1,5kg") rompían el CSV — se arregló con quoting y parser mejorado
- El selector KG usaba `card.outerHTML` que perdía event listeners — se arregló con event delegation en `document`
- Productos sin imagen muestran SVG de animal como fallback
- Los 68 productos fallback no tienen imágenes reales todavía

---

## 6. REFERENCIA VISUAL: PetCo Market

Sitio de referencia: https://www.petcomarket.com.ar

### Lo que lo hace profesional
- **Paleta**: azul petróleo (`#1b4f72`) + naranja (`#ff6701`) + amarillo (`#f1c40f`)
- **Tipografía**: Outfit (Google Fonts) — sans-serif moderna
- **Cards de producto**:
  - Selector de KG en pills
  - Precio escalonado (tachado → actual → contado)
  - Badges de oferta ("Envío gratis", "20% OFF 🔥")
  - Imagen real del producto 480×480px webp
  - Feedback de add-to-cart con loading + check
- **Hero**: carrusel full-width con imágenes de banners
- **Categorías**: grid con fotos reales de animales + nombre (ej: "PERRO ADULTO", "GATO CACHORRO")
- **Marcas**: slider de logos (Royal Canin, Eukanuba, Purina, etc.)
- **Testimonios**: con foto de cliente + nombre real
- **WhatsApp flotante**: botón permanente

### Lo que NO podemos replicar (requiere backend)
- Calculadora de envío
- Cuentas de usuario
- Blog/CMS
- Variantes por SKU (peso como variante del mismo producto en lugar de productos separados)

---

## 7. CONVENIOS DE CÓDIGO

### HTML
- Semántico: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- `aria-label` en botones sin texto
- `loading="lazy"` en imágenes

### CSS
- kebab-case: `.producto-card`, `.qty-selector`
- Grid para layouts 2D, Flexbox para 1D
- Mobile-first: base = mobile, `@media (min-width: 768px)` = desktop
- No inline styles (excepción: `object-fit` dinámico en cards)

### JavaScript
- `const` / `let` (no `var`)
- Arrow functions, template literals
- Event delegation en `document` para elementos dinámicos
- `data-*` attributes: `data-id`, `data-accion`, `data-categoria`
- Nombres en español para UI, inglés para datos/utilidades

---

## 8. SKILLS Y HERRAMIENTAS

Skills de opencode instaladas en `.opencode/skills/`:
- `ui-ux-pro-max/` — guías de diseño UI/UX
- `design/` — guías de diseño visual (logos, banners, slides, colores)
- `ui-styling/` — referencias de Tailwind, shadcn, Canvas Design System
- `frontend-design/` — diseño frontend general
- `redesign-existing/` — rediseño de sitios existentes
- `api-designer/` — diseño de APIs (no relevante aquí)
- `ecommerce-product-card-ux/` — UX de cards de producto ecommerce

---

## 9. COMANDOS ÚTILES

```bash
# Ver el sitio localmente
python3 -m http.server 8000

# Publicar cambios
git add -A && git commit -m "mensaje" && git push

# Ver estado
git status
```
