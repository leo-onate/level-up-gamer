/**
 * src/utils/BlogCard.logic.js
 *
 * Lógica pura asociada al componente BlogCard.
 */

// Asegura que el objeto de lógica exista en window, evitando redeclaraciones
// si el script se carga múltiples veces (ej. en testing).
if (typeof window.BlogCardLogic === 'undefined') {
  window.BlogCardLogic = {};
}

/**
 * @function formatDate
 * @description Toma una fecha (string ISO, timestamp o Date object) y la formatea
 * a un formato legible en español (ej. "29 de octubre de 2025").
 *
 * @param {string|Date|number} dateInput - La fecha de entrada.
 * @returns {string} - La fecha formateada o un string de 'Fecha inválida' si la entrada no es procesable.
 */
window.BlogCardLogic.formatDate = function(dateInput) {
  // Caso 1: Entrada nula, indefinida o vacía.
  if (!dateInput) {
    return 'Fecha inválida';
  }

  try {
    const date = new Date(dateInput);

    // Caso 2: La entrada no pudo ser parseada como fecha válida.
    // (Ej: new Date('esto no es una fecha') -> 'Invalid Date')
    // (isNaN(new Date('...').getTime()) es la forma correcta de chequear 'Invalid Date')
    if (isNaN(date.getTime())) {
      // console.warn("BlogCardLogic: Se recibió una fecha inválida:", dateInput);
      return 'Fecha inválida';
    }

    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    // Retorna la fecha formateada para español (España)
    return date.toLocaleDateString('es-ES', options);

  } catch (error) {
    // Captura cualquier error inesperado durante la creación de la fecha.
    // console.error("BlogCardLogic: Error al formatear fecha:", error);
    return 'Fecha inválida';
  }
};