import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/toastStyles.css';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';

// Layout Components
import Layout from './components/Layout';
import ProtectedRoute from './components/shared/ProtectedRoute';
import AuthRoute from './components/shared/AuthRoute';
import ProtectedAdminRoute from './components/shared/ProtectedAdminRoute';

// Page Components
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import ProductsPage from './pages/ProductsPage';

// Auth Components
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import TwoFactorAuth from './components/auth/TwoFactorAuth';
import ForgotUsername from './components/auth/ForgotUsername';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';

// Error Boundary
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Error global:', error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
            theme="light"
            toastStyle={{
              fontSize: '14px',
              margin: '8px 0',
              padding: '12px'
            }}
          />
        
          <Routes>
            <Route path="/" element={<HomePage />} />
            
            {/* Rutas de autenticación (solo para usuarios NO logueados) */}
            <Route element={<AuthRoute />}>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/verify-2fa" element={<TwoFactorAuth />} />
              <Route path="/forgot-username" element={<ForgotUsername />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Route>
            
            {/* Rutas protegidas (solo para usuarios logueados) */}
{/* Rutas protegidas (solo para usuarios logueados) */}
<Route element={<ProtectedRoute />}>
  <Route element={<Layout />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/products" element={<ProductsPage />} />
    {/* Accesible para todos los usuarios logueados */}
    <Route path="/admin" element={<AdminPanel />} />
  </Route>
</Route>
            
            {/* Ruta comodín para redireccionar */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
};

export default App;