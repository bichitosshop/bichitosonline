# /nuevo-producto — Agregar un producto al fallback

Cuando querés agregar un producto nuevo al listado de fallback (el que se muestra si Google Sheets no carga), usá este comando.

## Lo que necesito saber

Preguntame:
1. Nombre del producto
2. Marca (estampa / jaspe / vagoneta / liwue / dr perrot / valiant)
3. Categoría (perros / gatos)
4. Etapa (adulto / cachorro / senior / pequenas / especiales / kitten / urinario / castrado)
5. Precio en pesos
6. ¿Es oferta? (sí/no)
7. ¿Envío gratis? (sí/no)
8. ¿Destacado en la home? (sí/no)

## Dónde agregarlo

Archivo: `js/api-service.js` → array `getFallbackProducts()`.
El id debe ser el siguiente número correlativo al último producto existente.
La imagen puede quedar vacía (se usa placeholder automático).

## Formato del objeto

```js
{
  id: 69,
  nombre: "Nombre del Producto",
  marca: "marca",
  categoria: "perros",
  etapa: "adulto",
  precio: 15000,
  imagen: "",
  descripcion: "Descripción breve",
  es_oferta: false,
  envio_gratis: false,
  destacado: false,
  agotado: false,
  pocos_stock: false
}
```
