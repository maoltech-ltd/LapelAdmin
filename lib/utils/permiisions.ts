import { Role } from "../types/auth.types";


export const hasPermission = (
  role: Role | null,
  permission: string
): boolean => {
  if (!role) return false;
  return role.permissions.includes(permission);
};

export const hasAnyPermission = (
  role: Role | null,
  permissions: string[]
): boolean => {
  if (!role) return false;
  return permissions.some(p => role.permissions.includes(p));
};
