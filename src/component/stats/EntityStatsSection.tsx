'use client';

import { useEffect, useState } from 'react';
import DateRangeFilter from '@/component/utils/DateRangeFilter';
import { useDashboard } from '../../../lib/hooks/useDashboard';
import { AdvancedStats, DashboardFilter, StatsEntityType } from '../../../lib/types/dashboard.types';
import StatsPanel from './StatsPanel';

const DEVICE = 'web';

export default function EntityStatsSection({
  entityType,
  entityId,
  title,
  exportFilename,
}: {
  entityType: StatsEntityType;
  entityId?: string;
  title: string;
  exportFilename: string;
}) {
  const [statsFilter, setStatsFilter] = useState<DashboardFilter>({ period: 'LAST_30_DAYS' });
  const { entityStats, fetchEntityStats } = useDashboard();

  const statsKey = entityId ? `${entityType}:${entityId}` : '';
  const stats = statsKey ? entityStats[statsKey] ?? null : null;
  useEffect(() => {
    if (entityId) {
      fetchEntityStats(DEVICE, entityType, entityId, statsFilter);
    }
  }, [entityId, entityType, statsFilter, fetchEntityStats]);

  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
        <DateRangeFilter
          value={statsFilter}
          onChange={(filter) => setStatsFilter((current) => ({ ...current, ...filter }))}
          onExport={() => exportEntityStats(stats, exportFilename)}
        />
      </div>
      <StatsPanel stats={stats} compact />
    </section>
  );
}

function exportEntityStats(stats: AdvancedStats | null, filename: string) {
  const rows = [
    ['Metric', 'Value', 'Previous', 'Change %'],
    ...(stats?.metrics ?? []).map((metric) => [
      metric.label,
      String(metric.value),
      String(metric.previousValue),
      String(metric.changePercent),
    ]),
  ];
  const url = URL.createObjectURL(new Blob([rows.map((row) => row.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
