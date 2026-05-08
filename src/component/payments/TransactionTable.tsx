'use client';

import StatusBadge from '@/component/utils/StatusBadge';
import type { Status } from '@/component/utils/StatusBadge';
import { EmptyTableRow, TableShell, ViewButton } from '@/component/utils/DataTable';
import CurrencyFormatter from '../utils/CurrencyFormatter';
import { Transaction } from '../../../lib/types/transaction.type';

export default function TransactionsTable({
  transactions,
  onRetry,
  onFlag,
  onView,
}: {
  transactions: Transaction[];
  onRetry: (reference: string) => void;
  onFlag: (reference: string) => void;
  onView: (transaction: Transaction) => void;
}) {
  return (
    <TableShell>
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <tr>
            <th className="px-4 py-3 text-left">Reference</th>
            <th className="px-4 py-3 text-left">User</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">Amount</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-t border-slate-200 transition hover:bg-blue-50/60 dark:border-slate-800 dark:hover:bg-slate-800/70">
              <td className="px-4 py-3 font-medium">{tx.reference}</td>
              <td className="px-4 py-3">{tx.recipientName || tx.userId}</td>
              <td className="px-4 py-3 capitalize">{tx.type?.toLowerCase()}</td>
              <td className="px-4 py-3">
                <CurrencyFormatter amount={tx.amount} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={(tx.status || 'pending').toLowerCase() as Status} />
              </td>
              <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : ''}
              </td>
              <td className="space-x-2 px-4 py-3 text-right">
                <ViewButton onClick={() => onView(tx)} />
                {tx.status === 'PENDING' || tx.status === 'FAILED' ? (
                  <button
                    className="action-link text-blue-600 dark:text-blue-300"
                    onClick={() => onRetry(tx.reference)}
                    title="Retry this transaction"
                  >
                    Retry
                  </button>
                ) : null}
                <button
                  className="action-link text-red-600 dark:text-red-300"
                  onClick={() => onFlag(tx.reference)}
                  title="Flag this transaction for review"
                >
                  Flag
                </button>
              </td>
            </tr>
          ))}
          {transactions.length === 0 && (
            <EmptyTableRow colSpan={7} message="No transactions found." />
          )}
        </tbody>
      </table>
    </TableShell>
  );
}
