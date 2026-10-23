import axiosInstance from "../../axios/axiosInstance";

export interface LiveRideLocation {
  orderId: string;
  rideId?: string;
  driverId?: string;
  passengerId?: string;
  driverName?: string;
  passengerName?: string;
  lat: number;
  lng: number;
  heading?: number;
  updatedAt?: string;
}

export const liveLocationService = {
  getLiveLocations: (device: string) =>
    axiosInstance.get(`/api/v1/${device}/admin/rides/live-locations`),
};
