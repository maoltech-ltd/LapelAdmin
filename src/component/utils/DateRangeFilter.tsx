// interface DateRangeFilterProps {
//   onChange: (range: string) => void;
//   onExport: () => void;
// }

import { DashboardFilter } from "../../../lib/types/dashboard.types";

// export default function DateRangeFilter({
//   onChange,
//   onExport,
// }: DateRangeFilterProps) {
//   return (
//     <div className="flex items-center gap-2">
//       <select
//         onChange={(e) => onChange(e.target.value)}
//         className="rounded-lg border px-3 py-2 text-sm focus:outline-none"
//       >
//         <option value="today">Today</option>
//         <option value="7days">Last 7 days</option>
//         <option value="30days">Last 30 days</option>
//       </select>

//       <button
//         onClick={onExport}
//         className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
//       >
//         Export CSV
//       </button>
//     </div>
//   );
// }


interface DateRangeFilterProps {
  onChange: (filter: Partial<DashboardFilter>) => void;
  onExport: () => void;
}

export default function DateRangeFilter({
  onChange,
  onExport,
}: DateRangeFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <select
        onChange={(e) =>
          onChange({
            period: e.target.value as DashboardFilter['period'],
          })
        }
        className="rounded-lg border px-3 py-2 text-sm focus:outline-none"
      >
        <option value="TODAY">Today</option>
        <option value="LAST_7_DAYS">Last 7 days</option>
        <option value="LAST_30_DAYS">Last 30 days</option>
        <option value="LAST_3_MONTHS">Last 3 months</option>
        <option value="LAST_1_YEAR">Last 1 year</option>
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
