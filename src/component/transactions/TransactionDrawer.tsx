'use client';

import { Transaction } from '../../../lib/types/transaction.type';

export default function TransactionDrawer({
  transaction,
  open,
  onClose
}: {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
}) {

  if (!open || !transaction) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3 dark:border-gray-800">
          <h2 className="text-lg font-semibold">Transaction Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">

          <Detail label="Reference" value={transaction.reference} />
          <Detail label="Amount" value={`₦${transaction.amount.toLocaleString()}`} />
          <Detail label="Type" value={transaction.type} />
          <Detail label="Status" value={transaction.status} />
          <Detail label="Payment Method" value={transaction.paymentMethod} />
          <Detail label="Provider" value={transaction.paymentProvider} />
          <Detail label="User ID" value={transaction.userId} />
          <Detail label="Date" value={new Date(transaction.createdAt).toLocaleString()} />

        </div>

      </div>
    </>
  );
}

// Reusable Row
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b pb-2 dark:border-gray-800">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
