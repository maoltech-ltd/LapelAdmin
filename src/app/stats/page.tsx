'use client';

import { useEffect } from 'react';
import DateRangeFilter from '@/component/utils/DateRangeFilter';
import StatsPanel from '@/component/stats/StatsPanel';
import { useDashboard } from '../../../lib/hooks/useDashboard';

export default function StatsPage() {
  const { advancedStats, loading, currentFilter, fetchAdvancedStats, setFilter } = useDashboard();

  useEffect(() => {
    fetchAdvancedStats('web', currentFilter);
  }, [currentFilter, fetchAdvancedStats]);

  function exportStats() {
    const rows = [
      ['Metric', 'Value', 'Previous', 'Change %'],
      ...(advancedStats?.metrics ?? []).map((metric) => [
        metric.label,
        String(metric.value),
        String(metric.previousValue),
        String(metric.changePercent),
      ]),
    ];
    const csv = rows.map((row) => row.join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lapel-admin-stats.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950 dark:text-slate-50">Stats</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Daily, weekly, monthly, yearly, and custom analytics for users, riders, vehicles, rides, payments, and transactions.
          </p>
        </div>

        <DateRangeFilter
          value={currentFilter}
          onExport={exportStats}
          onChange={(filter) => setFilter({ ...currentFilter, ...filter })}
        />
      </div>

      <StatsPanel stats={advancedStats} loading={loading} />
    </div>
  );
}
