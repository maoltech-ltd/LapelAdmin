'use client';

import EntityStatsSection from '@/component/stats/EntityStatsSection';
import { DetailGrid, DetailSection, StatSummaryGrid } from '@/component/utils/DetailBlocks';
import DetailDrawer from '@/component/utils/DetailDrawer';
import StatusBadge from '@/component/utils/StatusBadge';
import type { Status } from '@/component/utils/StatusBadge';
import CurrencyFormatter from '@/component/utils/CurrencyFormatter';
import { Transaction, TransactionVerifyResult } from '../../../lib/types/transaction.type';

export default function TransactionDrawer({
  transaction,
  open,
  onClose,
  onVerify,
  verifying,
  verifyResult,
}: {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
  onVerify?: (force: boolean) => void;
  verifying?: boolean;
  verifyResult?: TransactionVerifyResult | null;
}) {
  if (!open || !transaction) return null;

  const status = (transaction.status || 'PENDING').toLowerCase() as Status;
  const netChange = Number(transaction.postBalance || 0) - Number(transaction.preBalance || 0);
  const isSettled = transaction.status === 'COMPLETED' || transaction.status === 'FAILED';

  return (
    <DetailDrawer
      open={open}
      onClose={onClose}
      widthClassName="max-w-4xl"
      title="Transaction details"
      subtitle={transaction.reference}
      badge={<StatusBadge status={status} />}
    >
      <div className="space-y-5">
        {onVerify && (
          <DetailSection title="Payment provider verification">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  className="btn-secondary"
                  disabled={verifying}
                  onClick={() => onVerify(false)}
                >
                  {verifying ? 'Verifying…' : 'Verify with provider'}
                </button>
                {isSettled && (
                  <button
                    className="action-link text-sm text-slate-500 dark:text-slate-400"
                    disabled={verifying}
                    onClick={() => onVerify(true)}
                    title="Re-check a settled transaction against the provider without re-settling it"
                  >
                    Check for drift
                  </button>
                )}
              </div>

              {verifyResult && verifyResult.transaction.reference === transaction.reference && (
                <div
                  className={`rounded-lg border p-3 text-sm ${
                    verifyResult.drifted
                      ? 'border-red-200 bg-red-50 text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300'
                      : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300'
                  }`}
                >
                  {!verifyResult.providerChecked && (
                    <p>Already settled locally; provider was not queried (use “Check for drift” to force a live check).</p>
                  )}
                  {verifyResult.providerChecked && verifyResult.drifted && (
                    <p className="font-medium">
                      Drift detected: the local record and the payment provider disagree on this transaction&apos;s status.
                    </p>
                  )}
                  {verifyResult.providerChecked && !verifyResult.drifted && (
                    <p>Local record matches the payment provider.</p>
                  )}
                  {verifyResult.providerResult && (
                    <pre className="mt-2 max-h-48 overflow-auto rounded bg-white/60 p-2 text-xs dark:bg-black/20">
                      {JSON.stringify(verifyResult.providerResult, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </DetailSection>
        )}

        <StatSummaryGrid
          stats={[
            { label: 'Amount', value: <CurrencyFormatter amount={transaction.amount || 0} />, hint: transaction.type },
            { label: 'Fee', value: <CurrencyFormatter amount={transaction.fee || 0} />, hint: 'Platform charge' },
            { label: 'Total', value: <CurrencyFormatter amount={transaction.totalAmount || transaction.amount || 0} />, hint: transaction.direction },
            { label: 'Balance change', value: <CurrencyFormatter amount={netChange || 0} />, hint: 'Post minus pre balance' },
          ]}
        />

        <DetailSection title="Payment information">
          <DetailGrid
            items={[
              { label: 'Reference', value: transaction.reference },
              { label: 'Type', value: transaction.type },
              { label: 'Method', value: transaction.paymentMethod || transaction.method },
              { label: 'Provider', value: transaction.paymentProvider },
              { label: 'Currency', value: transaction.currency || 'NGN' },
              { label: 'Date', value: transaction.createdAt ? new Date(transaction.createdAt).toLocaleString() : 'N/A' },
              { label: 'Description', value: transaction.description },
              { label: 'IP Address', value: transaction.ipAddress },
            ]}
          />
        </DetailSection>

        <DetailSection title="Participants">
          <DetailGrid
            items={[
              { label: 'User ID', value: transaction.userId },
              { label: 'Sender ID', value: transaction.senderId },
              { label: 'Recipient', value: transaction.recipientName || transaction.recipientId },
              { label: 'Recipient account', value: transaction.recipientAccount },
              { label: 'Recipient bank', value: transaction.recipientBank },
              { label: 'Pre balance', value: transaction.preBalance },
              { label: 'Post balance', value: transaction.postBalance },
              { label: 'User agent', value: transaction.userAgent },
            ]}
          />
        </DetailSection>

        {transaction.userId && (
          <EntityStatsSection
            entityType="USER"
            entityId={transaction.userId}
            title="User stats linked to this transaction"
            exportFilename="transaction-user-stats.csv"
          />
        )}
      </div>
    </DetailDrawer>
  );
}
