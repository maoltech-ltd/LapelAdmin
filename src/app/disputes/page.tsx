'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Loader } from 'lucide-react';
import Pagination from '@/component/utils/Pagination';
import OrdersTable from '@/component/orders/OrdersTable';
import OrderDetailsDrawer from '@/component/orders/OrderDetailsDrawer';
import DisputeResolveActions from '@/component/disputes/DisputeResolveActions';
import { disputeService } from '../../../lib/api/services/disputeService';
import { OrderDto, PaginatedResponse } from '../../../lib/types/order.types';
import { useDebouncedValue } from '../../../lib/hooks/useDebouncedValue';

const DEVICE = 'web';
const PAGE_SIZE = 10;

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<PaginatedResponse<OrderDto> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<OrderDto | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    disputeService
      .getAllDisputes(DEVICE, {
        page: page - 1,
        size: PAGE_SIZE,
        query: debouncedSearch || undefined,
        sortBy: 'createdAt',
        sortDirection: 'DESC',
      })
      .then((response) => {
        if (!cancelled) setDisputes(response.data);
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError?.message || 'Failed to load disputes');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, reloadToken]);

  const disputeList = disputes?.content ?? [];
  const totalPages = disputes?.totalPages ?? 1;

  const handleResolved = (updated: OrderDto) => {
    setSelected(updated);
    setReloadToken((token) => token + 1);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Disputes</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Orders flagged for support review. Resolving a dispute moves real money — confirm before acting.
          </p>
        </div>
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="h-4 w-4" />
            {disputes?.totalElements ?? 0} disputed order{(disputes?.totalElements ?? 0) === 1 ? '' : 's'}
          </div>
        </div>
      </header>

      <div className="flex flex-wrap gap-3 rounded-xl border bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search order or ride id..."
          className="w-full rounded-md border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 sm:w-64"
        />
      </div>

      {loading && <Loader className="h-5 w-5 animate-spin text-blue-600" />}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      <OrdersTable orders={disputeList} onView={setSelected} />

      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}

      <OrderDetailsDrawer
        order={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        footer={
          selected && (
            <DisputeResolveActions
              device={DEVICE}
              order={selected}
              onResolved={handleResolved}
            />
          )
        }
      />
    </div>
  );
}
