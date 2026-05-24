# Ecommerce Analytics & Tracking

Implement conversion tracking, user behavior analytics, and data collection for a vanilla HTML/CSS/JS static ecommerce site.

## When to Use
- Setting up Google Analytics 4 (GA4)
- Tracking ecommerce events (view item, add to cart, checkout)
- Monitoring user behavior (scroll, click, search)
- A/B testing and conversion optimization measurement

## Architecture (BICHITOS SHOP model)
- Static site on GitHub Pages — no server-side tracking
- Client-side only: GA4 via gtag.js, localStorage for basic event logging
- No cookies for EU compliance (or minimal analytics-only consent)
- Events fire from JavaScript user interactions

## GA4 Setup

### Base Configuration
```html
<!-- Google tag (gtag.js) - GA4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    send_page_view: true,
    cookie_flags: 'SameSite=None;Secure'
  });
</script>
```

### Ecommerce Events to Track

**view_item** — When product card is visible or modal is opened
```javascript
function trackViewItem(producto) {
  gtag('event', 'view_item', {
    currency: 'ARS',
    value: producto.precio,
    items: [{
      item_id: producto.id,
      item_name: producto.nombre,
      item_category: producto.etapa,
      item_brand: producto.marca,
      price: producto.precio
    }]
  });
}
```

**add_to_cart** — When user clicks "Agregar"
```javascript
function trackAddToCart(producto, cantidad) {
  gtag('event', 'add_to_cart', {
    currency: 'ARS',
    value: producto.precio * cantidad,
    items: [{
      item_id: producto.id,
      item_name: producto.nombre,
      item_category: producto.etapa,
      item_brand: producto.marca,
      price: producto.precio,
      quantity: cantidad
    }]
  });
}
```

**begin_checkout** — When cart modal opens
```javascript
function trackBeginCheckout() {
  gtag('event', 'begin_checkout', {
    currency: 'ARS',
    value: calcularTotalCarrito(),
    items: carrito.map(p => ({
      item_id: p.id,
      item_name: p.nombre,
      item_category: p.etapa,
      item_brand: p.marca,
      price: p.precio,
      quantity: p.cantidad
    }))
  });
}
```

**purchase** — When WhatsApp link is clicked (proxy for purchase)
```javascript
function trackPurchase() {
  gtag('event', 'purchase', {
    currency: 'ARS',
    value: calcularTotalCarrito(),
    items: carrito.map(p => ({
      item_id: p.id,
      item_name: p.nombre,
      price: p.precio,
      quantity: p.cantidad
    })),
    transaction_id: 'WA-' + Date.now()
  });
}
```

### Custom Events
```javascript
// Search
gtag('event', 'search', { search_term: query });

// Filter by etapa
gtag('event', 'filter', { filter_type: 'etapa', filter_value: etapa });

// WhatsApp click (from any location)
gtag('event', 'whatsapp_click', { origin: 'cart' });
gtag('event', 'whatsapp_click', { origin: 'contact' });
gtag('event', 'whatsapp_click', { origin: 'hero' });

// Share product
gtag('event', 'share', { content_type: 'product', item_id: productoId });
```

## Local Storage Analytics (Fallback)
```javascript
const ANALYTICS_KEY = '_bichitos_analytics';

function logEvent(eventName, data = {}) {
  try {
    const log = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '[]');
    log.push({
      event: eventName,
      data,
      timestamp: new Date().toISOString(),
      page: window.location.pathname
    });
    // Keep last 500 events
    if (log.length > 500) log.splice(0, log.length - 500);
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(log));
  } catch (e) {
    // localStorage full or unavailable
  }
}
```

## Tracking Filter/Apply Pattern
Create a `trackEvent()` wrapper with a simple toggle so analytics can be disabled:

```javascript
const ANALYTICS_ENABLED = true; // Can be read from site-config.json

function trackEvent(action, category, label, value) {
  if (!ANALYTICS_ENABLED) return;
  
  // GA4
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
  
  // Local fallback
  logEvent(action, { category, label, value });
}
```

## Conversion Funnel Tracking
1. **Pageview** → All pages (GA4 default)
2. **View product** → Product card visible / modal opened
3. **Add to cart** → Click "Agregar"
4. **View cart** → Cart modal opened
5. **Checkout initiated** → WhatsApp button clicked
6. **Purchase** → WhatsApp link opened (proxy)

## Privacy Considerations
- **No cookies** for tracking-only (use localStorage for session)
- GA4 uses first-party cookies by default — configure cookie consent
- Add a simple cookie consent banner if targeting EU traffic
- Respect `Do Not Track` header: `navigator.doNotTrack === '1'`

## Dashboard & Reporting
- GA4 dashboard for real-time and historical data
- Custom GA4 reports: product performance, conversion funnel
- WhatsApp click events as conversion goals
- Search terms report (GA4 enhanced measurement)

## Reference
- Google Analytics 4 Measurement Protocol
- GA4 ecommerce event documentation
- web.dev: privacy-preserving analytics
- Google Tag Manager (GTM) for advanced tag management
