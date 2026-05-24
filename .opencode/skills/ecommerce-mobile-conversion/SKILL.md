# Ecommerce Mobile Conversion

Optimize mobile shopping experience for maximum conversion on a vanilla HTML/CSS/JS static ecommerce site.

## When to Use
- Designing or improving mobile layouts
- Implementing thumb-friendly interactions
- Adding mobile-specific conversion patterns
- Reducing friction on small screens for cart/checkout

## Architecture (BICHITOS SHOP model)
- Mobile-first CSS: base styles for ≤767px, then `@media (min-width: 768px)`
- JavaScript event delegation on `document` for all dynamic content
- Cart modal slides in from right (full screen on mobile, drawer on desktop)
- Sticky header with blur backdrop on mobile

## Mobile-First UX Patterns

### Thumb Zone Optimization
- **Primary CTA** (Agregar al carrito) → bottom of card, within thumb reach
- **Navigation** → bottom or thumb-accessible top
- **Close buttons** → top-right (hard to reach) OR bottom (better) on modals
- **Critical actions** → lower third of screen:
  - "Consultar por WhatsApp" button sticky at bottom of cart
  - Filter/sort controls accessible from bottom sheet
- **Touch targets** ≥ 44×44px minimum (WCAG 2.1 AA)

### Mobile Cart Flow
1. Tap product card → quick-add animation (no full page reload)
2. Cart icon badge updates immediately with count
3. Cart slides from right (not push) — feels smooth
4. WhatsApp CTA at bottom of cart — always visible
5. Empty cart: CTA to "Ver productos"

### Mobile-Specific Patterns

**Sticky Add to Cart Bar**
```css
.sticky-atc-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--cream);
  box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
  padding: 12px 20px;
  z-index: 100;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}
.sticky-atc-bar.visible {
  transform: translateY(0);
}
```

**Bottom Sheet Filters** (prefer over side panels)
```css
.filtros-sheet {
  position: fixed;
  inset: auto 0 0 0;
  background: white;
  border-radius: 16px 16px 0 0;
  max-height: 80vh;
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 200;
}
.filtros-sheet.open {
  transform: translateY(0);
}
```

### Scroll Behavior
- **Smooth scroll** for same-page navigation
- **Infinite scroll vs pagination**: For static sites, show all products with "Cargar más" button or simple client-side pagination (15-20 per page)
- **Scroll position restore**: Save scroll position before modal/cart opens, restore on close

### Performance for Mobile
- Reduce JS bundle: tree-shake, minify
- CSS animations only on `transform` and `opacity` (GPU accelerated)
- `will-change: transform` only on continuously animated elements
- Images: `loading="lazy"`, explicit `width`/`height` to prevent layout shift
- No `@import` in CSS — blocks rendering

### Accessibility on Mobile
- Touch targets ≥ 44×44px
- No hover-only interactions (must work on touch)
- Adequate color contrast for outdoor viewing (sunlight)
- Font size minimum 16px to prevent iOS zoom on input focus

## Reference
- Baymard Institute mobile usability data
- Google Web Vitals: mobile performance
- Luke Wroblewski: Mobile First
