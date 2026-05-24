# Ecommerce Filtering & Search

Implement and optimize product filtering and search for a vanilla HTML/CSS/JS static ecommerce site.

## When to Use
- Adding product category/etapa filters
- Implementing client-side search with debounce
- Designing filter UI (chips, dropdowns, multi-select)
- Handling no-results and search suggestions

## Architecture (BICHITOS SHOP model)
- Products stored in `productos.json`, loaded via `js/api-service.js`
- Filters rendered dynamically from product data (etapas extracted from actual products)
- DOM updated by re-calling `renderProductos(filteredProducts)` without page reload
- Search via `renderBuscador()` with `input[type="search"]` and debounce
- Filter chips for etapa (`data-categoria`), select for sort order

## Implementation Patterns

### Filter State
```javascript
const filtroEstado = {
  busqueda: '',
  etapa: null,       // null = all, or string like "cachorro"
  orden: 'default',  // 'default', 'precio-asc', 'precio-desc', 'nombre'
  soloOfertas: false // optional toggle
};

function aplicarFiltros() {
  let resultados = [...productosActuales];
  
  if (filtroEstado.busqueda) {
    const q = filtroEstado.busqueda.toLowerCase();
    resultados = resultados.filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      p.marca?.toLowerCase().includes(q) ||
      p.descripcion?.toLowerCase().includes(q)
    );
  }
  
  if (filtroEstado.etapa) {
    resultados = resultados.filter(p => p.etapa === filtroEstado.etapa);
  }
  
  if (filtroEstado.orden === 'precio-asc') {
    resultados.sort((a, b) => a.precio - b.precio);
  } else if (filtroEstado.orden === 'precio-desc') {
    resultados.sort((a, b) => b.precio - a.precio);
  } else if (filtroEstado.orden === 'nombre') {
    resultados.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  }
  
  renderProductos(resultados);
  actualizarResultadosCount(resultados.length);
}
```

### Search with Debounce
```javascript
function setupSearch(inputElement) {
  let debounceTimer;
  inputElement.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      filtroEstado.busqueda = e.target.value.trim();
      aplicarFiltros();
    }, 300); // minimum 300ms per convention
  });
}
```

### Filter UI Components

**Etapa Chips** (horizontal scrollable on mobile)
```html
<div class="etapa-chips" role="group" aria-label="Filtrar por etapa">
  <button class="chip active" data-categoria="all">Todos</button>
  <button class="chip" data-categoria="cachorro">Cachorro</button>
  <button class="chip" data-categoria="adulto">Adulto</button>
  <button class="chip" data-categoria="senior">Senior</button>
</div>
```

**Sort Select** (custom styled)
```html
<div class="sort-select-wrapper">
  <svg class="sort-select-icon" aria-hidden="true">...</svg>
  <select id="sort-select" aria-label="Ordenar por">
    <option value="default">Relevancia</option>
    <option value="precio-asc">Menor precio</option>
    <option value="precio-desc">Mayor precio</option>
    <option value="nombre">Alfabético</option>
  </select>
</div>
```

### No Results State
```html
<div class="no-results" role="status">
  <svg class="no-results-icon" aria-hidden="true">...</svg>
  <p>No encontramos productos para <strong>"${busqueda}"</strong></p>
  <p class="no-results-suggestion">Probá con otros términos o <button class="btn-link" onclick="limpiarFiltros()">ver todos los productos</button></p>
</div>
```

### Keyboard Navigation in Search
```javascript
// From existing implementation
buscadorInput.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    const firstResult = document.querySelector('.producto-card');
    firstResult?.focus();
  } else if (e.key === 'Escape') {
    buscadorInput.blur();
    cerrarBuscador();
  }
});
```

### URL State Sync (Optional)
```javascript
// Sync filter state to URL query params for shareability
function syncFiltersToURL() {
  const params = new URLSearchParams();
  if (filtroEstado.etapa) params.set('etapa', filtroEstado.etapa);
  if (filtroEstado.busqueda) params.set('q', filtroEstado.busqueda);
  if (filtroEstado.orden !== 'default') params.set('orden', filtroEstado.orden);
  const newURL = `${window.location.pathname}${params.toString() ? '?' + params : ''}`;
  window.history.replaceState({}, '', newURL);
}

function loadFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('etapa')) filtroEstado.etapa = params.get('etapa');
  if (params.has('q')) filtroEstado.busqueda = params.get('q');
  if (params.has('orden')) filtroEstado.orden = params.get('orden');
}
```

## Accessibility
- `aria-live="polite"` on search results count
- `role="status"` on no-results message
- Focus management: when results update, announce count
- Chips: `role="group"` with `aria-label`
- Search input: proper `<label>` or `aria-label`

## Reference
- Baymard Institute: filtering and search usability
- NNG: faceted navigation guidelines
- InstantSearch.js patterns (conceptual, not library)
