// types/user.types.ts
export interface User {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  address: string;
  sex: 'MALE' | 'FEMALE' | 'OTHER';
  profilePicture: string;
  active: boolean;
  isRider: boolean;
  isAdmin: boolean;
  role: string;
  createdAt: string;
}

export interface UserSearchParams {
  query?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  sex?: 'MALE' | 'FEMALE' | 'OTHER';
  isRider?: boolean;
  isAdmin?: boolean;
  role?: string;
}

export interface ChangePasswordData {
  newPassword: string;
  confirmNewPassword: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: 'success' | 'error';
  code: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}