import type { Status } from '../utils/StatusBadge';
import { CompanyDto, CompanyStatus } from '../../../lib/types/company.types';

export const money = (value?: number | null) =>
  value === null || value === undefined ? '—' : `NGN ${Number(value).toLocaleString()}`;

export const dateTime = (value?: string | null) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

export const companyStatusKey = (value?: string): Status => {
  switch (value) {
    case CompanyStatus.ACTIVE:
      return 'active';
    case CompanyStatus.SUSPENDED:
      return 'suspended';
    case CompanyStatus.REJECTED:
      return 'rejected';
    default:
      return 'pending';
  }
};

export const companyStatusLabel = (value?: string) => {
  switch (value) {
    case CompanyStatus.PENDING_APPROVAL:
      return 'Pending approval';
    case CompanyStatus.ACTIVE:
      return 'Active';
    case CompanyStatus.SUSPENDED:
      return 'Suspended';
    case CompanyStatus.REJECTED:
      return 'Rejected';
    default:
      return value || 'N/A';
  }
};

export const inviteStatusKey = (status?: string, expired?: boolean): Status => {
  if (expired) return 'expired';
  switch (status) {
    case 'ACCEPTED':
      return 'approved';
    case 'REVOKED':
      return 'cancelled';
    case 'EXPIRED':
      return 'expired';
    default:
      return 'pending';
  }
};

export const orderStatusKey = (value?: string): Status => {
  const normalized = (value || '').toLowerCase();
  const known: Status[] = [
    'created',
    'confirmed',
    'ongoing',
    'driver_completed',
    'completed',
    'cancelled',
    'cancel_requested',
    'disputed',
  ];
  return (known as string[]).includes(normalized) ? (normalized as Status) : 'pending';
};

// "15% off, up to NGN 2,000 per ride" or "Off".
export const discountSummary = (company: CompanyDto) => {
  if (!company.discountActive || !company.discountPercentage) return 'Off';
  const cap = company.maxDiscountPerRide > 0 ? `, up to ${money(company.maxDiscountPerRide)} per ride` : '';
  return `${company.discountPercentage}% off${cap}`;
};

// Backend LocalDateTime ("2026-11-01T09:00:00") -> <input type="datetime-local"> value.
export const toDateTimeInput = (value?: string | null) => (value ? value.slice(0, 16) : '');

// Prefer the backend's ApiResponseDto message over axios' generic one.
export const errorMessage = (error: unknown, fallback: string): string => {
  const candidate = error as { response?: { data?: { message?: string } }; message?: string } | null;
  return candidate?.response?.data?.message || candidate?.message || fallback;
};
