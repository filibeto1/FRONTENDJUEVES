export interface Producto {
  id_product?: number;
  nombre: string;
  descripcion?: string;
  precio: number | string;
  cantidad: number | string;
  categoria: 'Instrumentos de cuerda' | 'Instrumentos de viento' | 'Instrumentos de percusión' | 'Instrumentos electrónicos';

  fechaCreacion?: string | Date;
}


export interface ProductoRequest {
  nombre: string;
  descripcion?: string;
  precio: number;
  cantidad: number;
  categoria: 'Instrumentos de cuerda' | 'Instrumentos de viento' | 'Instrumentos de percusión' | 'Instrumentos electrónicos';
  firma: string;
}

export interface ProductoUpdateRequest {
  nombreOriginal: string;
  nuevoNombre: string;
  descripcion?: string;
  precio: number;
  cantidad: number;
  categoria?: string;
  firma: string;
}

export interface ProductoDeleteRequest {
  nombre: string;
  firma: string;
}

// En productTypes.ts
export interface ProductoListRequest {
  pagina: number;
  tamañoPagina: number;
  nombre?: string;
  categoria?: string;
}
export interface ProductoResponse {
  id_product?: number;
  codigo: number;
  mensaje: string;
}

export interface ProductoListResponse {
  codigo: number;
  mensaje: string;
  productos: Producto[];
  totalElementos: number;
  totalPaginas: number;
}

export interface ProductoCreateResponse {
  data: Producto;
  codigo: number;
  mensaje: string;
}

export interface ProductoUpdateResponse {
  data: Producto;
  codigo: number;
  mensaje: string;
}
// En tus tipos (productTypes.ts), asegúrate de tener:
export type CategoriaProducto = 
  | 'Instrumentos de cuerda'
  | 'Instrumentos de viento'
  | 'Instrumentos de percusión'
  | 'Instrumentos electrónicos';

export interface Producto {
  id_product?: number;
  nombre: string;
  descripcion?: string;
  precio: number | string;
  cantidad: number | string;
  categoria: CategoriaProducto;
  fechaCreacion?: string | Date;
}