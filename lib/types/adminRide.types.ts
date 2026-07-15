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
  departureTimeUtc?: string;
  occurrenceId?: string;
  arrivalWindowStartUtc?: string;
  arrivalWindowEndUtc?: string;
  timezoneOffset?: string;
  recurring?: boolean;
  isRecurring?: boolean;
  recurringDays?: string[];
  fare?: number;
  seatsAvailable?: number;
  seatsBooked?: number;
  notificationMethods?: string[];
  passengerUserIds?: string[];
  status?: string;
  vehicleId?: string;
}

export const rideAddress = (location?: AdminLocation) =>
  location?.address || [location?.latitude, location?.longitude].filter(Boolean).join(', ') || 'Unknown';

export interface AdminOccurrenceRosterEntry {
  orderId?: string;
  passengerId?: string;
  passengerName?: string;
  passengerPhone?: string;
  orderStatus?: string;
}

export interface AdminRideOccurrence {
  id: string;
  rideId?: string;
  departureTimeUtc?: string;
  status?: string;
  seatsAvailable?: number;
  seatsBooked?: number;
  roster?: AdminOccurrenceRosterEntry[];
}
