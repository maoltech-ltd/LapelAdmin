interface DateRangeFilterProps {
  onChange: (range: string) => void;
  onExport: () => void;
}

export default function DateRangeFilter({
  onChange,
  onExport,
}: DateRangeFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <select
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border px-3 py-2 text-sm focus:outline-none"
      >
        <option value="today">Today</option>
        <option value="7days">Last 7 days</option>
        <option value="30days">Last 30 days</option>
      </select>

      <button
        onClick={onExport}
        className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
      >
        Export CSV
      </button>
    </div>
  );
}
