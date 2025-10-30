/**
 * Pruebas unitarias para la lógica de AdminProducts
 * Archivo: adminProducts.logic.spec.js
 */

import {
  isValidProductsArray,
  hasProducts,
  getProductId,
  getProductName,
  getProductPrice,
  getProductCategory,
  formatProductPrice,
  createDeleteConfirmationMessage,
  isValidProduct,
  getProductDisplayInfo,
  filterValidProducts,
  countValidProducts,
  findProductById,
  getProductNames,
  getUniqueCategories,
  calculateTotalProductsValue,
  sortProductsByName,
  sortProductsByPrice
} from './adminProducts.logic';

describe('AdminProducts Logic - Validación de Arrays', () => {
  describe('isValidProductsArray', () => {
    it('debe retornar true para arrays válidos', () => {
      expect(isValidProductsArray([])).toBe(true);
      expect(isValidProductsArray([{id: 1}])).toBe(true);
    });

    it('debe retornar false para null', () => {
      expect(isValidProductsArray(null)).toBe(false);
    });

    it('debe retornar false para undefined', () => {
      expect(isValidProductsArray(undefined)).toBe(false);
    });

    it('debe retornar false para objetos', () => {
      expect(isValidProductsArray({})).toBe(false);
    });

    it('debe retornar false para strings', () => {
      expect(isValidProductsArray('array')).toBe(false);
    });
  });

  describe('hasProducts', () => {
    it('debe retornar true cuando hay productos', () => {
      expect(hasProducts([{id: 1}])).toBe(true);
    });

    it('debe retornar false para array vacío', () => {
      expect(hasProducts([])).toBe(false);
    });

    it('debe retornar false para null', () => {
      expect(hasProducts(null)).toBe(false);
    });

    it('debe retornar false para undefined', () => {
      expect(hasProducts(undefined)).toBe(false);
    });
  });
});

describe('AdminProducts Logic - Propiedades de Producto', () => {
  describe('getProductId', () => {
    it('debe retornar el ID del producto', () => {
      const product = { id: 123 };
      expect(getProductId(product)).toBe(123);
    });

    it('debe retornar undefined para producto null', () => {
      expect(getProductId(null)).toBeUndefined();
    });

    it('debe retornar undefined para producto undefined', () => {
      expect(getProductId(undefined)).toBeUndefined();
    });

    it('debe manejar ID como string', () => {
      const product = { id: 'prod-001' };
      expect(getProductId(product)).toBe('prod-001');
    });

    it('debe retornar undefined si no hay ID', () => {
      const product = { nombre: 'Test' };
      expect(getProductId(product)).toBeUndefined();
    });
  });

  describe('getProductName', () => {
    it('debe retornar el nombre del producto', () => {
      const product = { nombre: 'Producto Test' };
      expect(getProductName(product)).toBe('Producto Test');
    });

    it('debe retornar string vacío para producto null', () => {
      expect(getProductName(null)).toBe('');
    });

    it('debe retornar string vacío para producto undefined', () => {
      expect(getProductName(undefined)).toBe('');
    });

    it('debe retornar string vacío si no hay nombre', () => {
      const product = { id: 1 };
      expect(getProductName(product)).toBe('');
    });

    it('debe manejar nombre vacío', () => {
      const product = { nombre: '' };
      expect(getProductName(product)).toBe('');
    });
  });

  describe('getProductPrice', () => {
    it('debe retornar el precio del producto', () => {
      const product = { precio: 99.99 };
      expect(getProductPrice(product)).toBe(99.99);
    });

    it('debe retornar 0 para producto null', () => {
      expect(getProductPrice(null)).toBe(0);
    });

    it('debe retornar 0 para producto undefined', () => {
      expect(getProductPrice(undefined)).toBe(0);
    });

    it('debe convertir string numérico a número', () => {
      const product = { precio: '50.25' };
      expect(getProductPrice(product)).toBe(50.25);
    });

    it('debe retornar 0 para precio no numérico', () => {
      const product = { precio: 'abc' };
      expect(getProductPrice(product)).toBe(0);
    });

    it('debe manejar precio = 0', () => {
      const product = { precio: 0 };
      expect(getProductPrice(product)).toBe(0);
    });

    it('debe manejar precio negativo', () => {
      const product = { precio: -10 };
      expect(getProductPrice(product)).toBe(-10);
    });
  });

  describe('getProductCategory', () => {
    it('debe retornar la categoría del producto', () => {
      const product = { categoria: 'Juegos' };
      expect(getProductCategory(product)).toBe('Juegos');
    });

    it('debe retornar string vacío para producto null', () => {
      expect(getProductCategory(null)).toBe('');
    });

    it('debe retornar string vacío para producto undefined', () => {
      expect(getProductCategory(undefined)).toBe('');
    });

    it('debe retornar string vacío si no hay categoría', () => {
      const product = { id: 1 };
      expect(getProductCategory(product)).toBe('');
    });
  });
});

describe('AdminProducts Logic - Formateo', () => {
  describe('formatProductPrice', () => {
    it('debe formatear precio con 2 decimales', () => {
      expect(formatProductPrice(10)).toBe('10.00');
      expect(formatProductPrice(10.5)).toBe('10.50');
      expect(formatProductPrice(10.99)).toBe('10.99');
    });

    it('debe redondear correctamente', () => {
      expect(formatProductPrice(10.999)).toBe('11.00');
      expect(formatProductPrice(10.994)).toBe('10.99');
    });

    it('debe manejar 0', () => {
      expect(formatProductPrice(0)).toBe('0.00');
    });

    it('debe manejar negativos', () => {
      expect(formatProductPrice(-25.5)).toBe('-25.50');
    });

    it('debe manejar string no numérico', () => {
      expect(formatProductPrice('abc')).toBe('0.00');
    });

    it('debe convertir strings numéricos', () => {
      expect(formatProductPrice('99.99')).toBe('99.99');
    });
  });

  describe('createDeleteConfirmationMessage', () => {
    it('debe crear mensaje de confirmación correcto', () => {
      const msg = createDeleteConfirmationMessage('Producto Test', 123);
      expect(msg).toBe('¿Eliminar "Producto Test" (id: 123)? Esta acción puede deshacerla borrando products_list en LocalStorage.');
    });

    it('debe manejar nombres con caracteres especiales', () => {
      const msg = createDeleteConfirmationMessage('Pokémon™', 'abc-123');
      expect(msg).toContain('Pokémon™');
      expect(msg).toContain('abc-123');
    });

    it('debe manejar nombres vacíos', () => {
      const msg = createDeleteConfirmationMessage('', 1);
      expect(msg).toBe('¿Eliminar "" (id: 1)? Esta acción puede deshacerla borrando products_list en LocalStorage.');
    });
  });
});

describe('AdminProducts Logic - Validación de Producto', () => {
  describe('isValidProduct', () => {
    it('debe retornar true para producto válido con id y nombre', () => {
      const product = { id: 1, nombre: 'Test' };
      expect(isValidProduct(product)).toBe(true);
    });

    it('debe retornar false con solo id (nombre undefined no cuenta)', () => {
      const product = { id: 1, nombre: undefined };
      expect(isValidProduct(product)).toBe(false);
    });

    it('debe retornar false con id definido pero sin nombre', () => {
      const product = { id: 5, precio: 100 };
      expect(isValidProduct(product)).toBe(false);
    });

    it('debe retornar false para null', () => {
      expect(isValidProduct(null)).toBe(false);
    });

    it('debe retornar false para undefined', () => {
      expect(isValidProduct(undefined)).toBe(false);
    });

    it('debe retornar false para objeto vacío', () => {
      expect(isValidProduct({})).toBe(false);
    });

    it('debe retornar false para string', () => {
      expect(isValidProduct('producto')).toBe(false);
    });

    it('debe retornar false para array', () => {
      expect(isValidProduct([1, 2, 3])).toBe(false);
    });
  });

  describe('getProductDisplayInfo', () => {
    it('debe retornar información completa del producto', () => {
      const product = { id: 1, nombre: 'Test', precio: 99.99, categoria: 'Juegos' };
      const info = getProductDisplayInfo(product);
      
      expect(info.id).toBe(1);
      expect(info.nombre).toBe('Test');
      expect(info.precio).toBe(99.99);
      expect(info.precioFormateado).toBe('99.99');
      expect(info.categoria).toBe('Juegos');
      expect(info.isValid).toBe(true);
    });

    it('debe manejar producto inválido', () => {
      const info = getProductDisplayInfo(null);
      
      expect(info.id).toBeUndefined();
      expect(info.nombre).toBe('');
      expect(info.precio).toBe(0);
      expect(info.precioFormateado).toBe('0.00');
      expect(info.categoria).toBe('');
      expect(info.isValid).toBe(false);
    });

    it('debe manejar producto con datos parciales (solo id) como inválido', () => {
      const product = { id: 5, precio: 100 };
      const info = getProductDisplayInfo(product);
      
      expect(info.id).toBe(5);
      expect(info.nombre).toBe('');
      expect(info.isValid).toBe(false); // Falta nombre, por lo tanto es inválido
    });
  });
});

describe('AdminProducts Logic - Operaciones con Arrays', () => {
  const mockProducts = [
    { id: 1, nombre: 'Producto A', precio: 50, categoria: 'Juegos' },
    { id: 2, nombre: 'Producto B', precio: 30, categoria: 'Consolas' },
    { id: 3, nombre: 'Producto C', precio: 70, categoria: 'Juegos' }
  ];

  describe('filterValidProducts', () => {
    it('debe filtrar solo productos válidos', () => {
      const products = [
        { id: 1, nombre: 'Valid' },
        {},  // inválido - no tiene id ni nombre
        { id: 2, nombre: 'Valid' }
      ];
      const filtered = filterValidProducts(products);
      expect(filtered.length).toBe(2);
    });

    it('debe retornar array vacío para null', () => {
      expect(filterValidProducts(null)).toEqual([]);
    });

    it('debe retornar array vacío para undefined', () => {
      expect(filterValidProducts(undefined)).toEqual([]);
    });

    it('debe retornar array vacío si todos son inválidos', () => {
      const products = [{}, null, undefined];
      expect(filterValidProducts(products).length).toBe(0);
    });
  });

  describe('countValidProducts', () => {
    it('debe contar productos válidos', () => {
      expect(countValidProducts(mockProducts)).toBe(3);
    });

    it('debe retornar 0 para array vacío', () => {
      expect(countValidProducts([])).toBe(0);
    });

    it('debe retornar 0 para null', () => {
      expect(countValidProducts(null)).toBe(0);
    });

    it('debe contar solo válidos en mezcla', () => {
      const products = [
        { id: 1, nombre: 'Valid' },
        {},
        { id: 2, nombre: 'Valid' }
      ];
      expect(countValidProducts(products)).toBe(2);
    });
  });

  describe('findProductById', () => {
    it('debe encontrar producto por ID', () => {
      const found = findProductById(mockProducts, 2);
      expect(found).toBeDefined();
      expect(found.nombre).toBe('Producto B');
    });

    it('debe retornar undefined si no encuentra', () => {
      const found = findProductById(mockProducts, 999);
      expect(found).toBeUndefined();
    });

    it('debe retornar undefined para array null', () => {
      const found = findProductById(null, 1);
      expect(found).toBeUndefined();
    });

    it('debe retornar undefined para array undefined', () => {
      const found = findProductById(undefined, 1);
      expect(found).toBeUndefined();
    });

    it('debe manejar ID como string', () => {
      const products = [{ id: 'abc', nombre: 'Test' }];
      const found = findProductById(products, 'abc');
      expect(found).toBeDefined();
      expect(found.nombre).toBe('Test');
    });
  });

  describe('getProductNames', () => {
    it('debe retornar todos los nombres', () => {
      const names = getProductNames(mockProducts);
      expect(names).toEqual(['Producto A', 'Producto B', 'Producto C']);
    });

    it('debe retornar array vacío para null', () => {
      expect(getProductNames(null)).toEqual([]);
    });

    it('debe retornar array vacío para undefined', () => {
      expect(getProductNames(undefined)).toEqual([]);
    });

    it('debe manejar productos sin nombre', () => {
      const products = [{ id: 1 }, { nombre: 'Test' }];
      const names = getProductNames(products);
      expect(names).toEqual(['', 'Test']);
    });
  });

  describe('getUniqueCategories', () => {
    it('debe retornar categorías únicas', () => {
      const categories = getUniqueCategories(mockProducts);
      expect(categories).toHaveLength(2);
      expect(categories).toContain('Juegos');
      expect(categories).toContain('Consolas');
    });

    it('debe retornar array vacío para null', () => {
      expect(getUniqueCategories(null)).toEqual([]);
    });

    it('debe excluir categorías vacías', () => {
      const products = [
        { categoria: 'Juegos' },
        { categoria: '' },
        { categoria: 'Juegos' }
      ];
      const categories = getUniqueCategories(products);
      expect(categories).toEqual(['Juegos']);
    });

    it('debe manejar productos sin categoría', () => {
      const products = [{ id: 1 }, { id: 2 }];
      const categories = getUniqueCategories(products);
      expect(categories).toEqual([]);
    });
  });

  describe('calculateTotalProductsValue', () => {
    it('debe calcular el valor total', () => {
      const total = calculateTotalProductsValue(mockProducts);
      expect(total).toBe(150); // 50 + 30 + 70
    });

    it('debe retornar 0 para array vacío', () => {
      expect(calculateTotalProductsValue([])).toBe(0);
    });

    it('debe retornar 0 para null', () => {
      expect(calculateTotalProductsValue(null)).toBe(0);
    });

    it('debe manejar precios inválidos como 0', () => {
      const products = [
        { precio: 100 },
        { precio: 'abc' },
        { precio: 50 }
      ];
      const total = calculateTotalProductsValue(products);
      expect(total).toBe(150);
    });

    it('debe manejar decimales', () => {
      const products = [
        { precio: 10.50 },
        { precio: 20.25 }
      ];
      const total = calculateTotalProductsValue(products);
      expect(total).toBe(30.75);
    });
  });
});

describe('AdminProducts Logic - Ordenamiento', () => {
  const mockProducts = [
    { id: 1, nombre: 'Charlie', precio: 50 },
    { id: 2, nombre: 'Alpha', precio: 30 },
    { id: 3, nombre: 'Bravo', precio: 70 }
  ];

  describe('sortProductsByName', () => {
    it('debe ordenar por nombre ascendente', () => {
      const sorted = sortProductsByName(mockProducts, true);
      expect(sorted[0].nombre).toBe('Alpha');
      expect(sorted[1].nombre).toBe('Bravo');
      expect(sorted[2].nombre).toBe('Charlie');
    });

    it('debe ordenar por nombre descendente', () => {
      const sorted = sortProductsByName(mockProducts, false);
      expect(sorted[0].nombre).toBe('Charlie');
      expect(sorted[1].nombre).toBe('Bravo');
      expect(sorted[2].nombre).toBe('Alpha');
    });

    it('debe retornar array vacío para null', () => {
      expect(sortProductsByName(null)).toEqual([]);
    });

    it('debe retornar array vacío para undefined', () => {
      expect(sortProductsByName(undefined)).toEqual([]);
    });

    it('debe manejar nombres vacíos', () => {
      const products = [{ nombre: 'Test' }, { nombre: '' }, { nombre: 'Abc' }];
      const sorted = sortProductsByName(products);
      expect(sorted[0].nombre).toBe('');
    });

    it('no debe modificar el array original', () => {
      const original = [...mockProducts];
      sortProductsByName(mockProducts);
      expect(mockProducts).toEqual(original);
    });
  });

  describe('sortProductsByPrice', () => {
    it('debe ordenar por precio ascendente', () => {
      const sorted = sortProductsByPrice(mockProducts, true);
      expect(sorted[0].precio).toBe(30);
      expect(sorted[1].precio).toBe(50);
      expect(sorted[2].precio).toBe(70);
    });

    it('debe ordenar por precio descendente', () => {
      const sorted = sortProductsByPrice(mockProducts, false);
      expect(sorted[0].precio).toBe(70);
      expect(sorted[1].precio).toBe(50);
      expect(sorted[2].precio).toBe(30);
    });

    it('debe retornar array vacío para null', () => {
      expect(sortProductsByPrice(null)).toEqual([]);
    });

    it('debe retornar array vacío para undefined', () => {
      expect(sortProductsByPrice(undefined)).toEqual([]);
    });

    it('debe manejar precios iguales', () => {
      const products = [
        { nombre: 'A', precio: 50 },
        { nombre: 'B', precio: 50 },
        { nombre: 'C', precio: 30 }
      ];
      const sorted = sortProductsByPrice(products);
      expect(sorted[0].precio).toBe(30);
      expect(sorted[1].precio).toBe(50);
      expect(sorted[2].precio).toBe(50);
    });

    it('no debe modificar el array original', () => {
      const original = [...mockProducts];
      sortProductsByPrice(mockProducts);
      expect(mockProducts).toEqual(original);
    });
  });
});

describe('AdminProducts Logic - Casos de Integración', () => {
  it('debe procesar lista completa de productos', () => {
    const products = [
      { id: 1, nombre: 'Producto A', precio: 100, categoria: 'Cat1' },
      { id: 2, nombre: 'Producto B', precio: 50, categoria: 'Cat2' },
      { id: 3, nombre: 'Producto C', precio: 75, categoria: 'Cat1' }
    ];

    expect(isValidProductsArray(products)).toBe(true);
    expect(hasProducts(products)).toBe(true);
    expect(countValidProducts(products)).toBe(3);
    expect(calculateTotalProductsValue(products)).toBe(225);
    expect(getUniqueCategories(products)).toHaveLength(2);
    
    const sorted = sortProductsByPrice(products);
    expect(sorted[0].precio).toBe(50);
    
    const found = findProductById(products, 2);
    expect(found.nombre).toBe('Producto B');
  });

  it('debe manejar lista con productos mixtos', () => {
    const products = [
      { id: 1, nombre: 'Valid' },
      {},
      { id: 2, nombre: 'Valid' },
      null
    ];

    expect(countValidProducts(products)).toBe(2);
    expect(filterValidProducts(products)).toHaveLength(2);
  });

  it('debe manejar lista vacía', () => {
    const products = [];

    expect(isValidProductsArray(products)).toBe(true);
    expect(hasProducts(products)).toBe(false);
    expect(countValidProducts(products)).toBe(0);
    expect(calculateTotalProductsValue(products)).toBe(0);
    expect(getUniqueCategories(products)).toEqual([]);
    expect(sortProductsByName(products)).toEqual([]);
  });
});
