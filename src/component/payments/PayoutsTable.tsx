'use client';

import CurrencyFormatter from '../utils/CurrencyFormatter';
import { WalletSettlement } from '../../../lib/api/services/settlementService';

export default function PayoutsTable({
  payouts,
}: {
  payouts: WalletSettlement[];
}) {
  return (
    <div className="surface overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <tr>
            <th className="px-4 py-3 text-left">User</th>
            <th className="px-4 py-3 text-left">Transaction</th>
            <th className="px-4 py-3 text-left">Amount</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">Date</th>
          </tr>
        </thead>

        <tbody>
          {payouts.map((payout) => (
            <tr key={payout.id} className="border-t border-slate-200 transition hover:bg-blue-50/60 dark:border-slate-800 dark:hover:bg-slate-800/70">
              <td className="px-4 py-3">{payout.userId}</td>
              <td className="px-4 py-3">{payout.transactionId}</td>
              <td className="px-4 py-3">
                <CurrencyFormatter amount={payout.amount} />
              </td>
              <td className="px-4 py-3 capitalize">{payout.type?.toLowerCase()}</td>
              <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                {payout.createdAt ? new Date(payout.createdAt).toLocaleString() : ''}
              </td>
            </tr>
          ))}
          {payouts.length === 0 && (
            <tr>
              <td className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400" colSpan={5}>
                No settlements found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
