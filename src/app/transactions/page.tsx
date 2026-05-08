'use client';

import { useEffect, useState } from 'react';
import Pagination from '@/component/utils/Pagination';
import TableFilterBar from '@/component/filters/TableFilterBar';
import { useTransaction } from '../../../lib/hooks/useTransaction';
import TransactionsTable from '@/component/transactions/TransactionTable';
import TransactionDrawer from '@/component/transactions/TransactionDrawer';
import { useDebouncedValue } from '../../../lib/hooks/useDebouncedValue';

const PAGE_SIZE = 10;
const DEVICE = 'web';

export default function TransactionsPage() {
  const {
    transactions,
    currentTransaction,
    getTransactions,
    getTransactionByReference,
    clearTransaction,
  } = useTransaction();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const [status, setStatus] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  useEffect(() => {
    getTransactions(DEVICE, {
      page: page - 1,
      size: PAGE_SIZE,
      reference: debouncedSearch || undefined,
      status: status !== 'all' ? status : undefined,
      fromDate: from || undefined,
      toDate: to || undefined,
    });
  }, [page, debouncedSearch, status, from, to, getTransactions]);

  const transactionList = transactions?.content ?? [];
  const totalPages = transactions?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Payments & Transactions</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Monitor deposits, withdrawals and transfers
        </p>
      </div>

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
          { label: 'Completed', value: 'COMPLETED' },
          { label: 'Failed', value: 'FAILED' },
          { label: 'Pending', value: 'PENDING' },
          { label: 'Refunded', value: 'REFUNDED' },
          { label: 'Success', value: 'SUCCESS' },
        ]}
      />

      <TransactionsTable
        transactions={transactionList}
        onView={(transaction) => getTransactionByReference(DEVICE, transaction.reference)}
      />

      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}

      <TransactionDrawer transaction={currentTransaction} open={!!currentTransaction} onClose={clearTransaction} />
    </div>
  );
}
