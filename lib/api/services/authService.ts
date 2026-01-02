import axiosInstance from "../../axios/axiosInstance";


interface LoginData {
  email: string;
  password: string;
  device: string;
}

interface ResetPasswordData {
  email: string;
  device: string;
}

interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
  device: string;
}

export const authService = {
  login: (data: LoginData) =>
    axiosInstance.post(`/api/v1/${data.device}/admins/login`, {
      email: data.email,
      password: data.password,
    }),

  requestPasswordReset: (data: ResetPasswordData) =>
    axiosInstance.post(`/api/v1/${data.device}/admins/password-reset/request`, {
      email: data.email,
    }),

  resetPassword: (token: string, data: { password: string; device: string }) =>
    axiosInstance.post(`/api/v1/${data.device}/admins/password-reset`, {
      token,
      password: data.password,
    }),

  changePassword: (data: ChangePasswordData) =>
    axiosInstance.post(`/api/v1/${data.device}/admins/change-password`, data),

  getCurrentAdmin: (device: string) =>
    axiosInstance.get(`/api/v1/${device}/admins/me`),
};