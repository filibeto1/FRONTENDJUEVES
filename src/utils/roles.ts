// Tipos de roles disponibles en la aplicación
export type UserRole = 'superadmin' | 'admin' | 'editor' | 'user' | 'guest';

// Interfaz para los permisos de cada rol
interface RolePermissions {
  canViewDashboard: boolean;
  canManageUsers: boolean;
  canManageContent: boolean;
  canManageSettings: boolean;
  canAccessAdminPanel: boolean;
}

// Mapeo de roles a permisos
export const rolePermissions: Record<UserRole, RolePermissions> = {
  superadmin: {
    canViewDashboard: true,
    canManageUsers: true,
    canManageContent: true,
    canManageSettings: true,
    canAccessAdminPanel: true,
  },
  admin: {
    canViewDashboard: true,
    canManageUsers: true,
    canManageContent: true,
    canManageSettings: false,
    canAccessAdminPanel: true,
  },
  editor: {
    canViewDashboard: true,
    canManageUsers: false,
    canManageContent: true,
    canManageSettings: false,
    canAccessAdminPanel: false,
  },
  user: {
    canViewDashboard: true,
    canManageUsers: false,
    canManageContent: false,
    canManageSettings: false,
    canAccessAdminPanel: false,
  },
  guest: {
    canViewDashboard: false,
    canManageUsers: false,
    canManageContent: false,
    canManageSettings: false,
    canAccessAdminPanel: false,
  },
};

// Función para verificar si un rol tiene un permiso específico
export const hasPermission = (role: UserRole, permission: keyof RolePermissions): boolean => {
  return rolePermissions[role]?.[permission] ?? false;
};

// Función para obtener todos los permisos de un rol
export const getRolePermissions = (role: UserRole): RolePermissions => {
  return rolePermissions[role] || rolePermissions.guest;
};

// Lista de roles disponibles para selección en formularios
export const availableRoles: { value: UserRole; label: string }[] = [
  { value: 'superadmin', label: 'Super Administrador' },
  { value: 'admin', label: 'Administrador' },
  { value: 'editor', label: 'Editor' },
  { value: 'user', label: 'Usuario' },
];