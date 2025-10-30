/**
 * @file AdminProducts.logic.js
 * @description Lógica de negocio para el componente AdminProducts.
 * Contiene funciones para formatear datos y generar mensajes de confirmación.
 */

// Asegura que el objeto global no se redeclare si este script se carga múltiples veces.
if (typeof window.AdminProductsLogic === 'undefined') {
  window.AdminProductsLogic = {};
}

/**
 * Crea el mensaje de confirmación estándar para eliminar un producto.
 * @param {string|number} id - El ID del producto.
 * @param {string} nombre - El nombre del producto para mostrar en el mensaje.
 * @returns {string} El mensaje de confirmación completo.
 */
window.AdminProductsLogic.createDeleteConfirmationMessage = function(id, nombre) {
  const safeName = nombre || "producto seleccionado";
  const safeId = id || "N/A";
  return `¿Eliminar "${safeName}" (id: ${safeId})? Esta acción puede deshacerla borrando products_list en LocalStorage.`;
};

/**
 * Formatea un valor numérico como un string de precio con dos decimales.
 * @param {number|string} price - El precio a formatear.
 * @returns {string} El precio formateado como "0.00". Si la entrada no es un número válido, devuelve "0.00".
 */
window.AdminProductsLogic.formatPrice = function(price) {
  const numericPrice = Number(price);
  if (isNaN(numericPrice)) {
    return '0.00';
  }
  return numericPrice.toFixed(2);
};