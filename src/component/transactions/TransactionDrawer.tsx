'use client';

import EntityStatsSection from '@/component/stats/EntityStatsSection';
import { DetailGrid, DetailSection, StatSummaryGrid } from '@/component/utils/DetailBlocks';
import DetailDrawer from '@/component/utils/DetailDrawer';
import StatusBadge from '@/component/utils/StatusBadge';
import type { Status } from '@/component/utils/StatusBadge';
import CurrencyFormatter from '@/component/utils/CurrencyFormatter';
import { Transaction } from '../../../lib/types/transaction.type';

export default function TransactionDrawer({
  transaction,
  open,
  onClose,
}: {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!open || !transaction) return null;

  const status = (transaction.status || 'PENDING').toLowerCase() as Status;
  const netChange = Number(transaction.postBalance || 0) - Number(transaction.preBalance || 0);

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
