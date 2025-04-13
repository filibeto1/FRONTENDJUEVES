import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedAdminRoute: React.FC = () => {
  const { user } = useAuth();
  
  // Solución: Verificación más robusta de roles
  const isAdmin = user?.role === 'superadmin' || user?.role === 'admin';
  
  if (!isAdmin) {
    // Solución: Redirección con estado para evitar montajes innecesarios
    return <Navigate to="/dashboard" replace state={{ from: 'admin-route' }} />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;