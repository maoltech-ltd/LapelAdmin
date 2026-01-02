'use client';


import StatusBadge from '@/component/utils/StatusBadge';
import CurrencyFormatter from '../utils/CurrencyFormatter';
import { Payout } from '../../../data/payout.mock';

// export type Payout = {
//   id: string;
//   driver: string;
//   amount: number;
//   status: 'pending' | 'success' | 'failed';
// };

export default function PayoutsTable({
  payouts,
}: {
  payouts: Payout[];
}) {
  return (
    <div className="rounded-xl border bg-white dark:border-gray-800 dark:bg-gray-900">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left">Driver</th>
            <th className="px-4 py-3 text-left">Amount</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>

        <tbody>
          {payouts.map((p) => (
            <tr key={p.id} className="border-t dark:border-gray-800">
              <td className="px-4 py-3">{p.driverName}</td>
              <td className="px-4 py-3">
                <CurrencyFormatter amount={p.amount} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={p.status} />
              </td>
              <td className="px-4 py-3 text-right">
                {p.status === 'pending' && (
                  <button className="text-green-600 hover:underline">
                    Approve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
