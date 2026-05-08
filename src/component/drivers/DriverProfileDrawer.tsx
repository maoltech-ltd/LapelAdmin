'use client';

import { useState } from 'react';
import EntityStatsSection from '@/component/stats/EntityStatsSection';
import { DetailGrid, DetailSection, StatSummaryGrid } from '@/component/utils/DetailBlocks';
import DetailDrawer from '@/component/utils/DetailDrawer';
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
      if (driver?.id) tasks.push(riderService.reviewRiderDocuments(DEVICE, driver.id, payload));
      if (driver?.vehicle?.id) tasks.push(riderService.reviewVehicleDocuments(DEVICE, driver.vehicle.id, payload));
      if (tasks.length === 0) throw new Error('Missing rider or vehicle id for review.');
      await Promise.all(tasks);
      onReviewed?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Document review failed');
    } finally {
      setBusy(false);
    }
  }

  const name = driver.user?.username || [driver.user?.firstName, driver.user?.lastName].filter(Boolean).join(' ') || 'Driver';
  const canReview = Boolean(driver.id || driver.vehicle?.id);
  const vehicleName = [driver.vehicle?.year, driver.vehicle?.make, driver.vehicle?.model].filter(Boolean).join(' ');

  return (
    <DetailDrawer
      open={open}
      onClose={onClose}
      widthClassName="max-w-6xl"
      title={name}
      subtitle={driver.user?.email || driver.user?.phoneNumber || driver.id}
      badge={<VerificationStatusBadge status={normalizeStatus(driver.documentReviewStatus)} />}
      footer={
        <div className="flex flex-wrap gap-2">
          <button disabled={busy || !canReview} onClick={() => review('ACCEPTED')} className="btn-primary bg-emerald-600 hover:bg-emerald-700">
            Approve
          </button>
          <button
            disabled={busy || !canReview}
            onClick={() => review('DECLINED')}
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            Reject
          </button>
          <button className="btn-secondary">Suspend</button>
        </div>
      }
    >
      <div className="space-y-5">
        <StatSummaryGrid
          stats={[
            { label: 'Availability', value: driver.available ? 'Available' : 'Offline', hint: 'Driver status' },
            { label: 'Rating', value: driver.rating?.toFixed?.(1) ?? 'N/A', hint: 'Average customer rating' },
            { label: 'Vehicle seats', value: driver.vehicle?.seats ?? 'N/A', hint: vehicleName || 'Assigned vehicle' },
            { label: 'Plate', value: driver.vehicle?.licensePlateNumber || 'N/A', hint: driver.vehicle?.color || 'Vehicle color' },
          ]}
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <DetailSection title="Personal info">
            <DetailGrid
              items={[
                { label: 'Name', value: name },
                { label: 'Email', value: driver.user?.email },
                { label: 'Phone', value: driver.user?.phoneNumber },
                { label: 'Driver license', value: driver.driverLicenseNumber },
              ]}
            />
          </DetailSection>

          <DetailSection title="Vehicle info">
            <DetailGrid
              items={[
                { label: 'Vehicle', value: vehicleName },
                { label: 'Plate', value: driver.vehicle?.licensePlateNumber },
                { label: 'Color', value: driver.vehicle?.color },
                { label: 'Vehicle license', value: driver.vehicle?.vehicleLicenseNumber },
              ]}
            />
          </DetailSection>
        </div>

        <DetailSection title="Documents">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <DocumentViewer label="Driver License" url={driver.driverLicense} />
              <VerificationStatusBadge status={normalizeStatus(driver.documentReviewStatus)} />
              {driver.documentReviewReason && <p className="text-xs text-red-600">{driver.documentReviewReason}</p>}
            </div>
            <div className="space-y-2">
              <DocumentViewer label="Vehicle Document" url={driver.vehicle?.vehicleLicense} />
              <VerificationStatusBadge status={normalizeStatus(driver.vehicle?.documentReviewStatus)} />
              {driver.vehicle?.documentReviewReason && <p className="text-xs text-red-600">{driver.vehicle.documentReviewReason}</p>}
            </div>
          </div>
        </DetailSection>

        <DetailSection title="Performance">
          <RatingSummary rating={driver.rating} trips={20} />
        </DetailSection>

        {driver.id && (
          <EntityStatsSection
            entityType="RIDER"
            entityId={driver.id}
            title="Rider stats and transaction usage"
            exportFilename="rider-stats.csv"
          />
        )}

        {driver.vehicle?.id && (
          <EntityStatsSection
            entityType="VEHICLE"
            entityId={driver.vehicle.id}
            title="Vehicle stats and ride usage"
            exportFilename="vehicle-stats.csv"
          />
        )}

        <DetailSection title="Decline template">
          <div className="space-y-2">
            <select
              value={reasonCode}
              onChange={(event) => setReasonCode(event.target.value)}
              className="input w-full"
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
              className="input min-h-24 w-full"
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
        </DetailSection>
      </div>
    </DetailDrawer>
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
