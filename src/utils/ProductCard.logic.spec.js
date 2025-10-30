/**
 * Pruebas Jasmine para ProductCard.logic.js.
 * NO SE DEBE USAR DESTRUCTURACIÓN (const { ... } = window) para evitar errores
 * de redeclaración en el entorno de Karma.
 */

describe('ProductCard.logic', function() {

  // Comprobar que el objeto global de lógica existe
  it('should be defined on the window object', function() {
    expect(window.ProductCardLogic).toBeDefined();
  });

  // --- Pruebas para calculateOriginalPrice ---
  describe('calculateOriginalPrice', function() {

    // Test 1: Entrada válida (Producto en oferta)
    it('should calculate the original price correctly for an on-sale item', function() {
      var product = { precio: 60, oferta: true };
      // 60 / 0.6 = 100
      expect(window.ProductCardLogic.calculateOriginalPrice(product)).toBeCloseTo(100);
    });

    // Test 2: Entrada válida (Producto SIN oferta)
    it('should return the same price if the item is not on sale', function() {
      var product = { precio: 80, oferta: false };
      expect(window.ProductCardLogic.calculateOriginalPrice(product)).toBe(80);
    });

    // Test 3: Entrada nula/incorrecta (producto nulo)
    it('should return 0 if the product is null or undefined', function() {
      expect(window.ProductCardLogic.calculateOriginalPrice(null)).toBe(0);
      expect(window.ProductCardLogic.calculateOriginalPrice(undefined)).toBe(0);
    });

    // Test 4: Caso borde (precio es cero)
    it('should return 0 if the price is 0, regardless of offer', function() {
      var productOnSale = { precio: 0, oferta: true };
      var productNotOnSale = { precio: 0, oferta: false };
      expect(window.ProductCardLogic.calculateOriginalPrice(productOnSale)).toBe(0);
      expect(window.ProductCardLogic.calculateOriginalPrice(productNotOnSale)).toBe(0);
    });
        
    // Test 5: Caso borde (falta el precio o no es número)
    it('should return 0 if product.precio is missing or not a number', function() {
      var productNoPrice = { oferta: true };
      var productInvalidPrice = { precio: 'cien', oferta: true };
      expect(window.ProductCardLogic.calculateOriginalPrice(productNoPrice)).toBe(0);
      expect(window.ProductCardLogic.calculateOriginalPrice(productInvalidPrice)).toBe(0);
    });
  });

  // --- Pruebas para getProductImageSrc ---
  describe('getProductImageSrc', function() {

    // Mock del objeto 'images' que simula el import de imageLoader
    var mockImages = {
      'dynamic.jpg': '/dynamic/path/dynamic.jpg'
    };

    // Test 1: Entrada válida (Imagen desde imageLoader)
    it('should return the path from the images object (loader)', function() {
      var src = window.ProductCardLogic.getProductImageSrc('dynamic.jpg', mockImages);
      expect(src).toBe('/dynamic/path/dynamic.jpg');
    });

    // Test 2: Entrada válida (Imagen como ruta relativa)
    it('should prepend /assets/img/ if the path is relative', function() {
      // 'relative.png' no está en mockImages
      var src = window.ProductCardLogic.getProductImageSrc('relative.png', mockImages);
      expect(src).toBe('/assets/img/relative.png');
    });

    // Test 3: Entrada válida (Imagen como ruta absoluta)
    it('should return the path as-is if it starts with /', function() {
      var src = window.ProductCardLogic.getProductImageSrc('/absolute/path.gif', mockImages);
      expect(src).toBe('/absolute/path.gif');
    });

    // Test 4: Entrada nula/incorrecta (productImagen es nulo o vacío)
    it('should return the placeholder if productImagen is null or empty', function() {
      var srcNull = window.ProductCardLogic.getProductImageSrc(null, mockImages);
      var srcEmpty = window.ProductCardLogic.getProductImageSrc('', mockImages);
      expect(srcNull).toBe('/assets/img/placeholder.jpg');
      expect(srcEmpty).toBe('/assets/img/placeholder.jpg');
    });

    // Test 5: Caso borde (Objeto 'images' es nulo)
    it('should handle images object being null (falls back to relative path)', function() {
      // Debería ignorar el 'images' nulo y tratar 'relative.png' como ruta relativa
      var src = window.ProductCardLogic.getProductImageSrc('relative.png', null);
      expect(src).toBe('/assets/img/relative.png');
    });
  });

  // --- Pruebas para handleAddToCartClick ---
  describe('handleAddToCartClick', function() {

    var mockAddToCart;
    var mockProduct;

    // Resetear mocks antes de cada test
    beforeEach(function() {
      // Creamos un 'spy' de Jasmine para simular la función addToCart del contexto
      mockAddToCart = jasmine.createSpy('addToCart');
      mockProduct = { id: 10, nombre: 'Producto Test' };
    });

    // Test 1: Entrada válida
    it('should call addToCart with the correct product and quantity 1', function() {
      window.ProductCardLogic.handleAddToCartClick(mockAddToCart, mockProduct);
      
      // Verificar que la función simulada (spy) fue llamada
      expect(mockAddToCart).toHaveBeenCalled();
      // Verificar que fue llamada con los argumentos correctos
      expect(mockAddToCart).toHaveBeenCalledWith(mockProduct, 1);
    });

    // Test 2: Entrada incorrecta (función addToCart no es una función)
    it('should not call addToCart if the first argument is not a function', function() {
      var notAFunction = null;
      window.ProductCardLogic.handleAddToCartClick(notAFunction, mockProduct);
      
      // Verificar que el spy NUNCA fue llamado
      expect(mockAddToCart).not.toHaveBeenCalled(); 
    });

    // Test 3: Entrada incorrecta (producto es nulo)
    it('should not call addToCart if the product is null or undefined', function() {
      window.ProductCardLogic.handleAddToCartClick(mockAddToCart, null);
      expect(mockAddToCart).not.toHaveBeenCalled();
      
      window.ProductCardLogic.handleAddToCartClick(mockAddToCart, undefined);
      expect(mockAddToCart).not.toHaveBeenCalled();
    });
  });

});