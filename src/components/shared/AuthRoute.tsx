import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AuthRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Solo redirige al dashboard si el usuario está autenticado Y viene específicamente del login
  if (isAuthenticated && location.state?.from === '/login') {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Permite mostrar las rutas de autenticación en todos los otros casos
  return <Outlet />;
};

export default AuthRoute;