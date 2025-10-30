/**
 * Pruebas Jasmine para ProductDetail.logic.js.
 * NO SE DEBE USAR DESTRUCTURACIÓN (const { ... } = window) para evitar errores
 * de redeclaración en el entorno de Karma.
 */

describe('ProductDetail.logic', function() {

  // Comprobar que el objeto global de lógica existe
  it('should be defined on the window object', function() {
    expect(window.ProductDetailLogic).toBeDefined();
  });

  // --- Pruebas para getProductImageSrc ---
  // (Estas pruebas son idénticas a las de ProductCard.logic.spec.js
  //  ya que la función es la misma)
  describe('getProductImageSrc', function() {

    // Mock del objeto 'images' que simula el import de imageLoader
    var mockImages = {
      'dynamic.jpg': '/dynamic/path/dynamic.jpg'
    };

    // Test 1: Entrada válida (Imagen desde imageLoader)
    it('should return the path from the images object (loader)', function() {
      var src = window.ProductDetailLogic.getProductImageSrc('dynamic.jpg', mockImages);
      expect(src).toBe('/dynamic/path/dynamic.jpg');
    });

    // Test 2: Entrada válida (Imagen como ruta relativa)
    it('should prepend /assets/img/ if the path is relative', function() {
      var src = window.ProductDetailLogic.getProductImageSrc('relative.png', mockImages);
      expect(src).toBe('/assets/img/relative.png');
    });

    // Test 3: Entrada válida (Imagen como ruta absoluta)
    it('should return the path as-is if it starts with /', function() {
      var src = window.ProductDetailLogic.getProductImageSrc('/absolute/path.gif', mockImages);
      expect(src).toBe('/absolute/path.gif');
    });

    // Test 4: Entrada nula/incorrecta (productImagen es nulo o vacío)
    it('should return the placeholder if productImagen is null or empty', function() {
      var srcNull = window.ProductDetailLogic.getProductImageSrc(null, mockImages);
      var srcEmpty = window.ProductDetailLogic.getProductImageSrc('', mockImages);
      expect(srcNull).toBe('/assets/img/placeholder.jpg');
      expect(srcEmpty).toBe('/assets/img/placeholder.jpg');
    });

    // Test 5: Caso borde (Objeto 'images' es nulo)
    it('should handle images object being null (falls back to relative path)', function() {
      var src = window.ProductDetailLogic.getProductImageSrc('relative.png', null);
      expect(src).toBe('/assets/img/relative.png');
    });
  });

  // --- Pruebas para handleGoBack ---
  describe('handleGoBack', function() {

    var mockNavigate;

    // Resetear mocks antes de cada test
    beforeEach(function() {
      // Creamos un 'spy' de Jasmine para simular la función navigate
      mockNavigate = jasmine.createSpy('navigate');
    });

    // Test 1: Entrada válida
    it('should call the navigate function with -1', function() {
      window.ProductDetailLogic.handleGoBack(mockNavigate);
      
      // Verificar que la función simulada (spy) fue llamada
      expect(mockNavigate).toHaveBeenCalled();
      // Verificar que fue llamada con el argumento -1
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    // Test 2: Entrada incorrecta (navigate no es una función)
    it('should not call navigate if the argument is not a function', function() {
      window.ProductDetailLogic.handleGoBack(null);
      expect(mockNavigate).not.toHaveBeenCalled();
      
      window.ProductDetailLogic.handleGoBack(undefined);
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    // Test 3: Entrada incorrecta (argumento de tipo incorrecto)
    it('should not call navigate if the argument is an object or string', function() {
      window.ProductDetailLogic.handleGoBack({});
      expect(mockNavigate).not.toHaveBeenCalled();

      window.ProductDetailLogic.handleGoBack('navigate');
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

});