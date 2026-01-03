// services/admin.service.ts
import axiosInstance from '../../axios/axiosInstance';
import { 
  User,
  ApiResponse,
  PaginatedResponse
} from '../../types/user.types';
import { UserSearchParams } from '../../types/admin.types';

export const adminService = {
  // Search admins
  searchAdmins: async (device: string, params: UserSearchParams): Promise<ApiResponse<PaginatedResponse<User>>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/admins/search`, {
      params
    });
    return response.data;
  },

  // Get admin by ID
  getAdminById: async (device: string, id: string): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/admins/${id}`);
    return response.data;
  },

  // Update admin profile
  updateAdmin: async (device: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.put(
      `/api/v1/${device}/admins/update`,
      data
    );
    return response.data;
  },

  // Delete admin
  deleteAdmin: async (device: string, id: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete(`/api/v1/${device}/admins`, {
      params: { id }
    });
    return response.data;
  }
};