// services/rider.service.ts
import axiosInstance from '../../axios/axiosInstance';
import { 
  Rider, 
  BecomeARiderDto, 
  Vehicle,
  RiderSearchParams,
  VehicleSearchParams,
  AvailabilityUpdate,
  ApiResponse,
  PaginatedResponse
} from '../../types/rider.types';

const getHeaders = (userId?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (userId) {
    headers['USER-ID'] = userId;
  }
  
  return { headers };
};

export const riderService = {
  // Register as a rider
  registerRider: async (device: string, userId: string, data: BecomeARiderDto): Promise<ApiResponse<Rider>> => {
    const response = await axiosInstance.post(
      `/api/v1/${device}/riders/register`,
      data,
      getHeaders(userId)
    );
    return response.data;
  },

  // Get rider profile
  getRiderProfile: async (device: string, userId: string): Promise<ApiResponse<Rider>> => {
    const response = await axiosInstance.get(
      `/api/v1/${device}/riders/profile`,
      getHeaders(userId)
    );
    return response.data;
  },

  // Get rider's vehicle
  getRiderVehicle: async (device: string, userId: string): Promise<ApiResponse<Vehicle>> => {
    const response = await axiosInstance.get(
      `/api/v1/${device}/riders/vehicle`,
      getHeaders(userId)
    );
    return response.data;
  },

  // Update rider availability
  updateRiderAvailability: async (device: string, userId: string, available: boolean): Promise<ApiResponse<Rider>> => {
    const response = await axiosInstance.patch(
      `/api/v1/${device}/riders/availability`,
      null,
      {
        params: { available },
        headers: getHeaders(userId).headers
      }
    );
    return response.data;
  },

  // Get all riders with pagination
  getAllRiders: async (device: string, params: RiderSearchParams): Promise<ApiResponse<PaginatedResponse<Rider>>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/riders`, {
      params,
      ...getHeaders()
    });
    return response.data;
  },

  // Get all vehicles with pagination
  getAllVehicles: async (device: string, params: VehicleSearchParams): Promise<ApiResponse<PaginatedResponse<Vehicle>>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/riders/vehicles`, {
      params,
      ...getHeaders()
    });
    return response.data;
  },

  // Activate rider
  activateRider: async (device: string, riderId: string): Promise<ApiResponse<Rider>> => {
    const response = await axiosInstance.patch(
      `/api/v1/${device}/riders/${riderId}/activate`
    );
    return response.data;
  },

  // Deactivate rider
  deactivateRider: async (device: string, userId: string): Promise<ApiResponse<Rider>> => {
    const response = await axiosInstance.patch(
      `/api/v1/${device}/riders/${userId}/deactivate`,
      null,
      getHeaders(userId)
    );
    return response.data;
  },

  // Delete rider
  deleteRider: async (device: string, userId: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete(
      `/api/v1/${device}/riders/${userId}`,
      getHeaders(userId)
    );
    return response.data;
  },

  // Statistics
  getTotalRidersCount: async (device: string): Promise<ApiResponse<number>> => {
    const response = await axiosInstance.get(
      `/api/v1/${device}/riders/stats/count`
    );
    return response.data;
  },

  getAvailableRidersCount: async (device: string): Promise<ApiResponse<number>> => {
    const response = await axiosInstance.get(
      `/api/v1/${device}/riders/stats/available-count`
    );
    return response.data;
  }
};