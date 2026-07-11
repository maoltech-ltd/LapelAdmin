'use client';

import { RidePaymentPlanDto } from '../../../lib/types/paymentPlan.types';
import { DetailGrid, DetailSection, StatSummaryGrid } from '../utils/DetailBlocks';
import DetailDrawer from '../utils/DetailDrawer';
import StatusBadge from '../utils/StatusBadge';
import { EmptyTableRow, TableShell } from '../utils/DataTable';
import {
  dateTime,
  installmentStatusKey,
  money,
  payoutScheduleLabel,
  periodLabel,
  planStatusKey,
  pricingModeLabel,
} from './paymentPlanAdminUtils';

export default function PaymentPlanDetailsDrawer({
  plan,
  open,
  onClose,
}: {
  plan: RidePaymentPlanDto | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!open || !plan) return null;

  return (
    <DetailDrawer
      open={open}
      onClose={onClose}
      widthClassName="max-w-5xl"
      title="Ride payment plan details"
      subtitle={`${plan.passengerId} -> ${plan.driverId}`}
      badge={<StatusBadge status={planStatusKey(plan.status)} label={plan.status} />}
    >
      <div className="space-y-5">
        <StatSummaryGrid
          stats={[
            { label: 'Final price', value: money(plan.finalPrice), hint: pricingModeLabel(plan.pricingMode) },
            { label: 'Gross price', value: money(plan.grossPrice), hint: `${plan.discountPercentage}% discount` },
            { label: 'Occurrences', value: plan.occurrenceCount, hint: periodLabel(plan.periodType) },
            {
              label: 'Refund',
              value: money(plan.refundAmount),
              hint: plan.refunded ? 'Refunded' : 'Not refunded',
            },
          ]}
        />

        <DetailSection title="Lifecycle">
          <DetailGrid
            items={[
              { label: 'Plan ID', value: plan.id },
              { label: 'Ride ID', value: plan.rideId },
              { label: 'Passenger', value: plan.passengerId },
              { label: 'Driver', value: plan.driverId },
              { label: 'Status', value: <StatusBadge status={planStatusKey(plan.status)} label={plan.status} /> },
              { label: 'Auto-renew', value: plan.autoRenew ? 'Enabled' : 'Disabled' },
              { label: 'Period start', value: dateTime(plan.periodStartUtc) },
              { label: 'Period end', value: dateTime(plan.periodEndUtc) },
              { label: 'Seats per ride', value: plan.seatsPerRide },
              { label: 'Payout schedule', value: payoutScheduleLabel(plan.payoutSchedule) },
              { label: 'Renewed from', value: plan.renewedFromPlanId || 'N/A' },
              { label: 'Last renewal attempt', value: dateTime(plan.lastRenewalAttemptAt) },
            ]}
          />
        </DetailSection>

        <DetailSection title="Payment controls">
          <DetailGrid
            items={[
              { label: 'Wallet debited', value: plan.walletDebited ? 'Yes' : 'No' },
              { label: 'Refunded', value: plan.refunded ? 'Yes' : 'No' },
              { label: 'Refund amount', value: money(plan.refundAmount) },
              { label: 'Discount amount', value: money(plan.discountAmount) },
            ]}
          />
        </DetailSection>

        <DetailSection title="Cancellation">
          <DetailGrid
            items={[
              { label: 'Cancelled at', value: dateTime(plan.cancelledAt) },
              { label: 'Cancelled by', value: plan.cancelledBy || 'N/A' },
              { label: 'Lapsed at', value: dateTime(plan.lapsedAt) },
            ]}
          />
        </DetailSection>

        <DetailSection title="Installments">
          <TableShell>
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Due</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Released</th>
                  <th className="px-4 py-2 text-left">Commission</th>
                  <th className="px-4 py-2 text-left">Driver earning</th>
                </tr>
              </thead>
              <tbody>
                {plan.installments.map((installment) => (
                  <tr key={installment.index} className="border-t border-slate-200 dark:border-slate-800">
                    <td className="px-4 py-2">{installment.index + 1}</td>
                    <td className="px-4 py-2">{money(installment.amount)}</td>
                    <td className="px-4 py-2">{dateTime(installment.dueAt)}</td>
                    <td className="px-4 py-2">
                      <StatusBadge
                        status={installmentStatusKey(installment.status)}
                        label={installment.status}
                      />
                    </td>
                    <td className="px-4 py-2">{dateTime(installment.releasedAt)}</td>
                    <td className="px-4 py-2">{money(installment.commissionAmount)}</td>
                    <td className="px-4 py-2">{money(installment.driverEarning)}</td>
                  </tr>
                ))}
                {plan.installments.length === 0 && (
                  <EmptyTableRow colSpan={7} message="No installments (per-occurrence payout plan)." />
                )}
              </tbody>
            </table>
          </TableShell>
        </DetailSection>
      </div>
    </DetailDrawer>
  );
}
