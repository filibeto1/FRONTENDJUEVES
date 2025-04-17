import CryptoJS from 'crypto-js';

// Mover esta interfaz y función al principio del archivo
interface SignatureParams {
  nombre?: string;
  nombreOriginal?: string;
  nuevoNombre?: string;
  descripcion?: string;
  precio?: number;
  cantidad?: number;
  categoria?: string;
}

export const generateSignature = (params: SignatureParams): string => {
  const cadenaOriginal = `||${params.nombre || ''}|${
    params.descripcion || ''
  }|${params.precio?.toString() || '0'}|${
    params.cantidad?.toString() || '0'
  }|${params.categoria || ''}||`;
  
  const API_SECRET = '123456'; // Mismo que en el backend
  
  const hash = CryptoJS.HmacSHA256(cadenaOriginal, API_SECRET);
  return CryptoJS.enc.Base64.stringify(hash);
};