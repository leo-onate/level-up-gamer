/**
 * Pruebas Jasmine para LoggedNavbar.logic.js.
 * NO SE DEBE USAR DESTRUCTURACIÓN (const { ... } = window) para evitar errores
 * de redeclaración en el entorno de Karma.
 */

describe('LoggedNavbar.logic', function() {

  // Comprobar que el objeto global de lógica existe
  it('should be defined on the window object', function() {
    expect(window.LoggedNavbarLogic).toBeDefined();
  });

  // --- Pruebas para checkIfAdmin ---
  describe('checkIfAdmin', function() {

    // Test 1: Entrada válida (Es admin)
    it('should return true if user name is "admin"', function() {
      var adminUser = { nombre: 'admin' };
      expect(window.LoggedNavbarLogic.checkIfAdmin(adminUser)).toBe(true);
    });

    // Test 2: Entrada válida (No es admin)
    it('should return false if user name is not "admin"', function() {
      var regularUser = { nombre: 'Juan' };
      expect(window.LoggedNavbarLogic.checkIfAdmin(regularUser)).toBe(false);
    });

    // Test 3: Entrada nula/incorrecta (usuario nulo)
    it('should return false if user is null', function() {
      expect(window.LoggedNavbarLogic.checkIfAdmin(null)).toBe(false);
    });

    // Test 4: Caso borde (usuario indefinido)
    it('should return false if user is undefined', function() {
      expect(window.LoggedNavbarLogic.checkIfAdmin(undefined)).toBe(false);
    });
        
    // Test 5: Caso borde (usuario sin propiedad 'nombre')
    it('should return false if user object does not have "nombre" property', function() {
      var userNoName = { id: 1, email: 'test@test.com' };
      expect(window.LoggedNavbarLogic.checkIfAdmin(userNoName)).toBe(false);
    });
  });

  // --- Pruebas para handleLogout ---
  describe('handleLogout', function() {

    var mockLogoutService;
    var mockNavigate;

    // Resetear mocks antes de cada test
    beforeEach(function() {
      mockLogoutService = jasmine.createSpy('logoutService');
      mockNavigate = jasmine.createSpy('navigate');
    });

    // Test 1: Entrada válida
    it('should call both logout service and navigate to /login', function() {
      window.LoggedNavbarLogic.handleLogout(mockLogoutService, mockNavigate);
      
      expect(mockLogoutService).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    // Test 2: Entrada incorrecta (funciones nulas)
    it('should not crash if functions are null or undefined', function() {
      // Función anónima para encapsular la llamada y probar que no lanza error
      var testCall = function() {
        window.LoggedNavbarLogic.handleLogout(null, null);
      };
      expect(testCall).not.toThrow();
    });

    // Test 3: Caso borde (solo una función es válida)
    it('should call navigate even if logout service is invalid', function() {
      window.LoggedNavbarLogic.handleLogout(null, mockNavigate);
      
      expect(mockLogoutService).not.toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  // --- Pruebas para handleToggleAdminMenu ---
  describe('handleToggleAdminMenu', function() {

    // Test 1: Entrada válida (simulando el toggle)
    it('should call the state setter function with an updater', function() {
      var mockState = false;
      // Simulamos un setter de estado de React
      var mockSetState = function(updater) {
        if (typeof updater === 'function') {
          mockState = updater(mockState); // Aplicamos el updater al estado actual
        }
      };

      // Primera llamada: false -> true
      window.LoggedNavbarLogic.handleToggleAdminMenu(mockSetState);
      expect(mockState).toBe(true);

      // Segunda llamada: true -> false
      window.LoggedNavbarLogic.handleToggleAdminMenu(mockSetState);
      expect(mockState).toBe(false);
    });

    // Test 2: Entrada incorrecta (función nula)
    it('should not crash if the state setter is not a function', function() {
      var testCall = function() {
        window.LoggedNavbarLogic.handleToggleAdminMenu(null);
      };
      expect(testCall).not.toThrow();
    });
    
    // Test 3: Entrada incorrecta (argumento inválido)
     it('should not crash if the state setter is undefined', function() {
      var testCall = function() {
        window.LoggedNavbarLogic.handleToggleAdminMenu(undefined);
      };
      expect(testCall).not.toThrow();
    });
  });

  // --- Pruebas para handleAdminNavigation ---
  describe('handleAdminNavigation', function() {
    
    var mockEvent;
    var mockSetAdminOpen;
    var mockNavigate;
    var testPath = "/admin/test-path";

    beforeEach(function() {
      // Mock de un evento DOM con 'preventDefault'
      mockEvent = {
        preventDefault: jasmine.createSpy('preventDefault')
      };
      mockSetAdminOpen = jasmine.createSpy('setAdminOpen');
      mockNavigate = jasmine.createSpy('navigate');
    });

    // Test 1: Entrada válida
    it('should prevent default, close menu (false), and navigate to path', function() {
      window.LoggedNavbarLogic.handleAdminNavigation(mockEvent, mockSetAdminOpen, mockNavigate, testPath);
      
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockSetAdminOpen).toHaveBeenCalledWith(false);
      expect(mockNavigate).toHaveBeenCalledWith(testPath);
    });

    // Test 2: Entrada incorrecta (argumentos nulos)
    it('should not crash if arguments are null', function() {
      var testCall = function() {
        window.LoggedNavbarLogic.handleAdminNavigation(null, null, null, null);
      };
      expect(testCall).not.toThrow();
    });

    // Test 3: Caso borde (evento nulo)
    it('should still close menu and navigate if event is null', function() {
      window.LoggedNavbarLogic.handleAdminNavigation(null, mockSetAdminOpen, mockNavigate, testPath);
      
      expect(mockEvent.preventDefault).not.toHaveBeenCalled(); // No se puede llamar
      expect(mockSetAdminOpen).toHaveBeenCalledWith(false);
      expect(mockNavigate).toHaveBeenCalledWith(testPath);
    });

    // Test 4: Caso borde (path nulo)
    it('should prevent default and close menu, but not navigate if path is null', function() {
      window.LoggedNavbarLogic.handleAdminNavigation(mockEvent, mockSetAdminOpen, mockNavigate, null);
      
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockSetAdminOpen).toHaveBeenCalledWith(false);
      expect(mockNavigate).not.toHaveBeenCalled(); // No debe navegar
    });
  });

});