'use client';

export default function UsersFilterBar({
  search,
  status,
  from,
  to,
  onSearch,
  onStatusChange,
  onFromChange,
  onToChange,
}: any) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-white p-4 dark:border-gray-800 dark:bg-gray-900 md:flex-row md:items-end">
      
      {/* Search */}
      <div className="flex-1">
        <label className="text-xs text-gray-500">Search</label>
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Name, email or phone"
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
        />
      </div>

      {/* Status */}
      <div>
        <label className="text-xs text-gray-500">Status</label>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="mt-1 rounded-md border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Date From */}
      <div>
        <label className="text-xs text-gray-500">From</label>
        <input
          type="date"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          className="mt-1 rounded-md border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
        />
      </div>

      {/* Date To */}
      <div>
        <label className="text-xs text-gray-500">To</label>
        <input
          type="date"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          className="mt-1 rounded-md border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
        />
      </div>
    </div>
  );
}
