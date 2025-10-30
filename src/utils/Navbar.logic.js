/**
 * src/utils/Navbar.logic.js
 *
 * Lógica pura asociada al componente Navbar.
 */

// Asegura que el objeto de lógica exista en window, evitando redeclaraciones
// si el script se carga múltiples veces (ej. en testing).
if (typeof window.NavbarLogic === 'undefined') {
  window.NavbarLogic = {};
}

/**
 * @function handleLogoClick
 * @description Maneja el evento de clic en el logo (o cualquier enlace de logout).
 * Previene la acción por defecto del evento, ejecuta un callback de cierre de sesión
 * y redirige a la raíz del sitio ('/').
 *
 * @param {object} event - El objeto de evento del navegador (requiere 'preventDefault').
 * @param {function} logoutCallback - La función que ejecuta el cierre de sesión (ej. auth.logout).
 * @param {object} windowRef - La referencia al objeto 'window' global (para 'location.href').
 */
window.NavbarLogic.handleLogoClick = function(event, logoutCallback, windowRef) {
  
  // 1. Prevenir la acción por defecto del enlace
  // Se valida que el evento exista y tenga el método.
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
  } else {
    // Si no es un evento válido, al menos se loguea en consola en desarrollo/testing.
    console.warn('NavbarLogic: handleLogoClick recibió un objeto de evento no válido.');
  }

  // 2. Ejecutar el cierre de sesión
  // Se valida que el callback sea una función antes de ejecutarlo.
  if (typeof logoutCallback === 'function') {
    try {
      logoutCallback();
    } catch (err) {
      // Captura errores si la función de logout falla, pero permite que la redirección continúe.
      console.error('NavbarLogic: El logoutCallback falló.', err);
    }
  } else {
    console.warn('NavbarLogic: logoutCallback no es una función válida.');
  }

  // 3. Redirigir al inicio
  // Se valida que windowRef exista y tenga la propiedad 'location'.
  if (windowRef && windowRef.location) {
    windowRef.location.href = '/';
  } else {
    console.error('NavbarLogic: windowRef no es un objeto válido para la redirección.');
  }
};