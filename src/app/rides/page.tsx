'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader } from 'lucide-react';
import RidesTable from '@/component/rides/RidesTable';
import RideDetailsDrawer from '@/component/rides/RideDetailsDrawer';
import TableFilterBar from '@/component/filters/TableFilterBar';
import { useRide } from '../../../lib/hooks/useRide';
import { AdminRide, rideAddress } from '../../../lib/types/adminRide.types';

const DEVICE = 'web';

export default function RidesPage() {
  const { rideHistory, loading, error, getRideHistory, updateRideStatus } = useRide();
  const [selected, setSelected] = useState<AdminRide | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  useEffect(() => {
    getRideHistory(DEVICE, {
      status: status === 'all' ? undefined : status.toUpperCase(),
      fromDate: from || undefined,
      toDate: to || undefined,
    });
  }, [status, from, to, getRideHistory]);

  const filtered = useMemo(() => {
    return (rideHistory as AdminRide[]).filter((ride) => {
      const query = search.toLowerCase();
      const matchesSearch =
        rideAddress(ride.origin).toLowerCase().includes(query) ||
        rideAddress(ride.destination).toLowerCase().includes(query) ||
        (ride.riderId || '').toLowerCase().includes(query) ||
        (ride.vehicleId || '').toLowerCase().includes(query);

      return matchesSearch;
    });
  }, [rideHistory, search]);

  const handleCancel = async (rideId: string) => {
    await updateRideStatus(DEVICE, rideId, 'CANCELLED');
    await getRideHistory(DEVICE);
    setSelected(null);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Rides Management
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Monitor and manage ride offers created by drivers
        </p>
      </header>

      <TableFilterBar
        search={search}
        status={status}
        from={from}
        to={to}
        onSearch={setSearch}
        onStatusChange={setStatus}
        onFromChange={setFrom}
        onToChange={setTo}
        statusOptions={[
          { label: 'All', value: 'all' },
          { label: 'Pending', value: 'pending' },
          { label: 'Ongoing', value: 'ongoing' },
          { label: 'Completed', value: 'completed' },
          { label: 'Cancelled', value: 'cancelled' },
        ]}
      />

      {loading && <Loader className="h-5 w-5 animate-spin text-blue-600" />}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      <RidesTable rides={filtered} onView={setSelected} />

      <RideDetailsDrawer
        ride={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onCancel={handleCancel}
      />
    </div>
  );
}
