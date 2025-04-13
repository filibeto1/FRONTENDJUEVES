import React, { useEffect, useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container, 
  Paper,
  CircularProgress 
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ProductList from '../components/products/ProductList';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [componentMounted, setComponentMounted] = useState(false);
  const navigate = useNavigate();

  // Efecto para controlar el montaje/desmontaje
  useEffect(() => {
    setComponentMounted(true);
    return () => setComponentMounted(false);
  }, []);

  // Efecto para redirección si no está autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Efecto para mostrar toast de bienvenida
  useEffect(() => {
    if (componentMounted && isAuthenticated && user) {
      const timer = setTimeout(() => {
        if (componentMounted) {
          toast.info(
            <div style={{ padding: '8px' }}>
              <h3 style={{ fontWeight: 'bold', marginBottom: '4px' }}>¡Bienvenido!</h3>
              <p>Usuario: {user.username}</p>
              <p>Rol: {user.role}</p>
            </div>,
            {
              toastId: 'welcome-toast',
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "colored"
            }
          );
        }
      }, 500);

      return () => {
        clearTimeout(timer);
        if (componentMounted) {
          toast.dismiss('welcome-toast');
        }
      };
    }
  }, [componentMounted, isAuthenticated, user]);

  const handleLogout = () => {
    toast.dismiss();
    logout();
    setTimeout(() => navigate('/login'), 150);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={4}
        sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          py: 1
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ 
            flexGrow: 1,
            fontWeight: 'bold',
            fontSize: '1.25rem'
          }}>
            Bienvenido al Dashboard
          </Typography>
          
          <Button 
            variant="contained"
            onClick={handleLogout}
            sx={{
              backgroundColor: 'white',
              color: '#1976d2',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
              px: 3,
              py: 1,
              borderRadius: 2,
              boxShadow: 2
            }}
          >
            Cerrar sesión
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1 }}>
        <Box sx={{ p: 3 }}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Información de tu cuenta
            </Typography>
            <Typography>Usuario: {user?.username}</Typography>
            <Typography>Rol: {user?.role}</Typography>
          </Paper>

          {isAdmin ? (
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Administración de Productos
              </Typography>
              <ProductList />
            </Paper>
          ) : (
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary">
                No tienes permisos para acceder a esta sección
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Contacta al administrador si necesitas acceso
              </Typography>
            </Paper>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;