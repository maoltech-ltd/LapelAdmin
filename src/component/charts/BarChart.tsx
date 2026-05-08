interface BarChartProps {
  data: Array<{ label: string; value: number; percent?: number }>;
  loading?: boolean;
  valueFormatter?: (value: number) => string;
}

export default function BarChart({ data, loading = false, valueFormatter = (value) => value.toLocaleString() }: BarChartProps) {
  const max = Math.max(...data.map((item) => item.value), 1);

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-slate-400">Loading chart...</div>;
  }

  if (data.length === 0) {
    return <div className="flex h-64 items-center justify-center text-slate-400">No chart data.</div>;
  }

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.label} className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="truncate">{item.label}</span>
            <span>{valueFormatter(item.value)}{item.percent !== undefined ? ` (${item.percent.toFixed(1)}%)` : ''}</span>
          </div>
          <div className="h-2 overflow-hidden rounded bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded bg-emerald-500"
              style={{ width: `${Math.max((item.value / max) * 100, item.value > 0 ? 4 : 0)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
