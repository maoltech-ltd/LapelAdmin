// services/rider.service.ts
import axiosInstance from '../../axios/axiosInstance';
import { 
  Rider, 
  BecomeARiderDto, 
  Vehicle,
  RiderSearchParams,
  VehicleSearchParams,
  AvailabilityUpdate,
  DocumentReviewDecision,
  ApiResponse,
  PaginatedResponse
} from '../../types/rider.types';

export interface DriverStrikeStatus {
  count30d: number;
  threshold: number;
  windowDays: number;
  suspendedUntil: string | null;
  strikes: { orderId?: string; rideId?: string; reason?: string; occurredAt?: string }[];
}

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
      `/api/v1/${device}/admin/riders/register`,
      data,
      getHeaders(userId)
    );
    return response.data;
  },

  // Get rider profile
  getRiderProfile: async (device: string, userId: string): Promise<ApiResponse<Rider>> => {
    const response = await axiosInstance.get(
      `/api/v1/${device}/admin/riders/profile`,
      getHeaders(userId)
    );
    return response.data;
  },

  // Late-cancellation strikes for a driver (read-only, by user id)
  getDriverStrikes: async (device: string, userId: string): Promise<ApiResponse<DriverStrikeStatus>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/admin/riders/${encodeURIComponent(userId)}/strikes`);
    return response.data;
  },

  // Get rider's vehicle
  getRiderVehicle: async (device: string, userId: string): Promise<ApiResponse<Vehicle>> => {
    const response = await axiosInstance.get(
      `/api/v1/${device}/admin/riders/vehicle`,
      getHeaders(userId)
    );
    return response.data;
  },

  // Update rider availability
  updateRiderAvailability: async (device: string, userId: string, available: boolean): Promise<ApiResponse<Rider>> => {
    const response = await axiosInstance.patch(
      `/api/v1/${device}/admin/riders/availability`,
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
    const response = await axiosInstance.get(`/api/v1/${device}/admin/riders`, {
      params,
      ...getHeaders()
    });
    return response.data;
  },

  // Get all vehicles with pagination
  getAllVehicles: async (device: string, params: VehicleSearchParams): Promise<ApiResponse<PaginatedResponse<Vehicle>>> => {
    const response = await axiosInstance.get(`/api/v1/${device}/admin/riders/vehicles`, {
      params,
      ...getHeaders()
    });
    return response.data;
  },

  // Activate rider
  activateRider: async (device: string, riderId: string): Promise<ApiResponse<Rider>> => {
    const response = await axiosInstance.patch(
      `/api/v1/${device}/admin/riders/${riderId}/activate`
    );
    return response.data;
  },

  // Deactivate rider
  deactivateRider: async (device: string, userId: string): Promise<ApiResponse<Rider>> => {
    const response = await axiosInstance.patch(
      `/api/v1/${device}/admin/riders/${userId}/deactivate`,
      null,
      getHeaders(userId)
    );
    return response.data;
  },

  reviewRiderDocuments: async (device: string, riderId: string, data: DocumentReviewDecision): Promise<ApiResponse<Rider>> => {
    const response = await axiosInstance.patch(
      `/api/v1/${device}/admin/riders/${riderId}/documents/review`,
      data,
      getHeaders()
    );
    return response.data;
  },

  reviewVehicleDocuments: async (device: string, vehicleId: string, data: DocumentReviewDecision): Promise<ApiResponse<Vehicle>> => {
    const response = await axiosInstance.patch(
      `/api/v1/${device}/admin/riders/vehicles/${vehicleId}/documents/review`,
      data,
      getHeaders()
    );
    return response.data;
  },

  // Delete rider
  deleteRider: async (device: string, userId: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete(
      `/api/v1/${device}/admin/riders/${userId}`,
      getHeaders(userId)
    );
    return response.data;
  },

  // Statistics
  getTotalRidersCount: async (device: string): Promise<ApiResponse<number>> => {
    const response = await axiosInstance.get(
      `/api/v1/${device}/admin/riders/stats/count`
    );
    return response.data;
  },

  getAvailableRidersCount: async (device: string): Promise<ApiResponse<number>> => {
    const response = await axiosInstance.get(
      `/api/v1/${device}/admin/riders/stats/available-count`
    );
    return response.data;
  }
};
