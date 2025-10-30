/**
 * src/utils/Navbar.logic.spec.js
 *
 * Pruebas Jasmine para Navbar.logic.js.
 * Estas pruebas se ejecutan usando Karma.
 */

describe('Navbar.logic.js', function() {

  // NOTA: Se asume que Karma ha cargado 'Navbar.logic.js' antes de ejecutar este spec.

  describe('Función: handleLogoClick', function() {

    // Se definen variables para los mocks que se reiniciarán en cada test (beforeEach)
    var mockEvent;
    var mockLogoutCallback;
    var mockWindowRef;

    // beforeEach reinicia los mocks antes de cada 'it'
    beforeEach(function() {
      // Mock del evento con un spy en preventDefault
      mockEvent = {
        preventDefault: jasmine.createSpy('preventDefaultSpy')
      };

      // Mock del callback de logout
      mockLogoutCallback = jasmine.createSpy('logoutCallbackSpy');

      // Mock del objeto window (solo con las propiedades necesarias)
      // Se inicializa con una URL base para verificar que cambia.
      mockWindowRef = {
        location: {
          href: 'http://localhost:3000/profile'
        }
      };
    });

    // Test 1: Entrada válida (Caso "Feliz")
    // Verifica que las 3 acciones (preventDefault, logout, redirect) se ejecutan.
    it('debe llamar a preventDefault, ejecutar el callback y redirigir a "/"', function() {
      // Ejecutar la función
      window.NavbarLogic.handleLogoClick(mockEvent, mockLogoutCallback, mockWindowRef);

      // Verificaciones
      expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
      expect(mockLogoutCallback).toHaveBeenCalledTimes(1);
      expect(mockWindowRef.location.href).toBe('/');
    });

    // Test 2: Entradas nulas (Caso de robustez)
    // Verifica que la función no falle (lance un error) si recibe entradas nulas
    // o indefinidas. La lógica interna debe manejar esto.
    it('no debe fallar (throw) si las entradas son nulas o undefined', function() {
      var executionNull = function() {
        window.NavbarLogic.handleLogoClick(null, null, null);
      };
      var executionUndefined = function() {
        window.NavbarLogic.handleLogoClick(undefined, undefined, undefined);
      };

      // Se espera que la función (que contiene validaciones internas)
      // simplemente no falle, aunque loguee errores en consola.
      expect(executionNull).not.toThrow();
      expect(executionUndefined).not.toThrow();
    });

    // Test 3: Caso Borde (El callback de logout falla)
    // Verifica que la redirección ocurra INCLUSO si la función logout() lanza un error.
    it('debe redirigir a "/" incluso si el logoutCallback lanza un error', function() {
      var mockFailedLogout = function() {
        throw new Error('Error de autenticación simulado');
      };

      // Ejecutar la función con el callback que falla
      window.NavbarLogic.handleLogoClick(mockEvent, mockFailedLogout, mockWindowRef);

      // Verificaciones
      // El preventDefault debió ocurrir (va primero)
      expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
      
      // La redirección debió ocurrir (la lógica interna captura el error)
      expect(mockWindowRef.location.href).toBe('/');
    });

    // Test 4: Caso Incorrecto (Entradas con tipos incorrectos)
    // Verifica robustez contra tipos de datos inesperados (ej. un objeto sin preventDefault).
    it('no debe fallar (throw) si las entradas tienen tipos incorrectos', function() {
      var wrongEvent = {}; // No tiene preventDefault
      var wrongCallback = "soy un string"; // No es función
      var wrongWindow = { location: null }; // Location es nulo

      var executionWrong = function() {
        window.NavbarLogic.handleLogoClick(wrongEvent, wrongCallback, wrongWindow);
      };

      // Se espera que la función (que contiene validaciones internas) no falle.
      expect(executionWrong).not.toThrow();
      
      // Verificamos que, aunque la ejecución no falló, el href no cambió
      // porque el mock 'wrongWindow' era inválido para la redirección.
      expect(mockWindowRef.location.href).toBe('http://localhost:3000/profile');
    });

  });
});