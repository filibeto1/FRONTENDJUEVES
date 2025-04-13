import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  CircularProgress, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { availableRoles } from '../../utils/roles';
import { api } from '../../api/authAPI';
import Grid from '@mui/material/Grid';
// Esquema de validación
const schema = yup.object().shape({
  username: yup.string().required('Nombre de usuario es requerido'),
  correo: yup.string().email('Email inválido').required('Email es requerido'),
  password: yup.string()
    .required('Contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Debe contener al menos una mayúscula, una minúscula y un número'
    ),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Las contraseñas deben coincidir')
    .required('Debes confirmar tu contraseña'),
  rol: yup.string().required('Rol es requerido')
});

interface RegisterFormData {
  username: string;
  correo: string;
  password: string;
  confirmPassword: string;
  rol: string;
}
interface ApiResponse {
  codigo: number;
  mensaje: string;
  data?: any;
}
const RegisterForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      correo: '',
      password: '',
      confirmPassword: '',
      rol: availableRoles[0]?.value || ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      setError('');
      
      const requestData = {
        username: data.username,
        password: data.password,
        correo: data.correo,
        rol: data.rol,
        estatus: true,
        doblePasoActivado: false,
        // La firma se añadirá automáticamente por el interceptor
      };
  
      console.log('Datos a enviar:', JSON.stringify(requestData, null, 2));
      
      const response = await api.post<ApiResponse>('/API/v1/ENCRYPT/usuarioServicio/crearUsuario', requestData);

      if (response.data.codigo === 0) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(response.data.mensaje || 'Error en el registro');
      }
    } catch (error: any) {
      console.error("Error completo:", error);
      if (error.response) {
        console.error("Respuesta del servidor:", error.response.data);
        setError(error.response.data?.mensaje || 'Error en los datos enviados');
      } else {
        setError('Error de conexión con el servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom align="center">
        Registro de Usuario
      </Typography>
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ¡Registro exitoso! Serás redirigido al login...
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <TextField
        margin="normal"
        fullWidth
        label="Nombre de usuario"
        autoComplete="username"
        {...register('username')}
        error={!!errors.username}
        helperText={errors.username?.message}
      />
      
      <TextField
        margin="normal"
        fullWidth
        label="Correo electrónico"
        autoComplete="email"
        {...register('correo')}
        error={!!errors.correo}
        helperText={errors.correo?.message}
      />
      
      <TextField
        margin="normal"
        fullWidth
        label="Contraseña"
        type="password"
        autoComplete="new-password"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      
      <TextField
        margin="normal"
        fullWidth
        label="Confirmar Contraseña"
        type="password"
        autoComplete="new-password"
        {...register('confirmPassword')}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Rol</InputLabel>
        <Select
          label="Rol"
          {...register('rol')}
          error={!!errors.rol}
          defaultValue={availableRoles[0]?.value || ''}
        >
          {availableRoles.map((role) => (
            <MenuItem key={role.value} value={role.value}>
              {role.label}
            </MenuItem>
          ))}
        </Select>
        {errors.rol && (
          <Typography variant="caption" color="error">
            {errors.rol.message}
          </Typography>
        )}
      </FormControl>
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Registrarse'}
      </Button>
    </Box>
  );
};

export default RegisterForm;