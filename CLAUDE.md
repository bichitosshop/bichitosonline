# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# BICHITOS SHOP — Guía para Claude

E-commerce de alimentos para mascotas en Mendoza, Argentina.
Dueño: Juani (no developer) — delegá todas las decisiones técnicas y visuales.

## Comandos / Workflow

Sin build system. Editás archivos → commit → push.

- **Preview local:** `python3 -m http.server 8000` (cualquier servidor estático sirve; abrir `productos.json`/CSV requiere servir por HTTP, no `file://`)
- **Deploy:** push a `main` en `bichitosshop/bichitosonline` → GitHub Pages auto-deploya (~1 min)
- **Cache busting:** los `<link>`/`<script>` usan `?v=N`. Al cambiar `css/style.css`, `js/script.js` o `js/config-loader.js`, incrementar `N` en los **3 HTML** (index, productos, contacto) — sino el CDN sirve la versión vieja por ~10 min. El patrón usado es `sed -i '' 's/style.css?v=N/style.css?v=N+1/g; ...' index.html productos.html contacto.html`.
- **Sin tests / sin linter.** No hay suite. La verificación es visual: mobile (375px) → tablet (768px) → desktop (1200px).

## Stack

- **HTML5 + CSS3 + JS vanilla** — sin frameworks, sin build system
- **Hosting:** GitHub Pages (`bichitosshop/bichitosonline`)
- **CMS:** `productos.json` (primario) → Google Sheets CSV → fallback hardcodeado
- **Checkout:** Carrito → mensaje formateado → WhatsApp (`WHATSAPP_NUMBER` en `script.js`)
- **Mapa:** Leaflet.js (solo en modal de checkout)
- **Fuente:** Plus Jakarta Sans (Google Fonts, cargada en los 3 HTML); puede cambiarse vía `site-config.json` → `theme.fontFamily`

## Archivos clave

| Archivo | Rol |
|---|---|
| `index.html` | Home: hero carousel, casitas de categorías, slider de marcas |
| `productos.html` | Catálogo completo con filtros |
| `contacto.html` | Info de contacto |
| `css/style.css` | Todos los estilos (~3600 líneas) |
| `js/config.js` | Constantes: `SHEET_CSV_URL`, `GITHUB_OWNER/REPO/BRANCH`, `PRODUCTOS_JSON_PATH` |
| `js/api-service.js` | Fetch de productos, parseo CSV, 68 productos fallback |
| `js/script.js` | Carrito, render de productos, checkout, carrusel, menú |
| `js/config-loader.js` | Aplica `site-config.json` al DOM (tema, botones, secciones, banners, etc.) |
| `site-config.json` | Config visual en runtime (sobreescribe tokens CSS) |
| `productos.json` | Catálogo de productos editado desde el admin panel |
| `admin/index.html` | Panel admin: gestión de productos (usa GitHub API para guardar) |
| `admin/editor.html` | Editor visual: renderiza el sitio en iframe y permite editar elementos |

## Variables CSS (design tokens)

```css
--blue:   #1B3B5A   /* primario, header, footer */
--orange: #FF6B35   /* acción, botones CTA */
--teal:   #2EC4B6   /* acento, badges */
--yellow: #f1c40f   /* badge "oferta" */
--cream:  #FFFDF7   /* fondo general */
```

> ⚠ **`site-config.json` gana en runtime.** Al cargar, `config-loader.js` (`aplicarTema()`) escribe `theme.colorPrimary/colorAccent/colorTeal/colorBackground` sobre `--blue/--orange/--teal/--cream`. Si cambiás un color **solo en CSS**, en producción podés seguir viendo el del JSON. Los cambios de paleta deben hacerse en **ambos lugares**, o eliminar la llamada en `config-loader.js`. Lo mismo aplica a fuente, radius, tamaños de card y textos de botones.

## site-config.json — estructura principal

```json
{
  "version": "1.2",
  "theme": { "colorPrimary", "colorAccent", "colorTeal", "colorBackground", "borderRadius", "fontFamily" },
  "banners": [ { "id", "active", "image", "ctaLink" } ],
  "sections": { "categorias", "marcas", "destacados" },
  "sectionsOrder": ["marcas", "categorias", "destacados"],
  "buttons": { "addToCart": { "text", "bg", "color", "radius", "paddingV" }, "cartSend", "checkout" },
  "cards": { "style": "scrapbook|clasico", "nameSize", "priceSize", "brandSize", "radius" },
  "store": { "footerTagline", "copyright", "whatsapp" },
  "elements": { "<data-edit-id>": { "text", "styles", "responsive", "hidden", "image" } },
  "logoImage", "logoSize", "logoOffsetX", "logoOffsetY"
}
```

## Editor visual — protocolo postMessage

`config-loader.js` corre dentro de un iframe en `admin/editor.html`. Mensajes que recibe/envía:

| Mensaje | Dirección | Descripción |
|---|---|---|
| `BICHITOS_READY` | iframe → parent | El sitio terminó de cargar |
| `BICHITOS_CONFIG` | parent → iframe | Aplica config en tiempo real |
| `BICHITOS_EDIT_MODE` `{ active: bool }` | parent → iframe | Activa/desactiva resaltado de elementos editables |
| `BICHITOS_ELEMENT_SELECTED` | iframe → parent | El usuario clickeó un elemento; devuelve su `editId`, estilos, texto |

Los elementos editables en el HTML se marcan con `data-edit-id="nombre"` y opcionalmente `data-edit-type="text|fab|..."`.

## Reglas visuales IMPORTANTES

- **Sin emojis decorativos.** Solo se permiten en contenido funcional de WhatsApp.
- **Fotos reales como placeholder** (nunca emoji como imagen):
  - Perros → `https://placedog.net/400/400?id={id}` (determinista por id)
  - Gatos → `https://loremflickr.com/400/400/cat?lock={id}`
  - Fallback via `onerror` → `images/icons/dog.svg` o `images/icons/cat.svg`
- **Botones grandes:** padding mínimo `17px` vertical.
- Paleta de colores: respetar siempre los tokens de arriba.

## Forma de la casita (clip-path)

Las tarjetas de categoría usan forma de casita:
```css
clip-path: polygon(50% 0%, 100% 18%, 100% 100%, 0% 100%, 0% 18%);
```
Las imágenes deben ser **400×400px** con el sujeto centrado/bajo (el 18% superior es el tejado).

## Google Sheets como CMS (fuente secundaria)

Columnas del CSV: `id, nombre, marca, categoria, etapa, precio, imagen, descripcion, es_oferta, envio_gratis, destacado, agotado, pocos_stock`

- `es_oferta` / `envio_gratis` → `"SI"` o `"NO"` (mayúsculas)
- `imagen` → URL directa (ImgBB o similar); si está vacío se usa placeholder automático
- La fuente **primaria** es `productos.json` (editada desde `admin/index.html` via GitHub API); el CSV es fallback si `productos.json` está vacío o falla.

## Fuentes de datos — orden de prioridad

`fetchProducts()` en `api-service.js` intenta en orden:
1. `productos.json` (fetch local, editado por admin panel)
2. `SHEET_CSV_URL` (Google Sheets publicado como CSV)
3. `getFallbackProducts()` (68 productos hardcodeados en el código)

## Funciones JS importantes

```js
imagenContextual(p)   // Genera URL de placeholder según categoría e id
imgOnError(iconoCat)  // String para onerror → fallback SVG
crearCardGrupo(grupo) // Renderiza una card de producto con variantes
initCarousel()        // Hero: autoplay 5s, swipe, flechas, dots
renderProductos()     // Filtra + ordena + renderiza toda la grilla
```

## Regla crítica: enrichWithImages()

`api-service.js` debe llamar `this.enrichWithImages()` en TODOS los paths de retorno:
```js
// Path 1: productos.json
const products = this.enrichWithImages(data);
// Path 2: CSV cargado
const products = this.enrichWithImages(this.parseCSV(csvText));
// Path 3: fallback
return this.enrichWithImages(this.getFallbackProducts());
```
Sin esto, `groupByVariants()` agrupa todo bajo `undefined` y solo aparece una card.

## Skills locales (`.agents/skills/`)

El proyecto tiene skills de diseño/debug instaladas (interface-design, web-design-guidelines, systematic-debugging, make-interfaces-feel-better, high-end-visual-design, ui-ux-pro-max, responsive-design, find-skills). Symlinkeadas en `.claude/skills/`. Se invocan automáticamente cuando aplican según su `description`. Para tareas de UI/diseño y debugging, usalas en vez de improvisar.

> Nota: `nano-banana-2` y `sleek-design-mobile-apps` requieren servicios pagos/CLI externos y **no son usables** en este entorno.

## Documentación adicional

- `AGENTS.md` — convenciones de código (CSS kebab-case, sin inline styles, WCAG 2.1 AA, JS ES6+, nombres de función en español para UI)
- `GUIA-GOOGLE-SHEETS.md` — cómo el dueño edita productos
- `GUIA-IMAGENES.md` — cómo subir imágenes a ImgBB
- `MASTER-DOC.md` — historial completo de decisiones y arquitectura
