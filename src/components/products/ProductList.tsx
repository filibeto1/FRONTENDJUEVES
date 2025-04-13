import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, IconButton, TablePagination, TextField, Box, Alert 
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import api from '../../api/productApi';
import { Producto, ProductoListRequest, ProductoListResponse } from '../../types/productTypes';
import { generateSignature } from '../../services/signatureService';
import ProductForm from './ProductForm';

const ProductList: React.FC = () => {
  // Estados
  const [products, setProducts] = useState<Producto[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Producto | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Refs para control del ciclo de vida
  const isMounted = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Función para cargar productos con protección
  const fetchProducts = useCallback(async () => {
    if (!isMounted.current) return;

    // Cancelar petición anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    try {
      setError(null);
      const request: ProductoListRequest = {
        nombre: searchTerm,
        pagina: page,
        tamañoPagina: rowsPerPage,
        firma: generateSignature({ 
          nombre: searchTerm, 
          pagina: page, 
          tamañoPagina: rowsPerPage 
        }, 'tu-clave-secreta')
      };
      
      const response = await api.listProducts(request, {
        signal: controller.signal
      });
      
      // Verificar montaje antes de actualizar estado
      if (isMounted.current) {
        setProducts(response.productos || []);
        setTotalItems(response.totalElementos || 0);
      }
    } catch (err) {
      if (isMounted.current) {
        // Verificar si es un AbortError primero
        if (err instanceof Error && err.name === 'AbortError') {
          return; // No hacer nada si fue abortado
        }
        
        console.error('Error al cargar productos:', err);
        setError('Error al cargar los productos. Por favor, inténtelo de nuevo.');
        
        // Opcional: puedes verificar el tipo de error más específico aquí
        if (err instanceof Error) {
          setError(`Error al cargar los productos: ${err.message}`);
        }
      }
    }
  }, [page, rowsPerPage, searchTerm]);

  // Efecto para cargar productos con limpieza
  useEffect(() => {
    isMounted.current = true;
    const timer = setTimeout(() => fetchProducts(), 300);

    return () => {
      isMounted.current = false;
      clearTimeout(timer);
      abortControllerRef.current?.abort();
    };
  }, [fetchProducts]);

  // Manejadores de eventos protegidos
  const handleChangePage = (_: unknown, newPage: number) => {
    if (isMounted.current) setPage(newPage);
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isMounted.current) {
      setRowsPerPage(parseInt(e.target.value, 10));
      setPage(0);
    }
  };

  const handleEdit = (product: Producto) => {
    if (isMounted.current) {
      setCurrentProduct(product);
      setOpenForm(true);
    }
  };

  const handleDelete = async (nombre: string) => {
    if (!isMounted.current) return;
    
    try {
      await api.deleteProduct({
        nombre,
        firma: generateSignature({ nombre }, 'tu-clave-secreta')
      });
      fetchProducts();
    } catch (err) {
      if (isMounted.current) {
        console.error('Error al eliminar:', err);
        
        // Manejo de error más seguro
        if (err instanceof Error) {
          setError(`Error al eliminar el producto: ${err.message}`);
        } else {
          setError('Error al eliminar el producto');
        }
      }
    }
  };

  const handleFormClose = () => {
    if (isMounted.current) {
      setOpenForm(false);
      setCurrentProduct(null);
      fetchProducts();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Controles de búsqueda y agregar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Buscar productos"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => isMounted.current && setOpenForm(true)}
        >
          Nuevo Producto
        </Button>
      </Box>

      {/* Mensaje de error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => isMounted.current && setError(null)}>
          {error}
        </Alert>
      )}

      {/* Tabla de productos */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id_product || product.nombre}>
                <TableCell>{product.nombre}</TableCell>
                <TableCell>{product.descripcion || '-'}</TableCell>
                <TableCell>${product.precio?.toFixed(2)}</TableCell>
                <TableCell>{product.cantidad}</TableCell>
                <TableCell>{product.categoria || '-'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(product)}>
                    <Edit color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product.nombre)}>
                    <Delete color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalItems}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Formulario de producto */}
      <ProductForm 
        open={openForm} 
        onClose={handleFormClose} 
        product={currentProduct} 
      />
    </Box>
  );
};

export default ProductList;