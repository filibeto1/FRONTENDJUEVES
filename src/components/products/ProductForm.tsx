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
  SelectChangeEvent,
  Box,
  CircularProgress
} from '@mui/material';
import { 
  Producto, 
  ProductoRequest, 
  ProductoUpdateRequest,
  SignatureParams 
} from '../../types/productTypes';
import productApi from '../../api/productApi';
import { generateSignature } from '../../services/signatureService';

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
  product: Producto | null;
}

function isUpdateRequest(data: ProductoRequest | ProductoUpdateRequest): data is ProductoUpdateRequest {
  return (data as ProductoUpdateRequest).nombreOriginal !== undefined;
}

const ProductForm: React.FC<ProductFormProps> = ({ open, onClose, onSubmitSuccess, product }) => {
  // Definimos valores iniciales completos para todos los campos
  const getInitialData = (): ProductoRequest | ProductoUpdateRequest => {
    const baseData = product 
      ? {
          nombreOriginal: product.nombre || '',
          nuevoNombre: product.nombre || '',
          descripcion: product.descripcion || '',
          precio: product.precio ?? 0,
          cantidad: product.cantidad ?? 0,
          categoria: product.categoria || 'Otros'
        }
      : {
          nombre: '',
          descripcion: '',
          precio: 0,
          cantidad: 0,
          categoria: 'Otros'
        };
  
    const signatureData = product
      ? {
          nombre: product.nombre || '',
          descripcion: product.descripcion || '',
          precio: product.precio ?? 0,
          cantidad: product.cantidad ?? 0,
          categoria: product.categoria || 'Otros'
        }
      : {
          nombre: '',
          descripcion: '',
          precio: 0,
          cantidad: 0,
          categoria: 'Otros'
        };
  
    return {
      ...baseData,
      firma: generateSignature(signatureData)
    };
  };
  
  const [formData, setFormData] = useState<ProductoRequest | ProductoUpdateRequest>(getInitialData());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sincronizamos el estado cuando cambia el producto o se abre el diálogo
  useEffect(() => {
    if (open) {
      const newFormData = product 
        ? {
            nombreOriginal: product.nombre || '',
            nuevoNombre: product.nombre || '',
            descripcion: product.descripcion || '',
            precio: product.precio ?? 0,
            cantidad: product.cantidad ?? 0,
            categoria: product.categoria || 'Otros',
            firma: generateSignature({
              nombre: product.nombre || '',
              pagina: 1,
              tamañoPagina: 10
            } as SignatureParams)
          }
        : {
            nombre: '',
            descripcion: '',
            precio: 0,
            cantidad: 0,
            categoria: 'Otros',
            firma: generateSignature({
              nombre: '',
              pagina: 1,
              tamañoPagina: 10
            } as SignatureParams)
          };
      
      setFormData(newFormData);
      setErrors({});
    }
  }, [product, open]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!product) {
      const request = formData as ProductoRequest;
      if (!request.nombre || request.nombre.trim().length === 0) {
        newErrors.nombre = 'El nombre es requerido';
      } else if (request.nombre.length > 100) {
        newErrors.nombre = 'El nombre debe tener máximo 100 caracteres';
      }
    } else {
      const request = formData as ProductoUpdateRequest;
      if (!request.nuevoNombre || request.nuevoNombre.trim().length === 0) {
        newErrors.nuevoNombre = 'El nombre es requerido';
      } else if (request.nuevoNombre.length > 100) {
        newErrors.nuevoNombre = 'El nombre debe tener máximo 100 caracteres';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const updatedData = {
        ...prev,
        [name]: name === 'precio' || name === 'cantidad' ? Number(value) : value
      };
      
      // Generar nueva firma con TODOS los campos requeridos
      const signatureData = {
        nombre: product 
          ? (updatedData as ProductoUpdateRequest).nuevoNombre || ''
          : (updatedData as ProductoRequest).nombre || '',
        descripcion: product 
          ? (updatedData as ProductoUpdateRequest).descripcion || ''
          : (updatedData as ProductoRequest).descripcion || '',
        precio: product 
          ? Number((updatedData as ProductoUpdateRequest).precio) || 0
          : Number((updatedData as ProductoRequest).precio) || 0,
        cantidad: product 
          ? Number((updatedData as ProductoUpdateRequest).cantidad) || 0
          : Number((updatedData as ProductoRequest).cantidad) || 0,
        categoria: product 
          ? (updatedData as ProductoUpdateRequest).categoria || 'Otros'
          : (updatedData as ProductoRequest).categoria || 'Otros'
      };
      
      return {
        ...updatedData,
        firma: generateSignature(signatureData)
      };
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setErrors({});
  
      // Generar firma con los datos ACTUALES del formulario
      const signatureData = {
        nombre: product 
          ? (formData as ProductoUpdateRequest).nuevoNombre 
          : (formData as ProductoRequest).nombre,
        descripcion: product 
          ? (formData as ProductoUpdateRequest).descripcion 
          : (formData as ProductoRequest).descripcion,
        precio: product 
          ? (formData as ProductoUpdateRequest).precio 
          : (formData as ProductoRequest).precio,
        cantidad: product 
          ? (formData as ProductoUpdateRequest).cantidad 
          : (formData as ProductoRequest).cantidad,
        categoria: product 
          ? (formData as ProductoUpdateRequest).categoria 
          : (formData as ProductoRequest).categoria
      };
  
      const firmaActualizada = generateSignature(signatureData);
  
      // Preparar datos finales
      const datosEnvio = product
        ? {
            ...(formData as ProductoUpdateRequest),
            firma: firmaActualizada
          }
        : {
            ...(formData as ProductoRequest),
            firma: firmaActualizada
          };
  
      console.log('Datos finales a enviar:', datosEnvio);
  
      if (product) {
        await productApi.updateProduct(datosEnvio as ProductoUpdateRequest);
      } else {
        await productApi.createProduct(datosEnvio as ProductoRequest);
      }
      
      onSubmitSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error completo:', error.response?.data || error.message);
      setErrors({
        submit: error.response?.data?.mensaje || 'Error al guardar el producto'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {product ? 'Editar Producto' : 'Crear Nuevo Producto'}
      </DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2, display: 'grid', gap: 2 }}>
          {!product ? (
            <TextField
              name="nombre"
              label="Nombre del Producto"
              value={(formData as ProductoRequest).nombre || ''}
              onChange={handleChange}
              error={!!errors.nombre}
              helperText={errors.nombre}
              fullWidth
              margin="normal"
            />
          ) : (
            <TextField
              name="nuevoNombre"
              label="Nombre del Producto"
              value={(formData as ProductoUpdateRequest).nuevoNombre || ''}
              onChange={handleChange}
              error={!!errors.nuevoNombre}
              helperText={errors.nuevoNombre}
              fullWidth
              margin="normal"
            />
          )}

          <TextField
            name="descripcion"
            label="Descripción"
            value={isUpdateRequest(formData) ? formData.descripcion || '' : formData.descripcion || ''}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            margin="normal"
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              name="precio"
              label="Precio"
              type="number"
              value={isUpdateRequest(formData) ? formData.precio ?? 0 : formData.precio ?? 0}
              onChange={handleChange}
              error={!!errors.precio}
              helperText={errors.precio}
              fullWidth
              margin="normal"
              InputProps={{
                inputProps: { min: 0.01, step: 0.01 },
                startAdornment: '$'
              }}
            />

            <TextField
              name="cantidad"
              label="Cantidad en Stock"
              type="number"
              value={isUpdateRequest(formData) ? formData.cantidad ?? 0 : formData.cantidad ?? 0}
              onChange={handleChange}
              error={!!errors.cantidad}
              helperText={errors.cantidad}
              fullWidth
              margin="normal"
              inputProps={{ min: 0 }}
            />
          </Box>
          <TextField
  name="firma"
  label="Firma Digital"
  value={formData.firma || ''}
  InputProps={{
    readOnly: true
  }}
  fullWidth
  margin="normal"
  helperText="Firma generada automáticamente"
/>
          <FormControl fullWidth margin="normal" error={!!errors.categoria}>
            <InputLabel>Categoría</InputLabel>
            <Select
              name="categoria"
              value={isUpdateRequest(formData) ? formData.categoria || 'Otros' : formData.categoria || 'Otros'}
              onChange={handleChange}
              label="Categoría"
            >
              <MenuItem value="Electrónica">Electrónica</MenuItem>
              <MenuItem value="Ropa">Ropa</MenuItem>
              <MenuItem value="Alimentos">Alimentos</MenuItem>
              <MenuItem value="Hogar">Hogar</MenuItem>
              <MenuItem value="Otros">Otros</MenuItem>
            </Select>
            {errors.categoria && <FormHelperText>{errors.categoria}</FormHelperText>}
          </FormControl>

          {errors.submit && (
            <FormHelperText error sx={{ mt: 2 }}>
              {errors.submit}
            </FormHelperText>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary"
          disabled={isSubmitting}
          endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductForm;