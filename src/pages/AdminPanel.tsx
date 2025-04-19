import React from 'react';
import { 
  Typography, 
  Box, 
  Alert, 
  Paper, 
  Button,
  Grid 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AdminPanelProps {}

const AdminPanel: React.FC<AdminPanelProps> = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">No se pudo cargar la información del usuario</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Administración
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Bienvenido, {user.username}. Esta área es solo para administradores.
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Información del Usuario
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Nombre:</strong> {user.username}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Rol:</strong> {user.role}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Acciones Rápidas
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button 
                variant="contained" 
                onClick={() => navigate('/admin/users')}
              >
                Gestionar Usuarios
              </Button>
              <Button 
                variant="contained" 
                onClick={() => navigate('/products/new')}
              >
                Crear Nuevo Producto
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/dashboard')}
              >
                Volver al Dashboard
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminPanel;