// types/auth.types.ts

import { User } from "./user.types";


export interface Role {
  id?: string;
  name: string;
  description?: string;
  permissions: string[];
}

export interface AuthResponseDto {
  token: string;
  user: User;
  role: Role;
}

export interface LoginDto {
  identifier: string;
  password: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AdminChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: 'success' | 'error';
  code: number;
}