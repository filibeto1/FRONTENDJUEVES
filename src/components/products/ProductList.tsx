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
  Typography,
  Tooltip
} from '@mui/material';
import { Edit, Delete, Add, Search } from '@mui/icons-material';
import productApi from '../../api/productApi';
import { Producto, ProductoListRequest } from '../../types/productTypes';
import ProductForm from './ProductForm';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmationDialog from '../shared/ConfirmationDialog';

const ProductList: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Producto[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Producto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Producto | null>(null);

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
      
      if (response.data && response.data.productos) {
        setProducts(response.data.productos);
        setTotalItems(response.data.totalElementos || response.data.productos.length);
      } else {
        setError('La respuesta no contiene datos válidos');
      }
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError('Error al cargar productos. Por favor intente nuevamente.');
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

  const handleDeleteClick = (product: Producto) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    
    try {
      const productId = productToDelete.id_product 
        ? String(productToDelete.id_product) 
        : productToDelete.nombre;
      
      await productApi.deleteProduct(productId);
      fetchProducts();
      setDeleteDialogOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al eliminar el producto');
      setDeleteDialogOpen(false);
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

  const isAdmin = user?.role === 'ADMINISTRADOR';

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
          sx={{ minWidth: 250, flexGrow: 1 }}
          InputProps={{
            startAdornment: <Search color="action" sx={{ mr: 1 }} />
          }}
        />

        <Button 
          type="submit"
          variant="outlined"
          sx={{ minWidth: 120 }}
        >
          Buscar
        </Button>

        {isAdmin && (
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => {
              setCurrentProduct(null);
              setOpenForm(true);
            }}
            sx={{ minWidth: 180, ml: 'auto' }}
          >
            Nuevo Producto
          </Button>
        )}
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
            <Button 
              onClick={() => {
                setSearchTerm('');
                setPage(0);
              }} 
              sx={{ mt: 2 }}
            >
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
                  <TableCell>Categoría</TableCell>
                  <TableCell align="right">Precio</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  {isAdmin && <TableCell align="center">Acciones</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map(product => (
                  <TableRow key={product.id_product || product.nombre}>
                    <TableCell>{product.nombre}</TableCell>
                    <TableCell sx={{ 
                      maxWidth: 200,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {product.descripcion}
                    </TableCell>
                    <TableCell>{product.categoria}</TableCell>
                    <TableCell align="right">${Number(product.precio).toFixed(2)}</TableCell>
                    <TableCell align="right">{Number(product.cantidad)}</TableCell>
                    {isAdmin && (
                      <TableCell align="center">
                        <Tooltip title="Editar">
                          <IconButton onClick={() => handleEdit(product)}>
                            <Edit color="primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton onClick={() => handleDeleteClick(product)}>
                            <Delete color="error" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    )}
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
            labelRowsPerPage="Productos por página:"
          />
        </>
      )}

      <ProductForm 
        open={openForm} 
        onClose={handleFormClose}
        onSubmitSuccess={handleFormSubmitSuccess}
        product={currentProduct} 
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirmar eliminación"
        content={`¿Está seguro que desea eliminar el producto "${productToDelete?.nombre}"?`}
      />
    </Box>
  );
};

export default ProductList;