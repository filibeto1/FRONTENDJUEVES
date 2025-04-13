// src/pages/AdminPanel.tsx
import React from 'react';
import { Typography, Box, Alert, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();

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
        Esta área es solo para usuarios con privilegios de administración
      </Alert>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Información del Usuario
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Nombre de usuario:</strong> {user.username}
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Email:</strong> {user.email}
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Rol:</strong> <span style={{ textTransform: 'capitalize' }}>{user.role}</span>
        </Typography>
      </Paper>

      {user.role === 'admin' && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Herramientas de Administración
          </Typography>
          {/* Aquí puedes agregar componentes específicos para administradores */}
        </Paper>
      )}
    </Box>
  );
};

export default AdminPanel;