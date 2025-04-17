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
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { Producto, ProductoRequest, ProductoUpdateRequest } from '../../types/productTypes';
import productApi from '../../api/productApi';
import { generateSignature } from '../../services/signatureService';
import { SelectChangeEvent } from '@mui/material';

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
  product: Producto | null;
}

const musicCategories = [
  'Instrumentos de cuerda',
  'Instrumentos de viento',
  'Instrumentos de percusión',
  'Instrumentos electrónicos'
] as const;

type MusicCategory = typeof musicCategories[number];

interface ProductoRequestWithCategory extends Omit<ProductoRequest, 'categoria'> {
  categoria: MusicCategory;
}

interface ProductoUpdateRequestWithCategory extends Omit<ProductoUpdateRequest, 'categoria'> {
  categoria: MusicCategory;
}

type ProductFormState = 
  | ({ mode: 'create' } & ProductoRequestWithCategory)
  | ({ mode: 'update' } & ProductoUpdateRequestWithCategory);

const ProductForm: React.FC<ProductFormProps> = ({ open, onClose, onSubmitSuccess, product }) => {
  const [formData, setFormData] = useState<ProductFormState>({
    mode: 'create',
    nombre: '',
    descripcion: '',
    precio: 0,
    cantidad: 0,
    categoria: 'Instrumentos de cuerda',
    firma: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (product) {
        const initialData: ProductFormState = {
          mode: 'update',
          nombreOriginal: product.nombre || '',
          nuevoNombre: product.nombre || '',
          descripcion: product.descripcion || '',
          precio: typeof product.precio === 'string' ? 
                 parseFloat(product.precio) || 0 : 
                 product.precio || 0,
          cantidad: typeof product.cantidad === 'string' ? 
                   parseInt(product.cantidad) || 0 : 
                   product.cantidad || 0,
          categoria: (product.categoria as MusicCategory) || 'Instrumentos de cuerda',
          firma: generateSignature({
            nombreOriginal: product.nombre || '',
            nuevoNombre: product.nombre || '',
            descripcion: product.descripcion || '',
            precio: typeof product.precio === 'string' ? 
                   parseFloat(product.precio) || 0 : 
                   product.precio || 0,
            cantidad: typeof product.cantidad === 'string' ? 
                     parseInt(product.cantidad) || 0 : 
                     product.cantidad || 0,
            categoria: product.categoria || 'Instrumentos de cuerda'
          })
        };
        setFormData(initialData);
      } else {
        const initialData: ProductFormState = {
          mode: 'create',
          nombre: '',
          descripcion: '',
          precio: 0,
          cantidad: 0,
          categoria: 'Instrumentos de cuerda',
          firma: generateSignature({
            nombre: '',
            descripcion: '',
            precio: 0,
            cantidad: 0,
            categoria: 'Instrumentos de cuerda'
          })
        };
        setFormData(initialData);
      }
      setErrors({});
    }
  }, [open, product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<MusicCategory>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const updatedData = {
        ...prev,
        [name]: name === 'precio' || name === 'cantidad' ? Number(value) : value
      };
      
      if (name === 'categoria') {
        (updatedData as any).categoria = value as MusicCategory;
      }
      
      const signatureData = prev.mode === 'update'
        ? {
            nombreOriginal: (updatedData as ProductoUpdateRequestWithCategory).nombreOriginal,
            nuevoNombre: (updatedData as ProductoUpdateRequestWithCategory).nuevoNombre,
            descripcion: (updatedData as ProductoUpdateRequestWithCategory).descripcion || '',
            precio: Number((updatedData as ProductoUpdateRequestWithCategory).precio) || 0,
            cantidad: Number((updatedData as ProductoUpdateRequestWithCategory).cantidad) || 0,
            categoria: (updatedData as ProductoUpdateRequestWithCategory).categoria || 'Instrumentos de cuerda'
          }
        : {
            nombre: (updatedData as ProductoRequestWithCategory).nombre,
            descripcion: (updatedData as ProductoRequestWithCategory).descripcion || '',
            precio: Number((updatedData as ProductoRequestWithCategory).precio) || 0,
            cantidad: Number((updatedData as ProductoRequestWithCategory).cantidad) || 0,
            categoria: (updatedData as ProductoRequestWithCategory).categoria || 'Instrumentos de cuerda'
          };
      
      return {
        ...updatedData,
        firma: generateSignature(signatureData)
      } as ProductFormState;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setErrors({});
  
      const newErrors: Record<string, string> = {};
      if (formData.mode === 'create' && !(formData as ProductoRequestWithCategory).nombre?.trim()) {
        newErrors.nombre = 'El nombre es requerido';
      }
      if (formData.mode === 'update' && !(formData as ProductoUpdateRequestWithCategory).nuevoNombre?.trim()) {
        newErrors.nuevoNombre = 'El nombre es requerido';
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsSubmitting(false);
        return;
      }
  
      let productId = product?.id_product;
      try {
        if (formData.mode === 'update') {
          const updateData = {
            nombreOriginal: (formData as ProductoUpdateRequestWithCategory).nombreOriginal,
            nuevoNombre: (formData as ProductoUpdateRequestWithCategory).nuevoNombre,
            descripcion: (formData as ProductoUpdateRequestWithCategory).descripcion,
            precio: (formData as ProductoUpdateRequestWithCategory).precio,
            cantidad: (formData as ProductoUpdateRequestWithCategory).cantidad,
            categoria: (formData as ProductoUpdateRequestWithCategory).categoria,
            firma: (formData as ProductoUpdateRequestWithCategory).firma
          };
          const response = await productApi.updateProduct(updateData);
          productId = response.data.data?.id_product || product?.id_product;
        } else {
          const createData = {
            nombre: (formData as ProductoRequestWithCategory).nombre,
            descripcion: (formData as ProductoRequestWithCategory).descripcion,
            precio: (formData as ProductoRequestWithCategory).precio,
            cantidad: (formData as ProductoRequestWithCategory).cantidad,
            categoria: (formData as ProductoRequestWithCategory).categoria,
            firma: (formData as ProductoRequestWithCategory).firma
          };
          const response = await productApi.createProduct(createData);
          productId = response.data.data?.id_product;
        }
      } catch (error) {
        console.error('Error al guardar producto:', error);
        setErrors({ submit: 'Error al guardar los datos del producto' });
        return;
      }
  
      onSubmitSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error general:', error);
      setErrors({ submit: error.response?.data?.mensaje || 'Error inesperado al procesar la solicitud' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{product ? 'Editar Producto' : 'Crear Nuevo Producto'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            {formData.mode === 'create' ? (
              <TextField
                name="nombre"
                label="Nombre del producto"
                value={formData.nombre}
                onChange={handleChange}
                error={!!errors.nombre}
                helperText={errors.nombre}
                fullWidth
                margin="normal"
              />
            ) : (
              <TextField
                name="nuevoNombre"
                label="Nombre del producto"
                value={(formData as ProductoUpdateRequestWithCategory).nuevoNombre}
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
              value={formData.descripcion}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
              margin="normal"
            />

            <Box display="flex" gap={2}>
              <TextField
                name="precio"
                label="Precio"
                type="number"
                value={formData.precio}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{
                  inputProps: { min: 0, step: 0.01 }
                }}
              />

              <TextField
                name="cantidad"
                label="Cantidad en stock"
                type="number"
                value={formData.cantidad}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Box>

            <FormControl fullWidth margin="normal">
              <InputLabel>Categoría</InputLabel>
              <Select
                name="categoria"
                value={formData.categoria}
                label="Categoría"
                onChange={handleChange}
              >
                {musicCategories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {errors.submit && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.submit}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            color="primary" 
            variant="contained" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} />
            ) : product ? (
              'Actualizar Producto'
            ) : (
              'Crear Producto'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductForm;