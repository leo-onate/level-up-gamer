import api from './http';

// NOTE: This file used to provide a local-storage backed product service.
// For integration with the Spring Boot backend we expose async functions
// that call the API. Legacy synchronous helpers remain for other code,
// but new pages should use the async `fetch*` functions below.

// Async calls to backend
function normalizeProduct(p) {
  if (!p) return p;
  return {
    id: p.id || p._id || p.codigo || null,
    nombre: p.name || p.nombre || '',
    imagen: p.image || p.imagen || p.img || '',
    precio: p.price ?? p.precio ?? 0,
    descripcion: p.description || p.descripcion || '',
    oferta: p.oferta ?? false,
    categoria: p.category || p.categoria || '',
    stock: p.stock ?? 0,
    // preserve original fields too
    _raw: p,
  };
}

export async function fetchProducts(params = {}) {
  try {
    const res = await api.get('/api/v1/products', { params });
    const data = res.data;
    const list = Array.isArray(data) ? data : (data.items || data || []);
    // debug log to help trace empty catalog issues
    console.debug('[productService] fetched products count=', Array.isArray(list) ? list.length : 0, 'raw=', list);
    return list.map(normalizeProduct);
  } catch (err) {
    console.error('[productService] fetchProducts error', err && err.message ? err.message : err);
    throw err;
  }
}

export async function fetchProductById(id) {
  const res = await api.get(`/api/v1/products/${id}`);
  return normalizeProduct(res.data);
}

export async function createProduct(payload) {
  const res = await api.post('/api/v1/products', payload);
  return res.data;
}

export async function updateProductById(id, payload) {
  const res = await api.put(`/api/v1/products/${id}`, payload);
  return res.data;
}

export async function deleteProductById(id) {
  const res = await api.delete(`/api/v1/products/${id}`);
  return res.data;
}

// Legacy synchronous helper — read only from localStorage if present.
// We avoid importing the static JSON so the file can be removed.
const STORAGE_KEY = 'products_list';

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getProducts() {
  return readStorage();
}

export function getProductById(id) {
  const lookup = String(id);
  return getProducts().find((p) => String(p.id) === lookup) || null;
}

