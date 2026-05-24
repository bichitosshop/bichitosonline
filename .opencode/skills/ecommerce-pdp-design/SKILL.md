# Ecommerce PDP Design

Design high-converting product detail pages for a vanilla HTML/CSS/JS static ecommerce site.

## When to Use
- Designing or improving product card layouts (list/grid views)
- Creating product detail overlays or quick-view modals
- Implementing variant selection (size, flavor, stage)
- Adding social proof elements to product displays

## Architecture (BICHITOS SHOP model)
- Products rendered as cards via `renderProductos()` in `js/script.js`
- Product data from `productos.json` via `js/api-service.js`
- Card creation in `crearCard()` — template literal with `data-id` attribute
- Quick-view via `abrirModalProducto()` — full-screen modal on mobile, centered on desktop
- Variants by `etapa` (cachorro, adulto, senior) filtered via chips in `renderFiltrosEtapa()`

## Card Design Patterns

### Grid Cards (listado de productos)
```html
<article class="producto-card" data-id="42">
  <div class="producto-card-img">
    <img src="..." alt="Nombre del producto" loading="lazy">
    <span class="producto-card-badge">Oferta</span>
  </div>
  <div class="producto-card-body">
    <h3 class="producto-card-title">Nombre del producto</h3>
    <p class="producto-card-marca">Marca</p>
    <p class="producto-card-desc">Breve descripción</p>
    <div class="producto-card-footer">
      <span class="producto-card-precio">$9999</span>
      <button class="btn-agregar" data-accion="agregar" data-id="42">
        Agregar
      </button>
    </div>
  </div>
</article>
```

### Card States
| State | Visual |
|-------|--------|
| **Default** | Subtle shadow, rounded corners, clean layout |
| **Hover** | Lift -6px, deeper shadow, image scale 1.05 |
| **Focus** | Visible outline ring for keyboard nav |
| **Loading** | Skeleton shimmer while image loads |
| **In cart** | Badge "× en carrito" or quantity stepper replacing button |
| **Out of stock** | Desaturated, "Sin stock" overlay, CTA disabled |

### Card Content Hierarchy
1. **Image** — dominant visual, 3:2 or 1:1 aspect ratio
2. **Title** — H3, max 2 lines, truncated with ellipsis
3. **Brand/Marca** — secondary text, smaller
4. **Description** — 1-2 lines max, truncated
5. **Price** — bold, large, with $ sign
6. **CTA** — primary button, full-width on mobile

### Badges & Labels
- "Nuevo" — teal background
- "Oferta" — orange/red background  
- "Sin stock" — gray, overlay on image
- "Más vendido" — gold accent
- Placement: top-left or top-right of image container

## Quick-View Modal

### Layout
- Mobile: Full screen, slide up from bottom
- Desktop: Centered modal, max-width 800px, 2 columns (image left, details right)

### Content
- Large product image (gallery if multiple images)
- Title, brand, description (full)
- Price with per-unit if applicable
- Quantity selector (stepper)
- "Agregar al carrito" CTA
- Marca badge/link
- Etapa tag

### Interactions
- Close: X button (top-right) + Escape key
- Image: Click to zoom (lightbox) or swipe gallery on mobile
- Quantity: +/− buttons update total price inline
- ATC: adds to cart, shows animation, updates badge

## Conversion Patterns
- **Scarcity**: "Solo quedan X unidades" if stock info available
- **Social proof**: "A 15 personas les gusta este producto"
- **Upsells**: "Compralo junto con..." (related products)
- **Trust**: "Compra segura — consultanos por WhatsApp"

## Reference
- Baymard Institute: PDP usability
- NNG: product page design guidelines
- Amazon/Alibaba PDP patterns
