import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';

const TwoFactorAuth: React.FC = () => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { verify2FA } = useAuth();
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      setLoading(true);
      setError('');
      await verify2FA(token);
      navigate('/dashboard');
    } catch (err) {
      setError('Código inválido o expirado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Verificación en Dos Pasos
      </Typography>
      <Typography variant="body1" gutterBottom>
        Por favor ingresa el código de 6 dígitos de Google Authenticator
      </Typography>
      <TextField
        fullWidth
        label="Código de Verificación"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        margin="normal"
      />
      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      <Button
        fullWidth
        variant="contained"
        onClick={handleVerify}
        disabled={loading || token.length !== 6}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Verificar'}
      </Button>
    </Box>
  );
};

export default TwoFactorAuth;