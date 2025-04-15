// src/contexts/AuthContext.tsx
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

// Import all necessary interfaces from authTypes.ts
import type {
  UserData,
  JwtPayload,
  LoginResponse,
  ApiLoginResponse,
  Api2FAResponse,
  UserRole
} from '../types/authTypes';

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
  const isMounted = useRef(true);

  const createUserFromToken = (token: string, username?: string): UserData => {
    const decoded = jwtDecode<JwtPayload>(token);
    return {
      userId: decoded.sub || `temp-${Math.random().toString(36).substring(2, 9)}`,
      username: username || decoded.sub?.split('@')[0] || 'Usuario',
      email: '',
      role: 'USER' // Valor fijo temporal
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

  const login = async (username: string, password: string): Promise<LoginResponse> => {
    try {
      setLoading(true);
      setRequires2FA(false);
      
      if (!username.trim() || !password.trim()) {
        throw new Error('Username and password are required');
      }

      const response = await api.post<ApiLoginResponse>('/API/v1/ENCRYPT/usuarioServicio/login', {
        username: username.trim(),
        password: password.trim()
      });

      console.log('[DEBUG] Server response:', {
        status: response.status,
        data: {
          code: response.data.codigo,
          message: response.data.mensaje,
          token: response.data.token ? '***REDACTED***' : null,
          requiresOtp: response.data.requiereOtp || false,
          tempToken: response.data.tempToken ? '***REDACTED***' : null
        }
      });

      if (response.data.codigo !== 0) {
        throw new Error(response.data.mensaje || 'Authentication error');
      }

      if (response.data.token) {
        const userData = createUserFromToken(response.data.token, username.trim());
        setUser(userData);
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
        return { success: true, requires2FA: false };
      }

      if (response.data.requiereOtp) {
        const otpToken = response.data.tempToken;
        if (!otpToken) {
          throw new Error('2FA required but no temporary token provided');
        }

        setTempToken(otpToken);
        setRequires2FA(true);
        return { 
          success: true, 
          requires2FA: true,
          tempToken: otpToken
        };
      }

      throw new Error('Unexpected server response');
    } catch (error) {
      console.error('[ERROR] Login error details:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        request: {
          endpoint: '/API/v1/ENCRYPT/usuarioServicio/login',
          username: username.trim()
        }
      });
      
      logout();
      throw error instanceof Error ? error : new Error('Authentication process error');
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