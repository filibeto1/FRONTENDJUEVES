import React, { useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { availableRoles } from '../../utils/roles';
import axios from 'axios';

// Configuración de axios
const api = axios.create({
  baseURL: 'http://localhost:8035',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interface para la respuesta de la API
interface ApiResponse {
  codigo: number;
  status?: string;
  mensaje: string;
  data?: any;
}

// Esquema de validación para el formulario principal
const registerSchema = yup.object().shape({
  username: yup.string().required('Nombre de usuario es requerido'),
  email: yup.string().email('Email inválido').required('Email es requerido'),
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

// Esquema de validación para la verificación
const verificationSchema = yup.object().shape({
  verificationCode: yup.string().required('Código de verificación es requerido')
});

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  rol: string;
}

interface VerificationData {
  verificationCode: string;
}

const RegisterForm: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue, 
    watch,
    reset
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema)
  });

  const { 
    register: registerVerification, 
    handleSubmit: handleSubmitVerification, 
    formState: { errors: verificationErrors },
    reset: resetVerification
  } = useForm<VerificationData>({
    resolver: yupResolver(verificationSchema)
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [tempFormData, setTempFormData] = useState<RegisterFormData>();
  const navigate = useNavigate();
  const onSubmitRegister: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      setLoading(true);
      setError('');
      
      // Verificar primero si el correo ya existe
      const checkEmailResponse = await api.get(
        `/API/v1/ENCRYPT/usuarioServicio/checkEmail`,
        {
          params: { correo: data.email },
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
  
      if (checkEmailResponse.data.codigo !== 0) {
        throw new Error(checkEmailResponse.data.mensaje || 'El correo ya está registrado');
      }
  
      // Enviar código de verificación
      const response = await api.post<ApiResponse>(
        '/API/v1/ENCRYPT/usuarioServicio/sendVerificationCode',
        { correo: data.email },
        {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
  
      if (response.data.codigo === 0) {
        setTempFormData(data);
        setVerificationDialogOpen(true);
      } else {
        throw new Error(response.data.mensaje || 'Error al enviar código');
      }
      
    } catch (error: any) {
      console.error('Error en registro:', error);
      setError(
        error.response?.data?.mensaje || 
        error.message || 
        'Error al enviar código de verificación'
      );
    } finally {
      setLoading(false);
    }
  };
  
  const onSubmitVerification: SubmitHandler<VerificationData> = async (data) => {
    try {
      setLoading(true);
      setError('');
      
      if (!tempFormData) {
        throw new Error('Datos de registro no encontrados');
      }
  
      const verifyResponse = await api.post<ApiResponse>(
        '/API/v1/ENCRYPT/usuarioServicio/verifyCode',
        {
          correo: tempFormData.email,
          codigo: data.verificationCode // Asegúrate que coincide con el backend
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (verifyResponse.data.codigo !== 0) {
        throw new Error(verifyResponse.data.mensaje || 'Código inválido');
      }
  
      // Procede con el registro
      const registerResponse = await api.post<ApiResponse>(
        '/API/v1/ENCRYPT/usuarioServicio/crearUsuario',
        {
          username: tempFormData.username,
          password: tempFormData.password,
          correo: tempFormData.email,
          rol: tempFormData.rol
        }
      );
  
      if (registerResponse.data.codigo === 0) {
        setSuccess(true);
        setVerificationDialogOpen(false);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        throw new Error(registerResponse.data.mensaje || 'Error en el registro');
      }
      
    } catch (error: any) {
      console.error("Error en verificación:", error);
      setError(error.response?.data?.mensaje || error.message || 'Error al verificar el código');
      
      // Opcional: Reenviar código automáticamente si expiró
      if (error.message.includes('expirado') && tempFormData) {
        setError('Código expirado. Se ha enviado un nuevo código.');
        await api.post('/API/v1/ENCRYPT/usuarioServicio/sendVerificationCode', {
          correo: tempFormData.email
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      component="form" 
      ref={formRef}
      onSubmit={handleSubmit(onSubmitRegister)} 
      sx={{ 
        mt: 1, 
        maxWidth: 500, 
        mx: 'auto',
        p: 3,
        boxShadow: 3,
        borderRadius: 2
      }}
    >
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3 }}>
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

      {/* Formulario principal de registro */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          margin="normal"
          fullWidth
          label="Nombre de usuario"
          autoComplete="username"
          {...register('username')}
          error={!!errors.username}
          helperText={errors.username?.message}
          disabled={loading}
        />
        
        <TextField
          margin="normal"
          fullWidth
          label="Correo electrónico"
          autoComplete="email"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          disabled={loading}
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
          disabled={loading}
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
          disabled={loading}
        />
        
        <FormControl fullWidth margin="normal" error={!!errors.rol}>
          <InputLabel>Rol</InputLabel>
          <Select
            label="Rol"
            {...register('rol')}
            defaultValue={availableRoles[0]?.value || ''}
            disabled={loading}
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
          sx={{ mt: 3, mb: 2, py: 1.5 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Registrarse'}
        </Button>
      </Box>

      {/* Diálogo de verificación (aparece después de enviar el formulario) */}
      <Dialog open={verificationDialogOpen} onClose={() => setVerificationDialogOpen(false)}>
  <DialogTitle>Verificación de Correo</DialogTitle>
  <DialogContent>
    <Typography sx={{ mb: 2 }}>
      Hemos enviado un código a {tempFormData?.email}. Ingresa el código recibido:
    </Typography>
    
    {error && (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )}
    
    <TextField
      autoFocus
      margin="dense"
      label="Código de verificación"
      fullWidth
      variant="outlined"
      {...registerVerification('verificationCode')}
      error={!!verificationErrors.verificationCode}
      helperText={verificationErrors.verificationCode?.message}
      disabled={loading}
    />
  </DialogContent>
  <DialogActions>
    <Button 
      onClick={() => {
        setVerificationDialogOpen(false);
        setError('');
      }}
      disabled={loading}
    >
      Cancelar
    </Button>
    <Button 
      onClick={handleSubmitVerification(onSubmitVerification)} 
      disabled={loading}
      variant="contained"
    >
      {loading ? <CircularProgress size={24} /> : 'Verificar'}
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
};

export default RegisterForm;