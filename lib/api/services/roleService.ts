
import axiosInstance from "../../axios/axiosInstance";
import { Role } from "../../store/slices/roleSlice";

interface RoleData {
  id?: string;
  name: string;
  description?: string;
  permissions: string[];
  isActive?: boolean;
}

interface PermissionData {
  permission: string;
  action: 'add' | 'remove';
}

export const roleService = {
  // Role CRUD operations
  getRoles: (params?: any) =>
    axiosInstance.get('/api/admin/roles', { params }),

  getRoleById: (id: string) =>
    axiosInstance.get(`/api/admin/roles/${id}`),

  createRole: (data: RoleData) =>
    axiosInstance.post('/api/admin/roles', data),

  updateRole: (id: string, data: Partial<Role>) =>
    axiosInstance.put(`/api/admin/roles/${id}`, data),

  deleteRole: (id: string) =>
    axiosInstance.delete(`/api/admin/roles/${id}`),

  // Permission management
  getPermissions: () =>
    axiosInstance.get('/api/admin/roles/permissions'),

  addPermissionToRole: (roleId: string, permissionId: string) =>
    axiosInstance.post(`/api/admin/roles/${roleId}/permissions`, {
      permission: permissionId,
    }),

  updateRolePermissions: (roleId: string, permissions: string[]) =>
    axiosInstance.put(`/api/admin/roles/${roleId}/permissions`, permissions),

  removePermissionFromRole: (roleId: string, permissionId: string) =>
    axiosInstance.delete(`/api/admin/roles/${roleId}/permissions`, {
      data: { permission: permissionId },
    }),

  // Bulk permission operations
  manageRolePermissions: (roleId: string, data: PermissionData) => {
    if (data.action === 'add') {
      return axiosInstance.post(`/api/admin/roles/${roleId}/permissions`, {
        permission: data.permission,
      });
    } else {
      return axiosInstance.delete(`/api/admin/roles/${roleId}/permissions`, {
        data: { permission: data.permission },
      });
    }
  },
};
