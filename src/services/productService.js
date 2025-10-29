import { products as initialProducts } from "../data/products";

const STORAGE_KEY = "products_list";
const COUNTER_KEY = "product_counter";

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeStorage(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {}
}

// max id num de pNN entre iniciales y guardados
function getMaxId() {
  const all = [...initialProducts, ...(readStorage() || [])];
  return all.reduce((acc, p) => {
    const m = String(p?.id || "").match(/^p(\d+)$/i);
    return m ? Math.max(acc, parseInt(m[1], 10)) : acc;
  }, 0);
}

// si el contador existente es menor que el máximo real, lo corrige
function ensureCounterSynced() {
  const cur = parseInt(localStorage.getItem(COUNTER_KEY) || "0", 10);
  const max = getMaxId();
  if (isNaN(cur) || cur < max) {
    localStorage.setItem(COUNTER_KEY, String(max));
  }
}

// merge: iniciales + guardados, pero si hay el mismo id, se hace deep-merge
// (los del storage sobrescriben, pero se mantienen campos faltantes como 'stock')
export function getProducts() {
  const stored = readStorage() || [];
  const map = new Map(initialProducts.map((p) => [String(p.id), { ...p }]));
  for (const s of stored) {
    const id = String(s.id);
    if (map.has(id)) {
      map.set(id, { ...map.get(id), ...s });
    } else {
      map.set(id, { ...s });
    }
  }
  return Array.from(map.values());
}

export function saveProducts(list) {
  writeStorage(list);
}

function nextId() {
  ensureCounterSynced();
  const last = parseInt(localStorage.getItem(COUNTER_KEY) || "0", 10);
  const next = (isNaN(last) ? 0 : last) + 1;
  localStorage.setItem(COUNTER_KEY, String(next));
  return `p${next}`;
}

export function addProduct(product) {
  // trabajar sobre la lista unificada y persistirla
  const list = getProducts();
  const newProduct = {
    id: product.id || nextId(),
    nombre: product.nombre || "",
    imagen: product.imagen || "Starmie.jpg",
    precio: Number(product.precio) || 0,
    descripcion: product.descripcion || "",
    oferta: !!product.oferta,
    categoria: product.categoria || "",
    stock: product.stock ?? 0,
  };
  list.push(newProduct);
  saveProducts(list);
  return newProduct;
}

export function getProductById(id) {
  const lookup = String(id);
  return getProducts().find((p) => String(p.id) === lookup) || null;
}

export function updateProduct(updated) {
  const list = getProducts().map((p) =>
    String(p.id) === String(updated.id) ? { ...p, ...updated } : p
  );
  saveProducts(list);
  return updated;
}

export function deleteProduct(id) {
  const list = getProducts().filter((p) => String(p.id) !== String(id));
  saveProducts(list);
}