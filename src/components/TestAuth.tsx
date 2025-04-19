import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const TestAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  const handleAdminLogin = async () => {
    try {
      await login('admin', 'password'); // Asegúrate que el backend devuelva rol 'ADMINISTRADOR'
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleUserLogin = async () => {
    try {
      await login('usuario', 'password'); // Usa credenciales válidas
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h2>Prueba de Autenticación</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleAdminLogin} style={{ marginRight: '10px' }}>
          Login como Admin
        </button>
        <button onClick={handleUserLogin} style={{ marginRight: '10px' }}>
          Login como Usuario
        </button>
        <button onClick={logout}>Logout</button>
      </div>

      <div>
        <h3>Estado Actual:</h3>
        <p>Autenticado: {isAuthenticated ? 'Sí' : 'No'}</p>
        {user && (
          <>
            <p>Usuario: {user.username}</p>
            <p>Rol: {user.role}</p>
            <p>ID: {user.userId}</p>
          </>
        )}
      </div>

      {user && (user.role === 'ADMINISTRADOR') && (
  <div style={{ marginTop: '20px', padding: '10px', background: '#e6f7ff' }}>
    <h3>Panel de Administrador (solo visible para admins)</h3>
    <p>Este contenido solo debería verse si eres administrador</p>
  </div>
)}
    </div>
  );
};

export default TestAuth;