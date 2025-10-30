/**
 * src/utils/BlogCard.logic.spec.js
 *
 * Pruebas Jasmine para BlogCard.logic.js.
 * Estas pruebas se ejecutan usando Karma.
 */

describe('BlogCard.logic.js', function() {

  // NOTA: Se asume que Karma ha cargado 'BlogCard.logic.js'
  // antes de ejecutar este archivo de spec.

  describe('Función: formatDate', function() {

    // Test 1: Entrada válida (String ISO 8601)
    // Verifica el formateo correcto de un estándar común de fecha.
    it('debe formatear correctamente un string de fecha ISO 8601', function() {
      const isoDate = '2025-10-29T12:00:00Z';
      const expected = '29 de octubre de 2025';
      const result = window.BlogCardLogic.formatDate(isoDate);
      expect(result).toBe(expected);
    });

    // Test 2: Entrada válida (Objeto Date)
    // Verifica que maneja objetos Date nativos.
    it('debe formatear correctamente un objeto Date (mes 0 = Enero)', function() {
      // Usamos Date.UTC para evitar discrepancias de zona horaria en el runner de pruebas
      const dateObj = new Date(Date.UTC(2024, 0, 15)); // 15 Enero 2024
      const expected = '15 de enero de 2024';
      const result = window.BlogCardLogic.formatDate(dateObj);
      expect(result).toBe(expected);
    });

    // Test 3: Entrada nula (null)
    // Prueba de robustez contra valores nulos.
    it('debe retornar "Fecha inválida" si la entrada es null', function() {
      const result = window.BlogCardLogic.formatDate(null);
      expect(result).toBe('Fecha inválida');
    });

    // Test 4: Entrada incorrecta (undefined)
    // Prueba de robustez contra valores indefinidos.
    it('debe retornar "Fecha inválida" si la entrada es undefined', function() {
      const result = window.BlogCardLogic.formatDate(undefined);
      expect(result).toBe('Fecha inválida');
    });

    // Test 5: Entrada incorrecta (string inválido)
    // Verifica el manejo de strings que no representan fechas.
    it('debe retornar "Fecha inválida" si el string no es una fecha', function() {
      const result = window.BlogCardLogic.formatDate('esto no es una fecha');
      expect(result).toBe('Fecha inválida');
    });

    // Test 6: Entrada incorrecta (Objeto vacío)
    // Verifica el manejo de tipos de entrada inesperados.
    it('debe retornar "Fecha inválida" si la entrada es un objeto vacío', function() {
      const result = window.BlogCardLogic.formatDate({});
      expect(result).toBe('Fecha inválida');
    });

    // Test 7: Caso Borde (Año bisiesto)
    // Asegura que el formateador maneja correctamente los días bisiestos.
    it('debe manejar correctamente fechas de años bisiestos (29 Feb)', function() {
      const leapDate = '2020-02-29T12:00:00Z';
      const expected = '29 de febrero de 2020';
      const result = window.BlogCardLogic.formatDate(leapDate);
      expect(result).toBe(expected);
    });

    // Test 8: Caso Borde (Timestamp 0 - "Epoch")
    // Prueba con el inicio del tiempo Unix.
    it('debe manejar correctamente la fecha "Epoch" (Timestamp 0)', function() {
      const epochDate = 0; // 1 Enero 1970 UTC
      const expected = '1 de enero de 1970';
      const result = window.BlogCardLogic.formatDate(epochDate);
      expect(result).toBe(expected);
    });

  });
});