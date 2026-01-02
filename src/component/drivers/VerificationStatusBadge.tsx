'use client';

export default function VerificationStatusBadge({
  status,
}: {
  status: 'pending' | 'approved' | 'rejected';
}) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/40',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/40',
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {status.toUpperCase()}
    </span>
  );
}
