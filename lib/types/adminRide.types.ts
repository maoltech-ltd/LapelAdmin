export interface AdminLocation {
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface AdminRide {
  id: string;
  riderId?: string;
  origin?: AdminLocation;
  destination?: AdminLocation;
  departureTime?: string;
  recurring?: boolean;
  fare?: number;
  seatsAvailable?: number;
  seatsBooked?: number;
  passengerUserIds?: string[];
  status?: string;
  vehicleId?: string;
}

export const rideAddress = (location?: AdminLocation) =>
  location?.address || [location?.latitude, location?.longitude].filter(Boolean).join(', ') || 'Unknown';
