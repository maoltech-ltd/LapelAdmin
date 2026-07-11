'use client';

import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import Pagination from '@/component/utils/Pagination';
import TableFilterBar from '@/component/filters/TableFilterBar';
import PaymentPlansTable from '@/component/paymentPlans/PaymentPlansTable';
import PaymentPlanDetailsDrawer from '@/component/paymentPlans/PaymentPlanDetailsDrawer';
import { paymentPlanService } from '../../../lib/api/services/paymentPlanService';
import { PaginatedResponse, PlanStatus, RidePaymentPlanDto } from '../../../lib/types/paymentPlan.types';
import { useDebouncedValue } from '../../../lib/hooks/useDebouncedValue';

const DEVICE = 'web';
const PAGE_SIZE = 10;

export default function RidePaymentPlansPage() {
  const [plans, setPlans] = useState<PaginatedResponse<RidePaymentPlanDto> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<RidePaymentPlanDto | null>(null);
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
    paymentPlanService
      .getAllPlans(DEVICE, {
        page: page - 1,
        size: PAGE_SIZE,
        query: debouncedSearch || undefined,
        status: status === 'all' ? undefined : (status as PlanStatus),
        fromDate: from || undefined,
        toDate: to || undefined,
        sortBy: 'createdAt',
        sortDirection: 'DESC',
      })
      .then((response) => {
        if (!cancelled) setPlans(response.data);
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError?.message || 'Failed to load ride payment plans');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, status, from, to]);

  const planList = plans?.content ?? [];
  const totalPages = plans?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Ride Payment Plans</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Monitor recurring weekly/monthly ride subscriptions, their installments and refund status.
        </p>
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
          { label: 'Active', value: 'ACTIVE' },
          { label: 'Lapsed', value: 'LAPSED' },
          { label: 'Cancelled', value: 'CANCELLED' },
          { label: 'Expired', value: 'EXPIRED' },
          { label: 'Completed', value: 'COMPLETED' },
        ]}
      />

      {loading && <Loader className="h-5 w-5 animate-spin text-blue-600" />}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      <PaymentPlansTable plans={planList} onView={setSelected} />

      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}

      <PaymentPlanDetailsDrawer plan={selected} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  );
}
