// types/company.types.ts
// "SharedDrive for Business" companies, as served by Lapel-Admin's /companies endpoints.
// See docs/COMPANY_ACCOUNTS.md section 4.
export enum CompanyStatus {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  REJECTED = 'REJECTED',
}

export type CompanyMemberRole = 'OWNER' | 'ADMIN' | 'STAFF';
export type CompanyMemberStatus = 'ACTIVE' | 'REMOVED';
export type CompanyInviteStatus = 'PENDING' | 'ACCEPTED' | 'REVOKED' | 'EXPIRED';

export interface CompanyDto {
  id: string;
  name: string;
  registrationNumber?: string;
  industry?: string;
  companySize?: string;
  address?: string;
  city?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;

  ownerUserId?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhoneNumber?: string;
  walletUserId?: string;

  status: CompanyStatus;
  statusReason?: string;
  approvedAt?: string;
  approvedBy?: string;

  defaultMonthlyBudget?: number | null;

  discountActive: boolean;
  discountPercentage: number;
  maxDiscountPerRide: number;
  discountStartsAt?: string | null;
  discountEndsAt?: string | null;
  discountNote?: string | null;
  discountUpdatedBy?: string;
  discountUpdatedAt?: string;

  walletBalance?: number | null;
  currency?: string;
  activeMemberCount?: number | null;
  // Detail endpoint only.
  pendingInviteCount?: number | null;
  spentThisMonth?: number | null;

  createdAt: string;
  updatedAt: string;
}

export interface CompanyMemberDto {
  id: string;
  companyId: string;
  userId: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  role: CompanyMemberRole;
  status: CompanyMemberStatus;
  department?: string;
  monthlyBudget?: number | null;
  effectiveMonthlyBudget?: number | null;
  spentThisMonth: number;
  invitedBy?: string;
  joinedAt?: string;
  createdAt?: string;
}

export interface CompanyInviteDto {
  id: string;
  companyId: string;
  code: string;
  email?: string;
  phoneNumber?: string;
  name?: string;
  role: CompanyMemberRole;
  monthlyBudget?: number | null;
  department?: string;
  status: CompanyInviteStatus;
  expired: boolean;
  expiresAt?: string;
  invitedBy?: string;
  acceptedBy?: string;
  acceptedAt?: string;
  lastSentAt?: string;
  createdAt?: string;
}

export interface CompanyRideDto {
  orderId: string;
  rideId: string;
  driverId?: string;
  passengerId: string;
  passengerName?: string;
  passengerEmail?: string;
  fare: number;
  grossFare: number;
  companyDiscountAmount: number;
  seatsBooked: number;
  status: string;
  payment?: string;
  requestedDepartureTime?: string;
  createdAt?: string;
}

// Keys are CompanyStatus values plus TOTAL.
export type CompanyStatusCounts = Partial<Record<CompanyStatus | 'TOTAL', number>>;

export interface CompanySearchParams {
  search?: string;
  status?: CompanyStatus;
  from?: string; // yyyy-MM-dd
  to?: string; // yyyy-MM-dd
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export interface CompanyStatusActionRequest {
  reason?: string;
}

export interface CompanyDiscountRequest {
  discountActive: boolean;
  discountPercentage: number;
  maxDiscountPerRide: number;
  discountStartsAt?: string | null; // local date-time, e.g. 2026-11-01T09:00
  discountEndsAt?: string | null;
  discountNote?: string | null;
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
