# Ecommerce Performance

Optimize Core Web Vitals and loading performance for a vanilla HTML/CSS/JS static ecommerce site on GitHub Pages.

## When to Use
- Improving Lighthouse/Pagespeed scores
- Reducing Largest Contentful Paint (LCP)
- Minimizing Cumulative Layout Shift (CLS)
- Optimizing First Input Delay (FID) / Interaction to Next Paint (INP)

## Architecture (BICHITOS SHOP model)
- Static site on GitHub Pages (no server-side optimizations possible)
- No build step — all optimization is manual/pre-runtime
- Assets: CSS, JS, images served from same origin or GitHub raw URLs
- No CDN control (GitHub Pages has Fastly CDN built-in)

## Optimization Checklist

### 1. Critical Rendering Path

**CSS**
```html
<!-- Critical CSS inlined (above-fold) -->
<style>/* critical above-fold styles ~15KB */</style>
<!-- Full CSS loaded async -->
<link rel="preload" href="css/style.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="css/style.css"></noscript>
```

**Fonts**
```html
<link rel="preload" href="fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
```
- Use `font-display: swap` in CSS `@font-face`
- Subset fonts to Latin if possible
- Prefer system-ui stack if Google Fonts cause CLS

**JavaScript**
- `defer` on all `<script>` tags (not `async` for DOM-dependent scripts)
- Inline critical JS (nav toggles, mobile menu)
- Lazy-load non-critical JS (analytics, config-loader)

### 2. Image Optimization

| Technique | Implementation |
|-----------|---------------|
| **Lazy loading** | `loading="lazy"` on all below-fold images |
| **Explicit dimensions** | `width` + `height` attributes on every `<img>` |
| **Aspect ratio** | `aspect-ratio: 3/2` in CSS as fallback |
| **Format** | WebP with `<picture>` + JPEG fallback (or GitHub Pages auto-optimization) |
| **Responsive** | `srcset` with multiple sizes if many viewport widths |
| **Compression** | JPG 80% quality, PNG quantized |

### 3. Layout Shift (CLS) Prevention

- **Always** set explicit `width` and `height` on images
- Reserve space for dynamic content (cart badge, search results)
- Font swap with `size-adjust` to prevent FOIT/FOUT shifts
- No late-loading inserts above existing content
- Cart/notifications use `position: fixed` (out of document flow)

### 4. JavaScript Performance

- Event delegation (single listener on `document`)
- Debounce search (300ms minimum)
- Throttle scroll handlers (requestAnimationFrame)
- Batch DOM reads/writes
- Avoid creating functions inside loops (use cached references)
- `const/let` only — no `var` (block scoping for GC)

### 5. Caching Strategy (GitHub Pages)

- HTML: Cache-Control max-age=600 (10 min)
- CSS/JS: Cache-Control max-age=31536000 (1 year) + content hash in filename
- Images: Cache-Control max-age=31536000 (1 year)
- `productos.json`: Cache-Control max-age=300 (5 min)
- Service Worker: Consider for offline support (Workbox or manual)

### 6. Network Optimization

- Preconnect to origins: `https://raw.githubusercontent.com`, Google Fonts
- Preload hero product image on home
- DNS-prefetch for external resources
- Reduce total JS: bundle size target <50KB gzipped
- No `@import` in CSS (blocking)

### 7. Performance Budget

| Metric | Target |
|--------|--------|
| LCP | ≤ 2.5s |
| FID/INP | ≤ 100ms |
| CLS | ≤ 0.1 |
| TBT | ≤ 200ms |
| Page weight | ≤ 500KB |
| JS size | ≤ 50KB gzip |
| CSS size | ≤ 30KB gzip |
| Time to Interactive | ≤ 3.5s |

## Measurement

```bash
# Lighthouse CLI
npx lighthouse https://bichitosshop.github.io/bichitosonline/ --view

# Pagespeed Insights API
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://bichitosshop.github.io/bichitosonline/"
```

## Reference
- web.dev: Core Web Vitals guide
- Lighthouse scoring calculator
- GitHub Pages performance best practices
