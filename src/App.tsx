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

// Page Components
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import ProductsPage from './pages/ProductsPage';
import ProductForm from './components/products/ProductForm';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

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
            {/* Rutas públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
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
            <Route element={<ProtectedRoute allowedRoles={['ADMINISTRADOR', 'USUARIO_NORMAL']} />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<ProductsPage />} />
              </Route>
            </Route>
            
            {/* Rutas administrativas (solo para administradores) */}
            <Route element={<ProtectedRoute allowedRoles={['ADMINISTRADOR']} />}>
              <Route element={<Layout />}>
                <Route path="/admin" element={<AdminPanel />} />
                <Route 
                  path="/products/edit/:id" 
                  element={
                    <ProductForm 
                      open={true} 
                      onClose={() => window.history.back()} 
                      onSubmitSuccess={() => window.location.reload()}
                      product={null}
                    />
                  } 
                />
                <Route 
                  path="/products/new" 
                  element={
                    <ProductForm 
                      open={true} 
                      onClose={() => window.history.back()} 
                      onSubmitSuccess={() => window.location.reload()}
                      product={null}
                    />
                  } 
                />
              </Route>
            </Route>
            
            {/* Manejo de errores */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
};

export default App;