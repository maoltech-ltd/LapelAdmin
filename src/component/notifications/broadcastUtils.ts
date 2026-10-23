import { Status } from '@/component/utils/StatusBadge';
import { BroadcastStatus } from '../../../lib/types/broadcast.types';

export const DEVICE = 'web';

export const STATUS_BADGE: Record<BroadcastStatus, { status: Status; label: string }> = {
  SCHEDULED: { status: 'scheduled', label: 'scheduled' },
  SENDING: { status: 'processing', label: 'sending' },
  SENT: { status: 'success', label: 'sent' },
  FAILED: { status: 'failed', label: 'failed' },
  CANCELLED: { status: 'cancelled', label: 'cancelled' },
};

export function errorMessage(error: unknown, fallback: string): string {
  const maybe = error as { response?: { data?: { message?: unknown } }; message?: unknown };
  const serverMessage = maybe?.response?.data?.message;
  if (typeof serverMessage === 'string' && serverMessage.trim()) return serverMessage;
  if (typeof maybe?.message === 'string' && maybe.message.trim()) return maybe.message;
  return fallback;
}

export function formatDateTime(value?: string): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}
