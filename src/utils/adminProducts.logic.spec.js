/**
 * @file AdminProducts.logic.spec.js
 * @description Pruebas unitarias para la lógica del componente AdminProducts.
 */

describe('AdminProductsLogic', function() {

  // Pruebas para la función createDeleteConfirmationMessage
  describe('createDeleteConfirmationMessage', function() {
    // Test 1: Prueba que genera el mensaje correctamente con entradas válidas.
    it('should create the correct confirmation message with valid inputs', function() {
      const id = 123;
      const nombre = 'Laptop Gamer';
      const expectedMessage = `¿Eliminar "Laptop Gamer" (id: 123)? Esta acción puede deshacerla borrando products_list en LocalStorage.`;
      expect(window.AdminProductsLogic.createDeleteConfirmationMessage(id, nombre)).toBe(expectedMessage);
    });

    // Test 2: Prueba que maneja un nombre nulo o indefinido de forma segura.
    it('should handle null or undefined name gracefully', function() {
      const id = 456;
      const expectedMessage = `¿Eliminar "producto seleccionado" (id: 456)? Esta acción puede deshacerla borrando products_list en LocalStorage.`;
      expect(window.AdminProductsLogic.createDeleteConfirmationMessage(id, null)).toBe(expectedMessage);
      expect(window.AdminProductsLogic.createDeleteConfirmationMessage(id, undefined)).toBe(expectedMessage);
    });

    // Test 3: Prueba (caso borde) que maneja un ID nulo o un nombre vacío.
    it('should handle null id or empty name as edge cases', function() {
      const expectedMessageWithNullId = `¿Eliminar "Teclado" (id: N/A)? Esta acción puede deshacerla borrando products_list en LocalStorage.`;
      expect(window.AdminProductsLogic.createDeleteConfirmationMessage(null, 'Teclado')).toBe(expectedMessageWithNullId);
      
      const expectedMessageWithEmptyName = `¿Eliminar "producto seleccionado" (id: 789)? Esta acción puede deshacerla borrando products_list en LocalStorage.`;
      expect(window.AdminProductsLogic.createDeleteConfirmationMessage(789, '')).toBe(expectedMessageWithEmptyName);
    });
  });

  // Pruebas para la función formatPrice
  describe('formatPrice', function() {
    // Test 1: Prueba que formatea un número estándar y un entero correctamente.
    it('should format a valid number to two decimal places', function() {
      expect(window.AdminProductsLogic.formatPrice(150.758)).toBe('150.76');
      expect(window.AdminProductsLogic.formatPrice(200)).toBe('200.00');
    });

    // Test 2: Prueba que devuelve '0.00' para entradas inválidas como null, undefined o strings no numéricos.
    it('should return "0.00" for invalid or non-numeric input', function() {
      expect(window.AdminProductsLogic.formatPrice(null)).toBe('0.00');
      expect(window.AdminProductsLogic.formatPrice(undefined)).toBe('0.00');
      expect(window.AdminProductsLogic.formatPrice('texto')).toBe('0.00');
    });

    // Test 3: Prueba (caso borde) que formatea correctamente strings numéricos y el valor cero.
    it('should handle numeric strings and the value zero correctly', function() {
      expect(window.AdminProductsLogic.formatPrice('99.9')).toBe('99.90');
      expect(window.AdminProductsLogic.formatPrice(0)).toBe('0.00');
      expect(window.AdminProductsLogic.formatPrice('0')).toBe('0.00');
    });
  });

});