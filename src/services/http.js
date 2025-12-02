import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor para agregar el token JWT en cada request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token') || localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token inválido o expirado - limpiar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      // Opcional: redirigir al login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
