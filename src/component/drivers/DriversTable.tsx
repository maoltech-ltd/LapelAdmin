'use client';

import StatusBadge from '@/component/utils/StatusBadge';
import VerificationStatusBadge from './VerificationStatusBadge';
import RatingSummary from './RatingSummary';
import { Rider } from '../../../lib/types/rider.types';

type VerificationBadgeStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'under_review'
  | 'accepted'
  | 'declined'
  | 'not_submitted';

export default function DriversTable({
  drivers,
  onView,
}: {
  drivers: Rider[];
  onView: (driver: Rider) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white dark:border-gray-800 dark:bg-gray-900">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left">Driver</th>
            <th className="px-4 py-3 text-left">Vehicle</th>
            <th className="px-4 py-3 text-left">Verification</th>
            <th className="px-4 py-3 text-left">Rating</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>

        <tbody>
          {drivers.map((d) => (
            <tr
              key={d.id}
              className="border-t hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
            >
              <td className="px-4 py-3">
                <div className="font-medium">{d.user?.username || d.user?.firstName}</div>
                <div className="text-xs text-gray-500">{d.user?.phoneNumber}</div>
              </td>

              <td className="px-4 py-3">
                <div>{d.vehicle?.make}</div>
                <div className="text-xs text-gray-500">{d.vehicle?.licensePlateNumber}</div>
              </td>

              <td className="px-4 py-3 space-y-1">
                <VerificationStatusBadge status={normalizeStatus(d.documentReviewStatus)} />
                <StatusBadge status={d.available ? 'active' : 'inactive'} />
              </td>

              <td className="px-4 py-3">
                <RatingSummary rating={d?.rating} trips={20} />
              </td>

              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onView(d)}
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
