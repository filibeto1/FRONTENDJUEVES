// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Link,
  Paper,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError('Por favor ingrese nombre de usuario y contraseña');
      return;
    }
  
    setLoading(true);
    setError('');
  
    try {
      const { requires2FA } = await login(username.trim(), password.trim());
      
      if (requires2FA) {
        navigate('/verify-2fa', { 
          state: { 
            username: username.trim(),
            redirectTo: '/dashboard'
          }
        });
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        p: 2
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 450,
          borderRadius: 2
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          textAlign="center"
          sx={{ 
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 3
          }}
        >
          Iniciar Sesión
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Nombre de Usuario"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              error={!!error}
              inputProps={{
                'data-testid': 'username-input'
              }}
            />

            <TextField
              fullWidth
              label="Contraseña"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type={showPassword ? 'text' : 'password'}
              disabled={loading}
              error={!!error}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Box textAlign="right">
              <Link 
                component="button"
                variant="body2"
                onClick={() => navigate('/forgot-password')}
                sx={{ textDecoration: 'none' }}
                disabled={loading}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 1,
                fontSize: '1rem',
                textTransform: 'uppercase'
              }}
              data-testid="login-button"
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'INICIAR SESIÓN'
              )}
            </Button>

            <Divider sx={{ my: 2 }}>o</Divider>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/register')}
              sx={{
                textTransform: 'none',
                fontWeight: 'normal'
              }}
              disabled={loading}
            >
              ¿No tienes cuenta? Regístrate
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginForm;