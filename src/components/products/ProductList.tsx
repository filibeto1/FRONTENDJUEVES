import React, { useState, useCallback, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  IconButton, 
  TablePagination, 
  TextField, 
  Box, 
  Alert,
  CircularProgress,
  Typography
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import productApi from '../../api/productApi';
import { 
  Producto, 
  ProductoListRequest, 
  ProductoDeleteRequest,
  SignatureParams
} from '../../types/productTypes';
import { generateSignature } from '../../services/signatureService';
import ProductForm from './ProductForm';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Producto[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Producto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const request: ProductoListRequest = {
        nombre: searchTerm || '',
        pagina: page + 1,
        tamañoPagina: rowsPerPage
      };
      
      const response = await productApi.listProducts(request);
      
      if (response && response.productos) {
        setProducts(response.productos);
        setTotalItems(response.totalElementos || response.productos.length);
      } else {
        setError('La respuesta no contiene datos válidos');
      }
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value, 10);
    setRowsPerPage(newSize);
    setPage(0);
  };

  const handleEdit = (product: Producto) => {
    setCurrentProduct({
      ...product,
      precio: typeof product.precio === 'string' ? parseFloat(product.precio) : product.precio || 0,
      cantidad: typeof product.cantidad === 'string' ? parseInt(product.cantidad) : product.cantidad || 0
    });
    setOpenForm(true);
  };

  const handleDelete = async (product: Producto) => {
    try {
      await productApi.deleteProduct(product.nombre); // Extraemos el nombre aquí
      fetchProducts();
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al eliminar el producto');
    }
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setCurrentProduct(null);
  };

  const handleFormSubmitSuccess = () => {
    handleFormClose();
    fetchProducts();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchProducts();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box 
        component="form"
        onSubmit={handleSearchSubmit}
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <TextField
          label="Buscar productos"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 250 }}
        />
        <Button 
          type="submit"
          variant="contained"
          sx={{ minWidth: 180 }}
        >
          Buscar
        </Button>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => {
            setCurrentProduct(null);
            setOpenForm(true);
          }}
          sx={{ minWidth: 180 }}
        >
          Nuevo Producto
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={60} />
        </Box>
      ) : products.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">
            No se encontraron productos
          </Typography>
          {searchTerm && (
            <Button onClick={() => setSearchTerm('')} sx={{ mt: 2 }}>
              Limpiar búsqueda
            </Button>
          )}
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map(product => (
                  <TableRow key={product.id_product || product.nombre}>
                    <TableCell>{product.nombre}</TableCell>
                    <TableCell>{product.descripcion}</TableCell>
                    <TableCell>${Number(product.precio).toFixed(2)}</TableCell>
                    <TableCell>{Number(product.cantidad)}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(product)}>
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(product)}>
                        <Delete color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalItems}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      <ProductForm 
        open={openForm} 
        onClose={handleFormClose}
        onSubmitSuccess={handleFormSubmitSuccess}
        product={currentProduct} 
      />
    </Box>
  );
};

export default ProductList;