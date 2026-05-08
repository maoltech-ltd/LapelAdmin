'use client';

import { Transaction } from '../../../lib/types/transaction.type';
import { EmptyTableRow, TableShell, ViewButton } from '../utils/DataTable';
import StatusBadge, { Status } from '../utils/StatusBadge';

export default function TransactionsTable({
  transactions,
  onView,
}: {
  transactions: Transaction[];
  onView: (tx: Transaction) => void;
}) {
  return (
    <TableShell>
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <tr>
            <th className="px-4 py-3 text-left">Reference</th>
            <th className="px-4 py-3 text-left">User</th>
            <th className="px-4 py-3 text-left">Amount</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((tx) => (
            <tr
              key={tx.id}
              className="border-t border-slate-200 transition hover:bg-blue-50/60 dark:border-slate-800 dark:hover:bg-slate-800/70"
            >
              <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{tx.reference}</td>
              <td className="px-4 py-3">{tx.recipientName || tx.userId}</td>
              <td className="px-4 py-3">NGN {Number(tx.amount || 0).toLocaleString()}</td>
              <td className="px-4 py-3">{tx.type}</td>
              <td className="px-4 py-3">
                <StatusBadge status={(tx.status || 'PENDING').toLowerCase() as Status} />
              </td>
              <td className="px-4 py-3 text-right">
                <ViewButton onClick={() => onView(tx)} />
              </td>
            </tr>
          ))}
          {transactions.length === 0 && <EmptyTableRow colSpan={6} message="No transactions found." />}
        </tbody>
      </table>
    </TableShell>
  );
}
