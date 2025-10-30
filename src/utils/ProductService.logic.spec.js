/**
 * src/utils/ProductService.logic.spec.js
 * Pruebas Jasmine para ProductService.logic.js.
 */

describe('ProductService.logic.js', function() {

  // --- Mocks y Setup ---

  // Mock de los datos iniciales (data/products)
  var mockInitialData;

  // Mock del localStorage
  var mockStorage;

  // Constantes (para consistencia en los tests)
  var STORAGE_KEY = "products_list_test"; // Usar claves diferentes a las de prod
  var COUNTER_KEY = "product_counter_test";

  // Función helper para crear un mock de storage (in-memory)
  var createMockStorage = function() {
    var store = {};
    return {
      getItem: function(key) {
        return store[key] || null;
      },
      setItem: function(key, value) {
        store[key] = String(value);
      },
      clear: function() {
        store = {};
      }
    };
  };

  // beforeEach: Se ejecuta antes de CADA 'it' para aislar los tests
  beforeEach(function() {
    // 1. Reinicia el mock de storage
    mockStorage = createMockStorage();

    // 2. Reinicia los datos iniciales (copia profunda)
    mockInitialData = [
      { id: "p1", nombre: "Producto Inicial 1", stock: 10, categoria: "A" },
      { id: "p2", nombre: "Producto Inicial 2", stock: 5, categoria: "B" }
    ];

    // 3. Inyecta las dependencias en el objeto de lógica
    // (Asumiendo que ProductService.logic.js ya fue cargado por Karma)
    window.ProductServiceLogic._storage = mockStorage;
    window.ProductServiceLogic._initialData = mockInitialData;
    window.ProductServiceLogic._storageKey = STORAGE_KEY;
    window.ProductServiceLogic._counterKey = COUNTER_KEY;
  });

  // --- Pruebas por Función ---

  describe('Funciones: readStorage / writeStorage', function() {

    // Test 1: (write + read)
    it('debe escribir y leer correctamente una lista', function() {
      var testData = [{ id: "p100", test: "data" }];
      window.ProductServiceLogic.writeStorage(testData);

      // Verifica usando la función de lectura
      var result = window.ProductServiceLogic.readStorage();
      expect(result).toEqual(testData);
    });

    // Test 2: (read) nulo/vacío
    it('readStorage debe retornar null si no hay nada en storage', function() {
      var result = window.ProductServiceLogic.readStorage();
      expect(result).toBeNull();
    });

    // Test 3: (read) data corrupta
    it('readStorage debe retornar null si el JSON está corrupto', function() {
      mockStorage.setItem(STORAGE_KEY, "{esto-no-es-json:");
      var result = window.ProductServiceLogic.readStorage();
      expect(result).toBeNull();
    });

    // Test 4: (write) nulo
    it('writeStorage debe guardar un array vacío si la entrada es nula', function() {
      window.ProductServiceLogic.writeStorage(null);
      var result = window.ProductServiceLogic.readStorage();
      expect(result).toEqual([]); // El storage debe contener '[]'
    });
  });

  describe('Función: getMaxId', function() {

    // Test 1: Solo datos iniciales
    it('debe encontrar el ID máximo solo en los datos iniciales', function() {
      // Setup: mockInitialData es [p1, p2]. Storage está vacío.
      var max = window.ProductServiceLogic.getMaxId();
      expect(max).toBe(2);
    });

    // Test 2: Solo datos en storage
    it('debe encontrar el ID máximo solo en el storage', function() {
      window.ProductServiceLogic._initialData = []; // Sin datos iniciales
      mockStorage.setItem(STORAGE_KEY, JSON.stringify([
        { id: "p10" }, { id: "p5" }
      ]));
      
      var max = window.ProductServiceLogic.getMaxId();
      expect(max).toBe(10);
    });

    // Test 3: Datos mezclados (Storage > Inicial)
    it('debe encontrar el ID máximo cuando storage tiene el mayor', function() {
      // Setup: Inicial [p1, p2]. Storage [p100, p50].
      mockStorage.setItem(STORAGE_KEY, JSON.stringify([
        { id: "p100" }, { id: "p50" }
      ]));
      
      var max = window.ProductServiceLogic.getMaxId();
      expect(max).toBe(100);
    });

    // Test 4: Caso borde (IDs inválidos)
    it('debe ignorar IDs inválidos (nulos, sin "p", vacíos)', function() {
      var corruptData = [
        { id: null }, { id: "p5" }, { id: 10 }, { id: "p-mal" }, { id: "p15" }, {}
      ];
      mockStorage.setItem(STORAGE_KEY, JSON.stringify(corruptData));
      // Inicial es [p1, p2].
      
      var max = window.ProductServiceLogic.getMaxId();
      expect(max).toBe(15); // Ignora 10, p-mal, null, {}
    });

    // Test 5: Caso nulo (sin datos)
    it('debe retornar 0 si no hay datos iniciales ni en storage', function() {
      window.ProductServiceLogic._initialData = [];
      var max = window.ProductServiceLogic.getMaxId();
      expect(max).toBe(0);
    });
  });

  describe('Función: nextId (y ensureCounterSynced)', function() {

    // Test 1: Contador vacío (llama a ensureCounterSynced)
    it('debe sincronizar (a 2) y retornar "p3"', function() {
      // Setup: getMaxId() retornará 2 (de [p1, p2]).
      var next = window.ProductServiceLogic.nextId();
      
      // 1. Sincroniza a 2.
      // 2. Incrementa a 3.
      // 4. Retorna "p3".
      expect(next).toBe("p3");
      expect(mockStorage.getItem(COUNTER_KEY)).toBe("3");
    });

    // Test 2: Contador existente (menor al maxId)
    it('debe sincronizar (subir de 1 a 2) y retornar "p3"', function() {
      mockStorage.setItem(COUNTER_KEY, "1"); // Contador viejo
      // Setup: getMaxId() retornará 2.
      var next = window.ProductServiceLogic.nextId();
      
      // 1. Sincroniza a 2.
      // 2. Incrementa a 3.
      expect(next).toBe("p3");
      expect(mockStorage.getItem(COUNTER_KEY)).toBe("3");
    });

    // Test 3: Contador existente (mayor al maxId)
    it('debe usar el contador (100), NO sincronizar, y retornar "p101"', function() {
      mockStorage.setItem(COUNTER_KEY, "100"); // Contador avanzado
      // Setup: getMaxId() retornará 2.
      var next = window.ProductServiceLogic.nextId();
      
      // 1. Sincroniza (ve que 100 > 2, no hace nada).
      // 2. Incrementa a 101.
      expect(next).toBe("p101");
      expect(mockStorage.getItem(COUNTER_KEY)).toBe("101");
    });

    // Test 4: Caso borde (Contador NaN)
    it('debe sincronizar (a 2) y retornar "p3" si el contador es NaN', function() {
       mockStorage.setItem(COUNTER_KEY, "gato");
       // Setup: getMaxId() retornará 2.
       var next = window.ProductServiceLogic.nextId();
       expect(next).toBe("p3");
       expect(mockStorage.getItem(COUNTER_KEY)).toBe("3");
    });
  });

  describe('Función: getProducts (Merge)', function() {

    // Test 1: Solo datos iniciales
    it('debe retornar solo los datos iniciales si storage está vacío', function() {
      var result = window.ProductServiceLogic.getProducts();
      expect(result.length).toBe(2);
      expect(result[0].id).toBe("p1");
    });

    // Test 2: Datos iniciales + storage (sin overlap)
    it('debe retornar la lista combinada (inicial + storage)', function() {
      mockStorage.setItem(STORAGE_KEY, JSON.stringify([
        { id: "p3", nombre: "Storage 1" }
      ]));
      
      var result = window.ProductServiceLogic.getProducts();
      expect(result.length).toBe(3);
      expect(result[2].nombre).toBe("Storage 1");
    });

    // Test 3: Datos iniciales + storage (con merge)
    it('debe hacer merge (storage sobrescribe inicial) si hay IDs duplicados', function() {
      // Setup: p1 inicial tiene stock 10 y categoria "A".
      mockStorage.setItem(STORAGE_KEY, JSON.stringify([
        { id: "p1", nombre: "P1 MODIFICADO", stock: 99 } // Sobrescribe nombre y stock
      ]));
      
      var result = window.ProductServiceLogic.getProducts();
      expect(result.length).toBe(2); // p1 (mergeado), p2 (inicial)
      
      var p1 = result.find(function(p){ return p.id === "p1" });
      
      // Campos sobrescritos por storage
      expect(p1.nombre).toBe("P1 MODIFICADO");
      expect(p1.stock).toBe(99);
      
      // Campo preservado del inicial
      expect(p1.categoria).toBe("A");
    });
  });

  describe('Función: addProduct (Normalización)', function() {

    // Test 1: Añadir producto (con normalización y nextId)
    it('debe añadir un producto, normalizar campos y generar ID "p3"', function() {
      var partialProduct = {
        nombre: "Nuevo Prod",
        precio: "50.5", // string
        oferta: 1, // truthy
        stock: 0 // debe preservar el 0
      };
      
      // getMaxId() es 2. nextId() retornará "p3".
      var result = window.ProductServiceLogic.addProduct(partialProduct);

      // Verifica el objeto retornado (normalizado)
      expect(result.id).toBe("p3");
      expect(result.precio).toBe(50.5); // number
      expect(result.oferta).toBe(true); // boolean
      expect(result.stock).toBe(0); // number
      expect(result.imagen).toBe("Starmie.jpg"); // default
      
      // Verifica que se guardó en storage
      var storedList = JSON.parse(mockStorage.getItem(STORAGE_KEY));
      // 2 iniciales + 1 nuevo
      expect(storedList.length).toBe(3);
      expect(storedList[2].id).toBe("p3");
    });

    // Test 2: Añadir producto (con ID provisto)
    it('debe añadir un producto con ID provisto "p99"', function() {
       var product = { id: "p99", nombre: "Con ID" };
       window.ProductServiceLogic.addProduct(product);
       
       var storedList = JSON.parse(mockStorage.getItem(STORAGE_KEY));
       expect(storedList.length).toBe(3);
       expect(storedList[2].id).toBe("p99");
       
       // El contador no debió usarse
       expect(mockStorage.getItem(COUNTER_KEY)).toBeNull();
    });

    // Test 3: Caso nulo (añadir null)
    it('debe añadir un producto "vacío" (con defaults) si la entrada es nula', function() {
      // getMaxId() es 2. nextId() retornará "p3".
      var result = window.ProductServiceLogic.addProduct(null);
      
      expect(result.id).toBe("p3");
      expect(result.nombre).toBe("");
      expect(result.precio).toBe(0);
      expect(result.stock).toBe(0);
      
      var storedList = JSON.parse(mockStorage.getItem(STORAGE_KEY));
      expect(storedList.length).toBe(3);
    });
  });

  describe('Función: getProductById', function() {

    // Test 1: Encontrar ID de datos iniciales
    it('debe encontrar un producto de los datos iniciales (p1)', function() {
      var p1 = window.ProductServiceLogic.getProductById("p1");
      expect(p1).not.toBeNull();
      expect(p1.nombre).toBe("Producto Inicial 1");
    });

    // Test 2: Encontrar ID de datos de storage (mergeado)
    it('debe encontrar un producto mergeado (p2)', function() {
      mockStorage.setItem(STORAGE_KEY, JSON.stringify([
        { id: "p2", nombre: "P2 MODIFICADO" }
      ]));
      
      var p2 = window.ProductServiceLogic.getProductById("p2");
      expect(p2).not.toBeNull();
      expect(p2.nombre).toBe("P2 MODIFICADO"); // de storage
      expect(p2.stock).toBe(5); // de inicial
    });

    // Test 3: No encontrar ID
    it('debe retornar null si el ID "p999" no existe', function() {
      var p999 = window.ProductServiceLogic.getProductById("p999");
      expect(p999).toBeNull();
    });

    // Test 4: Caso borde (ID nulo o undefined)
    it('debe retornar null si el ID es nulo o undefined', function() {
      var pNull = window.ProductServiceLogic.getProductById(null);
      var pUndef = window.ProductServiceLogic.getProductById(undefined);
      expect(pNull).toBeNull();
      expect(pUndef).toBeNull();
    });
  });

  describe('Función: updateProduct', function() {

    // Test 1: Actualizar producto (de datos iniciales)
    it('debe actualizar "p1" (inicial) y guardarlo en storage', function() {
      var updateData = { id: "p1", nombre: "P1 ACTUALIZADO", stock: 99 };
      
      window.ProductServiceLogic.updateProduct(updateData);
      
      // Verifica el storage
      var storedList = JSON.parse(mockStorage.getItem(STORAGE_KEY));
      
      // La lista en storage ahora contiene p1 actualizado y p2 original
      expect(storedList.length).toBe(2);
      var p1 = storedList.find(function(p){ return p.id === "p1" });
      expect(p1.nombre).toBe("P1 ACTUALIZADO");
      expect(p1.stock).toBe(99);
    });

    // Test 2: Caso incorrecto (actualizar ID inexistente)
    it('NO debe guardar en storage si el ID "p999" no existe', function() {
      var updateData = { id: "p999", nombre: "FANTASMA" };
      
      window.ProductServiceLogic.updateProduct(updateData);
      
      // Verifica storage (debe estar vacío, porque getProducts() [p1, p2] no
      // coincidió con p999, y la lógica (found=false) impidió el guardado)
      expect(mockStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    // Test 3: Caso nulo (actualizar con null o sin ID)
    it('no debe fallar (throw) y no debe guardar si se actualiza con null o sin ID', function() {
      var fnNull = function() { window.ProductServiceLogic.updateProduct(null); };
      var fnNoId = function() { window.ProductServiceLogic.updateProduct({ nombre: "Test" }); };

      expect(fnNull).not.toThrow();
      expect(fnNoId).not.toThrow();
      
      // Storage no debió modificarse
      expect(mockStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });

  describe('Función: deleteProduct', function() {

    // Test 1: Eliminar producto (de datos iniciales)
    it('debe eliminar "p1" (inicial) y persistir solo "p2"', function() {
      window.ProductServiceLogic.deleteProduct("p1");
      
      // Verifica storage
      var storedList = JSON.parse(mockStorage.getItem(STORAGE_KEY));
      // Solo debe quedar p2
      expect(storedList.length).toBe(1);
      expect(storedList[0].id).toBe("p2");
    });

    // Test 2: Eliminar producto (de datos de storage)
    it('debe eliminar "p3" (storage) y persistir "p1" y "p2"', function() {
      mockStorage.setItem(STORAGE_KEY, JSON.stringify([
         { id: "p3", nombre: "P3 Original" }
      ]));
      
      // Lista actual: p1, p2, p3
      window.ProductServiceLogic.deleteProduct("p3");
      
      // Verifica storage
      var storedList = JSON.parse(mockStorage.getItem(STORAGE_KEY));
      // Deben quedar p1, p2
      expect(storedList.length).toBe(2);
      expect(storedList.find(function(p){ return p.id === "p3" })).toBeUndefined();
    });

    // Test 3: Caso incorrecto (eliminar ID inexistente)
    it('debe persistir "p1" y "p2" si el ID a borrar ("p999") no existe', function() {
      window.ProductServiceLogic.deleteProduct("p999");
      
      // Verifica storage
      var storedList = JSON.parse(mockStorage.getItem(STORAGE_KEY));
      // Deben quedar p1, p2
      expect(storedList.length).toBe(2);
    });

    // Test 4: Caso nulo (eliminar null)
    it('no debe fallar (throw) ni modificar el storage si el ID es nulo', function() {
      // Primero guardamos algo para que el storage no esté vacío
      window.ProductServiceLogic.saveProducts([{ id: "p1" }, { id: "p2" }]);
      
      // Llamamos deleteProduct con null
      window.ProductServiceLogic.deleteProduct(null);
      
      // Verifica que el storage NO cambió (sigue teniendo p1 y p2)
      var storedList = JSON.parse(mockStorage.getItem(STORAGE_KEY));
      expect(storedList).not.toBeNull();
      expect(storedList.length).toBe(2);
    });
  });

});