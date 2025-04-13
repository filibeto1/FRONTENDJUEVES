import axios from 'axios';
import { 
  ProductoRequest, 
  ProductoUpdateRequest, 
  ProductoDeleteRequest, 
  ProductoListRequest,
  ProductoListResponse
} from '../types/productTypes';

// Interface para la configuración personalizada
interface ApiConfig {
  signal?: AbortSignal;
  headers?: Record<string, string>;
  // Otras propiedades de configuración que necesites
}

const API_URL = 'http://localhost:8035/API/v1/producto';

const setAuthToken = (token: string) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

const token = localStorage.getItem('token');
if (token) setAuthToken(token);

const api = {
  async createProduct(productData: ProductoRequest) {
    try {
      const response = await axios.post(`${API_URL}/crearProducto`, productData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { codigo: 1, mensaje: 'Error al crear producto' };
    }
  },

  async getProductByName(nombre: string) {
    try {
      const response = await axios.get(`${API_URL}/obtenerProductoPorNombre/${encodeURIComponent(nombre)}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { codigo: 1, mensaje: 'Error al obtener producto' };
    }
  },

  async updateProduct(productData: ProductoUpdateRequest) {
    try {
      const response = await axios.put(`${API_URL}/actualizar`, productData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { codigo: 1, mensaje: 'Error al actualizar producto' };
    }
  },

  async deleteProduct(productData: ProductoDeleteRequest) {
    try {
      const response = await axios.post(`${API_URL}/eliminar`, productData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { codigo: 1, mensaje: 'Error al eliminar producto' };
    }
  },

  async listProducts(listRequest: ProductoListRequest, config?: ApiConfig) {
    try {
      const response = await axios.post(`${API_URL}/listar`, listRequest, config);
      return response.data as ProductoListResponse;
    } catch (error: any) {
      throw error.response?.data || { codigo: 1, mensaje: 'Error al listar productos' };
    }
  }
};

export default api;