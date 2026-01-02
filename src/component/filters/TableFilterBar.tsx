'use client';

interface Option {
  label: string;
  value: string;
}

interface TableFilterBarProps {
  search: string;
  status: string;
  from: string;
  to: string;

  statusOptions: Option[];

  onSearch: (v: string) => void;
  onStatusChange: (v: string) => void;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
}

export default function TableFilterBar({
  search,
  status,
  from,
  to,
  statusOptions,
  onSearch,
  onStatusChange,
  onFromChange,
  onToChange,
}: TableFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3 rounded-xl border bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      
      {/* Search */}
      <input
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search name, email, phone..."
        className="w-full sm:w-64 rounded-md border px-3 py-2 text-sm
          dark:border-gray-700 dark:bg-gray-800"
      />

      {/* Status */}
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="rounded-md border px-3 py-2 text-sm
          dark:border-gray-700 dark:bg-gray-800"
      >
        {statusOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* Date from */}
      <input
        type="date"
        value={from}
        onChange={(e) => onFromChange(e.target.value)}
        className="rounded-md border px-3 py-2 text-sm
          dark:border-gray-700 dark:bg-gray-800"
      />

      {/* Date to */}
      <input
        type="date"
        value={to}
        onChange={(e) => onToChange(e.target.value)}
        className="rounded-md border px-3 py-2 text-sm
          dark:border-gray-700 dark:bg-gray-800"
      />
    </div>
  );
}
