'use client';

import { useState } from 'react';
import Modal from '../utils/Modal';
import { disputeService } from '../../../lib/api/services/disputeService';
import { DisputeResolution, OrderDto } from '../../../lib/types/order.types';
import { money } from '../orders/orderAdminUtils';

const RESOLUTION_COPY: Record<DisputeResolution, { label: string; confirm: (order: OrderDto) => string }> = {
  [DisputeResolution.REFUND_PASSENGER]: {
    label: 'Refund passenger',
    confirm: (order) =>
      `Refund ${money(order.fare)} to the passenger's wallet and cancel this order? This cannot be undone.`,
  },
  [DisputeResolution.PAY_DRIVER]: {
    label: 'Pay driver',
    confirm: (order) =>
      `Release ${money(order.driverEarning || order.fare)} to the driver's wallet and complete this order? This cannot be undone.`,
  },
  [DisputeResolution.DISMISS]: {
    label: 'Dismiss',
    confirm: () =>
      'Dismiss this dispute with no wallet changes? The order returns to its in-progress state for normal completion.',
  },
};

export default function DisputeResolveActions({
  device,
  order,
  onResolved,
}: {
  device: string;
  order: OrderDto;
  onResolved: (updated: OrderDto) => void;
}) {
  const [pending, setPending] = useState<DisputeResolution | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (order.status !== 'DISPUTED') {
    return <div className="text-sm text-slate-500 dark:text-slate-400">This order is not currently disputed.</div>;
  }

  const submit = async (resolution: DisputeResolution) => {
    setSubmitting(true);
    setError(null);
    try {
      const response = await disputeService.resolveDispute(device, order.id, { resolution });
      onResolved(response.data);
      setPending(null);
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || requestError?.message || 'Failed to resolve dispute');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}
      <div className="flex flex-wrap justify-end gap-2">
        <button
          className="btn-secondary"
          onClick={() => setPending(DisputeResolution.DISMISS)}
          disabled={submitting}
        >
          Dismiss
        </button>
        <button
          className="rounded-md bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-60"
          onClick={() => setPending(DisputeResolution.REFUND_PASSENGER)}
          disabled={submitting}
        >
          Refund passenger
        </button>
        <button
          className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          onClick={() => setPending(DisputeResolution.PAY_DRIVER)}
          disabled={submitting}
        >
          Pay driver
        </button>
      </div>

      <Modal open={!!pending} onClose={() => setPending(null)} title="Confirm resolution">
        {pending && (
          <div className="space-y-4">
            <p className="text-sm text-slate-700 dark:text-slate-300">{RESOLUTION_COPY[pending].confirm(order)}</p>
            <div className="flex justify-end gap-2">
              <button className="btn-secondary" onClick={() => setPending(null)} disabled={submitting}>
                Cancel
              </button>
              <button
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                onClick={() => submit(pending)}
                disabled={submitting}
              >
                {submitting ? 'Processing...' : `Confirm ${RESOLUTION_COPY[pending].label.toLowerCase()}`}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
