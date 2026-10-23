// services/auth.service.ts
import axiosInstance from '../../axios/axiosInstance';
import { 
  AuthResponseDto, 
  LoginDto, 
  ResetPasswordDto, 
  AdminChangePasswordDto,
  ApiResponse 
} from '../../types/auth.types';

export const authService = {
  // Admin login
  login: async (device: string, data: LoginDto): Promise<ApiResponse<AuthResponseDto>> => {
    const response = await axiosInstance.post(
      `/api/v1/${device}/admin/admins/login`,
      data
    );
    return response.data;
  },

  // Revoke this admin session on the server (the token stops working immediately)
  logout: async (device: string): Promise<void> => {
    await axiosInstance.post(`/api/v1/${device}/admin/admins/logout`);
  },

  // Get current admin profile
  getCurrentAdmin: async (device: string): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/admin/admins/me`);
    return response.data;
  },

  // Request password reset
  requestPasswordReset: async (device: string, identifier: string): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.post(
      `/api/v1/${device}/admin/admins/password-reset/request`,
      null,
      {
        params: { identifier }
      }
    );
    return response.data;
  },

  // Reset password
  resetPassword: async (device: string, data: ResetPasswordDto): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.post(
      `/api/v1/${device}/admin/admins/password-reset`,
      data
    );
    return response.data;
  },

  // Change password (authenticated)
  changePassword: async (device: string, data: AdminChangePasswordDto): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.post(
      `/api/v1/${device}/admin/admins/change-password`,
      data
    );
    return response.data;
  }
};