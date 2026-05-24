# Ecommerce Cart Recovery

Implement cart abandonment prevention and recovery strategies for a vanilla HTML/CSS/JS static ecommerce site with WhatsApp checkout.

## When to Use
- Reducing cart abandonment rate
- Implementing exit-intent strategies
- Building email/WhatsApp recovery flows
- Designing reminder notifications

## Architecture (BICHITOS SHOP model)
- Cart in `localStorage` (persists across sessions)
- No backend — cannot send automated emails/SMS
- Recovery via on-site prompts (exit intent, timers)
- WhatsApp as the recovery channel (admin can manually follow up)
- Cart save/restore on page refresh: `guardarCarrito()` / `cargarCarrito()`

## Abandonment Prevention Strategies

### 1. Exit-Intent Cart Prompt
Show when user moves cursor to leave the page while cart has items:

```javascript
let exitIntentShown = false;

function setupExitIntent() {
  document.addEventListener('mouseleave', (e) => {
    if (e.clientY > 0 || exitIntentShown) return; // Only track top exit
    if (carrito.length === 0) return;
    
    exitIntentShown = true;
    mostrarExitIntentModal();
  });
}

function mostrarExitIntentModal() {
  const modal = document.createElement('div');
  modal.className = 'exit-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <div class="exit-modal-content">
      <h3>¡Esperá! 🐾</h3>
      <p>Tu carrito tiene ${carrito.reduce((s, p) => s + p.cantidad, 0)} productos</p>
      <p class="exit-total">Total: $${calcularTotalCarrito().toLocaleString('es-AR')}</p>
      <div class="exit-actions">
        <a href="https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(construirMensajeCarrito())}"
           class="btn-primary"
           target="_blank">
          Consultar por WhatsApp
        </a>
        <button class="btn-secondary" onclick="cerrarExitIntent()">
          Seguir viendo
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('visible'), 10);
}
```

### 2. Auto-Save Cart
```javascript
// Cart is saved to localStorage on every mutation
function guardarCarrito() {
  localStorage.setItem(CART_KEY, JSON.stringify(carrito));
  localStorage.setItem(CART_TIMESTAMP, Date.now().toString());
}

// Restore on page load
function restaurarCarrito() {
  const saved = localStorage.getItem(CART_KEY);
  const timestamp = localStorage.getItem(CART_TIMESTAMP);
  
  if (saved && timestamp) {
    const elapsed = Date.now() - parseInt(timestamp);
    const TWENTY_FOUR_HOURS = 86400000;
    
    if (elapsed < TWENTY_FOUR_HOURS) {
      carrito = JSON.parse(saved);
      actualizarBadgeCarrito();
    } else {
      // Cart older than 24h — optionally show reminder
      localStorage.removeItem(CART_KEY);
      localStorage.removeItem(CART_TIMESTAMP);
    }
  }
}
```

### 3. Abandoned Cart Reminder (In-Site)
Show a banner when returning visitor has saved items:

```javascript
function checkAbandonedCart() {
  const saved = localStorage.getItem(CART_KEY);
  if (!saved) return;
  
  const carritoAnterior = JSON.parse(saved);
  if (carritoAnterior.length > 0 && carrito.length === 0) {
    // Returning user with saved cart but current cart is empty
    const banner = document.createElement('div');
    banner.className = 'cart-recovery-banner';
    banner.setAttribute('role', 'alert');
    banner.innerHTML = `
      <p>🛒 Tenés ${carritoAnterior.length} productos guardados en tu carrito</p>
      <div class="recovery-actions">
        <button onclick="restaurarCarritoAnterior()">Restaurar carrito</button>
        <button onclick="this.closest('.cart-recovery-banner').remove()">Cerrar</button>
      </div>
    `;
    document.body.prepend(banner);
  }
}
```

### 4. WhatsApp Recovery (Admin Workflow)
Since there's no backend automation, recovery relies on manual follow-up:

```javascript
function generarMensajeRecordatorio() {
  if (carrito.length === 0) return '';
  const items = carrito.map(p => `• ${p.nombre} × ${p.cantidad}`).join('\n');
  return encodeURIComponent(
    `¡Hola! 🐾 ¿Seguís interesado en estos productos?\n\n${items}\n\n` +
    `Pasé el presupuesto así lo ves:\n[Link pendiente]\n\n` +
    `¡Estamos a tu disposición!`
  );
}
```

### 5. Price Anchor / Scarcity Signals
- **Low stock notice**: "Solo quedan X" (from inventory data)
- **Discount expiring**: "Este precio es por tiempo limitado" (for promotions)
- **Free shipping threshold**: Progress bar toward free shipping

```javascript
function mostrarProgresoEnvioGratis() {
  const total = calcularTotalCarrito();
  const FREE_SHIPPING_MIN = 30000; // $30,000
  
  if (total >= FREE_SHIPPING_MIN) {
    return '🚚 ¡Envío gratis!';
  }
  const falta = FREE_SHIPPING_MIN - total;
  const porcentaje = Math.min(100, (total / FREE_SHIPPING_MIN) * 100);
  return `
    <div class="shipping-progress">
      <div class="shipping-progress-bar">
        <div class="shipping-progress-fill" style="width: ${porcentaje}%"></div>
      </div>
      <p>Te faltan $${falta.toLocaleString('es-AR')} para envío gratis</p>
    </div>
  `;
}
```

## Reminder Opt-In
```javascript
// Offer to save phone number for cart reminder
function offerCartReminder() {
  if (carrito.length === 0) return;
  if (localStorage.getItem('cart_reminder_opted')) return;
  
  const result = confirm(
    '¿Querés que te recordemos tu carrito por WhatsApp?\n' +
    'Decinos tu número y te enviamos un mensaje 📱'
  );
  
  if (result) {
    // Show phone input
    const phone = prompt('Tu número de WhatsApp (ej: 2612345678):');
    if (phone) {
      localStorage.setItem('cart_reminder_phone', phone);
      localStorage.setItem('cart_reminder_opted', 'true');
    }
  }
}
```

## Abandonment Metrics (Local Storage)
```javascript
function trackAbandonment() {
  if (carrito.length > 0) {
    const abandonmentLog = JSON.parse(
      localStorage.getItem('abandonment_log') || '[]'
    );
    abandonmentLog.push({
      items: carrito.length,
      total: calcularTotalCarrito(),
      timestamp: Date.now(),
      page: window.location.pathname
    });
    localStorage.setItem('abandonment_log', JSON.stringify(abandonmentLog));
  }
}

// Track on page unload
window.addEventListener('beforeunload', trackAbandonment);
```

## Recovery Sequence (Ideal Flow)
1. **Immediate**: Exit intent modal (within seconds of leaving)
2. **After 1 hour**: In-site banner on return visit
3. **After 24 hours**: Cart expires from localStorage (fresh start)
4. **Admin initiated**: Manual WhatsApp follow-up from admin panel

## Design Patterns

### Exit-Intent Modal
- Lightbox overlay
- Fade-in animation (CSS transition)
- Warm, empathetic tone ("¡Esperá! 🐾")
- Clear value prop + WhatsApp CTA
- Secondary action: "Seguir viendo" (dismiss)
- Close on Escape

### Recovery Banner
- Top of page, below header
- Dismissable ("X" button)
- Shows item count + restore button
- Subtle background color (not intrusive)

## Reference
- Baymard Institute: cart abandonment statistics
- ConversionXL: exit-intent best practices
- WhatsApp Business: recovery message templates
