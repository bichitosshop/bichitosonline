# GUÍA DE IMÁGENES — BICHITOS SHOP

## Dónde subir las imágenes

Subí todas las imágenes a **ImgBB** (https://imgbb.com):

1. Entrá a ImgBB
2. Subí tu imagen
3. Al terminar, apretá en **"Enlace directo"** (no el normal, no el BBCode)
4. Copiá el link que dice `https://i.ibb.co/...`
5. Ese link lo pegás donde corresponda (ver cada sección abajo)

---

## 1. BANNERS DEL CARRUSEL (Hero de la home)

**Tamaño recomendado:** 1400 × 500 px

| Medida | Valor |
|--------|-------|
| Ancho | 1400 px |
| Alto | 500 px |
| Formato | JPG o WebP |
| Peso ideal | < 200 KB |

**¿Dónde va el link?**

En `/index.html`, buscá las 3 slides del carrusel. Cada slide tiene un `data-bg="blue"`, `data-bg="orange"` o `data-bg="teal"`. Cambiá el fondo de color por la imagen así:

**ANTES (fondo sólido):**
```html
<div class="carousel-slide" data-index="0" data-bg="blue">
    <div class="carousel-overlay"></div>
    ...
</div>
```

**DESPUÉS (con imagen):**
```html
<div class="carousel-slide" data-index="0">
    <div class="carousel-bg">
        <img src="https://i.ibb.co/tu-imagen-1" alt="Banner bienvenidos" loading="lazy" width="1400" height="500" />
    </div>
    <div class="carousel-overlay"></div>
    ...
</div>
```

> ⚠️ **Importante**: Agregá de vuelta el div `.carousel-bg` con la imagen adentro (lo sacamos cuando pusimos los fondos sólidos).

**Cantidad de imágenes:** 3 banners (1 por slide)

---

## 2. CATEGORÍAS — FORMA DE CASITA (Perros / Gatos)

### La forma (clip-path)

Las categorías tienen forma de **casita de perro** con este recorte:

```
polygon(50% 0%, 100% 12%, 100% 100%, 0% 100%, 0% 12%)
```

Visualmente:
```
        ╱╲
       ╱  ╲        ← techo (diagonal desde el centro hasta 12% abajo)
      ╱    ╲
     ╱      ╲
    ╱        ╲
   ╱          ╲
  ╱            ╲
 ╱══════════════╲   ← animal PNG va acá
 ║              ║
 ║    🐶        ║
 ║              ║
 ╚══════════════╝
```

### Tamaño del PNG del animal

| Medida | Valor |
|--------|-------|
| Ancho del PNG | 200 px |
| Alto del PNG | 200 px |
| Formato | PNG con fondo transparente |
| Fondo | TRANSPARENTE (usá remove.bg) |
| Posición del animal | Centrado, mínimo 20 px de padding arriba |

> ⚠️ **Clave**: El PNG debe tener fondo **transparente**. El animal tiene que estar centrado y no llegar al borde superior (queda cortado por el techo de la casita). Dejá al menos 20 px de espacio arriba del animal.

### Cómo preparar la imagen

1. Buscá una foto de un perro y una de un gato
2. Andá a https://remove.bg, subí la foto, descargala sin fondo
3. Opcional: redimensioná a 200×200 px (centrado)
4. Subí el PNG a ImgBB

### ¿Dónde va el link?

En `/index.html`, buscá las categorías:

```html
<div class="categoria-card card-perros">
    <span class="categoria-icon" aria-hidden="true">🐶</span>
    ...
</div>
```

Reemplazá el emoji por la imagen:

```html
<div class="categoria-card card-perros">
    <img src="https://i.ibb.co/tu-imagen-perro" alt="Perros" class="categoria-icon" />
    ...
</div>
```

> ⚠️ Sacále el `aria-hidden="true"` al poner una imagen real, y asegurate de que tenga `alt` descriptivo.

**Cantidad de imágenes:** 2 PNGs (1 perro + 1 gato)

---

## 3. IMÁGENES DE PRODUCTOS (Cards en productos.html)

**Tamaño recomendado:** 400 × 400 px (cuadrado)

| Medida | Valor |
|--------|-------|
| Ancho | 400 px |
| Alto | 400 px |
| Formato | WebP (mejor) o JPG |
| Peso ideal | < 100 KB |
| Proporción | 1:1 (cuadrado perfecto) |
| Fondo | Blanco o transparente |
| Posición del producto | Centrado, que ocupe ~80% del espacio |

La imagen se muestra así en la card:
```
┌──────────────┐
│  ┌────────┐  │   ← 400×400 px original
│  │ 👜     │  │
│  │        │  │   ← se redimensiona a ~280×200 px
│  └────────┘  │
├──────────────┤
│  Marca       │
│  Nombre      │
│  $ Precio    │
│  [Agregar]   │
└──────────────┘
```

### ¿Dónde va el link?

En el **Google Sheet**, columna `imagen`. Cada producto tiene su propia celda con el link de ImgBB. Si no ponés nada, se muestra un emoji 🐶 o 🐱 como fallback.

**Cantidad de imágenes:** 68 (1 por producto) — podés empezar con los más vendidos e ir subiendo de a poco.

---

## 4. LOGOS DE MARCAS (Slider en la home)

Actualmente se muestran como texto ("Estampa", "Jaspe", etc.). Si querés logos:

**Tamaño recomendado:** 200 × 80 px

| Medida | Valor |
|--------|-------|
| Ancho | 200 px |
| Alto | 80 px |
| Formato | PNG con fondo transparente |
| Proporción | Horizontal (apaisado) |

### ¿Dónde va?

En `/index.html`, buscá `.brand-track` y reemplazá cada `<span>` de texto por una imagen:

```html
<span class="brand-item">Estampa</span>
<!-- Cambiar a: -->
<img src="https://i.ibb.co/logo-estampa" alt="Estampa" class="brand-item" />
```

**Cantidad de imágenes:** 6 logos

| # | Marca | Hecho |
|---|-------|-------|
| 1 | Estampa | ☐ |
| 2 | Jaspe | ☐ |
| 3 | Vagoneta | ☐ |
| 4 | Liwué | ☐ |
| 5 | Dr Perrot | ☐ |
| 6 | Valiant | ☐ |

---

## 5. LISTA DE PRODUCTOS PARA IMÁGENES

Usá esta lista para ir pidiéndole las imágenes a la IA. Marcá con ✅ las que ya tengas.

### 🐶 Perros (48 productos)

| # | Producto | Marca | Hecho |
|---|----------|-------|-------|
| 1 | Estampa Plus perro RAZAS PEQUEÑAS x 8 Kg | Estampa | ☐ |
| 2 | Estampa Plus perro x 15 Kg | Estampa | ☐ |
| 3 | Estampa Plus perro x 20 Kg | Estampa | ☐ |
| 4 | Estampa plus RAZA PEQUEÑA X 15 KG | Estampa | ☐ |
| 5 | ESTAMPA RAZA PEQUEÑA X 3KG (3 unid) | Estampa | ☐ |
| 6 | Estampa Criadores x 15 Kg | Estampa | ☐ |
| 7 | Estampa Criadores x 20 Kg | Estampa | ☐ |
| 8 | Estampa Criadores x 8kg | Estampa | ☐ |
| 9 | Estampa Plus Cachorro x 15 Kg | Estampa | ☐ |
| 10 | Estampa Plus Cachorro x 8kg | Estampa | ☐ |
| 11 | Valiant Criadores x 20 Kg | Valiant | ☐ |
| 12 | Estampa Insignia Perro Adulto x 20kg | Insignia | ☐ |
| 13 | Estampa Insignia Perro Adulto x 3kg | Insignia | ☐ |
| 14 | Estampa Insignia Perro Adulto x 15 kg | Insignia | ☐ |
| 15 | Estampa Insignia Perro Cachorro x 8kg | Insignia | ☐ |
| 16 | Estampa Insignia Perro Cachorro x 3kg | Insignia | ☐ |
| 17 | Estampa Insignia Perro Mordida Pequeña x 8kg | Insignia | ☐ |
| 18 | Estampa Insignia Perro Mordida Pequeña x 3kg | Insignia | ☐ |
| 19 | Jaspe Adulto x 20 kg | Jaspe | ☐ |
| 20 | Jaspe Adulto MP x 20 kg | Jaspe | ☐ |
| 21 | Jaspe Adulto x 8 kg | Jaspe | ☐ |
| 22 | Jaspe Adulto MP x 8 kg | Jaspe | ☐ |
| 23 | Jaspe Adulto x 3 kg (4u) | Jaspe | ☐ |
| 24 | Jaspe Adulto MP x 3kg (4u) | Jaspe | ☐ |
| 25 | Jaspe Cachorro x 15 kg | Jaspe | ☐ |
| 26 | Jaspe Cach Premium x 15 kg | Jaspe | ☐ |
| 27 | Jaspe Cach Premium x 1,5kg (8u) | Jaspe | ☐ |
| 28 | Jaspe Premium x 20 kg | Jaspe | ☐ |
| 29 | Jaspe Premium x 1,5kg (8u) | Jaspe | ☐ |
| 30 | Jaspe Premium x 15 Kg | Jaspe | ☐ |
| 31 | Jaspe Premium MP x 8 Kg | Jaspe | ☐ |
| 32 | Jaspe Premium MP x 15 Kg | Jaspe | ☐ |
| 33 | Jaspe Premium MP x1,5kg (8u) | Jaspe | ☐ |
| 34 | Jaspe Criadores x 20 kg | Jaspe | ☐ |
| 35 | Liwué x 15 kg | Liwué | ☐ |
| 36 | Liwué x 20 kg | Liwué | ☐ |
| 37 | Liwue Plus x 20 Kg | Liwué | ☐ |
| 38 | Vagoneta Gourmet x 15 Kg | Vagoneta | ☐ |
| 39 | Vagoneta Gourmet x 20 Kg | Vagoneta | ☐ |
| 40 | Vagoneta Gourmet x 1,5Kg (x6u) | Vagoneta | ☐ |
| 41 | Vagoneta CARNE Y CEREALES x20Kg | Vagoneta | ☐ |
| 42 | Vagoneta TRADICIONAL x 8 Kg | Vagoneta | ☐ |
| 43 | Vagoneta Raza Pequeña x 15 Kg | Vagoneta | ☐ |
| 44 | Vagoneta Raza Pequeña x 8 Kg | Vagoneta | ☐ |
| 45 | Vagoneta Raza Pequeña x 1,5 Kg (x6u) | Vagoneta | ☐ |
| 46 | Vagoneta Cachorro x 15 Kg | Vagoneta | ☐ |
| 47 | Vagoneta Cachorro x 1,5 Kg (x6u) | Vagoneta | ☐ |
| 48 | Dr Perrot x 20 Kg | Dr Perrot | ☐ |
| 49 | Dr Perrot x 15 Kg | Dr Perrot | ☐ |
| 50 | Dr Perrot x 1,5 Kg (pack x6u) | Dr Perrot | ☐ |

### 🐱 Gatos (18 productos)

| # | Producto | Marca | Hecho |
|---|----------|-------|-------|
| 51 | Estampa Plus Gato x15kg | Estampa | ☐ |
| 52 | Estampa Plus Gato x 8kg | Estampa | ☐ |
| 53 | Estampa Gato x 1 kg (pack x8 u) | Estampa | ☐ |
| 54 | Jaspe Gato x 10 kg | Jaspe | ☐ |
| 55 | Jaspe Gato x 1 kg (12u) | Jaspe | ☐ |
| 56 | Jaspe Gato x 20 kg | Jaspe | ☐ |
| 57 | Jaspe Gato Premium x 8 kg | Jaspe | ☐ |
| 58 | Jaspe Gato Premium x 1kg (12u) | Jaspe | ☐ |
| 59 | Liwué Gato x 10 kg | Liwué | ☐ |
| 60 | Liwué Gato x 20 kg | Liwué | ☐ |
| 61 | Vagoneta Gato x 10 Kg | Vagoneta | ☐ |
| 62 | Vagoneta Gato x 20 Kg | Vagoneta | ☐ |
| 63 | Vagoneta Gato x 1 Kg (pack x8u) | Vagoneta | ☐ |
| 64 | Vagoneta Gato Gourmet x 10 Kg | Vagoneta | ☐ |
| 65 | Vagoneta Gato Gourmet x 20 Kg | Vagoneta | ☐ |
| 66 | Vagoneta Gato Gourmet x 1 Kg (pack x8u) | Vagoneta | ☐ |
| 67 | Vagoneta Gatito x 10 Kg | Vagoneta | ☐ |
| 68 | Vagoneta Gatito x 0,5 Kg (pack x12u) | Vagoneta | ☐ |

---

## RESUMEN RÁPIDO

| Sección | Tamaño | Formato | Cantidad | ¿Dónde se pone? |
|---------|--------|---------|----------|-----------------|
| Carrusel banners | 1400×500 px | JPG/WebP | 3 | index.html (carousel-slide) |
| Categorías perro/gato | 200×200 px | PNG (transparente) | 2 | index.html (categoria-card) |
| Productos | 400×400 px | WebP/JPG | 68 | Google Sheet, columna "imagen" |
| Logos marcas | 200×80 px | PNG (transparente) | 6 | index.html (brand-track) |

### Herramientas que necesitás

| Para | Usá |
|------|-----|
| Subir imágenes | https://imgbb.com |
| Sacar fondos | https://remove.bg |
| Redimensionar | https://iloveimg.com |
| Mejorar calidad con IA | El que quieras |

### Flujo de trabajo para cada imagen

1. Buscá/bajá la imagen
2. (Opcional) Mejorala con IA
3. Sacále el fondo con remove.bg (si aplica)
4. Redimensioná al tamaño exacto de la tabla
5. Subí a ImgBB → copiá **"Enlace directo"**
6. Pegá el link donde corresponda
7. Refrescá la página para ver el resultado
