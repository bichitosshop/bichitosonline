// API Service for Bichitos Shop
// Follows REST principles and provides a clean interface for product data

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
                this.productsCache = products;
                this.cacheTimestamp = Date.now();
                
                return products;
            } else {
                // Fallback to local data
                throw new Error('Using fallback data');
            }
        } catch (error) {
            console.warn('Failed to fetch from API, using fallback data:', error);
            return this.getFallbackProducts();
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
            { id:1, nombre:'Estampa Plus perro RAZAS PEQUEÑAS x 8 Kg', categoria:'perros', precio:29180, destacado:true, marca:'Estampa' },
            { id:2, nombre:'Estampa Plus perro x 15 Kg', categoria:'perros', precio:50690, destacado:true, marca:'Estampa' },
            { id:3, nombre:'Estampa Plus perro x 20 Kg', categoria:'perros', precio:65148, destacado:false, marca:'Estampa' },
            { id:4, nombre:'Estampa plus RAZA PEQUEÑA X 15 KG', categoria:'perros', precio:53160, destacado:false, marca:'Estampa' },
            { id:5, nombre:'ESTAMPA RAZA PEQUEÑA X 3KG (3 unid)', categoria:'perros', precio:37695, destacado:false, marca:'Estampa' },
            { id:6, nombre:'Estampa Criadores x 15 Kg', categoria:'perros', precio:42898, destacado:false, marca:'Estampa' },
            { id:7, nombre:'Estampa Criadores x 20 Kg', categoria:'perros', precio:55173, destacado:false, marca:'Estampa' },
            { id:8, nombre:'Estampa Criadores x 8kg', categoria:'perros', precio:23547, destacado:false, marca:'Estampa' },
            { id:9, nombre:'Estampa Plus Cachorro x 15 Kg', categoria:'perros', precio:57475, destacado:false, marca:'Estampa' },
            { id:10, nombre:'Estampa Plus Cachorro x 8kg', categoria:'perros', precio:31553, destacado:false, marca:'Estampa' },
            { id:11, nombre:'Estampa Plus Gato x15kg', categoria:'gatos', precio:60300, destacado:true, marca:'Estampa' },
            { id:12, nombre:'Estampa Plus Gato x 8kg', categoria:'gatos', precio:33106, destacado:false, marca:'Estampa' },
            { id:13, nombre:'Estampa Gato x 1 kg (pack x8 u)', categoria:'gatos', precio:39679, destacado:false, marca:'Estampa' },
            { id:14, nombre:'Valiant Criadores x 20 Kg', categoria:'perros', precio:47398, destacado:false, marca:'Valiant' },
            { id:15, nombre:'Estampa Insignia Perro Adulto x 20kg', categoria:'perros', precio:109015, destacado:true, marca:'Insignia' },
            { id:16, nombre:'Estampa Insignia Perro Adulto x 3kg', categoria:'perros', precio:20941, destacado:false, marca:'Insignia' },
            { id:17, nombre:'Estampa Insignia Perro Adulto x 15 kg', categoria:'perros', precio:81761, destacado:false, marca:'Insignia' },
            { id:18, nombre:'Estampa Insignia Perro Cachorro x 8kg', categoria:'perros', precio:50290, destacado:false, marca:'Insignia' },
            { id:19, nombre:'Estampa Insignia Perro Cachorro x 3kg', categoria:'perros', precio:22491, destacado:false, marca:'Insignia' },
            { id:20, nombre:'Estampa Insignia Perro Mordida Pequeña x 8kg', categoria:'perros', precio:48913, destacado:false, marca:'Insignia' },
            { id:21, nombre:'Estampa Insignia Perro Mordida Pequeña x 3kg', categoria:'perros', precio:21962, destacado:false, marca:'Insignia' },
            { id:22, nombre:'Jaspe Adulto x 20 kg', categoria:'perros', precio:40307, destacado:false, marca:'Jaspe' },
            { id:23, nombre:'Jaspe Adulto MP x 20 kg', categoria:'perros', precio:44150, destacado:false, marca:'Jaspe' },
            { id:24, nombre:'Jaspe Adulto x 8 kg', categoria:'perros', precio:16590, destacado:false, marca:'Jaspe' },
            { id:25, nombre:'Jaspe Adulto MP x 8 kg', categoria:'perros', precio:18174, destacado:false, marca:'Jaspe' },
            { id:26, nombre:'Jaspe Adulto x 3 kg (4u)', categoria:'perros', precio:32149, destacado:false, marca:'Jaspe' },
            { id:27, nombre:'Jaspe Adulto MP x 3kg (4u)', categoria:'perros', precio:35174, destacado:false, marca:'Jaspe' },
            { id:28, nombre:'Jaspe Cachorro x 15 kg', categoria:'perros', precio:39158, destacado:false, marca:'Jaspe' },
            { id:29, nombre:'Jaspe Cach Premium x 15 kg', categoria:'perros', precio:51555, destacado:false, marca:'Jaspe' },
            { id:30, nombre:'Jaspe Cach Premium x 1,5kg (8u)', categoria:'perros', precio:70648, destacado:false, marca:'Jaspe' },
            { id:31, nombre:'Jaspe Gato x 10 kg', categoria:'gatos', precio:31456, destacado:false, marca:'Jaspe' },
            { id:32, nombre:'Jaspe Gato x 1 kg (12u)', categoria:'gatos', precio:51249, destacado:false, marca:'Jaspe' },
            { id:33, nombre:'Jaspe Gato x 20 kg', categoria:'gatos', precio:59862, destacado:false, marca:'Jaspe' },
            { id:34, nombre:'Jaspe Gato Premium x 8 kg', categoria:'gatos', precio:32877, destacado:false, marca:'Jaspe' },
            { id:35, nombre:'Jaspe Gato Premium x 1kg (12u)', categoria:'gatos', precio:74088, destacado:false, marca:'Jaspe' },
            { id:36, nombre:'Jaspe Premium x 20 kg', categoria:'perros', precio:61626, destacado:false, marca:'Jaspe' },
            { id:37, nombre:'Jaspe Premium x 1,5kg (8u)', categoria:'perros', precio:63322, destacado:false, marca:'Jaspe' },
            { id:38, nombre:'Jaspe Premium x 15 Kg', categoria:'perros', precio:46229, destacado:false, marca:'Jaspe' },
            { id:39, nombre:'Jaspe Premium MP x 8 Kg', categoria:'perros', precio:28254, destacado:false, marca:'Jaspe' },
            { id:40, nombre:'Jaspe Premium MP x 15 Kg', categoria:'perros', precio:48466, destacado:false, marca:'Jaspe' },
            { id:41, nombre:'Jaspe Premium MP x1,5kg (8u)', categoria:'perros', precio:66397, destacado:false, marca:'Jaspe' },
            { id:42, nombre:'Jaspe Criadores x 20 kg', categoria:'perros', precio:49368, destacado:false, marca:'Jaspe' },
            { id:43, nombre:'Liwué x 15 kg', categoria:'perros', precio:21487, destacado:false, marca:'Liwué' },
            { id:44, nombre:'Liwué x 20 kg', categoria:'perros', precio:28465, destacado:false, marca:'Liwué' },
            { id:45, nombre:'Liwué Gato x 10 kg', categoria:'gatos', precio:24577, destacado:false, marca:'Liwué' },
            { id:46, nombre:'Liwué Gato x 20 kg', categoria:'gatos', precio:46601, destacado:false, marca:'Liwué' },
            { id:47, nombre:'Liwue Plus x 20 Kg', categoria:'perros', precio:33083, destacado:false, marca:'Liwué' },
            { id:48, nombre:'Vagoneta Gourmet x 15 Kg', categoria:'perros', precio:29169, destacado:false, marca:'Vagoneta' },
            { id:49, nombre:'Vagoneta Gourmet x 20 Kg', categoria:'perros', precio:38896, destacado:false, marca:'Vagoneta' },
            { id:50, nombre:'Vagoneta Gourmet x 1,5Kg (x6u)', categoria:'perros', precio:25610, destacado:false, marca:'Vagoneta' },
            { id:51, nombre:'Vagoneta CARNE Y CEREALES x20Kg', categoria:'perros', precio:38896, destacado:false, marca:'Vagoneta' },
            { id:52, nombre:'Vagoneta TRADICIONAL x 8 Kg', categoria:'perros', precio:16127, destacado:false, marca:'Vagoneta' },
            { id:53, nombre:'Vagoneta Raza Pequeña x 15 Kg', categoria:'perros', precio:30571, destacado:false, marca:'Vagoneta' },
            { id:54, nombre:'Vagoneta Raza Pequeña x 8 Kg', categoria:'perros', precio:16745, destacado:false, marca:'Vagoneta' },
            { id:55, nombre:'Vagoneta Raza Pequeña x 1,5 Kg (x6u)', categoria:'perros', precio:26831, destacado:false, marca:'Vagoneta' },
            { id:56, nombre:'Vagoneta Cachorro x 15 Kg', categoria:'perros', precio:40370, destacado:false, marca:'Vagoneta' },
            { id:57, nombre:'Vagoneta Cachorro x 1,5 Kg (x6u)', categoria:'perros', precio:33980, destacado:false, marca:'Vagoneta' },
            { id:58, nombre:'Dr Perrot x 20 Kg', categoria:'perros', precio:37345, destacado:false, marca:'Dr Perrot' },
            { id:59, nombre:'Dr Perrot x 15 Kg', categoria:'perros', precio:28007, destacado:false, marca:'Dr Perrot' },
            { id:60, nombre:'Dr Perrot x 1,5 Kg (pack x6u)', categoria:'perros', precio:23065, destacado:false, marca:'Dr Perrot' },
            { id:61, nombre:'Vagoneta Gato x 10 Kg', categoria:'gatos', precio:32335, destacado:false, marca:'Vagoneta' },
            { id:62, nombre:'Vagoneta Gato x 20 Kg', categoria:'gatos', precio:62340, destacado:false, marca:'Vagoneta' },
            { id:63, nombre:'Vagoneta Gato x 1 Kg (pack x8u)', categoria:'gatos', precio:35357, destacado:false, marca:'Vagoneta' },
            { id:64, nombre:'Vagoneta Gato Gourmet x 10 Kg', categoria:'gatos', precio:32335, destacado:false, marca:'Vagoneta' },
            { id:65, nombre:'Vagoneta Gato Gourmet x 20 Kg', categoria:'gatos', precio:62340, destacado:false, marca:'Vagoneta' },
            { id:66, nombre:'Vagoneta Gato Gourmet x 1 Kg (pack x8u)', categoria:'gatos', precio:35357, destacado:false, marca:'Vagoneta' },
            { id:67, nombre:'Vagoneta Gatito x 10 Kg', categoria:'gatos', precio:34545, destacado:false, marca:'Vagoneta' },
            { id:68, nombre:'Vagoneta Gatito x 0,5 Kg (pack x12u)', categoria:'gatos', precio:30536, destacado:false, marca:'Vagoneta' }
        ];
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