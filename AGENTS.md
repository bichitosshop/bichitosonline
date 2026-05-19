# BICHITOS SHOP — Project Conventions

## Stack
- **Language**: HTML5, CSS3, JavaScript (ES6+)
- **Framework**: None (vanilla)
- **Build**: None (static files, no bundler)
- **Hosting**: GitHub Pages
- **Cart/Checkout**: Client-side → WhatsApp (no backend)

## Structure
```
/ → index.html, productos.html, contacto.html
css/style.css
js/script.js
```

## Design Tokens
- Orange: `--orange` `#FF7F2A` / `--orange-dark` `#e66e1f`
- Teal: `--teal` `#2EC4B6` / `--teal-dark` `#25a89c`
- Cream: `--cream` `#FFF8F0`
- Font: system-ui stack (no Google Fonts)
- Container max-width: 1200px (content), 1100px (header)
- Shadows: `--shadow` `0 4px 20px rgba(0,0,0,0.08)`

## CSS Conventions
- **kebab-case** class names: `.producto-card`, `.qty-selector`
- CSS custom properties for colors (inline values only for spacing)
- Grid for 2D layouts (`.productos-grid`, `.contacto-grid`)
- Flexbox for 1D layouts (`.header-flex`, `.qty-selector`)
- **No inline styles** (exceptions: emoji fallback in icon span, no-search-message)
- **Mobile-first**: base styles for mobile, `@media (min-width: 768px)` for desktop

## JavaScript Conventions
- `const` / `let` (no `var`)
- Arrow functions, template literals, `async/await`
- Event delegation on `document` for dynamic content
- `data-*` attributes for DOM–JS binding (`data-id`, `data-accion`)
- Product IDs as integers, cart as array of objects
- Spanish function names for UI actions, English for data

## Accessibility (WCAG 2.1 AA)
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` landmarks
- `<h1>`–`<h4>` hierarchical heading structure
- `aria-label` on icon-only buttons and interactive elements
- Skip-to-content link as first focusable element
- Focus visible indicators on all interactive elements
- `prefers-reduced-motion` for animations
- Touch targets ≥ 44×44px
- Color contrast ≥ 4.5:1 (normal text) / 3:1 (large text)
- `aria-live="polite"` on dynamically updated regions (cart count, search results)

## Process
1. **Always propose visual structure** (wireframe/layout) before coding UI
2. Confirm layout approach and component tree with user first
3. Test responsive: mobile (375px) → tablet (768px) → desktop (1200px)
4. Run `opencode audit` after UI changes
