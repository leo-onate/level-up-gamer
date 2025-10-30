/**
 * src/utils/ProductService.logic.js
 *
 * Lógica pura para la gestión de productos, abstrayendo el storage
 * y los datos iniciales para permitir el testing (mocking).
 */

// Asegura que el objeto de lógica exista en window
if (typeof window.ProductServiceLogic === 'undefined') {
  window.ProductServiceLogic = {};
}

// --- Configuración de Dependencias (Inyección) ---
// Estas propiedades DEBEN ser seteadas por el módulo que importa este script.

/**
 * @property {object} _storage - Referencia al API de storage (ej. localStorage o un mock).
 * Debe implementar getItem(key) y setItem(key, value).
 */
window.ProductServiceLogic._storage = null;

/**
 * @property {Array} _initialData - Array de productos iniciales (de data/products).
 */
window.ProductServiceLogic._initialData = [];

/**
 * @property {string} _storageKey - Clave para la lista de productos.
 */
window.ProductServiceLogic._storageKey = "products_list";

/**
 * @property {string} _counterKey - Clave para el contador de ID.
 */
window.ProductServiceLogic._counterKey = "product_counter";


// --- Funciones Internas (Ahora públicas en el objeto lógico para testing) ---

/**
 * @function readStorage
 * @description Lee y parsea la lista de productos desde el storage configurado.
 * @returns {Array|null} La lista de productos o null si hay error o no existe.
 */
window.ProductServiceLogic.readStorage = function() {
  if (!this._storage) {
    console.error("ProductServiceLogic: _storage no está configurado.");
    return null;
  }
  try {
    const raw = this._storage.getItem(this._storageKey);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error("ProductServiceLogic: Error al leer storage.", e);
    return null;
  }
};

/**
 * @function writeStorage
 * @description Escribe (serializa) la lista de productos al storage configurado.
 * @param {Array} list - La lista de productos a guardar.
 */
window.ProductServiceLogic.writeStorage = function(list) {
  if (!this._storage) {
    console.error("ProductServiceLogic: _storage no está configurado.");
    return;
  }
  try {
    // Asegura que la lista sea un array antes de guardar
    const dataToWrite = Array.isArray(list) ? list : [];
    this._storage.setItem(this._storageKey, JSON.stringify(dataToWrite));
  } catch (e) {
    console.error("ProductServiceLogic: Error al escribir storage.", e);
  }
};

/**
 * @function getMaxId
 * @description Calcula el ID numérico más alto (ej. 'p12' -> 12) combinando 
 * la data inicial y la data del storage.
 * @returns {number} El ID numérico máximo encontrado.
 */
window.ProductServiceLogic.getMaxId = function() {
  // Llama a la función de lógica interna (this.readStorage)
  const storedData = this.readStorage() || [];
  const all = [...this._initialData, ...storedData];

  return all.reduce((acc, p) => {
    // Regex robusta: p?.id puede ser null/undefined
    const m = String(p?.id || "").match(/^p(\d+)$/i);
    // Si hay match (m no es null) y m[1] existe, parsea
    return m && m[1] ? Math.max(acc, parseInt(m[1], 10)) : acc;
  }, 0);
};

/**
 * @function ensureCounterSynced
 * @description Asegura que el contador de IDs en el storage sea al menos 
 * tan alto como el ID máximo existente en los datos.
 */
window.ProductServiceLogic.ensureCounterSynced = function() {
  if (!this._storage) return;

  const curRaw = this._storage.getItem(this._counterKey) || "0";
  const cur = parseInt(curRaw, 10);

  // Llama a la función de lógica interna (this.getMaxId)
  const max = this.getMaxId();

  if (isNaN(cur) || cur < max) {
    this._storage.setItem(this._counterKey, String(max));
  }
};

/**
 * @function nextId
 * @description Obtiene el siguiente ID disponible, sincronizando primero el contador.
 * @returns {string} El nuevo ID (ej. "p123").
 */
window.ProductServiceLogic.nextId = function() {
  if (!this._storage) {
    console.error("ProductServiceLogic: _storage no está configurado.");
    return "p-error"; // Retorna ID inválido si no hay storage
  }

  // Llama a la lógica interna
  this.ensureCounterSynced();

  const lastRaw = this._storage.getItem(this._counterKey) || "0";
  const last = parseInt(lastRaw, 10);

  const next = (isNaN(last) ? 0 : last) + 1;
  this._storage.setItem(this._counterKey, String(next));
  return `p${next}`;
};

// --- Funciones Públicas (CRUD) ---

/**
 * @function getProducts
 * @description Obtiene la lista unificada de productos (iniciales + storage).
 * Si un ID se repite, los datos del storage sobrescriben a los iniciales (merge).
 * @returns {Array} Lista de productos unificada.
 */
window.ProductServiceLogic.getProducts = function() {
  // Llama a la lógica interna
  const stored = this.readStorage() || [];

  // Copia profunda de los datos iniciales para evitar mutación
  const map = new Map(this._initialData.map((p) => [String(p.id), { ...p }]));

  for (const s of stored) {
    if (!s || typeof s.id === 'undefined') continue; // Robustez

    const id = String(s.id);
    if (map.has(id)) {
      // Merge: El del storage (s) sobrescribe campos del inicial (map.get(id))
      map.set(id, { ...map.get(id), ...s });
    } else {
      // Es un producto nuevo, solo existe en storage
      map.set(id, { ...s });
    }
  }
  return Array.from(map.values());
};

/**
 * @function saveProducts
 * @description Alias para writeStorage. Persiste la lista completa.
 * @param {Array} list - Lista de productos a guardar.
 */
window.ProductServiceLogic.saveProducts = function(list) {
  // Llama a la lógica interna
  this.writeStorage(list);
};

/**
 * @function addProduct
 * @description Añade un nuevo producto a la lista unificada y la guarda.
 * Normaliza los campos y asigna un ID si no se provee.
 * @param {object} product - El producto (parcial) a añadir.
 * @returns {object} El producto completo que fue añadido.
 */
window.ProductServiceLogic.addProduct = function(product) {
  if (!product) product = {}; // Robustez para entradas nulas

  // Llama a la lógica interna
  const list = this.getProducts();

  const newProduct = {
    // Si no hay ID, llama a la lógica interna nextId()
    id: product.id || this.nextId(),
    nombre: product.nombre || "",
    imagen: product.imagen || "Starmie.jpg", // Default
    precio: Number(product.precio) || 0,
    descripcion: product.descripcion || "",
    oferta: !!product.oferta, // Casteo a booleano
    categoria: product.categoria || "",
    // Usa '??' (Nullish coalescing) para preservar '0' si existe
    stock: product.stock ?? 0,
  };

  list.push(newProduct);
  this.saveProducts(list); // Llama a la lógica interna
  return newProduct;
};

/**
 * @function getProductById
 * @description Busca un producto por su ID en la lista unificada.
 * @param {string|number} id - El ID a buscar.
 * @returns {object|null} El producto encontrado o null.
 */
window.ProductServiceLogic.getProductById = function(id) {
  // Robustez: si id es null/undefined, String(id) será "null" o "undefined"
  if (id === null || typeof id === 'undefined') {
    return null;
  }
  
  const lookup = String(id);
  // Llama a la lógica interna
  return this.getProducts().find((p) => String(p.id) === lookup) || null;
};

/**
 * @function updateProduct
 * @description Actualiza un producto en la lista unificada (merge) y la guarda.
 * @param {object} updated - El objeto de producto con los campos a actualizar (debe tener ID).
 * @returns {object} El objeto 'updated' que se recibió (o el original si el merge falló).
 */
window.ProductServiceLogic.updateProduct = function(updated) {
  if (!updated || typeof updated.id === 'undefined' || updated.id === null) {
    console.warn("ProductServiceLogic: updateProduct llamado sin ID válido.");
    return updated; // Retorna lo que recibió
  }

  const lookupId = String(updated.id);
  let found = false;

  // Llama a la lógica interna
  const list = this.getProducts().map((p) => {
    if (String(p.id) === lookupId) {
      found = true;
      return { ...p, ...updated }; // Aplica el merge
    }
    return p;
  });

  // Solo guarda si el producto existía en la lista unificada
  if (found) {
    this.saveProducts(list);
  }
  
  return updated;
};

/**
 * @function deleteProduct
 * @description Elimina un producto de la lista unificada y la guarda.
 * @param {string|number} id - El ID del producto a eliminar.
 */
window.ProductServiceLogic.deleteProduct = function(id) {
  if (id === null || typeof id === 'undefined') {
    return; // No hacer nada si el ID es nulo
  }
  
  const lookupId = String(id);

  // Llama a la lógica interna
  const list = this.getProducts().filter((p) => String(p.id) !== lookupId);

  // Guarda la lista filtrada
  this.saveProducts(list);
};