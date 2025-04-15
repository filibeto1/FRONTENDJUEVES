import CryptoJS from 'crypto-js';

const API_SECRET = '123456'; // DEBE coincidir exactamente con app.crypto.secret.key del backend

export const generateSignature = (params: {
  nombre: string;
  descripcion?: string;
  precio?: number;
  cantidad?: number;
  categoria?: string;
}): string => {
  // Formato EXACTO que espera el backend
  const cadenaOriginal = `||${params.nombre || ''}|${params.descripcion || ''}|${params.precio || 0}|${params.cantidad || 0}|${params.categoria || 'Otros'}||`;
  
  console.log('Cadena original generada:', cadenaOriginal);
  
  // Generar HMAC-SHA256
  const hash = CryptoJS.HmacSHA256(cadenaOriginal, API_SECRET);
  
  // Convertir a Base64 (formato que espera el backend)
  const firma = CryptoJS.enc.Base64.stringify(hash);
  
  console.log('Firma generada:', firma);
  return firma;
};