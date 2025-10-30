/**
 * Lógica de negocio para AdminProducts
 * Contiene funciones puras para el manejo de productos en el dashboard de administración
 */

/**
 * Valida si un arreglo de productos es válido
 * @param {Array} products - Arreglo de productos
 * @returns {boolean}
 */
export function isValidProductsArray(products) {
  return Array.isArray(products);
}

/**
 * Verifica si hay productos disponibles
 * @param {Array} products - Arreglo de productos
 * @returns {boolean}
 */
export function hasProducts(products) {
  if (!Array.isArray(products)) return false;
  return products.length > 0;
}

/**
 * Obtiene el ID de un producto
 * @param {Object} product - Objeto producto
 * @returns {string|number|undefined}
 */
export function getProductId(product) {
  if (!product) return undefined;
  return product.id;
}

/**
 * Obtiene el nombre de un producto
 * @param {Object} product - Objeto producto
 * @returns {string}
 */
export function getProductName(product) {
  if (!product) return '';
  return product.nombre || '';
}

/**
 * Obtiene el precio de un producto
 * @param {Object} product - Objeto producto
 * @returns {number}
 */
export function getProductPrice(product) {
  if (!product) return 0;
  const precio = Number(product.precio);
  return isNaN(precio) ? 0 : precio;
}

/**
 * Obtiene la categoría de un producto
 * @param {Object} product - Objeto producto
 * @returns {string}
 */
export function getProductCategory(product) {
  if (!product) return '';
  return product.categoria || '';
}

/**
 * Formatea el precio de un producto con 2 decimales
 * @param {number} price - Precio del producto
 * @returns {string}
 */
export function formatProductPrice(price) {
  const num = Number(price);
  if (isNaN(num)) return '0.00';
  return num.toFixed(2);
}

/**
 * Crea el mensaje de confirmación para eliminar un producto
 * @param {string} nombre - Nombre del producto
 * @param {string|number} id - ID del producto
 * @returns {string}
 */
export function createDeleteConfirmationMessage(nombre, id) {
  return `¿Eliminar "${nombre}" (id: ${id})? Esta acción puede deshacerla borrando products_list en LocalStorage.`;
}

/**
 * Valida si un producto tiene los campos requeridos
 * @param {Object} product - Objeto producto
 * @returns {boolean}
 */
export function isValidProduct(product) {
  if (!product || typeof product !== 'object') return false;
  return product.id !== undefined && 
         product.nombre !== undefined;
}

/**
 * Obtiene información completa de un producto para mostrar
 * @param {Object} product - Objeto producto
 * @returns {Object} - Objeto con información del producto
 */
export function getProductDisplayInfo(product) {
  return {
    id: getProductId(product),
    nombre: getProductName(product),
    precio: getProductPrice(product),
    precioFormateado: formatProductPrice(getProductPrice(product)),
    categoria: getProductCategory(product),
    isValid: isValidProduct(product)
  };
}

/**
 * Filtra productos válidos de un arreglo
 * @param {Array} products - Arreglo de productos
 * @returns {Array}
 */
export function filterValidProducts(products) {
  if (!Array.isArray(products)) return [];
  return products.filter(p => isValidProduct(p));
}

/**
 * Cuenta el número de productos válidos
 * @param {Array} products - Arreglo de productos
 * @returns {number}
 */
export function countValidProducts(products) {
  return filterValidProducts(products).length;
}

/**
 * Busca un producto por ID
 * @param {Array} products - Arreglo de productos
 * @param {string|number} id - ID del producto a buscar
 * @returns {Object|undefined}
 */
export function findProductById(products, id) {
  if (!Array.isArray(products)) return undefined;
  return products.find(p => p.id === id);
}

/**
 * Obtiene todos los nombres de productos
 * @param {Array} products - Arreglo de productos
 * @returns {Array<string>}
 */
export function getProductNames(products) {
  if (!Array.isArray(products)) return [];
  return products.map(p => getProductName(p));
}

/**
 * Obtiene todas las categorías únicas de productos
 * @param {Array} products - Arreglo de productos
 * @returns {Array<string>}
 */
export function getUniqueCategories(products) {
  if (!Array.isArray(products)) return [];
  const categories = products.map(p => getProductCategory(p)).filter(c => c !== '');
  return [...new Set(categories)];
}

/**
 * Calcula el precio total de todos los productos (suma de precios unitarios)
 * @param {Array} products - Arreglo de productos
 * @returns {number}
 */
export function calculateTotalProductsValue(products) {
  if (!Array.isArray(products)) return 0;
  return products.reduce((total, product) => {
    return total + getProductPrice(product);
  }, 0);
}

/**
 * Ordena productos por nombre alfabéticamente
 * @param {Array} products - Arreglo de productos
 * @param {boolean} ascending - Si es true, ordena ascendente; si es false, descendente
 * @returns {Array}
 */
export function sortProductsByName(products, ascending = true) {
  if (!Array.isArray(products)) return [];
  const sorted = [...products].sort((a, b) => {
    const nameA = getProductName(a).toLowerCase();
    const nameB = getProductName(b).toLowerCase();
    if (nameA < nameB) return ascending ? -1 : 1;
    if (nameA > nameB) return ascending ? 1 : -1;
    return 0;
  });
  return sorted;
}

/**
 * Ordena productos por precio
 * @param {Array} products - Arreglo de productos
 * @param {boolean} ascending - Si es true, ordena ascendente; si es false, descendente
 * @returns {Array}
 */
export function sortProductsByPrice(products, ascending = true) {
  if (!Array.isArray(products)) return [];
  const sorted = [...products].sort((a, b) => {
    const priceA = getProductPrice(a);
    const priceB = getProductPrice(b);
    return ascending ? priceA - priceB : priceB - priceA;
  });
  return sorted;
}
