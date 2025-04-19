import { 
  createContext, 
  useContext, 
  useMemo, 
  useEffect, 
  useState,  
  useRef 
} from 'react';
import { jwtDecode } from 'jwt-decode';
import { api } from '../api/authAPI';
import { AuthResponse,  UserData, Api2FAResponse } from '../types/authTypes';
import { UserRole } from '../types/authTypes';
interface JwtPayload {
  sub?: string;
  role?: string;  // Cambiado de UserRole a string para mayor flexibilidad
  exp?: number;
}


interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  loading: boolean;
  requires2FA: boolean;
  tempToken: string;
  login: (username: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  verify2FA: (otp: string) => Promise<AuthResponse>;
  setUserData: (data: Partial<UserData>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const isMounted = useRef(true);

// contexts/AuthContext.tsx
// Actualiza la interfaz JwtPayload para incluir correctamente el rol
interface JwtPayload {
  sub?: string;
  role?: string;  // Cambiado de UserRole a string para mayor flexibilidad
  exp?: number;
}
const createUserFromToken = (token: string, username?: string): UserData => {
  const decoded = jwtDecode<JwtPayload>(token);
  console.log('Token decodificado con rol:', decoded);
  
  // Validación segura del rol
  const roleFromToken = decoded.role;
  const validRole: UserRole = 
    roleFromToken === 'ADMINISTRADOR' || roleFromToken === 'USUARIO_NORMAL' 
      ? roleFromToken 
      : 'USUARIO_NORMAL';

  return {
    userId: decoded.sub || `temp-${Math.random().toString(36).substring(2, 9)}`,
    username: username || decoded.sub || 'Usuario',
    email: '',
    role: validRole
  };
};

  useEffect(() => {
    isMounted.current = true;
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token && isMounted.current) {
          const userData = createUserFromToken(token);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        if (isMounted.current) {
          console.error('Auth init error:', error);
          localStorage.removeItem('token');
        }
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };

    initializeAuth();
    return () => { isMounted.current = false; };
  }, []);

// Reemplaza la función login en tu AuthContext.tsx
const login = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    setLoading(true);
    const response = await fetch('http://localhost:8035/API/v1/ENCRYPT/usuarioServicio/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (data.codigo === 0) {
      localStorage.setItem('token', data.token);
      const userData = createUserFromToken(data.token, data.username);
      setUser(userData);
      setIsAuthenticated(true);
      
      return {
        codigo: data.codigo,
        mensaje: data.mensaje,
        token: data.token,
        rol: data.rol,
        requiereOtp: data.requiereOtp || false,
        username: data.username,
        redirectUrl: data.redirectUrl,
        success: true
      };
    } else {
      throw new Error(data.mensaje || 'Error de autenticación');
    }
  } catch (error) {
    setLoading(false);
    return {
      codigo: 1,
      mensaje: error instanceof Error ? error.message : 'Error de autenticación',
      success: false
    };
  } finally {
    setLoading(false);
  }
};

const verify2FA = async (otp: string): Promise<AuthResponse> => {
  try {
    if (!tempToken) {
      throw new Error('No temporary token available for 2FA verification');
    }

    setLoading(true);
    const response = await api.post<Api2FAResponse>('/API/v1/ENCRYPT/usuarioServicio/verify-otp', { 
      otp,
      tempToken 
    });

    if (response.data.codigo !== 0) {
      throw new Error(response.data.mensaje || '2FA verification failed');
    }

    const userData = {
      ...createUserFromToken(response.data.token),
      role: response.data.rol
    };

    localStorage.setItem('token', response.data.token);
    setUser(userData);
    setIsAuthenticated(true);
    setRequires2FA(false);
    setTempToken('');

    return {
      codigo: response.data.codigo,
      mensaje: response.data.mensaje,
      token: response.data.token,
      rol: response.data.rol,
      success: true
    };
  } catch (error) {
    console.error('2FA verification error:', error);
    return {
      codigo: 1,
      mensaje: error instanceof Error ? error.message : '2FA verification failed',
      success: false
    };
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