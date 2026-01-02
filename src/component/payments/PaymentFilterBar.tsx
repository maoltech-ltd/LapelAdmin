'use client';

export default function PaymentsFilterBar({
  search,
  status,
  from,
  to,
  onSearch,
  onStatusChange,
  onFromChange,
  onToChange,
}: {
  search: string;
  status: string;
  from: string;
  to: string;
  onSearch: (v: string) => void;
  onStatusChange: (v: string) => void;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3 rounded-xl border bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <input
        placeholder="Search transaction / user"
        className="input w-full sm:w-64"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="input"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="success">Success</option>
        <option value="failed">Failed</option>
        <option value="flagged">Flagged</option>
      </select>

      <input type="date" className="input" value={from} onChange={(e) => onFromChange(e.target.value)} />
      <input type="date" className="input" value={to} onChange={(e) => onToChange(e.target.value)} />
    </div>
  );
}
