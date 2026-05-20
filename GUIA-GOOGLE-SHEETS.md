# Guía para manejar los productos desde Google Sheets

## Paso 1: Crear el Google Sheet desde el CSV

1. Andá a https://sheets.new
2. Archivo → Importar → Subir → seleccioná `productos-ejemplo.csv`
3. Elegí "Reemplazar hoja de cálculo actual" → Importar

## Paso 2: Publicar como CSV

1. Archivo → Compartir → Publicar en web
2. En "Vincular", elegí: `Hoja1` → `CSV`
3. Click en **Publicar**
4. Copiá el link que aparece (algo como `https://docs.google.com/spreadsheets/d/e/.../pub?output=csv`)

## Paso 3: Configurar el sitio

1. Abrí `js/config.js` en el proyecto
2. Pegá el link entre las comillas:
   ```js
   const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/.../pub?output=csv';
   ```
3. Guardá y subí los cambios a GitHub

## Cómo editar productos

| Columna | Qué poner | Ejemplo |
|---------|-----------|---------|
| `nombre` | Nombre del producto | Estampa Plus perro x 20 Kg |
| `categoria` | `perros` o `gatos` | perros |
| `precio` | Precio final al público | 65148 |
| `precio_proveedor` | Lo que te costó (opcional) | 42346 |
| `margen` | Porcentaje de ganancia (opcional) | 35 |
| `imagen` | Link directo de la foto (opcional) | https://ejemplo.com/foto.jpg |
| `destacado` | `SI` para que aparezca en la home | SI |
| `stock` | Cantidad disponible | 12 |

## Cómo subir fotos fácil (ImgBB)

1. Andá a https://imgbb.com
2. Click en **Empezar a subir**
3. Elegí la foto del producto
4. En "Código para insertar", elegí **Enlace directo**
5. Copiá ese link y pegalo en la columna `imagen` del Sheet

## Importante

- **No borres** la primera fila (son los encabezados)
- **No cambios el formato** de publicación CSV
- Después de editar el Sheet, los cambios aparecen automáticamente en la web (puede tardar unos minutos por el caché)
