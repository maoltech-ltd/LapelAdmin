// services/user.service.ts
import axiosInstance from '../../axios/axiosInstance';
import { 
  User, 
  UserSearchParams, 
  UpdateUserData, 
  ChangePasswordData,
  ApiResponse,
  PaginatedResponse
} from '../../types/user.types';

const getHeaders = (userId?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (userId) {
    headers['USER-ID'] = userId;
  }
  
  return { headers };
};

export const userService = {
  // Search users with pagination
  searchUsers: async (device: string, params: UserSearchParams): Promise<ApiResponse<PaginatedResponse<User>>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/users/search`, {
      params,
      ...getHeaders()
    });
    return response.data;
  },

  // Get user by ID
  getUserById: async (device: string, userId: string): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/users`, {
      ...getHeaders(userId)
    });
    return response.data;
  },

  // Update user
  updateUser: async (device: string, userId: string, data: UpdateUserData): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.put(
      `/api/v1/${device}/users/update`,
      data,
      getHeaders(userId)
    );
    return response.data;
  },

  // Delete user
  deleteUser: async (device: string, userId: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete(
      `/api/v1/${device}/users/delete`,
      getHeaders(userId)
    );
    return response.data;
  },

  // Change password (Super Admin only)
  changePassword: async (device: string, userId: string, data: ChangePasswordData): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.post(
      `/api/v1/${device}/users/change-password`,
      data,
      getHeaders(userId)
    );
    return response.data;
  },

  // Update profile picture
  updateProfilePicture: async (device: string, userId: string, imageUrl: string): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.post(
      `/api/v1/${device}/users/update-profile-picture`,
      { imageUrl }, // Note: Your backend expects imageUrl as param, but I'm sending in body
      getHeaders(userId)
    );
    return response.data;
  },
  
  // Alternative method if backend expects query param
  updateProfilePictureWithParam: async (device: string, userId: string, imageUrl: string): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.post(
      `/api/v1/${device}/users/update-profile-picture`,
      null, // Empty body
      {
        params: { imageUrl },
        headers: getHeaders(userId).headers
      }
    );
    return response.data;
  }
};