// src/api/authAPI.ts
import axios from 'axios';
import { generarFirma } from './firmaService';

// Crear instancia de axios
const api = axios.create({
  baseURL: 'http://localhost:8035',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Solución: Asegurarse que config.data es un objeto antes de hacer el spread
api.interceptors.request.use((config) => {
  if (config.url?.includes('login')) {
    config.url = config.url.replace('ENCRYPI', 'ENCRYPT');
    config.data = {
      ...(config.data || {}), // Añadir esto para manejar casos donde data es undefined
      firma: "firma_desarrollo_omitida"
    };
  }
  return config;
});
export { api }; 