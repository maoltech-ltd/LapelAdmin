import axiosInstance from "../../axios/axiosInstance";

interface RideData {
  // Define ride data structure based on your API
  userId: string;
  pickupLocation: string;
  dropoffLocation: string;
  scheduledTime?: string;
  // Add other ride fields as needed
}

export const rideService = {
  getRideById: (device: string, rideId: string) =>
    axiosInstance.get(`/api/v1/${device}/rides/${rideId}`),

  updateRideStatus: (device: string, rideId: string, status: string) =>
    axiosInstance.put(`/api/v1/${device}/rides/${rideId}/status`, { status }),

  persistRide: (device: string, data: RideData) =>
    axiosInstance.post(`/api/v1/${device}/rides/persist`, data),

  offerRide: (device: string, data: RideData) =>
    axiosInstance.post(`/api/v1/${device}/rides/offer`, data),

  getAvailableRides: (device: string, params?: any) =>
    axiosInstance.post(`/api/v1/${device}/rides/available`, params),

  getRideHistory: (device: string, params?: any) =>
    axiosInstance.get(`/api/v1/${device}/rides/history`, { params }),

  getRiderHistory: (device: string, params?: any) =>
    axiosInstance.get(`/api/v1/${device}/rides/history/rider`, { params }),

  getCustomerHistory: (device: string, params?: any) =>
    axiosInstance.get(`/api/v1/${device}/rides/history/customer`, { params }),
};