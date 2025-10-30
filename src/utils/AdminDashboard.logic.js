/**
 * Fichero: src/utils/AdminDashboard.logic.js
 * * Lógica de negocio pura para el componente AdminDashboard.
 * Contiene funciones para calcular datos derivados y formatear salidas.
 * * Para usarlo, impórtalo en tu componente:
 * import './path/to/AdminDashboard.logic.js';
 */

// Se adjunta al objeto window para ser accesible globalmente
// y evitar problemas de redeclaración en entornos como Karma.
if (!window.AdminDashboardLogic) {
  window.AdminDashboardLogic = {};
}

/**
 * Calcula los 5 productos más recientes.
 * Primero intenta ordenar por 'createdAt' o 'fecha'.
 * Si no hay fechas, devuelve los últimos 5 agregados al array.
 * @param {Array<Object>} products - El array completo de productos.
 * @returns {Array<Object>} Un array con un máximo de 5 productos recientes.
 */
window.AdminDashboardLogic.calculateRecentProducts = function(products) {
  if (!products || !Array.isArray(products) || products.length === 0) {
    return [];
  }

  // Clona el array para no mutar el estado original
  var productsCopy = products.slice(); 

  // 1. Filtra productos que tengan una fecha válida
  var withDate = productsCopy.filter(function(p) {
    return p && (p.createdAt || p.fecha);
  });

  // 2. Si hay productos con fecha, ordénalos y toma 5
  if (withDate.length > 0) {
    return withDate
      .sort(function(a, b) {
        // Compara las fechas (usando new Date() para asegurar una comparación válida)
        var dateA = new Date(a.createdAt || a.fecha);
        var dateB = new Date(b.createdAt || b.fecha);
        return dateB - dateA; // Descendente
      })
      .slice(0, 5);
  }

  // 3. Si no hay fechas, toma los últimos 5 y revierte el orden (LIFO)
  return productsCopy.slice(-5).reverse();
};

/**
 * Resuelve la ruta fuente (src) para la imagen de un producto.
 * Maneja múltiples posibles nombres de propiedad (imagen, image, img),
 * un objeto de imágenes pre-cargadas, rutas absolutas y relativas.
 * @param {Object} p - El objeto de producto.
 * @param {Object} images - El objeto importado de 'imageLoader'.
 * @returns {string} La ruta URL de la imagen a mostrar.
 */
window.AdminDashboardLogic.imgSrcFor = function(p, images) {
  // Objeto 'images' debe ser proveído (incluso si está vacío)
  var imgMap = images || {}; 
  
  if (!p) {
    return '/assets/img/placeholder.jpg'; // Placeholder si el producto es nulo
  }

  var img = p.imagen || p.image || p.img;

  // 1. Verificar si la imagen está en el 'imageLoader'
  if (img && imgMap[img]) {
    return imgMap[img];
  }

  // 2. Verificar si es una ruta absoluta (comienza con /)
  if (img && typeof img === 'string' && img.startsWith('/')) {
    return img;
  }
  
  // 3. Asumir que es una ruta relativa que necesita el prefijo
  if (img) {
    return '/assets/img/' + img;
  }

  // 4. Fallback final al placeholder
  return '/assets/img/placeholder.jpg';
};

/**
 * Obtiene una clave única 'key' de React para un producto.
 * @param {Object} p - El objeto de producto.
 * @returns {string|number} Una clave única.
 */
window.AdminDashboardLogic.getProductKey = function(p) {
  if (!p) {
    // Clave para ítems nulos o indefinidos en el array
    return 'null_item_' + new Date().getTime(); 
  }
  // Prioriza ID, luego _ID (mongo), y finalmente serializa el objeto
  return p.id || p._id || JSON.stringify(p);
};

/**
 * Obtiene el nombre visible del producto.
 * @param {Object} p - El objeto de producto.
 * @returns {string} El nombre o un fallback.
 */
window.AdminDashboardLogic.getProductName = function(p) {
  if (!p) {
    return 'Sin nombre';
  }
  return p.nombre || p.title || 'Sin nombre';
};

/**
 * Formatea el precio del producto para mostrar.
 * @param {Object} p - El objeto de producto.
 * @returns {string} El precio formateado (ej: "$100") o un string vacío.
 */
window.AdminDashboardLogic.getProductPrice = function(p) {
  if (!p) {
    return '';
  }
  // Usa '!=' null para cubrir 'null' y 'undefined', pero permitir '0'
  if (p.precio != null) {
    return '$' + p.precio;
  }
  if (p.price != null) {
    return '$' + p.price;
  }
  return ''; // No hay precio
};