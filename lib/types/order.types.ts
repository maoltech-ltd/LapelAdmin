// types/order.types.ts
export enum OrderStatus {
  CREATED = 'CREATED',
  CONFIRMED = 'CONFIRMED',
  CANCEL_REQUESTED = 'CANCEL_REQUESTED',
  DISPUTED = 'DISPUTED',
  CANCELLED = 'CANCELLED',
  DRIVER_COMPLETED = 'DRIVER_COMPLETED',
  COMPLETED = 'COMPLETED',
  ONGOING = 'ONGOING',
  NO_SHOW = 'NO_SHOW',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  // Add other payment statuses
}

export enum RideStatus {
  PENDING = 'PENDING',
  Available = 'Available',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface OrderDto {
  id: string;
  rideId: string;
  occurrenceId?: string;
  passengerId: string;
  driverId: string;
  fare: number;
  grossFare: number;
  discountAmount: number;
  deviceChargeAmount: number;
  notificationChargeAmount?: number;
  notificationMethods?: string[];
  platformChargeType: string;
  platformChargeRate: number;
  device?: string;
  commissionAmount: number;
  driverEarning: number;
  seatsBooked: number;
  couponCode?: string;
  firstRideFreeApplied?: boolean;
  walletDebited?: boolean;
  driverCredited?: boolean;
  requestedDepartureTime?: string;
  requestedDepartureTimeUtc?: string;
  arrivalWindowStartUtc?: string;
  arrivalWindowEndUtc?: string;
  timezoneOffset?: string;
  rescheduleRequestedBy?: string;
  pendingRescheduleDepartureTime?: string;
  pendingRescheduleDepartureTimeUtc?: string;
  rescheduleStatus?: string;
  emergencyAlertedAt?: string;
  emergencyAlertedBy?: string;
  cancelRequestedBy?: string;
  cancelRequestedAt?: string;
  disputedBy?: string;
  disputedAt?: string;
  driverCompletedAt?: string;
  customerConfirmedAt?: string;
  // Cancellation / no-show policy (set by Lapel)
  cancelledBy?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  cancellationFee?: number;
  cancellationDriverShare?: number;
  driverArrivedAt?: string;
  noShowAt?: string;
  rideChangedAt?: string;
  noShowFeeRefunded?: boolean;
  status: OrderStatus;
  payment: PaymentStatus;
  rideStatus: RideStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderRequestDto {
  rideId: string;
  seats: number;
}

export enum DisputeResolution {
  REFUND_PASSENGER = 'REFUND_PASSENGER',
  PAY_DRIVER = 'PAY_DRIVER',
  DISMISS = 'DISMISS',
}

export interface DisputeResolutionRequest {
  resolution: DisputeResolution;
  note?: string;
}

export interface OrderSearchParams {
  query?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  status?: OrderStatus;
  payment?: PaymentStatus;
  paymentStatus?: PaymentStatus;
  rideStatus?: RideStatus;
  fromDate?: string;
  toDate?: string;
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
