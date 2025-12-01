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
    _raw: raw,
  };
}

export async function fetchUsers() {
  try {
    const res = await api.get('/users');
    const data = res.data;
    const list = Array.isArray(data) ? data : (data.items || []);
    return list.map(normalizeUser);
  } catch (err) {
    console.error('[userService] fetchUsers error', err?.message || err);
    throw err;
  }
}

export async function fetchUserById(id) {
  const res = await api.get(`/users/${id}`);
  return normalizeUser(res.data);
}

export async function updateUserById(id, payload) {
  // payload expected in backend shape
  const res = await api.put(`/users/${id}`, payload);
  return normalizeUser(res.data);
}

export async function createUser(payload) {
  const res = await api.post('/users', payload);
  return normalizeUser(res.data);
}

export async function deleteUserById(id) {
  const res = await api.delete(`/users/${id}`);
  return res.data;
}