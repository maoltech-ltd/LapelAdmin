// types/rider.types.ts
import { User } from './user.types';

export interface Vehicle {
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlateNumber: string;
  seats: number;
}

export interface Rider {
  id?: string;
  user: User;
  vehicle: Vehicle;
  available: boolean;
  rating: number;
}

export interface BecomeARiderDto {
  driverLicense: string;
  driverLicenseNumber: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlateNumber: string;
  seats: number;
}

export interface RiderSearchParams {
  query?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export interface VehicleSearchParams {
  query?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export interface AvailabilityUpdate {
  available: boolean;
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