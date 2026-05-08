'use client';

import StatusBadge from '../utils/StatusBadge';
import type { Status } from '../utils/StatusBadge';
import { EmptyTableRow, TableShell, ViewButton } from '../utils/DataTable';
import SeatsIndicator from './SeatIndicator';
import { AdminRide, rideAddress } from '../../../lib/types/adminRide.types';

export default function RidesTable({
  rides,
  onView,
}: {
  rides: AdminRide[];
  onView: (ride: AdminRide) => void;
}) {
  return (
    <TableShell>
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <tr>
            <th className="px-4 py-3 text-left">Route</th>
            <th className="px-4 py-3 text-left">Driver</th>
            <th className="px-4 py-3 text-left">Schedule</th>
            <th className="px-4 py-3 text-left">Seats</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>

        <tbody>
          {rides.map((ride) => (
            <tr
              key={ride.id}
              className="border-t border-slate-200 transition hover:bg-blue-50/60 dark:border-slate-800 dark:hover:bg-slate-800/70"
            >
              <td className="px-4 py-3">
                <div className="font-medium text-slate-900 dark:text-slate-100">
                  {rideAddress(ride.origin)} to {rideAddress(ride.destination)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Vehicle: {ride.vehicleId || 'Unassigned'}
                </div>
              </td>
              <td className="px-4 py-3">{ride.riderId || 'Unassigned'}</td>
              <td className="px-4 py-3">
                <div>{ride.recurring ? 'Recurring' : 'Single trip'}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {ride.departureTime ? new Date(ride.departureTime).toLocaleString() : 'Not scheduled'}
                </div>
              </td>
              <td className="px-4 py-3">
                <SeatsIndicator
                  total={(ride.seatsAvailable || 0) + (ride.seatsBooked || 0)}
                  booked={ride.seatsBooked || 0}
                />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={(ride.status || 'pending').toLowerCase() as Status} />
              </td>
              <td className="px-4 py-3 text-right">
                <ViewButton onClick={() => onView(ride)} />
              </td>
            </tr>
          ))}
          {rides.length === 0 && (
            <EmptyTableRow colSpan={6} message="No rides found." />
          )}
        </tbody>
      </table>
    </TableShell>
  );
}
