'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Loader } from 'lucide-react';
import Pagination from '@/component/utils/Pagination';
import TableFilterBar from '@/component/filters/TableFilterBar';
import OrdersTable from '@/component/orders/OrdersTable';
import OrderDetailsDrawer from '@/component/orders/OrderDetailsDrawer';
import { orderService } from '../../../lib/api/services/orderService';
import { OrderDto, OrderStatus, PaginatedResponse } from '../../../lib/types/order.types';
import { useDebouncedValue } from '../../../lib/hooks/useDebouncedValue';
import { orderFlags } from '@/component/orders/orderAdminUtils';

const DEVICE = 'web';
const PAGE_SIZE = 10;

export default function OrdersPage() {
  const [orders, setOrders] = useState<PaginatedResponse<OrderDto> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<OrderDto | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const [status, setStatus] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    orderService
      .getAllOrders(DEVICE, {
        page: page - 1,
        size: PAGE_SIZE,
        query: debouncedSearch || undefined,
        status: status === 'all' ? undefined : (status as OrderStatus),
        fromDate: from || undefined,
        toDate: to || undefined,
        sortBy: 'createdAt',
        sortDirection: 'DESC',
      })
      .then((response) => {
        if (!cancelled) setOrders(response.data);
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError?.message || 'Failed to load orders');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, status, from, to]);

  const orderList = orders?.content ?? [];
  const totalPages = orders?.totalPages ?? 1;
  const flaggedOrders = useMemo(
    () => orderList.filter((order) => orderFlags(order).length > 0),
    [orderList],
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Orders Operations</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monitor booking requests, wallet holds, driver payout release and support exceptions.
          </p>
        </div>
        <div className="rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-800 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-200">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="h-4 w-4" />
            {flaggedOrders.length} flagged on this page
          </div>
        </div>
      </header>

      <TableFilterBar
        search={search}
        status={status}
        from={from}
        to={to}
        onSearch={setSearch}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        onFromChange={setFrom}
        onToChange={setTo}
        statusOptions={[
          { label: 'All', value: 'all' },
          { label: 'Requested', value: 'CREATED' },
          { label: 'Confirmed', value: 'CONFIRMED' },
          { label: 'Ongoing', value: 'ONGOING' },
          { label: 'Driver completed', value: 'DRIVER_COMPLETED' },
          { label: 'Cancel requested', value: 'CANCEL_REQUESTED' },
          { label: 'Disputed', value: 'DISPUTED' },
          { label: 'Completed', value: 'COMPLETED' },
          { label: 'Cancelled', value: 'CANCELLED' },
          { label: 'No-show', value: 'NO_SHOW' },
        ]}
      />

      {loading && <Loader className="h-5 w-5 animate-spin text-blue-600" />}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      <OrdersTable orders={orderList} onView={setSelected} />

      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}

      <OrderDetailsDrawer order={selected} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  );
}
