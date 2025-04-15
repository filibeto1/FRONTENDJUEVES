import React, { useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container, 
  Paper,
  CircularProgress,
  useTheme
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProductList from '../components/products/ProductList';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (authLoading) {
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

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default
    }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Gestión
          </Typography>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            {user?.username}
          </Typography>
          <Button 
            color="inherit"
            onClick={handleLogout}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Cerrar sesión
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ 
        mt: 4, 
        flexGrow: 1,
        mb: 4
      }}>
        <Paper elevation={0} sx={{ 
          p: 3, 
          mb: 4,
          backgroundColor: 'transparent'
        }}>
          <Typography variant="h4" gutterBottom>
            Panel de Control
          </Typography>
          <Typography variant="body1">
            Bienvenido al sistema de gestión de productos
          </Typography>
        </Paper>

        <Paper elevation={3} sx={{ 
          p: 3,
          borderRadius: 2
        }}>
          <ProductList />
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;