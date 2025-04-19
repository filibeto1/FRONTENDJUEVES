import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Card, 
  CardContent,
  Avatar,
  useTheme,
  Divider,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  ShoppingCart as ShoppingCartIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          Error: No se pudo cargar la información del usuario
        </Typography>
      </Box>
    );
  }

  const isAdmin = user.role === 'ADMINISTRADOR';

  const quickActions = [
    {
      title: 'Ver Productos',
      icon: <InventoryIcon fontSize="large" />,
      action: () => navigate('/products'),
      color: theme.palette.primary.main,
      available: true
    },
    {
      title: 'Mis Pedidos',
      icon: <ShoppingCartIcon fontSize="large" />,
      action: () => navigate('/orders'),
      color: theme.palette.secondary.main,
      available: true
    },
    {
      title: 'Panel Admin',
      icon: <SettingsIcon fontSize="large" />,
      action: () => navigate('/admin'),
      color: theme.palette.error.main,
      available: isAdmin
    },
    {
      title: 'Reportes',
      icon: <BarChartIcon fontSize="large" />,
      action: () => navigate('/reports'),
      color: theme.palette.success.main,
      available: isAdmin
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header con información del usuario */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4
      }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Bienvenido, {user.username}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {isAdmin ? 'Administrador del sistema' : 'Usuario registrado'}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ 
            bgcolor: isAdmin ? theme.palette.error.main : theme.palette.primary.main,
            width: 56, 
            height: 56 
          }}>
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
          <Button 
            variant="outlined" 
            onClick={logout}
            sx={{ height: 'fit-content' }}
          >
            Cerrar sesión
          </Button>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Acciones rápidas */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Acciones Rápidas
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickActions.filter(action => action.available).map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: theme.shadows[6]
                }
              }}
              onClick={action.action}
            >
              <CardContent sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                textAlign: 'center',
                p: 3
              }}>
                <Box sx={{ 
                  color: action.color,
                  mb: 2
                }}>
                  {action.icon}
                </Box>
                <Typography variant="h6" component="div">
                  {action.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Estadísticas (solo para admin) */}
      {isAdmin && (
        <>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Estadísticas del Sistema
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Usuarios Registrados</Typography>
                </Box>
                <Typography variant="h4" align="center">
                  24
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <InventoryIcon color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Productos Activos</Typography>
                </Box>
                <Typography variant="h4" align="center">
                  156
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ShoppingCartIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">Pedidos Hoy</Typography>
                </Box>
                <Typography variant="h4" align="center">
                  18
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {/* Últimas actividades */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 3 }}>
        Actividad Reciente
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="textSecondary">
          {isAdmin 
            ? 'Aquí aparecerán los últimos eventos importantes del sistema'
            : 'Aquí aparecerán tus últimas actividades'}
        </Typography>
      </Paper>
    </Box>
  );
};

export default Dashboard;