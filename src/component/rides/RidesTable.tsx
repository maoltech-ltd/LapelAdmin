'use client';

import { Ride } from '../../../data/ride.mock';
import StatusBadge from '../utils/StatusBadge';
import SeatsIndicator from './SeatIndicator';

export default function RidesTable({
  rides,
  onView,
}: {
  rides: Ride[];
  onView: (ride: Ride) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white dark:border-gray-800 dark:bg-gray-900">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800">
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
          {rides.map((r: Ride) => (
            <tr
              key={r.id}
              className="border-t hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
            >
              <td className="px-4 py-3">
                <div className="font-medium">{r.origin} → {r.destination}</div>
                {
                r.waypoints?.length || 0 > 0 && (
                  <div className="text-xs text-gray-500">
                    via {r.waypoints?.join(', ') || ''}
                  </div>
                )}
              </td>

              <td className="px-4 py-3">{r.driverName}</td>

              <td className="px-4 py-3">
                <div>{r.scheduleType}</div>
                <div className="text-xs text-gray-500">{r.date}</div>
              </td>

              <td className="px-4 py-3">
                <SeatsIndicator total={r.totalSeats} booked={r.bookedSeats} />
              </td>

              <td className="px-4 py-3">
                <StatusBadge status={r.status} />
              </td>

              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onView(r)}
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
