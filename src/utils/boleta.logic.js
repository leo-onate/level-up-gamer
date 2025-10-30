/**
 * @file Boleta.logic.js
 * @description Lógica de negocio para el componente Boleta.
 * Contiene funciones para procesar y validar los datos de una orden.
 */

// Asegura que el objeto global no se redeclare si este script se carga múltiples veces.
if (typeof window.BoletaLogic === 'undefined') {
  window.BoletaLogic = {};
}

/**
 * Obtiene un ID de visualización seguro de la orden.
 * Prioriza 'displayId' sobre 'id'.
 * @param {object} order - El objeto de la orden.
 * @returns {string|number} El ID encontrado o una cadena vacía si no existe.
 */
window.BoletaLogic.getDisplayId = function(order) {
  if (!order) return '';
  return order.displayId || order.id || '';
};

/**
 * Devuelve un array de items de forma segura.
 * Si la propiedad 'items' no es un array, devuelve un array vacío.
 * @param {object} order - El objeto de la orden.
 * @returns {Array} Un array de items.
 */
window.BoletaLogic.getSafeItems = function(order) {
  if (!order || !Array.isArray(order.items)) {
    return [];
  }
  return order.items;
};

/**
 * Obtiene el total de la orden de forma segura, asegurando que sea un número.
 * @param {object} order - El objeto de la orden.
 * @returns {number} El total de la orden o 0 si no es un número válido.
 */
window.BoletaLogic.getSafeTotal = function(order) {
  if (!order || typeof order.total !== 'number') {
    return 0;
  }
  return order.total;
};

/**
 * Formatea la fecha de la orden a un string localizado.
 * @param {object} order - El objeto de la orden.
 * @returns {string} La fecha formateada o una cadena vacía si no hay fecha.
 */
window.BoletaLogic.getFormattedDate = function(order) {
  if (!order || !order.date) {
    return "";
  }
  // Se valida que la fecha sea válida antes de convertirla
  const dateObj = new Date(order.date);
  if (isNaN(dateObj.getTime())) {
    return "";
  }
  return dateObj.toLocaleString();
};

/**
 * Calcula el subtotal para un item de la orden.
 * Convierte precio y cantidad a números para asegurar un cálculo correcto.
 * @param {object} item - El item con propiedades 'precio' y 'qty'.
 * @returns {number} El subtotal calculado.
 */
window.BoletaLogic.calculateItemSubtotal = function(item) {
  if (!item) return 0;
  const precio = Number(item.precio) || 0;
  const qty = Number(item.qty) || 0;
  return precio * qty;
};