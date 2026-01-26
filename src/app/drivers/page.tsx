// 'use client';

// import { useMemo, useState } from 'react';
// import { Driver, drivers } from '../../../data/driver.mock';

// import DriversTable from '@/component/drivers/DriversTable';
// import DriverProfileDrawer from '@/component/drivers/DriverProfileDrawer';
// import TableFilterBar from '@/component/filters/TableFilterBar';
// import Pagination from '@/component/utils/Pagination';

// const PAGE_SIZE = 5;

// export default function DriversPage() {
//   const [selected, setSelected] = useState<Driver | null>(null);

//   const [search, setSearch] = useState('');
//   const [status, setStatus] = useState('all');
//   const [from, setFrom] = useState('');
//   const [to, setTo] = useState('');
//   const [page, setPage] = useState(1);

//   // 🔍 Filtering logic
//   const filteredDrivers = useMemo(() => {
//     return drivers.filter((d) => {
//       const matchesSearch =
//         d.name.toLowerCase().includes(search.toLowerCase()) ||
//         d.email.toLowerCase().includes(search.toLowerCase()) ||
//         d.phone.includes(search) ||
//         d.vehicle.plateNumber.toLowerCase().includes(search.toLowerCase());

//       const matchesStatus =
//         status === 'all' || d.status === status;

//       const joined = new Date(d.joinedAt).getTime();
//       const afterFrom = from ? joined >= new Date(from).getTime() : true;
//       const beforeTo = to ? joined <= new Date(to).getTime() : true;

//       return matchesSearch && matchesStatus && afterFrom && beforeTo;
//     });
//   }, [search, status, from, to]);

//   // 📄 Pagination
//   const totalPages = Math.ceil(filteredDrivers.length / PAGE_SIZE);
//   const paginatedDrivers = filteredDrivers.slice(
//     (page - 1) * PAGE_SIZE,
//     page * PAGE_SIZE
//   );

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <header>
//         <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
//           Drivers Management
//         </h1>
//         <p className="text-sm text-gray-500 dark:text-gray-400">
//           Verify drivers, manage vehicles, and monitor earnings
//         </p>
//       </header>

//       {/* Filters */}
//       <TableFilterBar
//         search={search}
//         status={status}
//         from={from}
//         to={to}
//         onSearch={setSearch}
//         onStatusChange={setStatus}
//         onFromChange={setFrom}
//         onToChange={setTo}
//         statusOptions={[
//           { label: 'All', value: 'all' },
//           { label: 'Active', value: 'active' },
//           { label: 'Suspended', value: 'suspended' },
//         ]}
//       />

//       {/* Table */}
//       <DriversTable drivers={paginatedDrivers} onView={setSelected} />

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <Pagination
//           page={page}
//           totalPages={totalPages}
//           onPageChange={setPage}
//         />
//       )}

//       {/* Drawer */}
//       <DriverProfileDrawer
//         driver={selected}
//         open={!!selected}
//         onClose={() => setSelected(null)}
//       />
//     </div>
//   );
// }
'use client';

import { useEffect, useMemo, useState } from 'react';


import { Rider } from '../../../lib/types/rider.types';
import { useRider } from '../../../lib/hooks/useRider';
import TableFilterBar from '@/component/filters/TableFilterBar';
import { Loader } from 'lucide-react';
import DriversTable from '@/component/drivers/DriversTable';
import Pagination from '@/component/utils/Pagination';
import DriverProfileDrawer from '@/component/drivers/DriverProfileDrawer';

const PAGE_SIZE = 10;
const DEVICE = 'web';

export default function DriversPage() {
  const {
    riders,
    loading,
    error,
    getAllRiders,
    activateRider,
    deactivateRider,
  } = useRider();

  const [selected, setSelected] = useState<Rider | null>(null);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const [page, setPage] = useState(0);

  // ✅ Fetch Riders From API
  useEffect(() => {
    getAllRiders(DEVICE, {
      query: search || undefined,
      page,
      size: PAGE_SIZE,
    });
  }, [search, page]);

  // ✅ Local status filter (API optional)
  const filteredDrivers = useMemo(() => {
    if (!riders?.content) return [];

    return riders.content.filter((r) => {
      if (status === 'all') return true;
      if (status === 'active') return r.available === true;
      if (status === 'suspended') return r.available === false;
      return true;
    });
  }, [riders, status]);

  return (
    <div className="space-y-6">

      {/* Header */}
      <header>
        <h1 className="text-2xl font-semibold">
          Drivers Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage riders, vehicles and availability
        </p>
      </header>

      {/* Filters */}
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

      {/* Loading */}
      {loading && <Loader />}

      {/* Error */}
      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <DriversTable drivers={filteredDrivers} onView={setSelected} />

      {/* Pagination */}
      {riders && riders.totalPages > 1 && (
        <Pagination
          page={page + 1}
          totalPages={riders.totalPages}
          onPageChange={(p) => setPage(p - 1)}
        />
      )}

      {/* Drawer */}
      <DriverProfileDrawer
        driver={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
