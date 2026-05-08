'use client';

import BarChart from '@/component/charts/BarChart';
import { AdvancedStats, StatsMetric, StatsTrendPoint } from '../../../lib/types/dashboard.types';

interface StatsPanelProps {
  stats: AdvancedStats | null;
  loading?: boolean;
  compact?: boolean;
}

const preferredMetrics = [
  'users',
  'activeUsers',
  'riders',
  'availableRiders',
  'vehicles',
  'rides',
  'completedRides',
  'cancelledRides',
  'orders',
  'walletTransactions',
  'paidOrders',
  'pendingPayments',
  'failedPayments',
  'refundedPayments',
  'revenue',
  'transactionVolume',
  'seatsBooked',
];

export default function StatsPanel({ stats, loading = false, compact = false }: StatsPanelProps) {
  if (loading && !stats) {
    return <div className="surface p-4 text-sm text-slate-500">Loading stats...</div>;
  }

  if (!stats) {
    return <div className="surface p-4 text-sm text-slate-500">No stats available.</div>;
  }

  const metrics = preferredMetrics
    .map((key) => stats.metrics.find((metric) => metric.key === key))
    .filter(Boolean) as StatsMetric[];
  const trend = stats.trends?.daily?.length ? stats.trends.daily : stats.trends?.weekly ?? [];
  const trendEntries = Object.entries(stats.trends || {}).filter(([, rows]) => rows.length > 0);

  return (
    <div className={compact ? 'space-y-4' : 'space-y-6'}>
      <div className={`grid gap-3 ${compact ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'}`}>
        {metrics.map((metric) => (
          <MetricCard key={metric.key} metric={metric} />
        ))}
      </div>

      <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-3'}`}>
        <section className="surface p-4 xl:col-span-2">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200">Usage trend</h3>
          <MiniMultiChart data={trend} compact={compact} />
        </section>

        <section className="surface p-4">
          <h3 className="mb-4 text-sm font-medium text-slate-700 dark:text-slate-200">Averages</h3>
          <div className="space-y-3">
            {Object.entries(stats.averages || {}).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-500 dark:text-slate-400">{humanize(key)}</span>
                <strong className="text-slate-900 dark:text-slate-100">{formatValue(key, value)}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>

      {!compact && trendEntries.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {trendEntries.map(([grain, rows]) => (
            <section key={grain} className="surface p-4">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200">{humanize(grain)} stats</h3>
              <MiniMultiChart data={rows} compact />
            </section>
          ))}
        </div>
      )}

      <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
        {Object.entries(stats.breakdowns || {}).map(([key, rows]) => (
          <section key={key} className="surface p-4">
            <h3 className="mb-4 text-sm font-medium text-slate-700 dark:text-slate-200">{humanize(key)}</h3>
            <BarChart
              data={rows.map((row) => ({ label: row.label, value: row.value, percent: row.percent }))}
              loading={loading}
            />
          </section>
        ))}
      </div>
    </div>
  );
}

function MetricCard({ metric }: { metric: StatsMetric }) {
  const positive = metric.changePercent > 0;
  const negative = metric.changePercent < 0;

  return (
    <div className="surface p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{metric.label}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">{formatMetric(metric)}</div>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">Previous {formatNumber(metric.previousValue, metric.unit)}</span>
        <span className={positive ? 'text-emerald-600' : negative ? 'text-red-600' : 'text-slate-500'}>
          {positive ? '+' : ''}{metric.changePercent.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

function MiniMultiChart({ data, compact }: { data: StatsTrendPoint[]; compact?: boolean }) {
  const max = Math.max(...data.flatMap((item) => [item.rides, item.orders, item.revenue]), 1);

  if (data.length === 0) {
    return <div className="flex h-64 items-center justify-center text-slate-400">No trend data.</div>;
  }

  return (
    <div className={`mt-4 flex items-end gap-2 border-b border-l border-slate-200 px-2 pt-4 dark:border-slate-800 ${compact ? 'h-48' : 'h-72'}`}>
      {data.map((item) => (
        <div key={item.period} className="flex min-w-8 flex-1 flex-col items-center gap-2">
          <div className="flex h-48 w-full items-end gap-1">
            <span className="w-1/3 rounded-t bg-blue-500" style={{ height: `${Math.max((item.rides / max) * 190, item.rides ? 6 : 0)}px` }} title={`${item.period} rides: ${item.rides}`} />
            <span className="w-1/3 rounded-t bg-emerald-500" style={{ height: `${Math.max((item.orders / max) * 190, item.orders ? 6 : 0)}px` }} title={`${item.period} transactions: ${item.orders}`} />
            <span className="w-1/3 rounded-t bg-amber-500" style={{ height: `${Math.max((item.revenue / max) * 190, item.revenue ? 6 : 0)}px` }} title={`${item.period} revenue: ${formatCurrency(item.revenue)}`} />
          </div>
          <span className="max-w-16 truncate text-xs text-slate-500 dark:text-slate-400">{item.period}</span>
        </div>
      ))}
    </div>
  );
}

function formatMetric(metric: StatsMetric) {
  return formatNumber(metric.value, metric.unit);
}

function formatNumber(value: number, unit?: string) {
  if (unit === 'currency') {
    return formatCurrency(value);
  }
  return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function formatCurrency(value: number) {
  return `NGN ${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

function formatValue(key: string, value: number) {
  if (key.toLowerCase().includes('revenue') || key.toLowerCase().includes('fare')) {
    return formatCurrency(value);
  }
  if (key.toLowerCase().includes('rate')) {
    return `${value.toFixed(1)}%`;
  }
  return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function humanize(value: string) {
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}
