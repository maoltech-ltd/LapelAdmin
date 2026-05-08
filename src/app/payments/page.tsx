'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader } from 'lucide-react';
import PayoutsTable from '@/component/payments/PayoutsTable';
import Pagination from '@/component/utils/Pagination';
import PaymentsFilterBar from '@/component/payments/PaymentFilterBar';
import TransactionsTable from '@/component/payments/TransactionTable';
import TransactionDrawer from '@/component/transactions/TransactionDrawer';
import { useTransaction } from '../../../lib/hooks/useTransaction';
import { settlementService, WalletSettlement } from '../../../lib/api/services/settlementService';
import { useDebouncedValue } from '../../../lib/hooks/useDebouncedValue';

const PAGE_SIZE = 10;
const DEVICE = 'web';

export default function PaymentsPage() {
  const {
    transactions,
    currentTransaction,
    loading,
    error,
    getTransactions,
    getTransactionByReference,
    clearTransaction,
    retryTransaction,
    flagTransaction,
  } = useTransaction();
  const [settlements, setSettlements] = useState<WalletSettlement[]>([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const [status, setStatus] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    getTransactions(DEVICE, {
      page: page - 1,
      size: PAGE_SIZE,
      status: status === 'all' ? undefined : status.toUpperCase(),
      fromDate: from || undefined,
      toDate: to || undefined,
      reference: debouncedSearch || undefined,
    });
  }, [page, status, from, to, debouncedSearch, getTransactions]);

  useEffect(() => {
    settlementService
      .getSettlements(DEVICE, { page: 0, size: 10 })
      .then((response) => setSettlements(response.data?.content || []))
      .catch(() => setSettlements([]));
  }, []);

  const visibleTransactions = useMemo(() => transactions?.content || [], [transactions]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Payments & Wallets</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Monitor transactions, settlements and platform revenue
        </p>
      </header>

      <PaymentsFilterBar
        search={search}
        status={status}
        from={from}
        to={to}
        onSearch={setSearch}
        onStatusChange={setStatus}
        onFromChange={setFrom}
        onToChange={setTo}
      />

      {loading && <Loader className="h-5 w-5 animate-spin text-blue-600" />}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      <TransactionsTable
        transactions={visibleTransactions}
        onRetry={(reference) => retryTransaction(DEVICE, reference)}
        onFlag={(reference) => flagTransaction(DEVICE, reference)}
        onView={(transaction) => getTransactionByReference(DEVICE, transaction.reference)}
      />

      {transactions && transactions.totalPages > 1 && (
        <Pagination page={page} totalPages={transactions.totalPages} onPageChange={setPage} />
      )}

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Wallet Settlements</h2>
        <PayoutsTable payouts={settlements} />
      </section>

      <TransactionDrawer transaction={currentTransaction} open={!!currentTransaction} onClose={clearTransaction} />
    </div>
  );
}
