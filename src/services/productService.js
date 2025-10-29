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

function ensureCounterSeeded() {
  const cur = parseInt(localStorage.getItem(COUNTER_KEY) || "0", 10);
  if (cur > 0) return;
  const all = [...initialProducts, ...(readStorage() || [])];
  const max = all.reduce((acc, p) => {
    const m = String(p?.id || "").match(/^p(\d+)$/i);
    return m ? Math.max(acc, parseInt(m[1], 10)) : acc;
  }, 0);
  localStorage.setItem(COUNTER_KEY, String(max));
}

export function getProducts() {
  const stored = readStorage();
  if (!stored) return [...initialProducts];
  const seen = new Set(stored.map((p) => String(p.id)));
  return [...stored, ...initialProducts.filter((p) => !seen.has(String(p.id)))];
}

export function saveProducts(list) {
  writeStorage(list);
}

function nextId() {
  ensureCounterSeeded();
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
  // guardar sobre la lista actual para persistir
  const list = getProducts();
  const newProduct = {
    id: product.id || nextId(),
    nombre: product.nombre || "",
    imagen: product.imagen || "Starmie.jpg",
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
  const lookup = String(id);
  return getProducts().find((p) => String(p.id) === lookup) || null;
}

export function deleteProduct(id) {
  const list = getProducts().filter((p) => String(p.id) !== String(id));
  saveProducts(list);
}