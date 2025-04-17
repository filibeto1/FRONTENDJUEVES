import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  CircularProgress as MuiCircularProgress,
  Checkbox,
  FormControlLabel,
  Paper,
  Link
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import saxImage from './sax.jpg';

interface LoginFormData {
  username: string;
  password: string;
  remember: boolean;
}

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (showProgress && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 2, 100));
      }, 50);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showProgress, progress]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setError('');
      setShowProgress(true);
      setProgress(0);

      const result = await login(data.username, data.password);
      
      if (result.success) {
        // Esperar a que complete la animación
        setTimeout(() => {
          const from = location.state?.from?.pathname || '/dashboard';
          navigate(from, { replace: true });
        }, 2500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      setShowProgress(false);
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
        backgroundImage: `url(${saxImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {!showProgress ? (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(5px)',
            borderRadius: 2,
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom 
            align="center"
            sx={{ fontWeight: 'bold', mb: 3, color: '#000000' }}
          >
            Login
          </Typography>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Box 
            component="form" 
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 1 }}
          >
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              variant="outlined"
              {...register('username', { required: 'Username is required' })}
              error={!!errors.username}
              helperText={errors.username?.message}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#000000' },
                  '&:hover fieldset': { borderColor: '#000000' },
                  '&.Mui-focused fieldset': { borderColor: '#000000' }
                },
                '& .MuiInputLabel-root': { 
                  color: '#000000',
                  '&.Mui-focused': { color: '#000000' }
                },
                '& .MuiInputBase-input': {
                  caretColor: '#000000'
                }
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              variant="outlined"
              {...register('password', { required: 'Password is required' })}
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#000000' },
                  '&:hover fieldset': { borderColor: '#000000' },
                  '&.Mui-focused fieldset': { borderColor: '#000000' }
                },
                '& .MuiInputLabel-root': { 
                  color: '#000000',
                  '&.Mui-focused': { color: '#000000' }
                },
                '& .MuiInputBase-input': {
                  caretColor: '#000000'
                }
              }}
            />

<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
  <FormControlLabel
    control={
      <Checkbox 
        {...register('remember')} 
        sx={{ 
          color: '#000000',
          '&.Mui-checked': { color: '#000000' }
        }}
      />
    }
    label="Remember me"
    sx={{ 
      color: '#000000',
      '& .MuiTypography-root': { color: '#000000' }
    }}
  />
  <Link 
    component="button"
    variant="body2"
    onClick={(e) => {
      e.preventDefault();
      navigate('/forgot-password');
    }}
    sx={{ color: '#000000' }}
  >
    Forgot Password?
  </Link>
</Box>


            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.5,
                backgroundColor: '#000000',
                '&:hover': { backgroundColor: '#000000' },
                color: '#ffffff'
              }}
              disabled={loading}
            >
              {loading ? 'Iniciando...' : 'Login'}
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 2, color: '#000000' }}>
  Don't have an account?{' '}
  <Link 
    component="button"
    variant="body2"
    onClick={(e) => {
      e.preventDefault();
      navigate('/register');
    }}
    sx={{ fontWeight: 'bold', color: '#000000' }}
  >
    Register
  </Link>
</Typography>
          </Box>
        </Paper>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: 200,
            height: 200,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(5px)',
            borderRadius: '50%',
            boxShadow: 3
          }}
        >
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <MuiCircularProgress
              variant="determinate"
              value={progress}
              size={120}
              thickness={4}
              sx={{
                color: '#000000',
                '& circle': {
                  strokeLinecap: 'round',
                },
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}
            >
              <Typography
                variant="caption"
                component="div"
                color="text.primary"
                sx={{ fontSize: '1rem', fontWeight: 'bold' }}
              >
                {progress}%
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: '0.75rem', mt: 1 }}
              >
                Iniciando sesión
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default LoginForm;