// src/api/authAPI.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8035',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000
});

// Interceptor para manejar el modo desarrollo
api.interceptors.request.use(config => {
  if (config.url?.includes('/API/v1/ENCRYPT/usuarioServicio/login')) {
    // Asegurar que data es un objeto
    if (!config.data) config.data = {};
    
    // Añadir firma de desarrollo si no existe
    if (!config.data.firma) {
      config.data = {
        ...config.data,
        firma: "firma_desarrollo_omitida"
      };
    }
  }
  return config;
});

// Interceptor para manejo centralizado de errores
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('Error del servidor:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url
      });
    }
    return Promise.reject(error);
  }
);

export { api };