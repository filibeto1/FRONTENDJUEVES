import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent
} from '@mui/material';
import { Producto, ProductoRequest, ProductoUpdateRequest } from '../../types/productTypes';
import productApi from '../../api/productApi';
import { generateSignature } from '../../services/signatureService';

// Solución para Grid - Usar Box con display grid
import Box from '@mui/material/Box';

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  product: Producto | null;
}

function isUpdateRequest(data: ProductoRequest | ProductoUpdateRequest): data is ProductoUpdateRequest {
  return (data as ProductoUpdateRequest).nombreOriginal !== undefined;
}

const ProductForm: React.FC<ProductFormProps> = ({ open, onClose, product }) => {
  const initialFormData = product 
    ? {
        nombreOriginal: product.nombre,
        nuevoNombre: product.nombre,
        descripcion: product.descripcion || '',
        precio: product.precio ?? 0,
        cantidad: product.cantidad ?? 0,
        categoria: product.categoria || '',
        firma: generateSignature({
          nombreOriginal: product.nombre,
          nuevoNombre: product.nombre,
          descripcion: product.descripcion || '',
          precio: product.precio ?? 0,
          cantidad: product.cantidad ?? 0,
          categoria: product.categoria || ''
        }, 'tu-clave-secreta')
      }
    : {
        nombre: '',
        precio: 0,
        cantidad: 0,
        descripcion: '',
        categoria: '',
        firma: generateSignature({
          nombre: '',
          precio: 0,
          cantidad: 0,
          descripcion: '',
          categoria: ''
        }, 'tu-clave-secreta')
      };

  const [formData, setFormData] = useState<ProductoRequest | ProductoUpdateRequest>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(initialFormData);
  }, [product]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!product) {
      const request = formData as ProductoRequest;
      if (!request.nombre || request.nombre.length > 100) {
        newErrors.nombre = 'El nombre es requerido y debe tener máximo 100 caracteres';
      }
    } else {
      const request = formData as ProductoUpdateRequest;
      if (!request.nuevoNombre || request.nuevoNombre.length > 100) {
        newErrors.nombre = 'El nombre es requerido y debe tener máximo 100 caracteres';
      }
    }
    
    const precio = isUpdateRequest(formData) ? formData.precio ?? 0 : formData.precio;
    const cantidad = isUpdateRequest(formData) ? formData.cantidad ?? 0 : formData.cantidad;
    
    if (precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }
    
    if (cantidad < 0) {
      newErrors.cantidad = 'La cantidad no puede ser negativa';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      if (product) {
        await productApi.updateProduct(formData as ProductoUpdateRequest);
      } else {
        await productApi.createProduct(formData as ProductoRequest);
      }
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const target = e.target as { name?: string; value: unknown };
    if (!target.name) return;

    setFormData(prev => ({
      ...prev,
      [target.name as string]: target.value
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{product ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
      <DialogContent>
        {/* Reemplazo de Grid por Box con sistema grid */}
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 2,
            mt: 1
          }}
        >
          {/* Campo Nombre */}
          <Box gridColumn="span 12">
            {!product ? (
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={(formData as ProductoRequest).nombre}
                onChange={handleChange}
                error={!!errors.nombre}
                helperText={errors.nombre}
              />
            ) : (
              <TextField
                fullWidth
                label="Nombre"
                name="nuevoNombre"
                value={(formData as ProductoUpdateRequest).nuevoNombre || ''}
                onChange={handleChange}
                error={!!errors.nombre}
                helperText={errors.nombre}
              />
            )}
          </Box>

          {/* Campos Precio y Cantidad */}
          <Box gridColumn={{ xs: 'span 12', sm: 'span 6' }}>
            <TextField
              fullWidth
              label="Precio"
              name="precio"
              type="number"
              value={isUpdateRequest(formData) ? formData.precio ?? 0 : formData.precio}
              onChange={handleChange}
              error={!!errors.precio}
              helperText={errors.precio}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Box>

          <Box gridColumn={{ xs: 'span 12', sm: 'span 6' }}>
            <TextField
              fullWidth
              label="Cantidad"
              name="cantidad"
              type="number"
              value={isUpdateRequest(formData) ? formData.cantidad ?? 0 : formData.cantidad}
              onChange={handleChange}
              error={!!errors.cantidad}
              helperText={errors.cantidad}
              inputProps={{ min: 0 }}
            />
          </Box>

          {/* Descripción y Categoría */}
          <Box gridColumn="span 12">
            <TextField
              fullWidth
              label="Descripción"
              name="descripcion"
              multiline
              rows={3}
              value={formData.descripcion}
              onChange={handleChange}
            />
          </Box>

          <Box gridColumn="span 12">
            <FormControl fullWidth error={!!errors.categoria}>
              <InputLabel>Categoría</InputLabel>
              <Select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                label="Categoría"
              >
                <MenuItem value="Electrónicos">Electrónicos</MenuItem>
                <MenuItem value="Ropa">Ropa</MenuItem>
                <MenuItem value="Alimentos">Alimentos</MenuItem>
                <MenuItem value="Hogar">Hogar</MenuItem>
                <MenuItem value="Otros">Otros</MenuItem>
              </Select>
              {errors.categoria && <FormHelperText>{errors.categoria}</FormHelperText>}
            </FormControl>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {product ? 'Actualizar' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductForm;