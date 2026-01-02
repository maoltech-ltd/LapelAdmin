'use client';

import StatusBadge from '@/component/utils/StatusBadge';
import CurrencyFormatter from '../utils/CurrencyFormatter';
import { Transaction } from '../../../data/transaction.mock';

// export type Transaction = {
//   id: string;
//   user: string;
//   type: 'ride' | 'payout' | 'commission';
//   amount: number;
//   status: 'pending' | 'success' | 'failed' | 'flagged';
//   date: string;
// };

export default function TransactionsTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white dark:border-gray-800 dark:bg-gray-900">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
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
            <tr key={tx.id} className="border-t dark:border-gray-800">
              <td className="px-4 py-3">{tx.id}</td>
              <td className="px-4 py-3">{tx.userName}</td>
              <td className="px-4 py-3 capitalize">{tx.type}</td>
              <td className="px-4 py-3">
                <CurrencyFormatter amount={tx.amount} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={tx.status} />
              </td>
              <td className="px-4 py-3 text-xs text-gray-500">
                {tx.createdAt}
              </td>
              <td className="px-4 py-3 text-right space-x-2">
                {tx.status === 'pending' && (
                  <button className="text-blue-600 hover:underline">
                    Retry
                  </button>
                )}
                <button className="text-red-600 hover:underline">
                  Flag
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
