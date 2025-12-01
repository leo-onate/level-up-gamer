import api from './http';

const CURRENT_KEY = 'currentUser';

export async function registerUser({ nombre, correo, contrasena, fechaNacimiento }) {
  try {
    const payload = {
      email: (correo || '').trim().toLowerCase(),
      password: contrasena,
      name: nombre,
      fechaNac: fechaNacimiento,
      isAdmin: false
    };
    const res = await api.post('/api/v1/users', payload);
    const user = res.data;
    // store minimal user locally (do not store password)
    const safe = { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin };
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
    // Llamar al endpoint JWT del backend
    const res = await api.post('/api/auth/login', {
      username: usuario,
      password: password
    });
    
    if (res.data && res.data.token) {
      // Guardar el token JWT
      localStorage.setItem('jwt_token', res.data.token);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('role', res.data.role);
      
      // Obtener datos completos del usuario desde /api/v1/users/me
      try {
        const userRes = await api.get('/api/v1/users/me');
        const userData = userRes.data;
        
        // Guardar usuario completo en formato compatible con el resto de la app
        const safe = { 
          id: userData.id,
          name: userData.name || userData.nombre || res.data.username,
          email: userData.email || res.data.username,
          isAdmin: res.data.role === 'ROLE_ADMIN'
        };
        try { localStorage.setItem(CURRENT_KEY, JSON.stringify(safe)); } catch {}
      } catch (err) {
        // Si falla obtener el usuario completo, usar datos del token
        const safe = { 
          name: res.data.username, 
          email: res.data.username,
          isAdmin: res.data.role === 'ROLE_ADMIN'
        };
        try { localStorage.setItem(CURRENT_KEY, JSON.stringify(safe)); } catch {}
      }
      
      return true;
    }
    return false;
  } catch (err) {
    console.error('login error', err);
    return false;
  }
}

export function logout() {
  try { 
    localStorage.removeItem(CURRENT_KEY);
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  } catch {}
}

export function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(CURRENT_KEY)); } catch { return null; }
}