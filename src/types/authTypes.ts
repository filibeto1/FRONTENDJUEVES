// src/types/authTypes.ts

export type UserRole = 'USER' | 'superadmin' | 'editor' | 'admin'; 
export interface JwtPayload {
    sub: string;
    iat?: number;
    exp?: number;
    role?: UserRole; // Usa el tipo UserRole aquí
    [key: string]: unknown;
  }

  export interface UserData {
    userId: string;
    username: string;
    email: string;
    role: UserRole; // Usa el tipo UserRole aquí
  }

export interface LoginResponse {
  success: boolean;
  requires2FA?: boolean;
  tempToken?: string;
  token?: string;
}

export interface ApiLoginResponse {
  codigo: number;
  mensaje: string;
  token?: string;
  requiereOtp?: boolean;
  tempToken?: string;
}

export interface Api2FAResponse {
  token: string;
  user?: UserData;
}