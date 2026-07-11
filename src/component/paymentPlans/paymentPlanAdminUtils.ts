import type { Status } from '../utils/StatusBadge';

export const money = (value?: number) => `NGN ${Number(value || 0).toLocaleString()}`;

export const dateTime = (value?: string) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

export const planStatusKey = (value?: string): Status => {
  const normalized = (value || '').toLowerCase();
  if (normalized === 'active') return 'active';
  if (normalized === 'lapsed') return 'lapsed';
  if (normalized === 'cancelled') return 'cancelled';
  if (normalized === 'expired') return 'expired';
  if (normalized === 'completed') return 'completed';
  return 'pending';
};

export const installmentStatusKey = (value?: string): Status => {
  const normalized = (value || '').toLowerCase();
  if (normalized === 'released') return 'released';
  if (normalized === 'cancelled') return 'cancelled';
  return 'pending';
};

export const periodLabel = (value?: string) => {
  if (!value) return 'N/A';
  return value.charAt(0) + value.slice(1).toLowerCase();
};

export const pricingModeLabel = (value?: string) => {
  switch (value) {
    case 'AUTO_SUM':
      return 'Auto sum of fares';
    case 'AUTO_SUM_DISCOUNTED':
      return 'Auto sum, discounted';
    case 'FLAT_RATE':
      return 'Flat rate';
    default:
      return value || 'N/A';
  }
};

export const payoutScheduleLabel = (value?: string) => {
  switch (value) {
    case 'PER_OCCURRENCE':
      return 'Per occurrence';
    case 'HALF':
      return 'Half-period';
    case 'QUARTERLY':
      return 'Quarterly';
    default:
      return value || 'N/A';
  }
};
