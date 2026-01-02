'use client';

import { useMemo, useState } from 'react';
import PayoutsTable from '@/component/payments/PayoutsTable';
import Pagination from '@/component/utils/Pagination';

import PaymentsFilterBar from '@/component/payments/PaymentFilterBar';
import TransactionsTable from '@/component/payments/TransactionTable';
import { Transaction, transactions } from '../../../data/transaction.mock';
import { payouts } from '../../../data/payout.mock';

const PAGE_SIZE = 5;

export default function PaymentsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return transactions.filter((t: Transaction) => {
      const matchSearch =
        t.userName.toLowerCase().includes(search.toLowerCase()) ||
        t.id.includes(search);

      const matchStatus =
        status === 'all' || t.status === status;

      return matchSearch && matchStatus;
    });
  }, [search, status]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Payments & Wallets</h1>
        <p className="text-sm text-gray-500">
          Monitor transactions, payouts and platform revenue
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

      <TransactionsTable transactions={paginated} />

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      <section>
        <h2 className="text-lg font-semibold mb-2">Driver Payouts</h2>
        <PayoutsTable payouts={payouts} />
      </section>
    </div>
  );
}
