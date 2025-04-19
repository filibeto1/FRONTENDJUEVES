import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductList from '../components/products/ProductList';
import { useAuth } from '../contexts/AuthContext';

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMINISTRADOR';

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Gestión de Productos
      </Typography>
      
      {isAdmin && (
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mb: 3 }}
          onClick={() => navigate('/products/new')}
        >
          Crear Nuevo Producto
        </Button>
      )}
      
      <ProductList/>
    </Box>
  );
};

export default ProductsPage;