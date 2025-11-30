import api from './http';

// NOTE: This file used to provide a local-storage backed product service.
// For integration with the Spring Boot backend we expose async functions
// that call the API. Legacy synchronous helpers remain for other code,
// but new pages should use the async `fetch*` functions below.

// Async calls to backend
export async function fetchProducts(params = {}) {
  const res = await api.get('/products', { params });
  return res.data;
}

export async function fetchProductById(id) {
  const res = await api.get(`/products/${id}`);
  return res.data;
}

export async function createProduct(payload) {
  const res = await api.post('/admin/products', payload);
  return res.data;
}

export async function updateProductById(id, payload) {
  const res = await api.put(`/admin/products/${id}`, payload);
  return res.data;
}

export async function deleteProductById(id) {
  const res = await api.delete(`/admin/products/${id}`);
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

