/**
 * Lógica de negocio para el componente ProductDetail.
 * Almacenado en window.ProductDetailLogic para acceso global y pruebas.
 */

// Evita la redeclaración si este script se carga múltiples veces (importante para Karma)
if (typeof window.ProductDetailLogic === 'undefined') {
  window.ProductDetailLogic = {};
}

/**
 * Resuelve la ruta (src) de la imagen del producto.
 * (Esta lógica es idéntica a la de ProductCard.logic.js)
 * 1. Busca en el objeto 'images' (cargador dinámico).
 * 2. Revisa si es una ruta absoluta (empieza con /).
 * 3. Asume que es una ruta relativa y le añade /assets/img/.
 * 4. Usa un placeholder si no hay productImagen.
 *
 * @param {string | null | undefined} productImagen - El valor de product.imagen.
 * @param {object} images - El objeto 'images' importado (imageLoader).
 * @returns {string} - La ruta (src) final de la imagen.
 */
window.ProductDetailLogic.getProductImageSrc = function(productImagen, images) {
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
 * Manejador para el evento click de "Volver".
 * Encapsula la llamada a la función 'navigate' de react-router.
 *
 * @param {function} navigate - La función 'navigate' proveniente de useNavigate().
 */
window.ProductDetailLogic.handleGoBack = function(navigate) {
  // Comprobación de robustez: asegura que 'navigate' sea una función
  if (typeof navigate === 'function') {
    navigate(-1); // Navega a la página anterior en el historial
  }
};