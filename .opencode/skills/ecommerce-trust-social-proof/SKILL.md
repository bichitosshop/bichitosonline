# Ecommerce Trust & Social Proof

Build trust signals and social proof elements for a vanilla HTML/CSS/JS static ecommerce site with WhatsApp checkout.

## When to Use
- Adding trust badges and security signals to product pages and checkout
- Implementing review/rating display
- Building social proof notifications (pop-ups)
- Reducing purchase anxiety for first-time buyers

## Architecture (BICHITOS SHOP model)
- No backend — reviews, ratings, and testimonials are static or config-driven
- `site-config.json` may include testimonial entries or brand trust signals
- WhatsApp checkout creates inherent trust via person-to-person interaction
- Social proof rendered client-side from config or hardcoded data

## Trust Signal Patterns

### 1. Trust Badges (Checkout Area)
```
[🔒 Compra segura]  [🚚 Envíos a todo el país]  [💳 Transferencia/Débito]
[⭐ 4.9/5 en Google] [🏆 +500 clientes satisfechos] [🔄 Cambios y devoluciones]
```

### 2. Testimonials Section
```html
<section class="testimonios" aria-label="Testimonios de clientes">
  <h2>Lo que dicen nuestros clientes</h2>
  <div class="testimonios-grid">
    <blockquote class="testimonio-card">
      <div class="testimonio-stars" aria-label="5 estrellas">★★★★★</div>
      <p>"Excelente atención y rapidez en la entrega. Mi perrito amó la comida."</p>
      <footer>— María G., Mendoza</footer>
    </blockquote>
    <!-- more testimonials -->
  </div>
</section>
```

### 3. Social Proof Notifications (Toast-style)
```javascript
// Floating notification "X persona compró esto hace N minutos"
function mostrarNotificacionSocial() {
  const nombres = ['María', 'Juan', 'Laura', 'Carlos', 'Ana', 'Pedro'];
  const productos = carritoActuales.map(p => p.nombre);
  // Pick random
  const nombre = nombres[Math.floor(Math.random() * nombres.length)];
  const producto = productos[Math.floor(Math.random() * productos.length)];
  
  // Show toast
  const toast = document.createElement('div');
  toast.className = 'social-toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `
    <span class="social-toast-icon">🐾</span>
    <span><strong>${nombre}</strong> compró ${producto}</span>
  `;
  document.body.appendChild(toast);
  
  // Auto-remove after 4s
  setTimeout(() => toast.remove(), 4000);
}

// Show every 30-60 seconds (only after first visit)
if (!localStorage.getItem('social_proof_shown')) {
  setInterval(mostrarNotificacionSocial, 40000);
  localStorage.setItem('social_proof_shown', 'true');
}
```

### 4. WhatsApp Chat Availability
```html
<div class="trust-whatsapp">
  <svg class="whatsapp-icon" aria-hidden="true">...</svg>
  <div>
    <p class="trust-whatsapp-title">Consultá por WhatsApp</p>
    <p class="trust-whatsapp-sub">Te respondemos en minutos</p>
    <p class="trust-whatsapp-hours">🕐 Lun a Sáb de 9 a 20hs</p>
  </div>
  <a href="https://wa.me/..." class="btn-whatsapp" aria-label="Contactar por WhatsApp">
    Escribinos
  </a>
</div>
```

### 5. Return & Warranty Policy
- "Cambios y devoluciones dentro de los 10 días"
- "Todos nuestros productos son originales"
- "Consultá por presupuesto sin compromiso"
- These should be visible near the checkout/WhatsApp CTA

### 6. Payment Methods Display
```html
<div class="payment-methods" aria-label="Métodos de pago aceptados">
  <p class="payment-methods-title">Medios de pago</p>
  <div class="payment-icons">
    <span class="payment-icon">Transferencia</span>
    <span class="payment-icon">Débito</span>
    <span class="payment-icon">Efectivo</span>
    <span class="payment-icon">Mercado Pago</span>
  </div>
</div>
```

### 7. Free Shipping Threshold
```html
<div class="shipping-banner">
  🚚 ${shippingFreeThreshold - currentTotal > 0
    ? `Faltan $${shippingFreeThreshold - currentTotal} para envío gratis`
    : '¡Envío gratis!'}
</div>
```

## Trust-Building Copy Patterns
- **Hero section**: "Hacemos el cambio a alimento natural 🐾"
- **Footer**: "Somos una tienda mendocina dedicada a la nutrición natural de tus mascotas"
- **Product cards**: "Producto original — consultá por WhatsApp"
- **Cart**: "Sin compromiso — te pasamos el presupuesto sin cargo"
- **No stock**: "Consultanos por reposición"

## Review/Rating Display (Static)
```javascript
const calificaciones = [
  { nombre: 'María G.', rating: 5, texto: 'Excelente calidad', fecha: '2025-12-01' },
  { nombre: 'Juan P.', rating: 5, texto: 'Mi perro lo ama', fecha: '2025-11-20' },
];
calificaciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
```

## Implementation Notes
- Don't fake social proof — use real customer names with permission
- Testimonials can be managed via `site-config.json` for admin editing
- Social proof toast: respect `prefers-reduced-motion` (show without animation)
- All trust elements should be visible without scrolling on mobile

## Reference
- Baymard Institute: trust building in ecommerce
- CXL Institute: social proof optimization
- ConversionXL: anxiety-reducing elements
