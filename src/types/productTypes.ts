// src/types/productTypes.ts
export interface Producto {
  id_product?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  cantidad: number;
  categoria?: string;
  fechaCreacion?: string;
}

export interface ProductoRequest {
  nombre: string;
  precio: number;
  cantidad: number;
  descripcion?: string;
  categoria?: string;
  firma: string;
}

export interface ProductoUpdateRequest {
  nombreOriginal: string;
  nuevoNombre?: string;
  descripcion?: string;
  precio?: number;
  cantidad?: number;
  categoria?: string;
  firma: string;
}

export interface ProductoDeleteRequest {
  nombre: string;
  firma: string;
}

export interface ProductoListRequest {
  nombre?: string;
  Fecha_creacion?: string;
  pagina: number;
  tamañoPagina: number;
  firma: string;
}

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
  totalPaginas?: number;
  totalElementos?: number;
  productos?: Producto[];
}
