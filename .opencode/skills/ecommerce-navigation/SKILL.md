# Ecommerce Navigation

Design and implement intuitive navigation for a vanilla HTML/CSS/JS static ecommerce site.

## When to Use
- Designing header/menu layout
- Implementing mobile navigation
- Building category hierarchy navigation
- Adding breadcrumbs and sub-navigation

## Architecture (BICHITOS SHOP model)
- Static HTML pages: `index.html`, `productos.html`, `contacto.html`
- Header with logo, nav links, search, cart icon — consistent across pages
- Mobile: full-screen overlay menu or slide-in drawer
- Desktop: horizontal nav bar with optional dropdowns
- Cart icon in header with live count badge

## Navigation Patterns

### Header Structure
```html
<header class="site-header">
  <div class="header-flex">
    <button class="menu-toggle" aria-label="Abrir menú" aria-expanded="false">
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </button>
    
    <a href="index.html" class="logo" aria-label="Bichitos Shop — Inicio">
      <span class="logo-icon">🐾</span>
      <span class="logo-text">Bichitos</span>
    </a>
    
    <nav class="nav-main" role="navigation" aria-label="Navegación principal">
      <ul class="nav-list">
        <li><a href="index.html" class="nav-link">Inicio</a></li>
        <li><a href="productos.html" class="nav-link">Productos</a></li>
        <li><a href="contacto.html" class="nav-link">Contacto</a></li>
      </ul>
    </nav>
    
    <div class="header-actions">
      <button class="btn-search" aria-label="Buscar productos">🔍</button>
      <button class="btn-cart" aria-label="Abrir carrito">
        🛒 <span class="cart-badge" aria-live="polite">0</span>
      </button>
    </div>
  </div>
</header>
```

### Mobile Menu (Full-Screen Overlay)
```css
.nav-main {
  position: fixed;
  inset: 0;
  background: var(--cream);
  z-index: 999;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  padding: 80px 20px 20px;
}
.nav-main.open {
  transform: translateX(0);
}
.nav-list {
  flex-direction: column;
  gap: 8px;
}
.nav-link {
  font-size: 1.2rem;
  padding: 12px 16px;
  display: block;
}
```

### Desktop Navigation
```css
@media (min-width: 768px) {
  .menu-toggle { display: none; }
  .nav-main {
    position: static;
    transform: none;
    background: none;
    padding: 0;
  }
  .nav-list {
    flex-direction: row;
    gap: 4px;
  }
  .nav-link {
    padding: 8px 16px;
    border-radius: 8px;
  }
  .nav-link:hover {
    background: var(--teal-light);
  }
}
```

### Active Page Indicator
```javascript
function highlightCurrentPage() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === current);
    link.setAttribute('aria-current', href === current ? 'page' : 'false');
  });
}
```

## Breadcrumbs (Product Category Pages)
```html
<nav class="breadcrumbs" aria-label="Breadcrumb">
  <ol class="breadcrumbs-list">
    <li><a href="index.html">Inicio</a></li>
    <li><a href="productos.html">Productos</a></li>
    <li aria-current="page">Alimento para perros</li>
  </ol>
</nav>
```

```css
.breadcrumbs {
  padding: 12px 0;
  font-size: 0.85rem;
}
.breadcrumbs-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
}
.breadcrumbs-list li:not(:last-child)::after {
  content: '/';
  margin-left: 8px;
  color: #999;
}
.breadcrumbs-list a {
  color: var(--teal);
  text-decoration: none;
}
```

## Cart Icon with Badge
```html
<button class="btn-cart" aria-label="Abrir carrito" data-accion="abrir-carrito">
  <svg class="cart-icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
  </svg>
  <span class="cart-badge" id="cart-count" aria-live="polite">0</span>
</button>
```

### Badge Update
```javascript
function actualizarBadgeCarrito() {
  const count = carrito.reduce((sum, p) => sum + p.cantidad, 0);
  const badge = document.getElementById('cart-count');
  if (badge) {
    badge.textContent = count;
    badge.classList.toggle('visible', count > 0);
  }
}
```

## Sticky Header
```css
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 248, 240, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0,0,0,0.06);
}
```

## Search Integration in Header
- Search icon opens search bar (expands inline or overlay)
- Keyboard shortcut: `/` to focus search
- Escape closes search
- Search results render in main area (not dropdown)

## Navigation UX Guidelines
- **3-click rule**: Any page reachable in ≤3 clicks
- **Current page indicator**: Visual highlight + `aria-current="page"`
- **Mobile**: Bottom nav bar (optional) for quick access to cart + productos
- **Logo**: Clickable to home, with `aria-label`
- **Skip link**: First focusable element "Saltar al contenido principal"
- **Consistent order**: Home → Productos → Contacto (all pages)

## Reference
- NNG: navigation patterns in ecommerce
- Baymard Institute: mega menu and category navigation
- WCAG: navigation accessibility requirements
