import axios from 'axios';
import { 
  ProductoRequest, 
  ProductoUpdateRequest, 
  ProductoDeleteRequest, 
  ProductoListRequest,
  ProductoListResponse
} from '../types/productTypes';

const API_BASE_URL = 'http://localhost:8035';
const PRODUCTS_ENDPOINT = '/API/v1/producto';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Configuración del token de autenticación
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Inicializar token si existe
const token = localStorage.getItem('token');
setAuthToken(token);
const createProduct = async (productData: ProductoRequest) => {
  try {
    // Prepara los datos exactamente como los espera el backend
    const requestBody = {
      nombre: productData.nombre,
      descripcion: productData.descripcion || '',
      precio: productData.precio,
      cantidad: productData.cantidad,
      categoria: productData.categoria || 'Otros',
      firma: productData.firma
    };

    console.log('Request body enviado:', JSON.stringify(requestBody, null, 2));

    const response = await api.post(`${PRODUCTS_ENDPOINT}/crearProducto`, requestBody);
    return response.data;
  } catch (error: any) {
    console.error('Error detallado:', {
      request: productData,
      response: error.response?.data,
      message: error.message
    });
    throw error.response?.data || { 
      codigo: 1, 
      mensaje: 'Error al crear producto' 
    };
  }
};

const getProductByName = async (nombre: string) => {
  try {
    const response = await api.get(
      `${PRODUCTS_ENDPOINT}/obtenerProductoPorNombre/${encodeURIComponent(nombre)}`
    );
    return response.data;
  } catch (error: any) {
    console.error('Error getting product:', error);
    throw error.response?.data || { 
      codigo: 1, 
      mensaje: 'Error al obtener producto' 
    };
  }
};
const updateProduct = async (productData: ProductoUpdateRequest) => {
  try {
    // Validación completa de campos requeridos
    if (!productData.nombreOriginal || !productData.nuevoNombre) {
      throw new Error('Nombre original y nuevo nombre son requeridos');
    }

    // Asegurar que ningún campo requerido sea nulo
    const dataToSend = {
      nombreOriginal: productData.nombreOriginal,
      nuevoNombre: productData.nuevoNombre,
      descripcion: productData.descripcion || '', // Valor por defecto para string
      precio: Number(productData.precio) || 0,     // Valor por defecto para número
      cantidad: Number(productData.cantidad) || 0, // Valor por defecto para número
      categoria: productData.categoria || 'Otros'  // Valor por defecto para categoría
    };

    console.log('Datos a enviar para actualización:', JSON.stringify(dataToSend, null, 2));

    const response = await api.put(`${PRODUCTS_ENDPOINT}/actualizar`, dataToSend);
    return response.data;
  } catch (error: any) {
    console.error('Error en updateProduct:', {
      request: productData,
      error: error.response?.data || error.message
    });
    
    // Mensaje de error más descriptivo
    const errorMessage = error.response?.data?.mensaje 
      ? `Error del servidor: ${error.response.data.mensaje}`
      : 'Error al actualizar producto. Verifique los datos e intente nuevamente.';
    
    throw new Error(errorMessage);
  }
};
const deleteProduct = async (nombreProducto: string) => { // Solo acepta string
  try {
    const response = await api.post(`${PRODUCTS_ENDPOINT}/eliminar`, { nombre: nombreProducto });
    return response.data;
  } catch (error: any) {
    console.error('Error en deleteProduct:', error);
    throw error.response?.data || { 
      codigo: 1, 
      mensaje: 'Error al eliminar producto' 
    };
  }
};

const listProducts = async (listRequest: ProductoListRequest): Promise<ProductoListResponse> => {
  try {
    const response = await api.post<ProductoListResponse>(`${PRODUCTS_ENDPOINT}/listar`, listRequest);
    return response.data;
  } catch (error: any) {
    console.error('Error en listProducts:', {
      request: listRequest,
      error: error.response?.data || error.message
    });
    throw error;
  }
};

// Objeto que agrupa todas las funciones
const productApi = {
  createProduct,
  getProductByName,
  updateProduct,
  deleteProduct,
  listProducts,
  setAuthToken
};

export {
  createProduct,
  getProductByName,
  updateProduct,
  deleteProduct,
  listProducts
};

export default productApi;