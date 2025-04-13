import React from 'react';
import { Box, Typography } from '@mui/material';
import ProductList from '../components/products/ProductList';

const ProductsPage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Gestión de Productos
      </Typography>
      <ProductList />
    </Box>
  );
};

export default ProductsPage;