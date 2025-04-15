// Interfaz principal para productos
export interface Producto {
  id_product: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  cantidad: number;
  categoria?: string;
  fechaCreacion?: string;
}

// Interfaces para props de componentes
export interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
  product: Producto | null;
}

// Interfaces para requests
export interface ProductoBaseRequest {
  nombre: string;
  firma: string;
}

export interface ProductoRequest {
  nombre: string;
  descripcion?: string;
  precio: number;
  cantidad: number;
  categoria?: string;
  firma: string; // Añadir este campo

}
export interface ProductoUpdateRequest {
  nombreOriginal: string;
  nuevoNombre: string;
  descripcion?: string;
  precio: number;
  cantidad: number;
  categoria?: string;
  firma: string; // Añadir este campo
}

export interface ProductoDeleteRequest {
  nombre: string;
  firma: string;
}

export interface ProductoListRequest {
  nombre?: string;
  pagina: number;
  tamañoPagina: number;
}

// Interfaces para responses
export interface ProductoResponse {
  codigo: number;
  mensaje: string;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  cantidad?: number;
  categoria?: string;
  fechaCreacion?: string;
}
export interface ProductoListResponse {
  codigo: number;
  mensaje: string;
  productos: Producto[];
  totalPaginas: number;
  totalElementos: number;
}


export interface SignatureParams {
  nombre: string;
  descripcion?: string;
  precio?: number;
  cantidad?: number;
  categoria?: string;
}

// Elimina el export type al final y usa solo las exportaciones de interface