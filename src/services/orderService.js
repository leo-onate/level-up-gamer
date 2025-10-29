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