// types/paymentPlan.types.ts
export enum PlanStatus {
  ACTIVE = 'ACTIVE',
  LAPSED = 'LAPSED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  COMPLETED = 'COMPLETED',
}

export enum InstallmentStatus {
  PENDING = 'PENDING',
  RELEASED = 'RELEASED',
  CANCELLED = 'CANCELLED',
}

export enum PlanPeriodType {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export enum PlanPricingMode {
  AUTO_SUM = 'AUTO_SUM',
  AUTO_SUM_DISCOUNTED = 'AUTO_SUM_DISCOUNTED',
  FLAT_RATE = 'FLAT_RATE',
}

export enum PlanPayoutSchedule {
  PER_OCCURRENCE = 'PER_OCCURRENCE',
  HALF = 'HALF',
  QUARTERLY = 'QUARTERLY',
}

export interface PlanInstallmentDto {
  index: number;
  amount: number;
  dueAt?: string;
  status: InstallmentStatus;
  releasedAt?: string;
  commissionAmount: number;
  driverEarning: number;
}

export interface RidePaymentPlanDto {
  id: string;
  rideId: string;
  driverId: string;
  passengerId: string;

  periodType: PlanPeriodType;
  pricingMode: PlanPricingMode;
  payoutSchedule: PlanPayoutSchedule;
  seatsPerRide: number;

  periodStartUtc?: string;
  periodEndUtc?: string;
  occurrenceCount: number;
  perOccurrenceGrossFareShare: number;

  grossPrice: number;
  discountPercentage: number;
  discountAmount: number;
  finalPrice: number;

  autoRenew: boolean;
  status: PlanStatus;
  walletDebited: boolean;
  refunded: boolean;
  refundAmount: number;

  renewedFromPlanId?: string;
  installments: PlanInstallmentDto[];

  lastRenewalAttemptAt?: string;
  lapsedAt?: string;
  cancelledAt?: string;
  cancelledBy?: string;

  createdAt: string;
  updatedAt: string;
}

export interface RidePaymentPlanSearchParams {
  query?: string;
  passengerId?: string;
  driverId?: string;
  rideId?: string;
  status?: PlanStatus;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: 'success' | 'error';
  code: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
