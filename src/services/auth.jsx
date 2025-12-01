import api from './http';

const CURRENT_KEY = 'currentUser';

export async function registerUser({ nombre, correo, contrasena, fechaNacimiento }) {
  try {
    const payload = {
      email: (correo || '').trim().toLowerCase(),
      password: contrasena,
      name: nombre,
      fechaNac: fechaNacimiento,
      isAdmin: false,
      tipo: 0 // Cliente por defecto
    };
    const res = await api.post('/users', payload);
    const user = res.data;
    // store minimal user locally (do not store password)
    const safe = { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin, tipo: user.tipo ?? (user.isAdmin ? 2 : 0) };
    try { localStorage.setItem(CURRENT_KEY, JSON.stringify(safe)); } catch {}
    return { ok: true, user: safe };
  } catch (err) {
    // if conflict or other error, normalize
    const message = err?.response?.data || err?.message || 'Error en registro';
    return { ok: false, error: String(message) };
  }
}

export async function login({ usuario, password }) {
  try {
    // backend doesn't have a login endpoint; fetch users and verify (temporary)
    const res = await api.get('/users');
    const list = Array.isArray(res.data) ? res.data : (res.data.items || []);
    const found = list.find(u => (u.email && u.email === usuario) || (u.name && u.name === usuario));
    if (found && String(found.password) === String(password)) {
      const safe = { id: found.id, email: found.email, name: found.name, isAdmin: found.isAdmin, tipo: found.tipo ?? (found.isAdmin ? 2 : 0) };
      try { localStorage.setItem(CURRENT_KEY, JSON.stringify(safe)); } catch {}
      return true;
    }
    return false;
  } catch (err) {
    console.error('login error', err);
    return false;
  }
}

export function logout() {
  try { localStorage.removeItem(CURRENT_KEY); } catch {}
}

export function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(CURRENT_KEY)); } catch { return null; }
}