'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, ChevronRight, Loader } from 'lucide-react';
import { useRide } from '../../../../../lib/hooks/useRide';
import StatusBadge from '@/component/utils/StatusBadge';
import type { Status } from '@/component/utils/StatusBadge';
import { TableShell, EmptyTableRow } from '@/component/utils/DataTable';
import { AdminRideOccurrence } from '../../../../../lib/types/adminRide.types';

const DEVICE = 'web';

export default function RideOccurrencesPage() {
  const params = useParams<{ rideId: string }>();
  const router = useRouter();
  const rideId = params.rideId;
  const { occurrences, occurrencesLoading, error, getRideOccurrences } = useRide();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (rideId) {
      getRideOccurrences(DEVICE, rideId);
    }
  }, [rideId, getRideOccurrences]);

  const list = (occurrences || []) as AdminRideOccurrence[];

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <button
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          onClick={() => router.push('/rides')}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Ride series occurrences
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            All dated occurrences for recurring ride {rideId}, with roster per date.
          </p>
        </div>
      </header>

      {occurrencesLoading && <Loader className="h-5 w-5 animate-spin text-blue-600" />}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      <TableShell>
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th className="px-4 py-3 text-left"></th>
              <th className="px-4 py-3 text-left">Departure</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Seats</th>
              <th className="px-4 py-3 text-left">Roster</th>
            </tr>
          </thead>
          <tbody>
            {list.map((occurrence) => {
              const isOpen = !!expanded[occurrence.id];
              const roster = occurrence.roster || [];
              return (
                <>
                  <tr
                    key={occurrence.id}
                    className="cursor-pointer border-t border-slate-200 transition hover:bg-blue-50/60 dark:border-slate-800 dark:hover:bg-slate-800/70"
                    onClick={() =>
                      setExpanded((prev) => ({ ...prev, [occurrence.id]: !prev[occurrence.id] }))
                    }
                  >
                    <td className="px-4 py-3 text-slate-400">
                      {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                      {occurrence.departureTimeUtc
                        ? new Date(occurrence.departureTimeUtc).toLocaleString()
                        : 'Not scheduled'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={(occurrence.status || 'available').toLowerCase() as Status} />
                    </td>
                    <td className="px-4 py-3">
                      {(occurrence.seatsBooked || 0)} booked / {(occurrence.seatsAvailable || 0)} open
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                      {roster.length} passenger{roster.length === 1 ? '' : 's'}
                    </td>
                  </tr>
                  {isOpen && (
                    <tr key={`${occurrence.id}-roster`} className="bg-slate-50/60 dark:bg-slate-900/40">
                      <td></td>
                      <td className="px-4 py-3" colSpan={4}>
                        {roster.length === 0 ? (
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            No passengers booked on this date.
                          </span>
                        ) : (
                          <ul className="space-y-1">
                            {roster.map((entry) => (
                              <li
                                key={entry.orderId || entry.passengerId}
                                className="flex items-center justify-between text-sm"
                              >
                                <span className="text-slate-800 dark:text-slate-200">
                                  {entry.passengerName || entry.passengerId}
                                  {entry.passengerPhone ? ` · ${entry.passengerPhone}` : ''}
                                </span>
                                <StatusBadge
                                  status={(entry.orderStatus || 'created').toLowerCase() as Status}
                                />
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
            {list.length === 0 && !occurrencesLoading && (
              <EmptyTableRow colSpan={5} message="No occurrences found for this ride." />
            )}
          </tbody>
        </table>
      </TableShell>
    </div>
  );
}
