'use client';

import { RidePaymentPlanDto } from '../../../lib/types/paymentPlan.types';
import { EmptyTableRow, TableShell, ViewButton } from '../utils/DataTable';
import StatusBadge from '../utils/StatusBadge';
import { dateTime, money, periodLabel, planStatusKey } from './paymentPlanAdminUtils';

export default function PaymentPlansTable({
  plans,
  onView,
}: {
  plans: RidePaymentPlanDto[];
  onView: (plan: RidePaymentPlanDto) => void;
}) {
  return (
    <TableShell>
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <tr>
            <th className="px-4 py-3 text-left">Plan</th>
            <th className="px-4 py-3 text-left">Participants</th>
            <th className="px-4 py-3 text-left">Period</th>
            <th className="px-4 py-3 text-left">Price</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Auto-renew</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr
              key={plan.id}
              className="border-t border-slate-200 transition hover:bg-blue-50/60 dark:border-slate-800 dark:hover:bg-slate-800/70"
            >
              <td className="px-4 py-3">
                <div className="font-medium text-slate-900 dark:text-slate-100">{plan.id}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Ride {plan.rideId}</div>
              </td>
              <td className="px-4 py-3">
                <div>Passenger {plan.passengerId}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Driver {plan.driverId}</div>
              </td>
              <td className="px-4 py-3">
                <div>{periodLabel(plan.periodType)}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {dateTime(plan.periodStartUtc)} - {dateTime(plan.periodEndUtc)}
                </div>
              </td>
              <td className="px-4 py-3">
                <div>{money(plan.finalPrice)}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{plan.occurrenceCount} occurrence(s)</div>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={planStatusKey(plan.status)} label={plan.status} />
              </td>
              <td className="px-4 py-3">
                <span className="text-xs text-slate-500 dark:text-slate-400">{plan.autoRenew ? 'On' : 'Off'}</span>
              </td>
              <td className="px-4 py-3 text-right">
                <ViewButton onClick={() => onView(plan)} />
              </td>
            </tr>
          ))}
          {plans.length === 0 && <EmptyTableRow colSpan={7} message="No ride payment plans found." />}
        </tbody>
      </table>
    </TableShell>
  );
}
