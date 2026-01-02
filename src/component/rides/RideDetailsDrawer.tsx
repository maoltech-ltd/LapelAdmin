'use client';

import { Ride } from '../../../data/ride.mock';
import StatusBadge from '../utils/StatusBadge';
import RouteMap from './RouteMap';
import SeatsIndicator from './SeatIndicator';

export default function RideDetailsDrawer({
  ride,
  open,
  onClose,
}: {
  ride: Ride | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!open || !ride) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="w-full max-w-xl bg-white p-6 dark:bg-gray-900">
        
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Ride Details</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="mt-4 space-y-4 text-sm">
          <RouteMap />

          <section>
            <p className="font-medium">
              {ride.origin} → {ride.destination}
            </p>
            {ride.waypoints?.length || 0 > 0 && (
              <p className="text-xs text-gray-500">
                Waypoints: {ride.waypoints?.join(', ')}
              </p>
            )}
          </section>

          <section className="flex items-center gap-4">
            <StatusBadge status={ride.status} />
            <SeatsIndicator total={ride.totalSeats} booked={ride.bookedSeats} />
          </section>

          <section>
            <p>Schedule: {ride.scheduleType}</p>
            <p>Date: {ride.date}</p>
            <p>Price per seat: ₦{ride.pricePerSeat}</p>
          </section>

          {/* Admin Actions */}
          <section className="flex flex-wrap gap-2 pt-4">
            <button className="rounded-md bg-red-600 px-3 py-1 text-white">
              Cancel Ride
            </button>
            <button className="rounded-md border px-3 py-1 dark:border-gray-700">
              Edit Ride
            </button>
            <button className="rounded-md border px-3 py-1 dark:border-gray-700">
              Block Route
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
