import axiosInstance from "../../axios/axiosInstance";

interface RiderData {
  id?: string;
  userId: string;
  vehicleType?: string;
  licenseNumber?: string;
  vehiclePlateNumber?: string;
  isAvailable?: boolean;
  status?: string;
  // Add other rider fields as needed
}

interface RegisterRiderData {
  userId: string;
  vehicleType: string;
  licenseNumber: string;
  vehiclePlateNumber: string;
  device: string;
}

interface AvailabilityData {
  isAvailable: boolean;
  device: string;
}

export const riderService = {
  // Rider registration
  registerRider: (data: RegisterRiderData) =>
    axiosInstance.post(`/api/v1/${data.device}/riders/register`, data),

  // Rider CRUD operations
  getRiders: (device: string, params?: any) =>
    axiosInstance.get(`/api/v1/${device}/riders`, { params }),

  getRiderProfile: (device: string) =>
    axiosInstance.get(`/api/v1/${device}/riders/profile`),

  getRiderVehicles: (device: string) =>
    axiosInstance.get(`/api/v1/${device}/riders/vehicles`),

  getRiderVehicle: (device: string, riderId?: string) =>
    axiosInstance.get(`/api/v1/${device}/riders/vehicle`, {
      params: { riderId },
    }),

  // Rider status management
  activateRider: (device: string, riderId: string) =>
    axiosInstance.patch(`/api/v1/${device}/riders/${riderId}/activate`, {}),

  deactivateRider: (device: string, riderId: string) =>
    axiosInstance.patch(`/api/v1/${device}/riders/${riderId}/deactivate`, {}),

  updateAvailability: (data: AvailabilityData) =>
    axiosInstance.patch(`/api/v1/${data.device}/riders/availability`, {
      isAvailable: data.isAvailable,
    }),

  deleteRider: (device: string, riderId: string) =>
    axiosInstance.delete(`/api/v1/${device}/riders/${riderId}`),

  // Statistics
  getRiderStatsCount: (device: string) =>
    axiosInstance.get(`/api/v1/${device}/riders/stats/count`),

  getAvailableRidersCount: (device: string) =>
    axiosInstance.get(`/api/v1/${device}/riders/stats/available-count`),
};