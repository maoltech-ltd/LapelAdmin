'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import Pagination from '@/component/utils/Pagination';
import StatCard from '@/component/utils/StatCard';
import TableFilterBar from '@/component/filters/TableFilterBar';
import CompaniesTable from '@/component/companies/CompaniesTable';
import CompanyDetailsDrawer from '@/component/companies/CompanyDetailsDrawer';
import { companyService } from '../../../lib/api/services/companyService';
import {
  CompanyDto,
  CompanyStatus,
  CompanyStatusCounts,
  PaginatedResponse,
} from '../../../lib/types/company.types';
import { useDebouncedValue } from '../../../lib/hooks/useDebouncedValue';

const DEVICE = 'web';
const PAGE_SIZE = 10;

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<PaginatedResponse<CompanyDto> | null>(null);
  const [counts, setCounts] = useState<CompanyStatusCounts>({});
  // Which query the current list/error belongs to; loading = it isn't the current query yet.
  const [settled, setSettled] = useState<{ key: string; error: string | null } | null>(null);
  const [selected, setSelected] = useState<CompanyDto | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const [status, setStatus] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const loadCounts = useCallback(() => {
    companyService
      .getStatusCounts(DEVICE)
      .then((response) => setCounts(response.data ?? {}))
      .catch(() => setCounts({}));
  }, []);

  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  const queryKey = JSON.stringify([page, debouncedSearch, status, from, to]);

  useEffect(() => {
    let cancelled = false;
    companyService
      .getAllCompanies(DEVICE, {
        page: page - 1,
        size: PAGE_SIZE,
        search: debouncedSearch || undefined,
        status: status === 'all' ? undefined : (status as CompanyStatus),
        from: from || undefined,
        to: to || undefined,
        sortBy: 'createdAt',
        sortDirection: 'DESC',
      })
      .then((response) => {
        if (cancelled) return;
        setCompanies(response.data);
        setSettled({ key: queryKey, error: null });
      })
      .catch((requestError) => {
        if (!cancelled) setSettled({ key: queryKey, error: requestError?.message || 'Failed to load companies' });
      });
    return () => {
      cancelled = true;
    };
  }, [queryKey, page, debouncedSearch, status, from, to]);

  const loading = settled?.key !== queryKey;
  const error = settled?.key === queryKey ? settled.error : null;

  // Status/discount changes in the drawer: patch the row in place and refresh the counts.
  const handleUpdated = (updated: CompanyDto) => {
    setCompanies((current) =>
      current
        ? {
            ...current,
            content: current.content.map((company) =>
              company.id === updated.id ? { ...company, ...updated } : company,
            ),
          }
        : current,
    );
    loadCounts();
  };

  const companyList = companies?.content ?? [];
  const totalPages = companies?.totalPages ?? 1;
  const count = (key: CompanyStatus | 'TOTAL') => (counts[key] ?? 0).toLocaleString();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Companies</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Review SharedDrive for Business accounts, set each company&apos;s business rate and manage their status.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard title="All companies" value={count('TOTAL')} />
        <StatCard title="Pending approval" value={count(CompanyStatus.PENDING_APPROVAL)} />
        <StatCard title="Active" value={count(CompanyStatus.ACTIVE)} variant="success" />
        <StatCard title="Suspended" value={count(CompanyStatus.SUSPENDED)} variant="danger" />
        <StatCard title="Rejected" value={count(CompanyStatus.REJECTED)} />
      </div>

      <TableFilterBar
        search={search}
        status={status}
        from={from}
        to={to}
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        onFromChange={setFrom}
        onToChange={setTo}
        statusOptions={[
          { label: 'All', value: 'all' },
          { label: 'Pending approval', value: CompanyStatus.PENDING_APPROVAL },
          { label: 'Active', value: CompanyStatus.ACTIVE },
          { label: 'Suspended', value: CompanyStatus.SUSPENDED },
          { label: 'Rejected', value: CompanyStatus.REJECTED },
        ]}
      />

      {loading && <Loader className="h-5 w-5 animate-spin text-blue-600" />}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      <CompaniesTable companies={companyList} onView={setSelected} />

      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}

      <CompanyDetailsDrawer
        device={DEVICE}
        company={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onUpdated={handleUpdated}
      />
    </div>
  );
}
