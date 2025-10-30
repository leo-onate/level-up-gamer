/**
 * Lógica de negocio para el componente Boleta
 * Separada para facilitar testing unitario
 */

/**
 * Valida si una orden es válida
 * @param {Object} order - Objeto de orden
 * @returns {boolean} - true si la orden es válida
 */
export function isValidOrder(order) {
  return order !== null && order !== undefined;
}

/**
 * Obtiene el ID de la orden (prioriza displayId sobre id)
 * @param {Object} order - Objeto de orden
 * @returns {string} - ID de la orden
 */
export function getOrderId(order) {
  return order.displayId || order.id;
}

/**
 * Obtiene los items de la orden de forma segura
 * @param {Object} order - Objeto de orden
 * @returns {Array} - Array de items (vacío si no hay items válidos)
 */
export function getOrderItems(order) {
  return Array.isArray(order.items) ? order.items : [];
}

/**
 * Obtiene el total de la orden de forma segura
 * @param {Object} order - Objeto de orden
 * @returns {number} - Total de la orden (0 si no es un número válido)
 */
export function getOrderTotal(order) {
  return typeof order.total === 'number' ? order.total : 0;
}

/**
 * Formatea la fecha de la orden
 * @param {Object} order - Objeto de orden
 * @returns {string} - Fecha formateada o string vacío
 */
export function getFormattedDate(order) {
  return order.date ? new Date(order.date).toLocaleString() : "";
}

/**
 * Calcula el precio de un item de forma segura
 * @param {Object} item - Item de la orden
 * @returns {number} - Precio del item (0 si inválido)
 */
export function getItemPrice(item) {
  return Number(item.precio) || 0;
}

/**
 * Calcula la cantidad de un item de forma segura
 * @param {Object} item - Item de la orden
 * @returns {number} - Cantidad del item (0 si inválido)
 */
export function getItemQuantity(item) {
  return Number(item.qty) || 0;
}

/**
 * Calcula el subtotal de un item (precio * cantidad)
 * @param {Object} item - Item de la orden
 * @returns {number} - Subtotal del item
 */
export function calculateItemSubtotal(item) {
  const precio = getItemPrice(item);
  const qty = getItemQuantity(item);
  return precio * qty;
}

/**
 * Formatea un precio con 2 decimales
 * @param {number} price - Precio a formatear
 * @returns {string} - Precio formateado (ej: "10.50")
 */
export function formatPrice(price) {
  return price.toFixed(2);
}

/**
 * Obtiene el nombre del cliente de forma segura
 * @param {Object} order - Objeto de orden
 * @returns {string} - Nombre del cliente o string vacío
 */
export function getCustomerName(order) {
  return order.customer?.nombre || "";
}

/**
 * Verifica si la orden tiene información del cliente
 * @param {Object} order - Objeto de orden
 * @returns {boolean} - true si tiene información del cliente
 */
export function hasCustomerInfo(order) {
  return !!order.customer;
}

/**
 * Obtiene el email del usuario de forma segura
 * @param {Object} order - Objeto de orden
 * @returns {string|null} - Email del usuario o null
 */
export function getUserEmail(order) {
  return order.userEmail || null;
}

/**
 * Calcula el total de todos los items (para validación)
 * @param {Array} items - Array de items
 * @returns {number} - Total calculado
 */
export function calculateTotalFromItems(items) {
  if (!Array.isArray(items)) return 0;
  
  return items.reduce((total, item) => {
    return total + calculateItemSubtotal(item);
  }, 0);
}

/**
 * Valida que el total de la orden coincida con la suma de items
 * @param {Object} order - Objeto de orden
 * @param {number} tolerance - Tolerancia en centavos (default: 0.01)
 * @returns {boolean} - true si los totales coinciden dentro de la tolerancia
 */
export function validateOrderTotal(order, tolerance = 0.01) {
  const orderTotal = getOrderTotal(order);
  const itemsTotal = calculateTotalFromItems(getOrderItems(order));
  return Math.abs(orderTotal - itemsTotal) <= tolerance;
}
