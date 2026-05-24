# Ecommerce WhatsApp Commerce

Implement and optimize WhatsApp-based ordering for a vanilla HTML/CSS/JS static ecommerce site with no backend.

## When to Use
- Setting up WhatsApp as primary checkout method
- Designing WhatsApp order message templates
- Implementing click-to-chat patterns and tracking
- Building a complete WhatsApp-based sales flow

## Architecture (BICHITOS SHOP model)
- No payment gateway — orders placed via WhatsApp Business API link (`wa.me`)
- Cart message built client-side in `js/script.js` via `enviarWhatsApp()`
- Phone number from config: `NUMERO_WHATSAPP` in `js/config.js`
- Opens `https://wa.me/{NUMERO_WHATSAPP}?text={MESSAGE}` in new tab

## Implementation Patterns

### WhatsApp Link Generator
```javascript
function enviarWhatsApp() {
  const numero = '5492612345678'; // From config
  const mensaje = construirMensajeCarrito();
  window.open(`https://wa.me/${numero}?text=${mensaje}`, '_blank');
}
```

### Message Template — Rich Format
```
¡Hola! 🐾 Quiero hacer un pedido:

*Productos:*
1️⃣ Royal Canin Perro Adulto 15kg × 2 = $60,000
2️⃣ Pro Plan Gato Adulto 7.5kg × 1 = $35,000

*Subtotal: $95,000*
*Envío:* A coordinar

*Datos del comprador:*
✏️ Nombre: [a completar]
✏️ Dirección: [a completar]
✏️ Teléfono: [a completar]
✏️ Horario de entrega: [a completar]
```

### Message Formatting Best Practices
- Use `*text*` for bold in WhatsApp
- Use line breaks `\n` generously for readability
- Emojis for visual hierarchy: 📦 Productos, 🚚 Envío, 💰 Total
- Include placeholders `[a completar]` for missing info
- Keep total message under 4096 chars (WhatsApp limit)

### WhatsApp Business Features to Leverage
- **Catalog**: If using WhatsApp Business API, sync product catalog
- **Quick replies**: Set up automated responses for common questions
- **Labels**: Organize orders (New, In Progress, Delivered, Paid)
- **Broadcast lists**: For promotions and restock alerts

### Conversion Optimization
- **Pre-filled message** reduces friction significantly
- **"Click to WhatsApp"** buttons throughout:
  - Cart checkout (primary)
  - Product page CTA (secondary)
  - Contact page (primary)
  - Home hero section (prominent)
- **"Te respondemos en minutos"** social proof below WhatsApp links
- **Working hours notice**: "Atendemos de 9 a 20hs"

### Analytics (No Backend)
```javascript
// Track WhatsApp clicks via URL parameter or simple counter
function trackWhatsAppClick(origen) {
  // Option 1: GitHub Pages doesn't support server logging
  // Option 2: Simple analytics service (Google Analytics event)
  if (typeof gtag !== 'undefined') {
    gtag('event', 'whatsapp_click', {
      'event_category': 'engagement',
      'event_label': origen
    });
  }
  // Option 3: Store in localStorage for basic tracking
  const clicks = JSON.parse(localStorage.getItem('whatsapp_clicks') || '[]');
  clicks.push({ origen, timestamp: new Date().toISOString() });
  localStorage.setItem('whatsapp_clicks', JSON.stringify(clicks));
}
```

### Order Management (No Backend Workflow)
1. Customer sends WhatsApp order
2. Admin copies order to spreadsheet or CRM manually
3. Admin confirms stock and total via WhatsApp reply
4. Customer confirms and pays (transfer/deposit/mercado pago)
5. Admin arranges shipping/delivery

### Design Patterns
- WhatsApp button: green brand (#25D366) or your brand's accent
- Icon: SVG WhatsApp logo (avoid emoji for consistency)
- Text: "Consultar por WhatsApp" or "Hacer pedido por WhatsApp"
- Open in new tab: `target="_blank" rel="noopener noreferrer"`

## Reference
- WhatsApp Business API documentation
- wa.me link format reference
- Argentine ecommerce WhatsApp commerce case studies
