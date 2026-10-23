'use client';

import { useEffect, useState } from 'react';
import { DetailGrid, DetailSection } from '@/component/utils/DetailBlocks';
import { DriverStrikeStatus, riderService } from '../../../lib/api/services/riderService';

const REASON_LABELS: Record<string, string> = {
  DRIVER_CANCELLED: 'Cancelled a confirmed seat late',
  PASSENGER_REMOVED_AT_START: 'Removed a passenger at trip start',
  RIDE_DAY_PAUSED: 'Paused a booked day late',
};

/** Read-only late-cancellation strike status (Lapel writes driver_strikes). */
export default function DriverStrikesSection({ device, userId }: { device: string; userId?: string }) {
  const [status, setStatus] = useState<DriverStrikeStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    riderService
      .getDriverStrikes(device, userId)
      .then((response) => {
        if (!cancelled) setStatus(response.data ?? null);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load strikes');
      });
    return () => {
      cancelled = true;
    };
  }, [device, userId]);

  if (!userId) return null;

  return (
    <DetailSection title="Cancellation strikes">
      {error && <p className="text-xs text-red-600">{error}</p>}
      {!error && !status && <p className="text-xs text-slate-500">Loading...</p>}
      {status && (
        <div className="space-y-3">
          <DetailGrid
            items={[
              {
                label: `Strikes (last ${status.windowDays ?? 30} days)`,
                value: `${status.count30d} / ${status.threshold}`,
              },
              {
                label: 'Publishing',
                value: status.suspendedUntil
                  ? `Suspended until ${new Date(status.suspendedUntil).toLocaleString()}`
                  : 'Allowed',
              },
            ]}
          />
          {status.strikes.length > 0 && (
            <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
              {status.strikes.map((strike, index) => (
                <li key={`${strike.orderId ?? 'strike'}-${index}`}>
                  {strike.occurredAt ? new Date(strike.occurredAt).toLocaleString() : 'Unknown time'} -{' '}
                  {REASON_LABELS[strike.reason ?? ''] ?? strike.reason ?? 'Late cancellation'}
                  {strike.orderId ? ` (order ${strike.orderId})` : ''}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </DetailSection>
  );
}
