import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Solución: Inicializar headers si no existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {}; // Añadir esta línea
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Evita redirección múltiple
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'; // Full page reload
      }
    }
    return Promise.reject(error);
  }
);

export default api;