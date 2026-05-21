# BICHITOS SHOP — Guía para Claude

E-commerce de alimentos para mascotas en Mendoza, Argentina.
Dueño: Juani (no developer) — delegá todas las decisiones técnicas y visuales.

## Stack

- **HTML5 + CSS3 + JS vanilla** — sin frameworks, sin build system
- **Hosting:** GitHub Pages (`bichitosshop/bichitosonline`)
- **CMS:** Google Sheets publicado como CSV → `js/config.js` (`SHEET_CSV_URL`)
- **Checkout:** Carrito → mensaje formateado → WhatsApp (`WA_NUMBER` en config.js)
- **Mapa:** Leaflet.js (solo en modal de checkout)
- **Fuente:** Inter (Google Fonts, 400–900)

## Archivos clave

| Archivo | Rol |
|---|---|
| `index.html` | Home: hero carousel, casitas de categorías, slider de marcas |
| `productos.html` | Catálogo completo con filtros |
| `contacto.html` | Info de contacto |
| `css/style.css` | Todos los estilos (~2100 líneas) |
| `js/config.js` | Variables: `SHEET_CSV_URL`, `WA_NUMBER` |
| `js/api-service.js` | Fetch CSV, parseo, 68 productos fallback |
| `js/script.js` | Carrito, render de productos, checkout, carrusel, menú |

## Variables CSS (design tokens)

```css
--blue:   #1B3B5A   /* primario, header, footer */
--orange: #FF6B35   /* acción, botones CTA */
--teal:   #2EC4B6   /* acento, badges */
--yellow: #f1c40f   /* badge "oferta" */
--cream:  #FFFDF7   /* fondo general */
```

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

## Google Sheets como CMS

Columnas del CSV: `id, nombre, marca, categoria, etapa, precio, imagen, descripcion, es_oferta, envio_gratis, destacado, agotado, pocos_stock`

- `es_oferta` / `envio_gratis` → `"SI"` o `"NO"` (mayúsculas)
- `imagen` → URL directa (ImgBB o similar); si está vacío se usa placeholder automático

## Funciones JS importantes

```js
imagenContextual(p)   // Genera URL de placeholder según categoría e id
imgOnError(iconoCat)  // String para onerror → fallback SVG
crearCardGrupo(grupo) // Renderiza una card de producto con variantes
initCarousel()        // Hero: autoplay 5s, swipe, flechas, dots
renderProductos()     // Filtra + ordena + renderiza toda la grilla
```

## Regla crítica: enrichWithImages()

`api-service.js` debe llamar `this.enrichWithImages()` en AMBOS paths:
```js
// Path 1: CSV cargado
const products = this.enrichWithImages(this.parseCSV(csvText));
// Path 2: fallback
return this.enrichWithImages(this.getFallbackProducts());
```
Sin esto, `groupByVariants()` agrupa todo bajo `undefined` y solo aparece una card.

## Documentación adicional

- `GUIA-GOOGLE-SHEETS.md` — cómo el dueño edita productos
- `GUIA-IMAGENES.md` — cómo subir imágenes a ImgBB
- `MASTER-DOC.md` — historial completo de decisiones y arquitectura
