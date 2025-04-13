import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Chip,
  Box,
  Paper
} from '@mui/material';
import { Producto } from '../../types/productTypes';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

interface ProductViewProps {
  product: Producto | null;
  open: boolean;
  onClose: () => void;
}

const ProductView: React.FC<ProductViewProps> = ({ product, open, onClose }) => {
  if (!product) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Typography variant="h5" component="div">
          {product.nombre}
        </Typography>
        <Chip 
          label={product.categoria || 'Sin categoría'} 
          color="primary" 
          size="small"
          sx={{ mt: 1 }}
        />
      </DialogTitle>
      
      <Divider sx={{ my: 1 }} />
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Descripción
            </Typography>
            <Typography variant="body1">
              {product.descripcion || 'No hay descripción disponible'}
            </Typography>
          </Paper>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Precio
              </Typography>
              <Typography variant="h6" color="primary">
                ${product.precio?.toFixed(2)}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Cantidad en stock
              </Typography>
              <Typography variant="h6">
                {product.cantidad}
              </Typography>
            </Box>
          </Box>
          
          {product.fechaCreacion && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Fecha de creación
              </Typography>
              <Typography>
              {format(new Date(product.fechaCreacion), "PPP")}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductView;