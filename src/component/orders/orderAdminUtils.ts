import { OrderDto } from '../../../lib/types/order.types';
import type { Status } from '../utils/StatusBadge';

export const money = (value?: number) => `NGN ${Number(value || 0).toLocaleString()}`;

export const dateTime = (value?: string) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

export const statusKey = (value?: string): Status => {
  const normalized = (value || 'pending').toLowerCase();
  if (normalized === 'available') return 'available';
  if (normalized === 'cancel_request') return 'cancel_requested';
  if (normalized === 'driver_completed') return 'driver_completed';
  if (normalized === 'cancel_requested') return 'cancel_requested';
  if (normalized === 'disputed') return 'disputed';
  if (normalized === 'created') return 'created';
  if (normalized === 'confirmed') return 'confirmed';
  if (normalized === 'ongoing') return 'ongoing';
  if (normalized === 'completed') return 'completed';
  if (normalized === 'cancelled') return 'cancelled';
  if (normalized === 'paid') return 'paid';
  if (normalized === 'refunded') return 'refunded';
  if (normalized === 'failed') return 'failed';
  return 'pending';
};

export const orderFlags = (order: OrderDto) => {
  const flags: string[] = [];
  const status = String(order.status);
  const payment = String(order.payment);
  if (status === 'DRIVER_COMPLETED' && !order.driverCredited) {
    flags.push('Awaiting passenger confirmation or auto-release');
  }
  if ((status === 'CONFIRMED' || status === 'ONGOING') && payment !== 'PAID') {
    flags.push('Active order without paid wallet hold');
  }
  if (payment === 'PAID' && !order.walletDebited) {
    flags.push('Payment marked paid but walletDebited is false');
  }
  if (status === 'COMPLETED' && !order.driverCredited) {
    flags.push('Completed order missing driver credit');
  }
  if (status === 'CANCEL_REQUESTED') {
    flags.push('Cancellation awaiting counterparty or support action');
  }
  if (status === 'DISPUTED') {
    flags.push(order.noShowAt ? 'Disputed no-show: support review required' : 'Support review required');
  }
  if (status === 'NO_SHOW' && (order.cancellationDriverShare ?? 0) > 0 && !order.driverCredited) {
    flags.push('No-show driver share not credited yet (retry cron pending)');
  }
  return flags;
};
