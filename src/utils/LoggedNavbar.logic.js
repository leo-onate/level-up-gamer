/**
 * Lógica de negocio para el componente LoggedNavbar.
 * Almacenado en window.LoggedNavbarLogic para acceso global y pruebas.
 */

// Evita la redeclaración si este script se carga múltiples veces (importante para Karma)
if (typeof window.LoggedNavbarLogic === 'undefined') {
  window.LoggedNavbarLogic = {};
}

/**
 * Verifica si un usuario es administrador.
 * La lógica de negocio define a un admin como aquel cuyo 'nombre' es "admin".
 *
 * @param {object | null | undefined} user - El objeto de usuario (de getCurrentUser).
 * @returns {boolean} - True si el usuario es 'admin', false en caso contrario.
 */
window.LoggedNavbarLogic.checkIfAdmin = function(user) {
  // Comprobación de robustez: asegúrate de que el usuario exista y tenga la propiedad 'nombre'
  if (!user || typeof user.nombre === 'undefined') {
    return false;
  }
  return user.nombre === "admin";
};

/**
 * Maneja el proceso de cierre de sesión.
 * Llama al servicio de logout y luego navega a la página de login.
 *
 * @param {function} logoutServiceFn - La función 'logout' del servicio auth.
 * @param {function} navigateFn - La función 'navigate' de React Router.
 */
window.LoggedNavbarLogic.handleLogout = function(logoutServiceFn, navigateFn) {
  // Comprobar que los argumentos sean funciones antes de llamarlos
  if (typeof logoutServiceFn === 'function') {
    logoutServiceFn();
  }
  if (typeof navigateFn === 'function') {
    navigateFn("/login"); // Ruta fija definida en el componente
  }
};

/**
 * Maneja el T-toggle (abrir/cerrar) del menú de administrador.
 * Llama al setter de estado de React con una función de actualización.
 *
 * @param {function} setAdminOpenFn - El setter de estado (ej. setAdminOpen).
 */
window.LoggedNavbarLogic.handleToggleAdminMenu = function(setAdminOpenFn) {
  if (typeof setAdminOpenFn === 'function') {
    // Usa la forma de callback para garantizar el valor previo más reciente
    setAdminOpenFn(function(v) { 
      return !v; 
    });
  }
};

/**
 * Maneja la navegación desde un item del dropdown de admin.
 * Previene el comportamiento por defecto, cierra el menú y navega a la ruta especificada.
 *
 * @param {Event} event - El evento click del DOM.
 * @param {function} setAdminOpenFn - El setter de estado (ej. setAdminOpen).
 * @param {function} navigateFn - La función 'navigate' de React Router.
 * @param {string} path - La ruta de destino (ej. "/admin/usuarios").
 */
window.LoggedNavbarLogic.handleAdminNavigation = function(event, setAdminOpenFn, navigateFn, path) {
  // 1. Prevenir el comportamiento por defecto del evento
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
  }
  
  // 2. Cerrar el dropdown
  if (typeof setAdminOpenFn === 'function') {
    setAdminOpenFn(false);
  }
  
  // 3. Navegar a la ruta
  if (typeof navigateFn === 'function' && typeof path === 'string') {
    navigateFn(path);
  }
};