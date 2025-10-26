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

export function getProducts() {
  const stored = readStorage();
  return stored !== null ? stored : [...initialProducts];
}

export function saveProducts(list) {
  writeStorage(list);
}


function nextId() {
  try {
    const last = parseInt(localStorage.getItem(COUNTER_KEY) || "0", 10);
    const next = last + 1;
    localStorage.setItem(COUNTER_KEY, String(next));
    return `p${next}`;
  } catch {
    return `p${Date.now()}`;
  }
}

export function addProduct(product) {
  const list = getProducts();
  const newProduct = {
    id: product.id || nextId(),
    nombre: product.nombre || "",
    imagen: product.imagen || "",
    precio: Number(product.precio) || 0,
    descripcion: product.descripcion || "",
    oferta: !!product.oferta,
    categoria: product.categoria || "",
  };
  list.push(newProduct);
  saveProducts(list);
  return newProduct;
}

export function getProductById(id) {
  return getProducts().find(p => p.id === id) || null;
}

/* Opcionales para el futuro */
export function updateProduct(updated) {
  const list = getProducts().map(p => (p.id === updated.id ? { ...p, ...updated } : p));
  saveProducts(list);
  return updated;
}

export function deleteProduct(id) {
  const list = getProducts().filter(p => p.id !== id);
  saveProducts(list);
}