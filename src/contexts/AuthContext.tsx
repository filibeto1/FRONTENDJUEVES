// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
import { api } from '../api/authAPI';

// Importa TODAS las interfaces necesarias desde authTypes.ts
import type {
  UserData,
  JwtPayload,
  LoginResponse,
  ApiLoginResponse,
  Api2FAResponse,
  UserRole
} from '../types/authTypes';

// Solo declara interfaces únicas que no estén en authTypes.ts
interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  loading: boolean;
  requires2FA: boolean;
  tempToken: string;
  login: (username: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  verify2FA: (token: string) => Promise<void>;
  setUserData: (data: Partial<UserData>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState('');

  // Función para crear UserData desde token mínimo
  const createUserFromToken = (token: string, username?: string): UserData => {
    
    const decoded = jwtDecode<JwtPayload>(token);
    console.log('[DEBUG] Token decodificado:', decoded);
    const role = decoded.role as UserRole || 'USER'; // Valor por defecto 'USER'
    return {
      userId: decoded.sub || `temp-${Math.random().toString(36).substring(2, 9)}`,
      username: username || decoded.sub?.split('@')[0] || 'Usuario',
      email: '',
      role: role
    };
  };

  // Inicializar autenticación al cargar
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const userData = createUserFromToken(token);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error decodificando token:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Función de login mejorada
  const login = async (username: string, password: string): Promise<LoginResponse> => {
    try {
      setLoading(true);
      setRequires2FA(false);
      
      if (!username.trim() || !password.trim()) {
        throw new Error('Nombre de usuario y contraseña son requeridos');
      }

      const response = await api.post<ApiLoginResponse>('/API/v1/ENCRYPT/usuarioServicio/login', {
        username: username.trim(),
        password: password.trim()
      });

      console.log('[DEBUG] Respuesta del servidor:', {
        status: response.status,
        data: {
          codigo: response.data.codigo,
          mensaje: response.data.mensaje,
          token: response.data.token ? '***REDACTED***' : null,
          requiereOtp: response.data.requiereOtp || false,
          tempToken: response.data.tempToken ? '***REDACTED***' : null
        }
      });

      if (response.data.codigo !== 0) {
        throw new Error(response.data.mensaje || 'Error en la autenticación');
      }

      if (response.data.token) {
        console.log('Token recibido:', response.data.token); // ← Agrega esto
        const decoded = jwtDecode(response.data.token);
        console.log('Token decodificado:', decoded); // ← Agrega esto
  
        try {
          const userData = createUserFromToken(response.data.token, username.trim());
          setUser(userData);
          localStorage.setItem('token', response.data.token);
          setIsAuthenticated(true);
          return { success: true, requires2FA: false };
        } catch (decodeError) {
          console.error('Error decodificando token:', decodeError);
          throw new Error('Error procesando credenciales');
        }
      }

      if (response.data.requiereOtp) {
        const otpToken = response.data.tempToken;
        if (!otpToken) {
          throw new Error('Se requiere 2FA pero no se proporcionó token temporal');
        }

        setTempToken(otpToken);
        setRequires2FA(true);
        return { 
          success: true, 
          requires2FA: true,
          tempToken: otpToken
        };
      }

      throw new Error('Respuesta inesperada del servidor');
    } catch (error) {
      console.error('[ERROR] Detalles del error en login:', {
        error: error instanceof Error ? error.message : 'Error desconocido',
        request: {
          endpoint: '/API/v1/ENCRYPT/usuarioServicio/login',
          username: username.trim()
        }
      });
      
      logout();
      throw error instanceof Error ? error : new Error('Error en el proceso de autenticación');
    } finally {
      setLoading(false);
    }
  };


 
  const verify2FA = async (token: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.post<Api2FAResponse>('/verify-2fa', { token, tempToken });
      
      localStorage.setItem('token', response.data.token);
      const decoded = jwtDecode<UserData>(response.data.token);
      setUser(decoded);
      setIsAuthenticated(true);
      setRequires2FA(false);
      setTempToken('');
    } catch (error) {
      console.error('2FA verification error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setRequires2FA(false);
    setTempToken('');
  };

  const setUserData = (data: Partial<UserData>): void => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  const contextValue = useMemo(() => ({
    user,
    isAuthenticated,
    loading,
    requires2FA,
    tempToken,
    login,
    logout,
    verify2FA,
    setUserData
  }), [user, isAuthenticated, loading, requires2FA, tempToken]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };