'use client';

export default function VerificationStatusBadge({
  status,
}: {
  status: 'pending' | 'approved' | 'rejected' | 'under_review' | 'accepted' | 'declined' | 'not_submitted';
}) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/40',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/40',
    under_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40',
    accepted: 'bg-green-100 text-green-800 dark:bg-green-900/40',
    declined: 'bg-red-100 text-red-800 dark:bg-red-900/40',
    not_submitted: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {status.toUpperCase()}
    </span>
  );
}
