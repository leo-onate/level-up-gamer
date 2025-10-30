/**
 * Lógica de negocio para el componente ProductCard.
 * Almacenado en window.ProductCardLogic para acceso global y pruebas.
 */

// Evita la redeclaración si este script se carga múltiples veces (importante para Karma)
if (typeof window.ProductCardLogic === 'undefined') {
  window.ProductCardLogic = {};
}

/**
 * Calcula el precio original de un producto basándose en si está en oferta.
 * Asume un descuento fijo del 40% (precio / 0.6).
 *
 * @param {object} product - El objeto del producto.
 * @param {number} product.precio - El precio actual (puede ser el de oferta).
 * @param {boolean} product.oferta - Booleano que indica si el producto está en oferta.
 * @returns {number} - El precio original calculado.
 */
window.ProductCardLogic.calculateOriginalPrice = function(product) {
  // Comprobación de robustez: asegúrate de que el producto y el precio sean válidos
  if (!product || typeof product.precio !== 'number') {
    return 0; 
  }
  
  // Aplica la lógica de descuento
  return product.oferta ? product.precio / 0.6 : product.precio;
};

/**
 * Resuelve la ruta (src) de la imagen del producto.
 * 1. Busca en el objeto 'images' (cargador dinámico).
 * 2. Revisa si es una ruta absoluta (empieza con /).
 * 3. Asume que es una ruta relativa y le añade /assets/img/.
 * 4. Usa un placeholder si no hay productImagen.
 *
 * @param {string | null | undefined} productImagen - El valor de product.imagen.
 * @param {object} images - El objeto 'images' importado (imageLoader).
 * @returns {string} - La ruta (src) final de la imagen.
 */
window.ProductCardLogic.getProductImageSrc = function(productImagen, images) {
  // Asegura que 'images' sea un objeto, aunque sea nulo o indefinido
  var localImages = images || {}; 

  // 1. Prioridad: Imagen del cargador dinámico
  if (productImagen && localImages[productImagen]) {
    return localImages[productImagen];
  }
  
  if (productImagen) {
    // 2. Ruta absoluta
    if (productImagen.startsWith("/")) {
      return productImagen;
    } 
    // 3. Ruta relativa
    else {
      return "/assets/img/" + productImagen;
    }
  }
  
  // 4. Placeholder
  return "/assets/img/placeholder.jpg";
};

/**
 * Manejador para el evento click de "Añadir al carrito".
 * Encapsula la llamada a la función 'addToCart' del contexto.
 *
 * @param {function} addToCart - La función 'addToCart' proveniente de useCart().
 * @param {object} product - El producto a añadir.
 */
window.ProductCardLogic.handleAddToCartClick = function(addToCart, product) {
  // Comprobación de robustez: asegura que los parámetros sean correctos
  if (typeof addToCart === 'function' && product) {
    addToCart(product, 1); // La cantidad '1' estaba fija en el componente
  }
};