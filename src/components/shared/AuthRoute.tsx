import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress } from '@mui/material';

const LoadingSpinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
    <CircularProgress size={60} />
  </div>
);

const AuthRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Solo para depuración
  console.log('AuthRoute - estado actual:', {
    path: location.pathname,
    isAuthenticated,
    loading
  });

  if (loading) return <LoadingSpinner />;

  // Redirigir solo si está autenticado Y está intentando acceder a rutas de auth
  if (isAuthenticated && ['/login', '/register'].includes(location.pathname)) {
    console.log('Redirigiendo a dashboard desde:', location.pathname);
    return <Navigate to="/dashboard" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default AuthRoute;