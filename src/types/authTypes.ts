
export type UserRole = 'ADMINISTRADOR' | 'USUARIO_NORMAL';

export interface JwtPayload {
  sub?: string;
  role?: UserRole;  // Usamos UserRole directamente aquí
  exp?: number;
}


export interface UserData {
  userId: string;
  username: string;
  email: string;
  role: UserRole;  // Aseguramos que siempre sea del tipo UserRole
}
export interface AuthContextType {
  user: UserData | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
export interface AuthResponse {
  codigo: number;
  mensaje: string;
  token?: string;
  rol?: string;
  requiereOtp?: boolean;
  username?: string;
  redirectUrl?: string;
  success?: boolean;
}
export interface Api2FAResponse {
  /** Código de estado (0 = éxito) */
  codigo: number;
  
  /** Mensaje descriptivo */
  mensaje: string;
  
  /** Token JWT definitivo */
  token: string;
  
  /** Datos del usuario */
  user?: UserData;
  
  /** Rol del usuario */
  rol: UserRole;
}

/**
 * Respuesta para verificación OTP
 */
export interface OtpResponse {
  /** Código de estado (0 = éxito) */
  codigo: number;
  
  /** Mensaje descriptivo */
  mensaje: string;
  
  /** Token JWT (si la verificación fue exitosa) */
  token?: string;
  
  /** URL a redirigir después de verificación exitosa */
  redirectUrl?: string;
  
  /** Rol del usuario (para redirección) */
  rol?: string;
}