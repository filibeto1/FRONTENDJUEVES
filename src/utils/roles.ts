// src/utils/roles.ts
export type UserRole = 'ADMINISTRADOR' | 'USUARIO_NORMAL';

interface RolePermissions {
  canViewDashboard: boolean;
  canManageUsers: boolean;
  canManageContent: boolean;
  canManageSettings: boolean;
  canAccessAdminPanel: boolean;
}

export const rolePermissions: Record<UserRole, RolePermissions> = {
  ADMINISTRADOR: {
    canViewDashboard: true,
    canManageUsers: true,
    canManageContent: true,
    canManageSettings: true,
    canAccessAdminPanel: true,
  },
  USUARIO_NORMAL: {
    canViewDashboard: true,
    canManageUsers: false,
    canManageContent: false,
    canManageSettings: false,
    canAccessAdminPanel: false,
  },
};

export const hasPermission = (role: UserRole, permission: keyof RolePermissions): boolean => {
  return rolePermissions[role]?.[permission] ?? false;
};

export const getRolePermissions = (role: UserRole): RolePermissions => {
  return rolePermissions[role] || rolePermissions.USUARIO_NORMAL;
};

export const availableRoles: { value: UserRole; label: string }[] = [
  { value: 'ADMINISTRADOR', label: 'Administrador' },
  { value: 'USUARIO_NORMAL', label: 'Usuario Normal' },
];