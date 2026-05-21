# PROMPT PARA REDISEÑO DE BICHITOS SHOP

> Este documento contiene todos los requerimientos recopilados del dueño del proyecto. Usalo como especificación para rediseñar el sitio.
>
> ⚠️ **NOTA**: La implementación estructural (Fases 1-6) ya está completa: topbar, mega-menú, logo, carrusel hero, categorías casita, slider marcas, cards con badges/botón 3 estados, search modal, WhatsApp FAB, filtros, animaciones scroll, accesibilidad. Lo que queda es **pulido visual fino** (reemplazar placeholders, ajustar diseños, imágenes reales). Ver `MASTER-DOC.md` sección 5 "PENDIENTES".

---

## CONTEXTO DEL PROYECTO

**Tienda**: BICHITOS SHOP — e-commerce de alimentos para mascotas (Mendoza, Argentina)
**Stack**: HTML5 + CSS3 + JavaScript vanilla (sin frameworks ni bundlers)
**Hosting**: GitHub Pages (100% estático, sin backend)
**Checkout**: Cliente → WhatsApp (no hay carrito online real, genera mensaje con el pedido)
**Productos**: 68 productos hardcodeados como fallback. El contenido vivo viene de un Google Sheets publicado como CSV.
**URL actual**: https://bichitosshop.github.io/bichitosonline/
**Repositorio**: https://github.com/bichitosshop/bichitosonline

**Archivos del proyecto** (en /Users/Juani/Desktop/BICHITOS SHOP/):

```
/
├── index.html            → Home
├── productos.html        → Listado con filtros
├── contacto.html         → Página de contacto
├── css/
│   └── style.css         → Todos los estilos
├── js/
│   ├── config.js         → SHEET_CSV_URL (Google Sheets)
│   ├── api-service.js    → ProductosAPI (fetch CSV + 68 fallback)
│   └── script.js         → Carrito, checkout, mapa Leaflet, render
├── MASTER-DOC.md         → Documentación completa del proyecto
├── productos-ejemplo.csv → Plantilla para Google Sheets
├── GUIA-GOOGLE-SHEETS.md → Instructivo para la clienta
└── .opencode/            → Skills de diseño (referencias útiles)
```

---

## REQUERIMIENTOS DE DISEÑO

### 1. Personalidad de marca
- **Divertida y juguetona** — no seria ni corporativa, queremos que sea alegre y canchera
- Marca: "BICHITOS SHOP" (no cambiar)
- Logo: solo tipográfico (tipografía especial, sin icono)
- Tono: cercano, con personalidad, que haga sonreír

### 2. Paleta de colores
- Mantener la actual: **azul petróleo** (`#1B3B5A`) + **naranja** (`#FF6B35`) + **teal** (`#2EC4B6`) + **amarillo** (`#f1c40f`)
- Fondo general: crema claro (`#FFFDF7`)
- Se puede ajustar/ampliar la paleta mientras se mantenga la base

### 3. Tipografía
- Similar a la de **Mercado Libre** (Proxima Nova / system-ui moderna)
- Opciones sugeridas: Inter, DM Sans o la combinación que más se acerque al estilo Meli
- Debe verse moderna y muy legible

### 4. Hero de la home
- **Carrusel de banners interactivos** (slider automático que cambia cada ~5 segundos)
- Cada slide debe tener:
  - Una imagen grande y llamativa (de animales o productos)
  - Texto grande superpuesto + llamativo
  - Botón CTA que redirija a productos
- Tipos de banners que quiere:
  1. "Perro divertido con mensaje que invite a comprar"
  2. "Ofertas: llevando 4 pagás 3" (con un gato divertido)
  3. Más promociones similares
- Debe tener indicadores (puntos/pills) y flechas de navegación
- Las imágenes las va a buscar él (fotos de animales divertidas) y las mejorará con IA

### 5. Categorías (Perros / Gatos)
- **Forma de casita de perro**: con clip-path CSS (techo triangular inclinado)
- Cada card debe tener:
  - Un **PNG del animal recortado sin fondo** (él lo va a hacer con remove.bg)
  - Fondo blanco general
  - Nombre de la categoría debajo
  - Sombra suave para darle profundidad
- Debe verse como una casita, no como una card genérica
- Él mismo va a buscar las imágenes de perro/gato recortadas

### 6. Cards de producto
- Deben ser **completas como PetCo Market** pero adaptadas para WhatsApp
- Elementos requeridos:
  - Imagen del producto (fondo blanco, 1:1)
  - Badges: "🔥 Oferta", "⭐ Más vendido", "🚚 Envío gratis", "🔴 Agotado", "🔥 Quedan pocos"
  - **Selector KG** (pills de peso: 8Kg, 15Kg, 20Kg) — agrupando productos por nombre base (ya implementado, mejorar diseño)
  - **Precio escalonado**: precio tachado (anterior) + precio actual grande + texto de descuento (ej: "20% OFF 🔥") + precio contado/efectivo
  - Botón "Agregar" con **feedback de 3 estados**: normal → "Agregando..." → "✓ Agregado" (check verde)
  - Marca del producto
- El dueño va a buscar las imágenes de producto en internet y mejorarlas con IA

### 7. Navegación (Header)
- **Megamenú completo** con dropdowns tipo PetCo:
  - PERROS (sub: Adulto, Cachorro, Senior, Razas Pequeñas, Necesidades Especiales)
  - GATOS (sub: Adulto, Kitten, Senior, Urinario, Castrado)
  - MARCAS (sub: Estampa, Jaspe, Vagoneta, Liwué, Dr Perrot, Valiant)
  - ACCESORIOS (a futuro: juguetes, ropa, casitas)
- A futuro va a agregar más categorías, así que debe ser escalable
- Logo a la izquierda, menú al centro, carrito + búsqueda a la derecha

### 8. Header funcional
- Barra superior delgada (topbar) con texto promocional: "📦 Envío gratis en Gran Mendoza"
- Sticky al hacer scroll (como está ahora)
- Icono de búsqueda que abre modal fullscreen (como PetCo)

### 9. Animaciones
- **Divertidas y notorias** — no sutiles, queremos que se note
- Cards que entran con bounce al scrollear
- Hover effects: scale, wiggle, rotate en iconos
- Micro-interacciones en botones, KG pills, badges
- Transiciones alegres, estilo "juguetón"
- Respetar `prefers-reduced-motion`

### 10. Botones flotantes
- **Dos FABs**:
  - Derecha: carrito (como ahora) con contador
  - Izquierda: WhatsApp directo (verde, con icono)
- Ambos con animación de entrada

### 11. Footer
- **Básico**: logo, contacto, horarios, copyright
- Sin newsletter ni testimonios por ahora

### 12. Funcionalidades extra
- **Slider de marcas**: logos de Estampa, Vagoneta, Jaspe, Liwué, Dr Perrot, Valiant en la home
- Filtros en productos.html: por categoría, por marca, búsqueda por texto
- Posibilidad de ordenar por precio

### 13. Google Sheets como CMS
- Los productos se cargan desde un CSV público de Google Sheets
- La clienta edita precios, stock e imágenes desde el sheet
- 68 productos de fallback si no hay conexión
- Cache de 5 minutos

---

## REFERENCIA VISUAL

**PetCo Market** (https://www.petcomarket.com.ar):
- Es la inspiración principal en estructura, pero con personalidad más divertida
- Copiar: estructura de cards, megamenú, carrusel hero, slider de marcas
- Adaptar: paleta más juguetona, animaciones más notorias, tono más canchero

**Estructura de card ideal** (adaptación PetCo para WhatsApp):
```
┌──────────────────────┐
│    [Imagen 1:1]      │
│  🔥 Oferta  🚚 Envío │ ← badges
├──────────────────────┤
│  KG: [15Kg] [20Kg]   │ ← pills de peso
├──────────────────────┤
│ Estampa              │ ← marca
│ Estampa Plus x 20 Kg │ ← nombre
│ $55.173               │ ← precio tachado
│ $48.000               │ ← precio actual (GRANDE)
│ 20% OFF 🔥           │ ← badge de descuento
│ $44.160 contado 💵   │ ← precio contado
├──────────────────────┤
│ [Agregar]            │ ← botón con feedback 3 estados
└──────────────────────┘
```

---

## NOTAS TÉCNICAS IMPORTANTES

1. **No usar frameworks** — todo vanilla HTML/CSS/JS
2. **No inline styles** (excepción: object-fit dinámico en imágenes de producto)
3. **Mobile-first** — base styles para mobile, `@media (min-width: 768px)` para desktop
4. **CSS custom properties** para colores, sombras, radios
5. **kebab-case** para clases CSS
6. **Event delegation** en `document` para elementos dinámicos
7. **data-* attributes** para binding DOM-JS: `data-id`, `data-accion`, `data-categoria`
8. **Accesibilidad WCAG 2.1 AA**: aria-label, skip-to-content, focus-visible, contraste 4.5:1, touch targets ≥44px
9. **Todo en un solo archivo CSS** (style.css)
10. **GitHub Pages** — rutas relativas, sin backend, sin API keys
11. **Selector KG ya implementado** — mejora solo el diseño visual de las pills
12. **El parseo de CSV ya soporta quoting** (comas dentro de nombres)
13. **SVG icons** en `/images/icons/` para fallback de producto

---

## ENTREGABLES ESPERADOS

1. Rediseño completo de `css/style.css` con la nueva identidad visual
2. Actualización de `index.html` (hero carrusel, categorías casita, slider marcas)
3. Actualización de `productos.html` (megamenú, cards completas, filtros por marca)
4. Actualización de `js/script.js` (carrusel, feedback botón, FAB WhatsApp, slider marcas)
5. Mantener funcionalidad existente: carrito, checkout con mapa Leaflet, Google Sheets CSV

---

## PREGUNTAS ABIERTAS PARA EL DISEÑADOR

Además de lo especificado arriba, el dueño quiere que el diseñador proponga:
- Ideas creativas para el carrusel de banners (textos, tono, estilo gráfico)
- Efectos de animación específicos (qué bounce, qué wiggle, timing)
- Estilo de los badges (formas, colores, iconos)
- Diseño del megamenú (columnas, hover vs click)
- Cómo integrar la personalidad "divertida" sin dejar de ser funcional
