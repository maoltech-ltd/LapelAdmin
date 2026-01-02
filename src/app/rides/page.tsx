'use client';

import { useMemo, useState } from 'react';
import { Ride, rides } from '../../../data/ride.mock';

import RidesTable from '@/component/rides/RidesTable';
import RideDetailsDrawer from '@/component/rides/RideDetailsDrawer';
import TableFilterBar from '@/component/filters/TableFilterBar';
import Pagination from '@/component/utils/Pagination';

const PAGE_SIZE = 5;

export default function RidesPage() {
  const [selected, setSelected] = useState<Ride | null>(null);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return rides.filter((r) => {
      const matchesSearch =
        r.origin.toLowerCase().includes(search.toLowerCase()) ||
        r.destination.toLowerCase().includes(search.toLowerCase()) ||
        r.driverName.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === 'all' || r.status === status;

      const created = new Date(r.createdAt).getTime();
      const afterFrom = from ? created >= new Date(from).getTime() : true;
      const beforeTo = to ? created <= new Date(to).getTime() : true;

      return matchesSearch && matchesStatus && afterFrom && beforeTo;
    });
  }, [search, status, from, to]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Rides Management</h1>
        <p className="text-sm text-gray-500">
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
          { label: 'Scheduled', value: 'scheduled' },
          { label: 'Ongoing', value: 'ongoing' },
          { label: 'Completed', value: 'completed' },
          { label: 'Cancelled', value: 'cancelled' },
        ]}
      />

      <RidesTable rides={paginated} onView={setSelected} />

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      <RideDetailsDrawer
        ride={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
