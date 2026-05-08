'use client';

import EntityStatsSection from '@/component/stats/EntityStatsSection';
import { DetailGrid, DetailSection, StatSummaryGrid } from '@/component/utils/DetailBlocks';
import DetailDrawer from '@/component/utils/DetailDrawer';
import StatusBadge from '../utils/StatusBadge';
import type { Status } from '../utils/StatusBadge';
import RouteMap from './RouteMap';
import SeatsIndicator from './SeatIndicator';
import { AdminRide, rideAddress } from '../../../lib/types/adminRide.types';

export default function RideDetailsDrawer({
  ride,
  open,
  onClose,
  onCancel,
}: {
  ride: AdminRide | null;
  open: boolean;
  onClose: () => void;
  onCancel: (rideId: string) => void;
}) {
  if (!open || !ride) return null;

  const seatsTotal = (ride.seatsAvailable || 0) + (ride.seatsBooked || 0);
  const bookedPercent = seatsTotal ? Math.round(((ride.seatsBooked || 0) / seatsTotal) * 100) : 0;

  return (
    <DetailDrawer
      open={open}
      onClose={onClose}
      widthClassName="max-w-5xl"
      title="Ride details"
      subtitle={`${rideAddress(ride.origin)} to ${rideAddress(ride.destination)}`}
      badge={<StatusBadge status={(ride.status || 'pending').toLowerCase() as Status} />}
      footer={
        <button
          className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
          onClick={() => onCancel(ride.id)}
          disabled={(ride.status || '').toUpperCase() === 'CANCELLED'}
        >
          Cancel Ride
        </button>
      }
    >
      <div className="space-y-5">
        <StatSummaryGrid
          stats={[
            { label: 'Fare', value: `NGN ${Number(ride.fare || 0).toLocaleString()}`, hint: 'Listed ride fare' },
            { label: 'Booked seats', value: ride.seatsBooked || 0, hint: `${bookedPercent}% occupancy` },
            { label: 'Open seats', value: ride.seatsAvailable || 0, hint: `${seatsTotal} total seats` },
            { label: 'Schedule', value: ride.recurring ? 'Recurring' : 'Single', hint: 'Ride frequency' },
          ]}
        />

        <DetailSection title="Route">
          <div className="space-y-4">
            <RouteMap />
            <DetailGrid
              items={[
                { label: 'Origin', value: rideAddress(ride.origin) },
                { label: 'Destination', value: rideAddress(ride.destination) },
                { label: 'Departure', value: ride.departureTime ? new Date(ride.departureTime).toLocaleString() : 'Not scheduled' },
                { label: 'Seats', value: <SeatsIndicator total={seatsTotal} booked={ride.seatsBooked || 0} /> },
                { label: 'Driver ID', value: ride.riderId || 'Unassigned' },
                { label: 'Vehicle ID', value: ride.vehicleId || 'Unassigned' },
              ]}
            />
          </div>
        </DetailSection>

        {ride.riderId && (
          <EntityStatsSection
            entityType="RIDER"
            entityId={ride.riderId}
            title="Driver stats for this ride"
            exportFilename="ride-driver-stats.csv"
          />
        )}

        {ride.vehicleId && (
          <EntityStatsSection
            entityType="VEHICLE"
            entityId={ride.vehicleId}
            title="Vehicle stats and ride usage"
            exportFilename="ride-vehicle-stats.csv"
          />
        )}
      </div>
    </DetailDrawer>
  );
}
