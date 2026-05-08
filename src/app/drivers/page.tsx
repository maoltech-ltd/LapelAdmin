'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader } from 'lucide-react';
import { Rider } from '../../../lib/types/rider.types';
import { useRider } from '../../../lib/hooks/useRider';
import TableFilterBar from '@/component/filters/TableFilterBar';
import DriversTable from '@/component/drivers/DriversTable';
import Pagination from '@/component/utils/Pagination';
import DriverProfileDrawer from '@/component/drivers/DriverProfileDrawer';

const PAGE_SIZE = 10;
const DEVICE = 'web';

export default function DriversPage() {
  const { riders, loading, error, getAllRiders } = useRider();
  const [selected, setSelected] = useState<Rider | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    getAllRiders(DEVICE, {
      query: search || undefined,
      page,
      size: PAGE_SIZE,
    });
  }, [search, page, getAllRiders]);

  const filteredDrivers = useMemo(() => {
    if (!riders?.content) return [];

    return riders.content.filter((rider) => {
      if (status === 'all') return true;
      if (status === 'active') return rider.available === true;
      if (status === 'suspended') return rider.available === false;
      return true;
    });
  }, [riders, status]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Drivers Management</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage riders, vehicles and availability
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
          { label: 'Active', value: 'active' },
          { label: 'Suspended', value: 'suspended' },
        ]}
      />

      {loading && <Loader className="h-5 w-5 animate-spin text-blue-600" />}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      <DriversTable drivers={filteredDrivers} onView={setSelected} />

      {riders && riders.totalPages > 1 && (
        <Pagination page={page + 1} totalPages={riders.totalPages} onPageChange={(p) => setPage(p - 1)} />
      )}

      <DriverProfileDrawer
        driver={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onReviewed={() =>
          getAllRiders(DEVICE, {
            query: search || undefined,
            page,
            size: PAGE_SIZE,
          })
        }
      />
    </div>
  );
}
