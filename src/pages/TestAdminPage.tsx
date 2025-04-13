// src/pages/TestAdminPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const TestAdminPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div>
        <h2>Acceso denegado</h2>
        <p>Debes iniciar sesión como administrador</p>
        <button onClick={() => navigate('/login')}>Ir a Login</button>
      </div>
    );
  }

  if (user?.role !== 'admin' && user?.role !== 'superadmin') {
    return (
      <div>
        <h2>Acceso restringido</h2>
        <p>Solo disponible para administradores</p>
        <p>Tu rol actual es: {user?.role}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Panel de Administración</h2>
      <p>Bienvenido {user.username} (Rol: {user.role})</p>
      <div>
        <h3>Esta es una página simulada del CRUD de productos</h3>
        <p>Si puedes ver esto, el control por roles funciona correctamente.</p>
      </div>
    </div>
  );
};

export default TestAdminPage;