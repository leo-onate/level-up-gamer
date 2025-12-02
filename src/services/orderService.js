import api from './http';

// Servicio flexible para leer/escribir "boletas" en localStorage
const DEFAULT_KEY = 'boletas';
const CANDIDATE_KEYS = ['boletas', 'orders', 'orderHistory', 'ordenes', 'orders_list'];

/** Devuelve la primera key válida que contenga un array de órdenes */
function detectKey() {
  for (const k of CANDIDATE_KEYS) {
    try {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return k;
    } catch (err) {
      // ignore parse errors
    }
  }
  return null;
}

/** Obtiene el key que se debe usar: detectada o la por defecto */
function keyToUse() {
  return detectKey() || DEFAULT_KEY;
}

export function getOrders() {
  const k = detectKey();
  if (k) {
    try {
      return JSON.parse(localStorage.getItem(k)) || [];
    } catch (err) {
      console.error('orderService.getOrders parse error', err);
      return [];
    }
  }
  try {
    const raw = localStorage.getItem(DEFAULT_KEY);
    return raw ? (JSON.parse(raw) || []) : [];
  } catch (err) {
    console.error('orderService.getOrders fallback parse error', err);
    return [];
  }
}

export function saveOrder(order, key = null) {
  const useKey = key || keyToUse();
  try {
    const raw = localStorage.getItem(useKey);
    const arr = raw ? (JSON.parse(raw) || []) : [];
    arr.push(order);
    localStorage.setItem(useKey, JSON.stringify(arr));
    return true;
  } catch (err) {
    console.error('orderService.saveOrder error', err);
    return false;
  }
}

export function clearOrders(key = null) {
  const useKey = key || keyToUse();
  try {
    localStorage.removeItem(useKey);
  } catch (err) {
    console.error('orderService.clearOrders error', err);
  }
}

export function getOrdersCount() {
  return getOrders().length;
}

export function getOrdersByUserEmail(email) {
  if (!email) return [];
  const allOrders = getOrders();
  return allOrders.filter(order => order.userEmail === email);
}

// ========== FUNCIONES PARA BACKEND ==========

export async function createOrderInBackend(orderData) {
  try {
    const response = await api.post('/api/v1/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error al crear orden en backend:', error);
    throw error;
  }
}

export async function fetchOrdersFromBackend() {
  try {
    const response = await api.get('/api/v1/orders');
    return response.data;
  } catch (error) {
    console.error('Error al obtener órdenes del backend:', error);
    throw error;
  }
}

export async function fetchOrderById(id) {
  try {
    const response = await api.get(`/api/v1/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener orden del backend:', error);
    throw error;
  }
}

export async function fetchOrdersByUserId(userId) {
  try {
    const response = await api.get(`/api/v1/orders?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener órdenes por usuario:', error);
    throw error;
  }
}

export async function updateOrderStatus(id, status) {
  try {
    const response = await api.patch(`/api/v1/orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar estado de orden:', error);
    throw error;
  }
}