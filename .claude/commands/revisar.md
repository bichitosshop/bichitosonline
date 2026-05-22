# /revisar — Revisión completa de la página

Hace una revisión general del estado del proyecto y detecta problemas.

## Qué revisar

1. **HTML:** Chequeá que los 3 archivos (index, productos, contacto) tengan el mismo header/footer/scripts
2. **CSS:** Variables usadas correctamente, no hay estilos inline innecesarios, no hay emojis decorativos
3. **JS:** `enrichWithImages()` se llama en ambos paths de `api-service.js`; no hay `console.error` ni funciones indefinidas
4. **Imágenes:** Todas las `<img>` tienen `onerror` configurado; no hay emojis como src
5. **Accesibilidad:** `aria-label` en botones de ícono, `alt` en imágenes, roles en modales
6. **Links:** Verificar que todos los href internos apunten a archivos que existen

## Formato del reporte

- Lista por archivo de lo que está bien ✅ y lo que hay que arreglar ⚠️
- Empezá por lo más crítico
