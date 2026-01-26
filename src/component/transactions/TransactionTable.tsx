'use client';

import { Transaction } from '../../../lib/types/transaction.type';
import StatusBadge, { Status } from '../utils/StatusBadge';

export default function TransactionsTable({
  transactions,
  onView
}: {
  transactions: Transaction[];
  onView: (tx: Transaction) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white dark:bg-gray-900 dark:border-gray-800">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800">
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
              className="border-t dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <td className="px-4 py-3 font-medium">
                {tx.reference}
              </td>

              <td className="px-4 py-3">
                {tx.userId}
              </td>

              <td className="px-4 py-3">
                ₦{tx.amount.toLocaleString()}
              </td>

              <td className="px-4 py-3">
                {tx.type}
              </td>

              <td className="px-4 py-3">
                <StatusBadge status={tx.status.toLowerCase() as Status} />
              </td>

              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onView(tx)}
                  className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
