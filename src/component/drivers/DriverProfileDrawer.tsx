'use client';

import { useState } from 'react';
import { Rider } from '../../../lib/types/rider.types';
import { riderService } from '../../../lib/api/services/riderService';
import DocumentViewer from './DocumentViewer';
import RatingSummary from './RatingSummary';
import VerificationStatusBadge from './VerificationStatusBadge';

const DEVICE = 'web';
const declineReasons = [
  { code: 'BLURRY_DOCUMENT', label: 'Blurry or unreadable document' },
  { code: 'EXPIRED_DOCUMENT', label: 'Expired document' },
  { code: 'NAME_MISMATCH', label: 'Name does not match profile' },
  { code: 'PLATE_MISMATCH', label: 'Vehicle plate does not match' },
  { code: 'INCOMPLETE_DOCUMENT', label: 'Incomplete document' },
];

type VerificationBadgeStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'under_review'
  | 'accepted'
  | 'declined'
  | 'not_submitted';

export default function DriverProfileDrawer({
  driver,
  open,
  onClose,
  onReviewed,
}: {
  driver: Rider | null;
  open: boolean;
  onClose: () => void;
  onReviewed?: () => void;
}) {
  const [reasonCode, setReasonCode] = useState(declineReasons[0].code);
  const [customReason, setCustomReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open || !driver) return null;

  async function review(status: 'ACCEPTED' | 'DECLINED') {
    if (!driver) return;
    setBusy(true);
    setError(null);
    try {
      const payload = {
        status,
        ...(status === 'DECLINED'
          ? {
              templateReasonCode: reasonCode,
              reason: customReason.trim() || undefined,
            }
          : {}),
      };
      const tasks: Promise<unknown>[] = [];
      if (driver.id) {
        tasks.push(riderService.reviewRiderDocuments(DEVICE, driver.id, payload));
      }
      if (driver.vehicle?.id) {
        tasks.push(riderService.reviewVehicleDocuments(DEVICE, driver.vehicle.id, payload));
      }
      if (tasks.length === 0) {
        throw new Error('Missing rider or vehicle id for review.');
      }
      await Promise.all(tasks);
      onReviewed?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Document review failed');
    } finally {
      setBusy(false);
    }
  }

  const canReview = Boolean(driver.id || driver.vehicle?.id);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="w-full max-w-xl overflow-y-auto bg-white p-6 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {driver.user?.username || driver.user?.firstName || 'Driver'}
          </h2>
          <button onClick={onClose} aria-label="Close">x</button>
        </div>

        <div className="mt-4 space-y-4 text-sm">
          <section>
            <h3 className="font-medium">Personal Info</h3>
            <p>{driver.user?.email || driver.user?.phoneNumber || 'N/A'}</p>
            <p>{driver.user?.phoneNumber || 'N/A'}</p>
          </section>

          <section>
            <h3 className="font-medium">Vehicle Info</h3>
            <p>{driver.vehicle?.make} {driver.vehicle?.model}</p>
            <p>{driver.vehicle?.licensePlateNumber}</p>
            <p>{driver.vehicle?.color}</p>
          </section>

          <section className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <DocumentViewer label="Driver License" url={driver.driverLicense} />
              <VerificationStatusBadge status={normalizeStatus(driver.documentReviewStatus)} />
              {driver.documentReviewReason && (
                <p className="text-xs text-red-600">{driver.documentReviewReason}</p>
              )}
            </div>
            <div className="space-y-2">
              <DocumentViewer label="Vehicle Document" url={driver.vehicle?.vehicleLicense} />
              <VerificationStatusBadge status={normalizeStatus(driver.vehicle?.documentReviewStatus)} />
              {driver.vehicle?.documentReviewReason && (
                <p className="text-xs text-red-600">{driver.vehicle.documentReviewReason}</p>
              )}
            </div>
          </section>

          <section>
            <h3 className="font-medium">Performance</h3>
            <RatingSummary rating={driver.rating} trips={20} />
            <p className="text-xs text-gray-500">Earnings: NGN {100000000}</p>
          </section>

          <section className="space-y-2 rounded-lg border p-3 dark:border-gray-800">
            <h3 className="font-medium">Decline template</h3>
            <select
              value={reasonCode}
              onChange={(event) => setReasonCode(event.target.value)}
              className="w-full rounded-md border bg-transparent px-3 py-2 text-sm dark:border-gray-700"
            >
              {declineReasons.map((reason) => (
                <option key={reason.code} value={reason.code}>
                  {reason.label}
                </option>
              ))}
            </select>
            <textarea
              value={customReason}
              onChange={(event) => setCustomReason(event.target.value)}
              placeholder="Optional extra note"
              className="min-h-20 w-full rounded-md border bg-transparent px-3 py-2 text-sm dark:border-gray-700"
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
          </section>

          <section className="flex flex-wrap gap-2 pt-4">
            <button
              disabled={busy || !canReview}
              onClick={() => review('ACCEPTED')}
              className="rounded-md bg-green-600 px-3 py-1 text-white disabled:opacity-50"
            >
              Approve
            </button>
            <button
              disabled={busy || !canReview}
              onClick={() => review('DECLINED')}
              className="rounded-md bg-red-600 px-3 py-1 text-white disabled:opacity-50"
            >
              Reject
            </button>
            <button className="rounded-md border px-3 py-1 dark:border-gray-700">
              Suspend
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

function normalizeStatus(status?: string): VerificationBadgeStatus {
  switch (status) {
    case 'ACCEPTED':
      return 'accepted';
    case 'DECLINED':
      return 'declined';
    case 'UNDER_REVIEW':
      return 'under_review';
    default:
      return 'not_submitted';
  }
}
