import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, Button, Typography } from '@mui/material';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Solo redirige si está autenticado y viene de un proceso de login
    if (isAuthenticated && document.referrer.includes('/login')) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Box sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h3" gutterBottom>
        Bienvenido a nuestra aplicación
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => navigate('/login')}
        sx={{ mr: 2 }}
      >
        Iniciar Sesión
      </Button>
      <Button 
        variant="outlined" 
        onClick={() => navigate('/register')}
      >
        Registrarse
      </Button>
    </Box>
  );
};

export default HomePage;