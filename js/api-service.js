// API Service for Bichitos Shop
// Follows REST principles and provides a clean interface for product data

const PRODUCT_IMAGES_MAP = {
    'ESTAMPAPLUSPERRORAZASPEQUENAS': 'https://nutrega.com.ar/wp-content/uploads/2023/03/plus-rp.jpg',
    'ESTAMPAPLUSPERRORAZASPEQUEÑAS': 'https://nutrega.com.ar/wp-content/uploads/2023/03/plus-rp.jpg',
    'ESTAMPAPLUSPERRO': 'https://acdn-us.mitiendanube.com/stores/004/788/704/products/estampa-plus-alimento-perro-adulto-26-proteinas-cae8966fc78db91b1117412954978076-480-0.webp',
    'ESTAMPAPLUSCACHORRO': 'https://nutrega.com.ar/wp-content/uploads/2023/03/cachorros-plus.jpg',
    'ESTAMPAPLUSGATO': 'https://nutrega.com.ar/images/estampa-gato.jpg',
    'ESTAMPAGATO': 'https://nutrega.com.ar/images/estampa-gato.jpg',
    'ESTAMPACRIADORES': 'https://acdn-us.mitiendanube.com/stores/003/845/983/products/estampa-criadores-perros-adultos-pet-shop-animall-com-ar-835d8135a18fa85ab117004823687926-640-0.webp',
    'VALIANTCRIADORES': 'https://supermercadodemascotas.com.ar/wp-content/uploads/2022/08/Diseno-sin-titulo-11-600x600.png',
    'ESTAMPAINSIGNIAPERROADULTO': 'https://nutrega.com.ar/wp-content/uploads/2023/03/estmapa-myg.jpg',
    'ESTAMPAINSIGNIAPERROCACHORRO': 'https://nutrega.com.ar/wp-content/uploads/2023/03/cachorros-1.jpg',
    'ESTAMPAINSIGNIAPERROMORDIDAPEQUENA': 'https://nutrega.com.ar/wp-content/uploads/2023/03/estampa-rp.jpg',
    'ESTAMPAINSIGNIAPERROMORDIDAPEQUEÑA': 'https://nutrega.com.ar/wp-content/uploads/2023/03/estampa-rp.jpg',
    'JASPEADULTO': 'https://jaspe-nutricion.com.ar/img/tradicional/Tradicional-Adultos.webp',
    'JASPECACHORRO': 'https://jaspe-nutricion.com.ar/img/tradicional/Tradicional-Cachorros.webp',
    'JASPECACHPREMIUM': 'https://jaspe-nutricion.com.ar/img/premium/Premium-Cachorros.webp',
    'JASPEPREMIUM': 'https://jaspe-nutricion.com.ar/img/premium/Premium-Adultos-Mordida-Tradicional.webp',
    'JASPECRIADORES': 'https://jaspe-nutricion.com.ar/img/premium/Premium-Criadores.webp',
    'JASPEGATO': 'https://jaspe-nutricion.com.ar/img/tradicional/Tradicional-Gatos.webp',
    'JASPEGATOPREMIUM': 'https://jaspe-nutricion.com.ar/img/premium/Premium-Gatos.webp',
    'LIWU': 'https://acdn-us.mitiendanube.com/stores/979/500/products/tmp_b64_b99b0bf6-730f-4d04-9274-d753a5e8deae_979500_6251921-0ea2bbf7ab216ea8d817732341486204-640-0.webp',
    'LIWUÉ': 'https://acdn-us.mitiendanube.com/stores/979/500/products/tmp_b64_b99b0bf6-730f-4d04-9274-d753a5e8deae_979500_6251921-0ea2bbf7ab216ea8d817732341486204-640-0.webp',
    'LIWUEPLUS': 'https://acdn-us.mitiendanube.com/stores/979/500/products/tmp_b64_b99b0bf6-730f-4d04-9274-d753a5e8deae_979500_6251921-0ea2bbf7ab216ea8d817732341486204-640-0.webp',
    'VAGONETAGOURMET': 'https://vagoneta.com.ar/img/producto-perros-gourmet.png',
    'VAGONETACARNEY': 'https://vagoneta.com.ar/img/producto-perros-gourmet.png',
    'VAGONETATRADICIONAL': 'https://vagoneta.com.ar/img/producto-perros-adultos.png',
    'VAGONETARAZAPEQUENA': 'https://vagoneta.com.ar/img/producto-perros-adultos.png',
    'VAGONETARAZAPEQUEÑA': 'https://vagoneta.com.ar/img/producto-perros-adultos.png',
    'VAGONETACACHORRO': 'https://vagoneta.com.ar/img/producto-cachorros.png',
    'VAGONETAGATO': 'https://vagoneta.com.ar/img/producto-gatos.png',
    'VAGONETAGATOGOURMET': 'https://vagoneta.com.ar/img/producto-gatos-gourmet.png',
    'VAGONETAGATITO': 'https://vagoneta.com.ar/img/producto-gatitos.png',
    'DRPERROT': 'https://drperrot.com.ar/img/producto.png',
};

function buscarImagenProducto(nombre) {
    const key = nombre.toUpperCase().replace(/[^A-Z0-9ÁÉÍÓÚÑÜ]/g, '');
    for (const [k, url] of Object.entries(PRODUCT_IMAGES_MAP)) {
        if (key.startsWith(k)) return url;
    }
    for (const [k, url] of Object.entries(PRODUCT_IMAGES_MAP)) {
        if (key.includes(k)) return url;
    }
    return '';
}

class ProductosAPI {
    constructor() {
        this.baseUrl = '';
        this.productsCache = null;
        this.cacheTimestamp = null;
        this.cacheDuration = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Fetch products from Google Sheets CSV or fallback to local data
     * @returns {Promise<Array>} Promise resolving to array of product objects
     */
    async fetchProducts() {
        // Check if we have valid cached data
        if (this.isCacheValid()) {
            return this.productsCache;
        }

        try {
            // Try to fetch from Google Sheets if URL is configured
            if (typeof SHEET_CSV_URL !== 'undefined' && SHEET_CSV_URL) {
                const response = await fetch(`${SHEET_CSV_URL}?v=${Date.now()}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const csvText = await response.text();
                const products = this.parseCSV(csvText);
                
                // Update cache
                const enriched = this.enrichWithImages(products);
                this.productsCache = enriched;
                this.cacheTimestamp = Date.now();
                
                return enriched;
            } else {
                // Fallback to local data
                throw new Error('Using fallback data');
            }
            } catch (error) {
                console.warn('Failed to fetch from API, using fallback data:', error);
                const products = this.getFallbackProducts();
                return this.enrichWithImages(products);
            }
    }

    /**
     * Get product by ID
     * @param {number} id - Product ID
     * @returns {Promise<Object>} Promise resolving to product object
     */
    async getProductById(id) {
        const products = await this.fetchProducts();
        return products.find(product => product.id === id) || null;
    }

    /**
     * Get products by category
     * @param {string} category - Product category ('perros', 'gatos', or 'todas')
     * @returns {Promise<Array>} Promise resolving to array of product objects
     */
    async getProductsByCategory(category) {
        const products = await this.fetchProducts();
        if (category === 'todas') return products;
        return products.filter(product => product.categoria === category);
    }

    /**
     * Search products by name
     * @param {string} searchTerm - Search term
     * @returns {Promise<Array>} Promise resolving to array of product objects
     */
    async searchProducts(searchTerm) {
        const products = await this.fetchProducts();
        if (!searchTerm) return products;
        const term = searchTerm.toLowerCase().trim();
        return products.filter(product => 
            product.nombre.toLowerCase().includes(term)
        );
    }

    /**
     * Get featured products
     * @returns {Promise<Array>} Promise resolving to array of featured product objects
     */
    async getFeaturedProducts() {
        const products = await this.fetchProducts();
        return products.filter(product => product.destacado === true);
    }

    /**
     * Parse CSV text into product objects
     * @param {string} csvText - CSV text to parse
     * @returns {Array} Array of product objects
     */
    parseCSV(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim());
        if (lines.length < 2) return this.getFallbackProducts();
        
        const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
        const results = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(value => value.trim());
            if (values.length < 2) continue;
            
            const item = {};
            headers.forEach((header, index) => {
                item[header] = values[index] || '';
            });
            
            if (!item.nombre) continue;
            
            results.push({
                id: i,
                nombre: item.nombre,
                categoria: (item.categoria || '').toLowerCase(),
                precio: parseInt(item.precio_final) || parseInt(item.precio) || 0,
                precio_proveedor: parseInt(item.precio_proveedor) || 0,
                margen: parseInt(item.margen) || 35,
                imagen: item.imagen || '',
                destacado: (item.destacado || '').toUpperCase() === 'SI',
                marca: (item.nombre || '').split(' ')[0]
            });
        }
        
        return results.length ? results : this.getFallbackProducts();
    }

    /**
     * Get fallback products (hardcoded data)
     * @returns {Array} Array of product objects
     */
    getFallbackProducts() {
        return [
            { id:1, nombre:'Estampa Plus perro RAZAS PEQUEÑAS x 8 Kg', categoria:'perros', precio:29180, destacado:true, marca:'Estampa', stock:12 },
            { id:2, nombre:'Estampa Plus perro x 15 Kg', categoria:'perros', precio:50690, destacado:true, marca:'Estampa', stock:8 },
            { id:3, nombre:'Estampa Plus perro x 20 Kg', categoria:'perros', precio:65148, destacado:false, marca:'Estampa', stock:5 },
            { id:4, nombre:'Estampa plus RAZA PEQUEÑA X 15 KG', categoria:'perros', precio:53160, destacado:false, marca:'Estampa', stock:3 },
            { id:5, nombre:'ESTAMPA RAZA PEQUEÑA X 3KG (3 unid)', categoria:'perros', precio:37695, destacado:false, marca:'Estampa', stock:10 },
            { id:6, nombre:'Estampa Criadores x 15 Kg', categoria:'perros', precio:42898, destacado:false, marca:'Estampa', stock:20 },
            { id:7, nombre:'Estampa Criadores x 20 Kg', categoria:'perros', precio:55173, destacado:false, marca:'Estampa', stock:6 },
            { id:8, nombre:'Estampa Criadores x 8kg', categoria:'perros', precio:23547, destacado:false, marca:'Estampa', stock:15 },
            { id:9, nombre:'Estampa Plus Cachorro x 15 Kg', categoria:'perros', precio:57475, destacado:false, marca:'Estampa', stock:4 },
            { id:10, nombre:'Estampa Plus Cachorro x 8kg', categoria:'perros', precio:31553, destacado:false, marca:'Estampa', stock:7 },
            { id:11, nombre:'Estampa Plus Gato x15kg', categoria:'gatos', precio:60300, destacado:true, marca:'Estampa', stock:12 },
            { id:12, nombre:'Estampa Plus Gato x 8kg', categoria:'gatos', precio:33106, destacado:false, marca:'Estampa', stock:9 },
            { id:13, nombre:'Estampa Gato x 1 kg (pack x8 u)', categoria:'gatos', precio:39679, destacado:false, marca:'Estampa', stock:2 },
            { id:14, nombre:'Valiant Criadores x 20 Kg', categoria:'perros', precio:47398, destacado:false, marca:'Valiant', stock:25 },
            { id:15, nombre:'Estampa Insignia Perro Adulto x 20kg', categoria:'perros', precio:109015, destacado:true, marca:'Insignia', stock:8 },
            { id:16, nombre:'Estampa Insignia Perro Adulto x 3kg', categoria:'perros', precio:20941, destacado:false, marca:'Insignia', stock:4 },
            { id:17, nombre:'Estampa Insignia Perro Adulto x 15 kg', categoria:'perros', precio:81761, destacado:false, marca:'Insignia', stock:6 },
            { id:18, nombre:'Estampa Insignia Perro Cachorro x 8kg', categoria:'perros', precio:50290, destacado:false, marca:'Insignia', stock:3 },
            { id:19, nombre:'Estampa Insignia Perro Cachorro x 3kg', categoria:'perros', precio:22491, destacado:false, marca:'Insignia', stock:5 },
            { id:20, nombre:'Estampa Insignia Perro Mordida Pequeña x 8kg', categoria:'perros', precio:48913, destacado:false, marca:'Insignia', stock:7 },
            { id:21, nombre:'Estampa Insignia Perro Mordida Pequeña x 3kg', categoria:'perros', precio:21962, destacado:false, marca:'Insignia', stock:2 },
            { id:22, nombre:'Jaspe Adulto x 20 kg', categoria:'perros', precio:40307, destacado:false, marca:'Jaspe', stock:30 },
            { id:23, nombre:'Jaspe Adulto MP x 20 kg', categoria:'perros', precio:44150, destacado:false, marca:'Jaspe', stock:18 },
            { id:24, nombre:'Jaspe Adulto x 8 kg', categoria:'perros', precio:16590, destacado:false, marca:'Jaspe', stock:22 },
            { id:25, nombre:'Jaspe Adulto MP x 8 kg', categoria:'perros', precio:18174, destacado:false, marca:'Jaspe', stock:14 },
            { id:26, nombre:'Jaspe Adulto x 3 kg (4u)', categoria:'perros', precio:32149, destacado:false, marca:'Jaspe', stock:0 },
            { id:27, nombre:'Jaspe Adulto MP x 3kg (4u)', categoria:'perros', precio:35174, destacado:false, marca:'Jaspe', stock:0 },
            { id:28, nombre:'Jaspe Cachorro x 15 kg', categoria:'perros', precio:39158, destacado:false, marca:'Jaspe', stock:11 },
            { id:29, nombre:'Jaspe Cach Premium x 15 kg', categoria:'perros', precio:51555, destacado:false, marca:'Jaspe', stock:8 },
            { id:30, nombre:'Jaspe Cach Premium x 1,5kg (8u)', categoria:'perros', precio:70648, destacado:false, marca:'Jaspe', stock:4 },
            { id:31, nombre:'Jaspe Gato x 10 kg', categoria:'gatos', precio:31456, destacado:false, marca:'Jaspe', stock:16 },
            { id:32, nombre:'Jaspe Gato x 1 kg (12u)', categoria:'gatos', precio:51249, destacado:false, marca:'Jaspe', stock:6 },
            { id:33, nombre:'Jaspe Gato x 20 kg', categoria:'gatos', precio:59862, destacado:false, marca:'Jaspe', stock:3 },
            { id:34, nombre:'Jaspe Gato Premium x 8 kg', categoria:'gatos', precio:32877, destacado:false, marca:'Jaspe', stock:9 },
            { id:35, nombre:'Jaspe Gato Premium x 1kg (12u)', categoria:'gatos', precio:74088, destacado:false, marca:'Jaspe', stock:1 },
            { id:36, nombre:'Jaspe Premium x 20 kg', categoria:'perros', precio:61626, destacado:false, marca:'Jaspe', stock:5 },
            { id:37, nombre:'Jaspe Premium x 1,5kg (8u)', categoria:'perros', precio:63322, destacado:false, marca:'Jaspe', stock:7 },
            { id:38, nombre:'Jaspe Premium x 15 Kg', categoria:'perros', precio:46229, destacado:false, marca:'Jaspe', stock:12 },
            { id:39, nombre:'Jaspe Premium MP x 8 Kg', categoria:'perros', precio:28254, destacado:false, marca:'Jaspe', stock:10 },
            { id:40, nombre:'Jaspe Premium MP x 15 Kg', categoria:'perros', precio:48466, destacado:false, marca:'Jaspe', stock:8 },
            { id:41, nombre:'Jaspe Premium MP x1,5kg (8u)', categoria:'perros', precio:66397, destacado:false, marca:'Jaspe', stock:0 },
            { id:42, nombre:'Jaspe Criadores x 20 kg', categoria:'perros', precio:49368, destacado:false, marca:'Jaspe', stock:20 },
            { id:43, nombre:'Liwué x 15 kg', categoria:'perros', precio:21487, destacado:false, marca:'Liwué', stock:15 },
            { id:44, nombre:'Liwué x 20 kg', categoria:'perros', precio:28465, destacado:false, marca:'Liwué', stock:9 },
            { id:45, nombre:'Liwué Gato x 10 kg', categoria:'gatos', precio:24577, destacado:false, marca:'Liwué', stock:4 },
            { id:46, nombre:'Liwué Gato x 20 kg', categoria:'gatos', precio:46601, destacado:false, marca:'Liwué', stock:6 },
            { id:47, nombre:'Liwue Plus x 20 Kg', categoria:'perros', precio:33083, destacado:false, marca:'Liwué', stock:11 },
            { id:48, nombre:'Vagoneta Gourmet x 15 Kg', categoria:'perros', precio:29169, destacado:false, marca:'Vagoneta', stock:13 },
            { id:49, nombre:'Vagoneta Gourmet x 20 Kg', categoria:'perros', precio:38896, destacado:false, marca:'Vagoneta', stock:8 },
            { id:50, nombre:'Vagoneta Gourmet x 1,5Kg (x6u)', categoria:'perros', precio:25610, destacado:false, marca:'Vagoneta', stock:5 },
            { id:51, nombre:'Vagoneta CARNE Y CEREALES x20Kg', categoria:'perros', precio:38896, destacado:false, marca:'Vagoneta', stock:16 },
            { id:52, nombre:'Vagoneta TRADICIONAL x 8 Kg', categoria:'perros', precio:16127, destacado:false, marca:'Vagoneta', stock:22 },
            { id:53, nombre:'Vagoneta Raza Pequeña x 15 Kg', categoria:'perros', precio:30571, destacado:false, marca:'Vagoneta', stock:7 },
            { id:54, nombre:'Vagoneta Raza Pequeña x 8 Kg', categoria:'perros', precio:16745, destacado:false, marca:'Vagoneta', stock:4 },
            { id:55, nombre:'Vagoneta Raza Pequeña x 1,5 Kg (x6u)', categoria:'perros', precio:26831, destacado:false, marca:'Vagoneta', stock:2 },
            { id:56, nombre:'Vagoneta Cachorro x 15 Kg', categoria:'perros', precio:40370, destacado:false, marca:'Vagoneta', stock:9 },
            { id:57, nombre:'Vagoneta Cachorro x 1,5 Kg (x6u)', categoria:'perros', precio:33980, destacado:false, marca:'Vagoneta', stock:3 },
            { id:58, nombre:'Dr Perrot x 20 Kg', categoria:'perros', precio:37345, destacado:false, marca:'Dr Perrot', stock:18 },
            { id:59, nombre:'Dr Perrot x 15 Kg', categoria:'perros', precio:28007, destacado:false, marca:'Dr Perrot', stock:14 },
            { id:60, nombre:'Dr Perrot x 1,5 Kg (pack x6u)', categoria:'perros', precio:23065, destacado:false, marca:'Dr Perrot', stock:6 },
            { id:61, nombre:'Vagoneta Gato x 10 Kg', categoria:'gatos', precio:32335, destacado:false, marca:'Vagoneta', stock:10 },
            { id:62, nombre:'Vagoneta Gato x 20 Kg', categoria:'gatos', precio:62340, destacado:false, marca:'Vagoneta', stock:5 },
            { id:63, nombre:'Vagoneta Gato x 1 Kg (pack x8u)', categoria:'gatos', precio:35357, destacado:false, marca:'Vagoneta', stock:8 },
            { id:64, nombre:'Vagoneta Gato Gourmet x 10 Kg', categoria:'gatos', precio:32335, destacado:false, marca:'Vagoneta', stock:3 },
            { id:65, nombre:'Vagoneta Gato Gourmet x 20 Kg', categoria:'gatos', precio:62340, destacado:false, marca:'Vagoneta', stock:4 },
            { id:66, nombre:'Vagoneta Gato Gourmet x 1 Kg (pack x8u)', categoria:'gatos', precio:35357, destacado:false, marca:'Vagoneta', stock:0 },
            { id:67, nombre:'Vagoneta Gatito x 10 Kg', categoria:'gatos', precio:34545, destacado:false, marca:'Vagoneta', stock:7 },
            { id:68, nombre:'Vagoneta Gatito x 0,5 Kg (pack x12u)', categoria:'gatos', precio:30536, destacado:false, marca:'Vagoneta', stock:12 }
        ];
    }

    /**
     * Enrich products with image URLs from the mapping
     * @param {Array} products - Product array
     * @returns {Array} Products with imagen field populated
     */
    enrichWithImages(products) {
        return products.map(p => {
            if (!p.imagen) {
                p.imagen = buscarImagenProducto(p.nombre);
            }
            return p;
        });
    }

    /**
     * Check if cache is valid
     * @returns {boolean} True if cache is valid, false otherwise
     */
    isCacheValid() {
        return this.productsCache !== null && 
               this.cacheTimestamp !== null && 
               (Date.now() - this.cacheTimestamp) < this.cacheDuration;
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.productsCache = null;
        this.cacheTimestamp = null;
    }
}

// Initialize API service
const productosAPI = new ProductosAPI();

// Export for use in other modules (if using ES modules)
// In this case, we'll attach to window for global access
window.productosAPI = productosAPI;