import axiosInstance from "../../axios/axiosInstance";

interface User {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  // Add other user fields as needed
}

interface UpdateProfilePictureData {
  device: string;
  image: File;
}

interface ChangePasswordData {
  device: string;
  oldPassword: string;
  newPassword: string;
}

export const userService = {
  getUsers: (device: string, params?: any) =>
    axiosInstance.get(`/api/v1/${device}/users`, { params }),

  searchUsers: (device: string, query: string) =>
    axiosInstance.get(`/api/v1/${device}/users/search`, {
      params: { query },
    }),

  updateUser: (device: string, userId: string, data: Partial<User>) =>
    axiosInstance.put(`/api/v1/${device}/users/update`, {
      ...data,
      id: userId,
    }),

  updateProfilePicture: (data: UpdateProfilePictureData) => {
    const formData = new FormData();
    formData.append('image', data.image);
    return axiosInstance.post(
      `/api/v1/${data.device}/users/update-profile-picture`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  changePassword: (data: ChangePasswordData) =>
    axiosInstance.post(`/api/v1/${data.device}/users/change-password`, data),

  deleteUser: (device: string, userId: string) =>
    axiosInstance.delete(`/api/v1/${device}/users/delete`, {
      data: { id: userId },
    }),
};