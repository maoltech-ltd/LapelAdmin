import axiosInstance from "../../axios/axiosInstance";

interface AdminData {
  id?: string;
  name: string;
  email: string;
  role?: string;
  status?: string;
  // Add other admin fields as needed
}

interface LoginData {
  email: string;
  password: string;
  device: string;
}

interface PasswordResetRequest {
  email: string;
  device: string;
}

interface PasswordReset {
  token: string;
  password: string;
  device: string;
}

interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
  device: string;
}

export const adminService = {
  // Authentication
  login: (data: LoginData) =>
    axiosInstance.post(`/api/v1/${data.device}/admins/login`, {
      email: data.email,
      password: data.password,
    }),

  // Password management
  requestPasswordReset: (data: PasswordResetRequest) =>
    axiosInstance.post(`/api/v1/${data.device}/admins/password-reset/request`, {
      email: data.email,
    }),

  resetPassword: (data: PasswordReset) =>
    axiosInstance.post(`/api/v1/${data.device}/admins/password-reset`, data),

  changePassword: (data: ChangePasswordData) =>
    axiosInstance.post(`/api/v1/${data.device}/admins/change-password`, data),

  // Admin CRUD operations
  getAdmins: (device: string, params?: any) =>
    axiosInstance.get(`/api/v1/${device}/admins`, { params }),

  getAdminById: (device: string, id: string) =>
    axiosInstance.get(`/api/v1/${device}/admins/${id}`),

  searchAdmins: (device: string, query: string, params?: any) =>
    axiosInstance.get(`/api/v1/${device}/admins/search`, {
      params: { query, ...params },
    }),

  updateAdmin: (device: string, id: string, data: Partial<AdminData>) =>
    axiosInstance.put(`/api/v1/${device}/admins/update`, {
      ...data,
      id,
    }),

  deleteAdmin: (device: string, id: string) =>
    axiosInstance.delete(`/api/v1/${device}/admins`, {
      data: { id },
    }),

  // Profile management
  getCurrentAdmin: (device: string) =>
    axiosInstance.get(`/api/v1/${device}/admins/me`),
};