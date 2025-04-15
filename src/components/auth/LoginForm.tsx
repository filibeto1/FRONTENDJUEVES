import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormData {
  username: string;
  password: string;
}

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setError('');
      
      const result = await login(data.username, data.password);
      
      if (result.success) {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit(onSubmit)} 
      sx={{ 
        mt: 1, 
        maxWidth: 400, 
        mx: 'auto',
        p: 3,
        boxShadow: 3,
        borderRadius: 2
      }}
    >
      <Typography variant="h4" gutterBottom align="center">
        Iniciar Sesión
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <TextField
        fullWidth
        label="Nombre de usuario"
        margin="normal"
        {...register('username', { required: 'Usuario es requerido' })}
        error={!!errors.username}
        helperText={errors.username?.message}
        disabled={loading}
      />

      <TextField
        fullWidth
        label="Contraseña"
        type="password"
        margin="normal"
        {...register('password', { required: 'Contraseña es requerida' })}
        error={!!errors.password}
        helperText={errors.password?.message}
        disabled={loading}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Iniciar Sesión'}
      </Button>

      <Button
        fullWidth
        variant="text"
        onClick={() => navigate('/register')}
        sx={{ mt: 1 }}
      >
        ¿No tienes cuenta? Regístrate
      </Button>
    </Box>
  );
};

export default LoginForm;