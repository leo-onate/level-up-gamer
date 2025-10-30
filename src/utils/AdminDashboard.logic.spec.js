/**
 * Fichero: src/utils/AdminDashboard.logic.spec.js
 * * Tests de Jasmine para AdminDashboard.logic.js.
 * Verifica la lógica de cálculo y formato de datos del dashboard.
 */

describe('AdminDashboardLogic', function() {

  // Asegura que la lógica esté cargada
  if (!window.AdminDashboardLogic) {
    // Carga la lógica si no está (simulación, en Karma esto se importa)
    // En un entorno real de Karma, el .logic.js ya estaría cargado.
    console.warn("AdminDashboardLogic no está cargado. Los tests pueden fallar.");
  }

  // --- Pruebas para calculateRecentProducts ---
  describe('calculateRecentProducts', function() {

    // Datos de prueba con fechas (createdAt)
    var productsWithDate = [
      { id: 1, nombre: 'Antiguo', createdAt: '2025-01-01T10:00:00Z' },
      { id: 2, nombre: 'Reciente', createdAt: '2025-10-28T10:00:00Z' },
      { id: 3, nombre: 'Medio', createdAt: '2025-05-15T10:00:00Z' }
    ];
    
    // Datos de prueba con fechas (fecha)
    var productsWithFecha = [
      { id: 1, nombre: 'Antiguo', fecha: '2025-01-01' },
      { id: 2, nombre: 'Reciente', fecha: '2025-10-28' },
      { id: 3, nombre: 'Medio', fecha: '2025-05-15' }
    ];

    // Datos de prueba sin fechas
    var productsNoDate = [
      { id: 1, nombre: 'A' },
      { id: 2, nombre: 'B' },
      { id: 3, nombre: 'C' },
      { id: 4, nombre: 'D' },
      { id: 5, nombre: 'E' },
      { id: 6, nombre: 'F' } // Este debería ser el primero en la lista final
    ];

    // Test 1: (Entrada válida) Debe ordenar por 'createdAt' y devolver los 5 más nuevos
    it('debe ordenar por createdAt correctamente', function() {
      var result = window.AdminDashboardLogic.calculateRecentProducts(productsWithDate);
      expect(result.length).toBe(3); // Menos de 5
      expect(result[0].nombre).toBe('Reciente'); // El más nuevo primero
      expect(result[1].nombre).toBe('Medio');
      expect(result[2].nombre).toBe('Antiguo');
    });

    // Test 2: (Entrada válida) Debe ordenar por 'fecha' (fallback) correctamente
    it('debe ordenar por fecha (fallback) correctamente', function() {
      var result = window.AdminDashboardLogic.calculateRecentProducts(productsWithFecha);
      expect(result.length).toBe(3);
      expect(result[0].nombre).toBe('Reciente');
      expect(result[1].nombre).toBe('Medio');
      expect(result[2].nombre).toBe('Antiguo');
    });

    // Test 3: (Caso Borde) Debe tomar los últimos 5 y revertirlos si no hay fechas
    it('debe tomar los últimos 5 y revertirlos si no hay fechas', function() {
      var result = window.AdminDashboardLogic.calculateRecentProducts(productsNoDate);
      expect(result.length).toBe(5); // Toma solo 5 (de 6)
      expect(result[0].nombre).toBe('F'); // El último del array original
      expect(result[1].nombre).toBe('E');
      expect(result[4].nombre).toBe('B');
    });

    // Test 4: (Entrada nula/incorrecta) Debe devolver un array vacío
    it('debe devolver un array vacío para entrada nula o indefinida', function() {
      expect(window.AdminDashboardLogic.calculateRecentProducts(null)).toEqual([]);
      expect(window.AdminDashboardLogic.calculateRecentProducts(undefined)).toEqual([]);
      expect(window.AdminDashboardLogic.calculateRecentProducts([])).toEqual([]);
    });

  });

  // --- Pruebas para imgSrcFor ---
  describe('imgSrcFor', function() {
    
    // Mock del objeto 'images' que vendría del import 'imageLoader'
    var mockImages = {
      'logo.png': 'http://cdn/logo.png',
      'special.jpg': '/assets/preloaded/special.jpg'
    };

    // Test 1: (Entrada válida) Debe usar el 'imageLoader' (mockImages)
    it('debe devolver la ruta del imageLoader si existe', function() {
      var p = { imagen: 'logo.png' };
      var result = window.AdminDashboardLogic.imgSrcFor(p, mockImages);
      expect(result).toBe('http://cdn/logo.png');
    });

    // Test 2: (Entrada válida) Debe usar la ruta absoluta si empieza con /
    it('debe devolver la ruta absoluta si empieza con /', function() {
      var p = { image: '/img/direct_path.jpg' };
      var result = window.AdminDashboardLogic.imgSrcFor(p, mockImages);
      expect(result).toBe('/img/direct_path.jpg');
    });

    // Test 3: (Entrada válida) Debe construir la ruta relativa
    it('debe construir la ruta relativa si no está en loader ni es absoluta', function() {
      var p = { img: 'prod_123.jpg' };
      var result = window.AdminDashboardLogic.imgSrcFor(p, mockImages);
      expect(result).toBe('/assets/img/prod_123.jpg');
    });

    // Test 4: (Entrada nula/incorrecta) Debe devolver el placeholder si no hay imagen
    it('debe devolver el placeholder si el producto no tiene imagen', function() {
      var p = { nombre: 'Sin imagen' };
      var result = window.AdminDashboardLogic.imgSrcFor(p, mockImages);
      expect(result).toBe('/assets/img/placeholder.jpg');
    });

    // Test 5: (Caso Borde) Debe devolver el placeholder si el producto es nulo
    it('debe devolver el placeholder si el producto es nulo', function() {
      var result = window.AdminDashboardLogic.imgSrcFor(null, mockImages);
      expect(result).toBe('/assets/img/placeholder.jpg');
    });

  });

  // --- Pruebas para getProductKey ---
  describe('getProductKey', function() {
    
    // Test 1: (Entrada válida) Debe usar 'id'
    it('debe usar p.id si está disponible', function() {
      expect(window.AdminDashboardLogic.getProductKey({ id: 123, _id: 'abc' })).toBe(123);
    });

    // Test 2: (Entrada válida) Debe usar '_id' si 'id' no está
    it('debe usar p._id si p.id no está disponible', function() {
      expect(window.AdminDashboardLogic.getProductKey({ _id: 'abc', nombre: 'Test' })).toBe('abc');
    });

    // Test 3: (Caso Borde) Debe usar JSON.stringify como fallback
    it('debe usar JSON.stringify si no hay id ni _id', function() {
      var p = { nombre: 'Test', precio: 100 };
      expect(window.AdminDashboardLogic.getProductKey(p)).toBe(JSON.stringify(p));
    });

    // Test 4: (Entrada nula) Debe devolver una clave de fallback para nulos
    it('debe devolver una clave de fallback para nulos', function() {
      // Usamos 'toContain' porque la clave nula incluye un timestamp
      expect(window.AdminDashboardLogic.getProductKey(null)).toContain('null_item_');
    });

  });

  // --- Pruebas para getProductName ---
  describe('getProductName', function() {

    // Test 1: (Entrada válida) Debe usar 'nombre'
    it('debe usar p.nombre si está disponible', function() {
      expect(window.AdminDashboardLogic.getProductName({ nombre: 'Prod 1', title: 'Prod 2' })).toBe('Prod 1');
    });

    // Test 2: (Entrada válida) Debe usar 'title' como fallback
    it('debe usar p.title si p.nombre no está disponible', function() {
      expect(window.AdminDashboardLogic.getProductName({ title: 'Prod 2', precio: 100 })).toBe('Prod 2');
    });

    // Test 3: (Entrada nula/incorrecta) Debe usar 'Sin nombre' como fallback
    it('debe usar "Sin nombre" si no hay nombre ni title', function() {
      expect(window.AdminDashboardLogic.getProductName({ precio: 100 })).toBe('Sin nombre');
      expect(window.AdminDashboardLogic.getProductName(null)).toBe('Sin nombre');
      expect(window.AdminDashboardLogic.getProductName(undefined)).toBe('Sin nombre');
    });

  });

  // --- Pruebas para getProductPrice ---
  describe('getProductPrice', function() {

    // Test 1: (Entrada válida) Debe usar 'precio'
    it('debe usar p.precio si está disponible', function() {
      expect(window.AdminDashboardLogic.getProductPrice({ precio: 100, price: 200 })).toBe('$100');
    });

    // Test 2: (Entrada válida) Debe usar 'price' como fallback
    it('debe usar p.price si p.precio no está disponible', function() {
      expect(window.AdminDashboardLogic.getProductPrice({ price: 200, nombre: 'Test' })).toBe('$200');
    });

    // Test 3: (Caso Borde) Debe manejar el precio 0 correctamente
    it('debe manejar el precio 0 correctamente', function() {
      expect(window.AdminDashboardLogic.getProductPrice({ precio: 0 })).toBe('$0');
      expect(window.AdminDashboardLogic.getProductPrice({ price: 0 })).toBe('$0');
    });

    // Test 4: (Entrada nula/incorrecta) Debe devolver string vacío
    it('debe devolver un string vacío si no hay precio o el producto es nulo', function() {
      expect(window.AdminDashboardLogic.getProductPrice({ nombre: 'Test' })).toBe('');
      expect(window.AdminDashboardLogic.getProductPrice(null)).toBe('');
      expect(window.AdminDashboardLogic.getProductPrice(undefined)).toBe('');
    });

  });

});