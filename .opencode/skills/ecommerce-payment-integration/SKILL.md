# Ecommerce Payment Integration

Handle payment method display, integration patterns, and checkout flow for a vanilla HTML/CSS/JS static ecommerce site with WhatsApp-based ordering.

## When to Use
- Displaying accepted payment methods
- Integrating Mercado Pago (or other Argentinian payment gateway)
- Building payment selection UI within WhatsApp flow
- Communicating payment instructions to customers

## Architecture (BICHITOS SHOP model)
- Primary checkout: WhatsApp → customer completes payment manually
- No direct payment gateway on site (static, no backend)
- Payment methods listed as informational on site + in WhatsApp message
- Optional: Mercado Pago "Checkout Pro" link can be generated as a static link

## Payment Method Display

### Payment Methods Section
```html
<section class="payment-methods-section" aria-label="Medios de pago">
  <h2>Medios de pago</h2>
  <div class="payment-grid">
    <div class="payment-method-card">
      <div class="payment-icon">
        <svg>...</svg> <!-- Transferencia icon -->
      </div>
      <p class="payment-name">Transferencia bancaria</p>
      <p class="payment-detail">Sin recargo</p>
    </div>
    <div class="payment-method-card">
      <div class="payment-icon">
        <svg>...</svg> <!-- MP icon -->
      </div>
      <p class="payment-name">Mercado Pago</p>
      <p class="payment-detail">Tarjetas de débito/crédito</p>
    </div>
    <div class="payment-method-card">
      <div class="payment-icon">
        <svg>...</svg> <!-- Cash icon -->
      </div>
      <p class="payment-name">Efectivo</p>
      <p class="payment-detail">En punto de encuentro</p>
    </div>
  </div>
</section>
```

### WhatsApp Message Payment Instructions
After cart items, include payment options in the pre-filled WhatsApp message:
```
*Formas de pago:*
💳 Mercado Pago (débito/crédito)
🏦 Transferencia bancaria (CBU: _____)
💵 Efectivo (en entrega)

*Indicame cuál preferís y te paso los datos*
```

## Mercado Pago Integration (No-Backend)

### Option 1: Static Preference Link
Generate a Mercado Pago payment link manually or via admin:
```html
<a href="https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=YOUR_PREF_ID"
   target="_blank"
   rel="noopener noreferrer"
   class="btn-mp">
   Pagar con Mercado Pago
</a>
```
Note: Pref IDs expire and can't be dynamically generated without a backend.

### Option 2: Manual Payment Instructions
Best fit for static sites:
- Generate CBU/alias for transfers
- Add as payment info in WhatsApp message template
- Admin confirms receipt manually

### Option 3: Checkout Pro Link (Semi-Automated)
Use Mercado Pago's link generator to create checkout links per product:
```
[Product] → [Generate MP link] → [Send via WhatsApp]
```
This is done manually by the admin after receiving the WhatsApp order.

## Payment UX Best Practices

### Before Checkout
- Show accepted payment methods on product pages
- Include "¿Cómo pago?" section in FAQ or footer
- Transparent about any surcharges for card payments

### During Checkout (WhatsApp)
- Pre-fill message with available payment options
- Clearly state if there's a discount for transfer payments
- Include bank details (CBU/alias) in message if transfer selected
- Mention if Mercado Pago QR is available for in-person pickup

### After Checkout
- Send payment confirmation template
- Provide estimated processing time
- Update customer on payment verification

## Display Bank Details Template
```javascript
function generarMensajeTransferencia() {
  return `*Datos para transferencia:*
Banco: ${BANCO}
Titular: ${TITULAR}
CBU: ${CBU}
Alias: ${ALIAS}
CUIL/CUIT: ${CUIT}

*Monto:* $${totalCarrito}
*Concepto:* Pedido Bichitos Shop

*IMPORTANTE:* Enviá comprobante por este chat para confirmar tu pedido 📸`;
}
```

## Payment Confirmation Flow
```
Customer pays → Sends screenshot → Admin verifies → Admin confirms order
     ↓                    ↓                     ↓
  Payment              Receipt              Order in
  made                 sent                 progress
```

## Security Considerations
- Never hardcode bank account details in client-side JS (use config or manual messaging)
- Recommend customers use "Datos de transferencia" section via WhatsApp (not public page)
- Display: "No compartas tus datos bancarios con terceros — solo nosotros te enviamos esta info"
- Consider adding "Tienda verificada" badge (Instagram/Facebook verification)

## Reference
- Mercado Pago Checkout Pro documentation
- BCRA: transferencia bancaria guidelines
- Argentine ecommerce payment method statistics (preferencia: MP + transferencia)
