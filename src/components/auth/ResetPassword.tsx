import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import { api } from '../../api/authAPI'; 

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = () => {
  const { token } = useParams();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordFormData>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setLoading(true);
      setError('');
      await api.post('/auth/reset-password', { 
        token, 
        newPassword: data.password 
      });
      setMessage('Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError('El enlace es inválido o ha expirado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Restablecer Contraseña
      </Typography>
      <TextField
        fullWidth
        label="Nueva Contraseña"
        type="password"
        margin="normal"
        {...register('password', { 
          required: 'Contraseña es requerida',
          minLength: {
            value: 8,
            message: 'La contraseña debe tener al menos 8 caracteres'
          }
        })}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <TextField
        fullWidth
        label="Confirmar Contraseña"
        type="password"
        margin="normal"
        {...register('confirmPassword', { 
          required: 'Por favor confirma tu contraseña',
          validate: (value) => 
            value === watch('password') || 'Las contraseñas no coinciden'
        })}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />
      {message && (
        <Typography color="success.main" sx={{ mt: 1 }}>
          {message}
        </Typography>
      )}
      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Restablecer Contraseña'}
      </Button>
    </Box>
  );
};

export default ResetPassword;