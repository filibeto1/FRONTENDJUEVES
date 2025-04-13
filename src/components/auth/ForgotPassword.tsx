import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import { api } from '../../api/authAPI'; 
import { useNavigate } from 'react-router-dom';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      setError('');
      await api.post('/auth/forgot-password', data);
      setMessage('Si el email existe en nuestro sistema, te hemos enviado un enlace para restablecer tu contraseña.');
    } catch (err) {
      setError('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Recuperar Contraseña
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
        Ingresa tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
      </Typography>
      <TextField
        fullWidth
        label="Correo Electrónico"
        autoComplete="email"
        {...register('email', { 
          required: 'Email es requerido',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Email inválido'
          }
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
        margin="normal"
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
        {loading ? <CircularProgress size={24} /> : 'Enviar'}
      </Button>
      <Button fullWidth onClick={() => navigate('/login')}>
        Volver al Login
      </Button>
    </Box>
  );
};

export default ForgotPassword;