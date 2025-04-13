import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

export const decodeToken = (token: string): DecodedToken => {
  return jwtDecode<DecodedToken>(token);
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = decodeToken(token);
    return Date.now() >= exp * 1000;
  } catch (error) {
    return true;
  }
};

export const getUserRole = (token: string): string | null => {
  try {
    const { role } = decodeToken(token);
    return role;
  } catch (error) {
    return null;
  }
};

export const validatePassword = (password: string): boolean => {
  // Al menos 8 caracteres, una mayúscula, una minúscula y un número
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return regex.test(password);
};

export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};