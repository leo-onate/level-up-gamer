import api from './http';

const USERS_KEY = 'users';

function readStorage() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

export function getUsers() {
  return readStorage();
}

export function saveUsers(users) {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch {}
}

function normalizeUser(raw) {
  if (!raw) return raw;
  // map backend fields to frontend shape
  const fecha = raw.fechaNac || raw.fecha_nac || raw.createdAt || raw.created_at || null;
  let fechaIso = '';
  try {
    if (fecha) {
      const d = new Date(fecha);
      // format yyyy-mm-dd for date inputs
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      fechaIso = `${y}-${m}-${day}`;
    }
  } catch {}
  return {
    id: raw.id || raw._id || null,
    nombre: raw.name || raw.nombre || raw.username || '',
    correo: raw.email || raw.correo || '',
    contrasena: raw.password ? '••••••' : '',
    fechaNacimiento: fechaIso,
    isAdmin: raw.isAdmin ?? raw.is_admin ?? false,
    tipo: raw.tipo ?? (raw.isAdmin || raw.is_admin ? 2 : 0), // 0=cliente, 1=vendedor, 2=admin
    _raw: raw,
  };
}

export async function fetchUsers() {
  try {
    const res = await api.get('/api/v1/users');
    const data = res.data;
    const list = Array.isArray(data) ? data : (data.items || []);
    return list.map(normalizeUser);
  } catch (err) {
    console.error('[userService] fetchUsers error', err?.message || err);
    throw err;
  }
}

export async function fetchUserById(id) {
  const res = await api.get(`/api/v1/users/${id}`);
  return normalizeUser(res.data);
}

export async function updateUserById(id, payload) {
  // payload expected in backend shape
  const res = await api.put(`/api/v1/users/${id}`, payload);
  return normalizeUser(res.data);
}

export async function createUser(payload) {
  const res = await api.post('/api/v1/users', payload);
  return normalizeUser(res.data);
}

export async function deleteUserById(id) {
  const res = await api.delete(`/api/v1/users/${id}`);
  return res.data;
}

export async function updateUserTipo(id, tipo) {
  try {
    const res = await api.patch(`/api/v1/users/${id}/tipo`, { tipo });
    return normalizeUser(res.data);
  } catch (err) {
    console.error('[userService] updateUserTipo error', err?.message || err);
    throw err;
  }
}

export async function fetchUsersByTipo(tipo) {
  try {
    const res = await api.get(`/api/v1/users/by-tipo/${tipo}`);
    const data = res.data;
    const list = Array.isArray(data) ? data : [];
    return list.map(normalizeUser);
  } catch (err) {
    console.error('[userService] fetchUsersByTipo error', err?.message || err);
    throw err;
  }
}