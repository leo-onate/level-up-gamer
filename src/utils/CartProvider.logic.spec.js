/**
 * Pruebas Jasmine para CartProvider.logic.js.
 * NO SE DEBE USAR DESTRUCTURACIÓN (const { ... } = window) para evitar errores
 * de redeclaración en el entorno de Karma.
 */

describe('CartProvider.logic', function() {

  var CART_KEY_TEST = 'cart_test_key';

  // Limpiar localStorage antes y después de las pruebas de storage
  describe('Storage Functions', function() {
    
    beforeEach(function() {
      localStorage.removeItem(CART_KEY_TEST);
    });
    
    afterEach(function() {
      localStorage.removeItem(CART_KEY_TEST);
    });

    // --- Pruebas para loadCartFromStorage ---
    it('loadCartFromStorage should return items from localStorage', function() {
      var mockItems = [{ id: 1, qty: 2 }];
      localStorage.setItem(CART_KEY_TEST, JSON.stringify(mockItems));
      
      var result = window.CartProviderLogic.loadCartFromStorage(CART_KEY_TEST);
      expect(result).toEqual(mockItems);
    });

    it('loadCartFromStorage should return empty array for invalid JSON', function() {
      localStorage.setItem(CART_KEY_TEST, 'invalid-json-string');
      
      var result = window.CartProviderLogic.loadCartFromStorage(CART_KEY_TEST);
      expect(result).toEqual([]);
    });

    it('loadCartFromStorage should return empty array for missing key', function() {
      var result = window.CartProviderLogic.loadCartFromStorage(CART_KEY_TEST);
      expect(result).toEqual([]);
    });

    // --- Pruebas para saveCartToStorage ---
    it('saveCartToStorage should save items to localStorage', function() {
      var mockItems = [{ id: 1, qty: 3 }];
      window.CartProviderLogic.saveCartToStorage(CART_KEY_TEST, mockItems);
      
      var stored = localStorage.getItem(CART_KEY_TEST);
      expect(stored).toBe(JSON.stringify(mockItems));
    });

    it('saveCartToStorage should save an empty array', function() {
      window.CartProviderLogic.saveCartToStorage(CART_KEY_TEST, []);
      expect(localStorage.getItem(CART_KEY_TEST)).toBe('[]');
    });
  });


  // --- Pruebas para calculateTotal ---
  describe('calculateTotal', function() {
    
    it('should calculate the total price correctly', function() {
      var items = [{ precio: 10, qty: 2 }, { precio: 5.5, qty: 1 }]; // 20 + 5.5
      expect(window.CartProviderLogic.calculateTotal(items)).toBe(25.5);
    });

    it('should return 0 for an empty cart', function() {
      expect(window.CartProviderLogic.calculateTotal([])).toBe(0);
    });

    it('should return 0 for invalid input (null/undefined)', function() {
      expect(window.CartProviderLogic.calculateTotal(null)).toBe(0);
      expect(window.CartProviderLogic.calculateTotal(undefined)).toBe(0);
    });
    
    it('should handle string numbers', function() {
      var items = [{ precio: '10', qty: '3' }];
      expect(window.CartProviderLogic.calculateTotal(items)).toBe(30);
    });
    
    it('should handle missing or invalid price/qty', function() {
      var items = [{ precio: 10 }, { qty: 2 }, { precio: 'abc', qty: 2 }];
      expect(window.CartProviderLogic.calculateTotal(items)).toBe(0);
    });
  });

  // --- Pruebas para Lógica de Carrito (add, remove, update) ---
  describe('Cart State Calculations', function() {
    
    var mockProducts;
    var mockItems;
    var product1;

    beforeEach(function() {
      // Estado inicial antes de cada prueba de lógica
      product1 = { id: 1, nombre: 'Producto 1', precio: 10 };
      mockProducts = [
        { id: 1, nombre: 'Producto 1', precio: 10, stock: 10 },
        { id: 2, nombre: 'Producto 2', precio: 20, stock: 5 }
      ];
      mockItems = [];
    });

    // --- calculateAddToCart ---
    describe('calculateAddToCart', function() {
      
      it('should add a new item to the cart and reduce stock', function() {
        var result = window.CartProviderLogic.calculateAddToCart(product1, 2, mockItems, mockProducts);
        
        expect(result.error).toBeUndefined();
        expect(result.newItems.length).toBe(1);
        expect(result.newItems[0].qty).toBe(2);
        expect(result.newProducts[0].stock).toBe(8); // 10 - 2
      });

      it('should add quantity to an existing item and reduce stock', function() {
        mockItems = [{ ...product1, qty: 1 }]; // Item ya en carrito
        mockProducts[0].stock = 9; // Stock ya reducido
        
        var result = window.CartProviderLogic.calculateAddToCart(product1, 3, mockItems, mockProducts);
        
        expect(result.error).toBeUndefined();
        expect(result.newItems.length).toBe(1);
        expect(result.newItems[0].qty).toBe(4); // 1 + 3
        expect(result.newProducts[0].stock).toBe(6); // 9 - 3
      });

      it('should return error if stock is insufficient (new item)', function() {
        var result = window.CartProviderLogic.calculateAddToCart(product1, 11, mockItems, mockProducts);
        expect(result.error).toBeDefined();
        expect(result.newItems).toBeUndefined();
      });

      it('should return error if stock is insufficient (existing item)', function() {
        mockItems = [{ ...product1, qty: 5 }];
        mockProducts[0].stock = 5;
        
        var result = window.CartProviderLogic.calculateAddToCart(product1, 6, mockItems, mockProducts); // 5 + 6 = 11 (stock 10)
        expect(result.error).toBeDefined();
      });
      
      it('should return error if product not in stock list', function() {
        var product3 = { id: 3, nombre: 'Producto 3' };
        var result = window.CartProviderLogic.calculateAddToCart(product3, 1, mockItems, mockProducts);
        expect(result.error).toBeDefined();
      });
    });

    // --- calculateRemoveFromCart ---
    describe('calculateRemoveFromCart', function() {
      
      it('should remove an item and restore stock', function() {
        mockItems = [{ id: 1, qty: 3 }];
        mockProducts[0].stock = 7; // 10 - 3
        
        var result = window.CartProviderLogic.calculateRemoveFromCart(1, mockItems, mockProducts);
        
        expect(result.newItems.length).toBe(0);
        expect(result.newProducts[0].stock).toBe(10); // 7 + 3
      });

      it('should do nothing if productId is not in cart', function() {
        var result = window.CartProviderLogic.calculateRemoveFromCart(99, mockItems, mockProducts);
        
        expect(result.newItems).toBe(mockItems); // Retorna el array original
        expect(result.newProducts).toBe(mockProducts);
      });
    });

    // --- calculateUpdateQty ---
    describe('calculateUpdateQty', function() {
      
      beforeEach(function() {
        mockItems = [{ id: 1, qty: 5 }];
        mockProducts[0].stock = 5; // 10 total - 5 en carrito
      });

      it('should increase quantity and reduce stock', function() {
        var result = window.CartProviderLogic.calculateUpdateQty(1, 8, mockItems, mockProducts); // Diff: +3
        
        expect(result.error).toBeUndefined();
        expect(result.newItems[0].qty).toBe(8);
        expect(result.newProducts[0].stock).toBe(2); // 5 - 3
      });

      it('should decrease quantity and restore stock', function() {
        var result = window.CartProviderLogic.calculateUpdateQty(1, 2, mockItems, mockProducts); // Diff: -3
        
        expect(result.error).toBeUndefined();
        expect(result.newItems[0].qty).toBe(2);
        expect(result.newProducts[0].stock).toBe(8); // 5 - (-3)
      });
      
      it('should return error if stock is insufficient for update', function() {
        var result = window.CartProviderLogic.calculateUpdateQty(1, 11, mockItems, mockProducts); // Diff: +6 (stock 5)
        expect(result.error).toBeDefined();
      });
      
      it('should set qty to 1 if newQty is less than 1', function() {
        var result = window.CartProviderLogic.calculateUpdateQty(1, 0, mockItems, mockProducts); // Diff: -5
        
        expect(result.newItems[0].qty).toBe(1); // Math.max(1, 0)
        // La diferencia validada es 1 - 5 = -4
        expect(result.newProducts[0].stock).toBe(9); // 5 - (-4)
      });
    });

    // --- calculateRestoredStock ---
    describe('calculateRestoredStock', function() {
      
      it('should restore stock correctly for multiple items', function() {
        mockProducts[0].stock = 0;
        mockProducts[1].stock = 0;
        var itemsToRestore = [
          { id: 1, qty: 5 },
          { id: 2, qty: 3 },
          { id: 1, qty: 2 } // Mismo ID, debe sumar
        ];
        
        var newProducts = window.CartProviderLogic.calculateRestoredStock(itemsToRestore, mockProducts);
        
        expect(newProducts[0].stock).toBe(7); // 0 + 5 + 2
        expect(newProducts[1].stock).toBe(3); // 0 + 3
      });
      
      it('should return original products if itemsToRestore is empty', function() {
        var newProducts = window.CartProviderLogic.calculateRestoredStock([], mockProducts);
        expect(newProducts[0].stock).toBe(10);
        // Debe usar toEqual para comparar arrays de objetos (comparación profunda)
        expect(newProducts).toEqual(mockProducts);
      });
    });
    
    // --- calculateClearCartOnSuccess ---
    describe('calculateClearCartOnSuccess', function() {
      it('should return an empty array', function() {
        expect(window.CartProviderLogic.calculateClearCartOnSuccess()).toEqual([]);
      });
    });
  });
});