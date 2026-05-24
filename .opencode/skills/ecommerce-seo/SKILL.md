# Ecommerce SEO

Optimize product pages and site structure for search engines on a static vanilla HTML/CSS/JS ecommerce site.

## When to Use
- Improving organic search visibility for product pages
- Adding structured data / schema markup
- Building SEO-friendly navigation and URL structure
- Generating meta tags dynamically for product pages

## Architecture (BICHITOS SHOP model)
- Static HTML pages: `index.html`, `productos.html`, `contacto.html`
- Products rendered client-side via `js/api-service.js` from `productos.json`
- No SSR, no SSR-friendly pre-rendering — all SEO burden on static pages + structured data
- GitHub Pages hosting (no server-side rewrites)

## SEO Strategy for Client-Side Rendered Products

### Structured Data (JSON-LD)
Inject via `<script type="application/ld+json">` in `productos.html` for:
- **WebSite** (homepage)
- **WebPage** (category page)
- **Product** (individual product — can inject dynamically)

```javascript
// Dynamic schema insertion for each product card
function generarSchemaProducto(producto) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": producto.nombre,
    "image": producto.imagen,
    "description": producto.descripcion?.substring(0, 200),
    "category": producto.etapa,
    "offers": {
      "@type": "Offer",
      "price": producto.precio,
      "priceCurrency": "ARS"
    }
  };
}
```

### Critical SEO Elements
- **`<title>`**: Unique per page — "Bichitos Shop — Alimento para perros y gatos" (productos.html)
- **`<meta name="description">** : 150-160 chars, includes keywords
- **`<link rel="canonical">`**: Self-referencing per page
- **`<meta name="robots">`**: `index, follow` for all pages
- **`og:title`**, `og:description`, `og:image`, `og:url`: For social sharing
- **`<meta name="keywords">`: Only if high-value — Google ignores but Bing/Yandex use
- **Open Graph** + **Twitter Cards** tags

### URL Structure (GitHub Pages)
```
/                           → index.html (home)
/productos.html             → All products
/productos.html?etapa=cachorro  → Filtered (no-js fallback)
/contacto.html              → Contact
```

### Image SEO
- `alt` text on every `<img>` with product name + category
- Descriptive filenames: `alimento-perros-adultos-carne.jpg` not `IMG_001.jpg`
- GitHub raw URLs for images — ensure they're indexable
- `loading="lazy"` for below-fold images

### Content Strategy
- Homepage: H1 with brand + value prop, H2 for sections (Destacados, Marcas)
- Category/etapa pages: Description paragraphs for each stage
- Contact page: Address, phone, WhatsApp with `wa.me` (indexable)
- Blog/articles: Not yet — consider adding for long-tail SEO

## Implementation Checklist
- [ ] Dynamic JSON-LD per product view
- [ ] BreadcrumbList schema on productos.html
- [ ] Organization schema with logo, social links
- [ ] hreflang if targeting multiple countries
- [ ] Sitemap.xml (manual for static site)
- [ ] robots.txt

## Reference
- Google Search Central: structured data guidelines
- Schema.org Product type
- Moz: ecommerce SEO guide
