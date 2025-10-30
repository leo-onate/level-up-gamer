/**
 * Lógica de negocio para el componente CartProvider.
 * Almacenado en window.CartProviderLogic para acceso global y pruebas.
 * * Este módulo contiene funciones puras que calculan los nuevos estados
 * del carrito y los productos, pero NO MODIFICAN el estado directamente.
 * Devuelven el nuevo estado o un objeto de error.
 */

// Evita la redeclaración si este script se carga múltiples veces
if (typeof window.CartProviderLogic === 'undefined') {
  window.CartProviderLogic = {};
}

/**
 * Carga el carrito desde localStorage.
 * Maneja de forma segura errores de parseo JSON.
 *
 * @param {string} cartKey - La clave de localStorage donde se guarda el carrito.
 * @returns {Array} - El array de items del carrito, o un array vacío si falla.
 */
window.CartProviderLogic.loadCartFromStorage = function(cartKey) {
  try {
    var storedCart = localStorage.getItem(cartKey);
    // Si storedCart es null o undefined, JSON.parse(null) es null, || [] lo maneja.
    return JSON.parse(storedCart) || [];
  } catch (e) {
    console.error("CartProviderLogic: Error al parsear el carrito desde localStorage.", e);
    return [];
  }
};

/**
 * Guarda el carrito en localStorage.
 * Maneja de forma segura errores al escribir (ej. almacenamiento lleno).
 *
 * @param {string} cartKey - La clave de localStorage donde se guardará el carrito.
 * @param {Array} items - El array de items del carrito a guardar.
 */
window.CartProviderLogic.saveCartToStorage = function(cartKey, items) {
  try {
    localStorage.setItem(cartKey, JSON.stringify(items));
  } catch (e) {
    console.error("CartProviderLogic: Error al guardar el carrito en localStorage.", e);
  }
};

/**
 * Calcula el estado del carrito y productos después de añadir un item.
 *
 * @param {object} product - El producto a añadir.
 * @param {number} qty - La cantidad a añadir.
 * @param {Array} currentItems - El estado actual de items en el carrito.
 * @param {Array} currentProducts - El estado actual de la lista de productos (stock).
 * @returns {object} - Un objeto { newItems, newProducts } o { error: "mensaje" }.
 */
window.CartProviderLogic.calculateAddToCart = function(product, qty, currentItems, currentProducts) {
  if (!product || typeof qty !== 'number' || !Array.isArray(currentItems) || !Array.isArray(currentProducts)) {
    return { error: "Datos de entrada inválidos." };
  }

  var productInStock = currentProducts.find(function(p) { return p.id === product.id; });
  
  if (!productInStock) {
    return { error: "Producto no encontrado en la lista de stock." };
  }
  
  if (productInStock.stock < qty) {
    return { error: "No hay suficiente stock para añadir este producto." };
  }

  var found = currentItems.find(function(i) { return i.id === product.id; });
  var newItems;

  if (found) {
    // Producto ya existente en el carrito
    if (productInStock.stock < found.qty + qty) {
      return { error: "No hay suficiente stock para añadir este producto." };
    }
    newItems = currentItems.map(function(i) {
      return i.id === product.id ? { ...i, qty: i.qty + qty } : i;
    });
  } else {
    // Producto nuevo en el carrito
    newItems = [...currentItems, { ...product, qty: qty }];
  }

  // Actualizar el stock en la lista de productos
  var newProducts = currentProducts.map(function(p) {
    return p.id === product.id ? { ...p, stock: p.stock - qty } : p;
  });

  return { newItems: newItems, newProducts: newProducts };
};

/**
 * Calcula el estado del carrito y productos después de eliminar un item.
 *
 * @param {string|number} productId - El ID del producto a eliminar.
 * @param {Array} currentItems - El estado actual de items en el carrito.
 * @param {Array} currentProducts - El estado actual de la lista de productos (stock).
 * @returns {object} - Un objeto { newItems, newProducts }.
 */
window.CartProviderLogic.calculateRemoveFromCart = function(productId, currentItems, currentProducts) {
  var itemToRemove = currentItems.find(function(i) { return i.id === productId; });
  
  if (!itemToRemove) {
    // No se encontró el item, no hay cambios
    return { newItems: currentItems, newProducts: currentProducts };
  }

  var newItems = currentItems.filter(function(i) { return i.id !== productId; });

  var newProducts = currentProducts.map(function(p) {
    // Devuelve el stock al producto
    return p.id === productId ? { ...p, stock: p.stock + itemToRemove.qty } : p;
  });

  return { newItems: newItems, newProducts: newProducts };
};

/**
 * Calcula el estado del carrito y productos después de actualizar la cantidad de un item.
 *
 * @param {string|number} productId - El ID del producto a actualizar.
 * @param {number} newQty - La *nueva* cantidad total deseada (no el diferencial).
 * @param {Array} currentItems - El estado actual de items en el carrito.
 * @param {Array} currentProducts - El estado actual de la lista de productos (stock).
 * @returns {object} - Un objeto { newItems, newProducts } o { error: "mensaje" }.
 */
window.CartProviderLogic.calculateUpdateQty = function(productId, newQty, currentItems, currentProducts) {
  var itemToUpdate = currentItems.find(function(i) { return i.id === productId; });
  if (!itemToUpdate) {
    return { newItems: currentItems, newProducts: currentProducts }; // No encontrado
  }

  var productInStock = currentProducts.find(function(p) { return p.id === productId; });
  if (!productInStock) {
    return { error: "Producto no encontrado en el stock." };
  }

  var stockDifference = newQty - itemToUpdate.qty;

  if (productInStock.stock < stockDifference) {
    return { error: "No hay suficiente stock para actualizar la cantidad." };
  }

  // Asegura que la cantidad no sea menor a 1
  var validatedQty = Math.max(1, newQty);
  // Recalcula la diferencia de stock basado en la cantidad validada
  var validatedStockDifference = validatedQty - itemToUpdate.qty;

  var newItems = currentItems.map(function(i) {
    return i.id === productId ? { ...i, qty: validatedQty } : i;
  });
  
  var newProducts = currentProducts.map(function(p) {
    return p.id === productId ? { ...p, stock: p.stock - validatedStockDifference } : p;
  });

  return { newItems: newItems, newProducts: newProducts };
};

/**
 * Calcula el nuevo estado de productos después de restaurar el stock de una lista de items.
 *
 * @param {Array} itemsToRestore - Items cuyo stock debe ser devuelto.
 * @param {Array} currentProducts - El estado actual de la lista de productos.
 * @returns {Array} - El nuevo array de productos con el stock actualizado.
 */
window.CartProviderLogic.calculateRestoredStock = function(itemsToRestore, currentProducts) {
  if (!Array.isArray(itemsToRestore) || !Array.isArray(currentProducts)) {
    return currentProducts;
  }

  // Un mapa es más eficiente que iteraciones anidadas
  var restoreMap = {};
  itemsToRestore.forEach(function(item) {
    restoreMap[item.id] = (restoreMap[item.id] || 0) + (item.qty || 0);
  });

  var newProducts = currentProducts.map(function(p) {
    if (restoreMap[p.id]) {
      return { ...p, stock: p.stock + restoreMap[p.id] };
    }
    return p;
  });

  return newProducts;
};

/**
 * Simplemente devuelve un array vacío, para la lógica de 'clearCartOnSuccess'.
 * @returns {Array} - Un array vacío.
 */
window.CartProviderLogic.calculateClearCartOnSuccess = function() {
  return [];
};

/**
 * Calcula el precio total del carrito.
 *
 * @param {Array} items - El array de items del carrito.
 * @returns {number} - El precio total.
 */
window.CartProviderLogic.calculateTotal = function(items) {
  if (!Array.isArray(items)) {
    return 0;
  }
  
  return items.reduce(function(sum, item) {
    var price = Number(item.precio) || 0;
    var qty = Number(item.qty) || 0;
    return sum + (price * qty);
  }, 0);
};