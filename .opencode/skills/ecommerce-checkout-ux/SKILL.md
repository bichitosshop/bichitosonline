# Ecommerce Checkout UX

Optimize checkout flow for maximum conversion on a vanilla HTML/CSS/JS static site with WhatsApp-based payment.

## When to Use
- Designing or improving the checkout experience
- Reducing cart abandonment
- Implementing guest checkout flows
- Building order summary and confirmation screens

## Architecture (BICHITOS SHOP model)
- No backend, no payment gateway — checkout is client-side → WhatsApp
- Cart stored in `localStorage` as array of objects `{ id, nombre, precio, cantidad, imagen, etapa }`
- Checkout modal in `js/script.js`: `abrirCarrito()` → `renderCarrito()` → `enviarWhatsApp()`
- WhatsApp message built with `enviarWhatsApp()`: iterates cart items, adds totals, encodes as `wa.me` URL

## UX Guidelines

### Cart Drawer/Modal
- Slide-in from right (not center modal) — feels more native on mobile
- Overlay backdrop with `aria-hidden="true"` closing on click
- Show item count badge, subtotal, shipping info
- Quantity controls (+/−) with `data-accion="aumentar"` / `disminuir`
- Remove item button with confirmation or undo option
- Sticky bottom bar with total + "Consultar por WhatsApp" CTA

### Checkout Flow (WhatsApp)
1. User reviews cart
2. Taps WhatsApp button
3. Message is pre-filled with:
   ```
   ¡Hola! Quiero hacer un pedido:
   
   *Productos:*
   1️⃣ Alimento para perros X 2 = $6000
   2️⃣ Alimento para gatos Y 1 = $3500
   
   *Total: $9500*
   
   *Datos de envío:*
   ✏️ Por favor completar
   ```
4. Missing fields for user to fill: name, address, phone, payment method
5. Opens in new tab (native app or web)

### Conversion Patterns
- **Progress indicator**: 1→2→3 steps if multi-step (Cart → Data → Confirm)
- **Guarantee text**: "Sin compromiso — te pasamos el presupuesto sin cargo"
- **Trust signals**: Medios de pago aceptados, envíos a todo el país
- **Exit intent**: If user moves to close cart, show "¿Seguro? Podemos ayudarte" mini-prompt
- **Empty cart**: Friendly illustration + "¡Tu carrito está vacío!" + link to productos

### Accessibility
- `aria-live="polite"` on cart count and total
- Focus trap inside cart modal when open
- Close on `Escape` key
- Focus returns to trigger button on close

## Code Patterns

### WhatsApp Message Builder
```javascript
function construirMensajeCarrito() {
  const items = carrito.map((p, i) =>
    `${i + 1}️⃣ ${p.nombre} × ${p.cantidad} = $${(p.precio * p.cantidad).toLocaleString('es-AR')}`
  ).join('\n');
  const total = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  const mensaje = `¡Hola! Quiero hacer un pedido:\n\n*Productos:*\n${items}\n\n*Total: $${total.toLocaleString('es-AR')}*\n\n*Datos de envío:*\n✏️ Por favor completar`;
  return encodeURIComponent(mensaje);
}
```

### Cart State Persistence
```javascript
function guardarCarrito() {
  localStorage.setItem(CART_KEY, JSON.stringify(carrito));
}
function cargarCarrito() {
  const data = localStorage.getItem(CART_KEY);
  carrito = data ? JSON.parse(data) : [];
}
```

## Reference
- Baymard Institute checkout usability guidelines
- WhatsApp Business API message templates
- Session storage for checkout progress
