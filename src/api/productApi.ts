import axios, { AxiosResponse } from 'axios';
import {
  Producto,
  ProductoRequest,
  ProductoUpdateRequest,
  ProductoListRequest,
  ProductoListResponse,
  ProductoCreateResponse,
  ProductoUpdateResponse
} from '../types/productTypes';
// Al principio del archivo
import { generateSignature } from '../utils/signatureUtils';
const API_BASE_URL = 'http://localhost:8035';
const PRODUCTS_ENDPOINT = '/API/v1/producto';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

setAuthToken(localStorage.getItem('token'));
const createProduct = async (productData: ProductoRequest): Promise<AxiosResponse<ProductoCreateResponse>> => {
  try {
    // Generar firma primero
    const firma = generateSignature({
      nombre: productData.nombre,
      descripcion: productData.descripcion,
      precio: productData.precio,
      cantidad: productData.cantidad,
      categoria: productData.categoria
    });

    const requestBody = {
      nombre: productData.nombre.trim(),
      descripcion: productData.descripcion?.trim() || '',
      precio: productData.precio,
      cantidad: productData.cantidad,
      categoria: productData.categoria || '',
      firma: firma // Añadir la firma generada
    };

    console.log('Datos enviados:', JSON.stringify(requestBody, null, 2));
    
    const response = await api.post(`${PRODUCTS_ENDPOINT}/crearProducto`, requestBody);
    return response;
  } catch (error: any) {
    console.error('Error completo:', {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });
    throw error.response?.data || { 
      codigo: 1, 
      mensaje: error.message || 'Error al crear producto' 
    };
  }
};
const updateProduct = async (productData: ProductoUpdateRequest): Promise<AxiosResponse<ProductoUpdateResponse>> => {
  try {
    const dataToSend = {
      nombreOriginal: productData.nombreOriginal,
      nuevoNombre: productData.nuevoNombre,
      descripcion: productData.descripcion || '',
      precio: productData.precio,
      cantidad: productData.cantidad,
      categoria: productData.categoria || 'Otros',
      firma: productData.firma
    };

    return await api.put(`${PRODUCTS_ENDPOINT}/actualizar`, dataToSend);
  } catch (error: any) {
    throw error.response?.data || { 
      codigo: 1, 
      mensaje: 'Error al actualizar producto' 
    };
  }
};

const deleteProduct = async (nombreProducto: string): Promise<AxiosResponse> => {
  try {
    return await api.post(`${PRODUCTS_ENDPOINT}/eliminar`, { nombre: nombreProducto });
  } catch (error: any) {
    throw error.response?.data || { 
      codigo: 1, 
      mensaje: 'Error al eliminar producto' 
    };
  }
};

const listProducts = async (listRequest: ProductoListRequest): Promise<AxiosResponse<ProductoListResponse>> => {
  try {
    return await api.post(`${PRODUCTS_ENDPOINT}/listar`, listRequest);
  } catch (error: any) {
    throw error;
  }
};

const uploadProductImage = async (file: File, productoId: number): Promise<AxiosResponse<{imageUrl: string}>> => {
  try {
    const formData = new FormData();
    formData.append('imagen', file);
    formData.append('productoId', productoId.toString());

    const response = await axios.post(`${API_BASE_URL}${PRODUCTS_ENDPOINT}/uploadImage`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      timeout: 30000 // 30 segundos de timeout
    });

    return response;
  } catch (error: any) {
    console.error('Error detallado al subir imagen:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });
    throw error.response?.data || { 
      error: 'Error al subir la imagen' 
    };
  }
};
const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, productId: number) => {
  if (event.target.files && event.target.files[0]) {
    const file = event.target.files[0];
    
    // Validaciones básicas
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('El archivo es demasiado grande (máximo 5MB)');
      return;
    }

    try {
      const response = await uploadProductImage(file, productId);
      console.log('Imagen subida:', response.data.imageUrl);
      // Actualizar estado con la nueva URL de la imagen
    } catch (error) {
      console.error('Error al subir imagen:', error);
      
      // Solución: Verificar el tipo del error antes de acceder a sus propiedades
      if (error instanceof Error) {
        alert(error.message);
      } else if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } } };
        alert(axiosError.response?.data?.error || 'Error al subir la imagen');
      } else {
        alert('Error desconocido al subir la imagen');
      }
    }
  }
};
export default {
  createProduct,
  updateProduct,
  deleteProduct,
  listProducts,
  setAuthToken
};