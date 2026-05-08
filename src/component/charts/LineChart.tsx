interface LineChartProps {
  data: {
    labels?: string[];
    datasets?: Array<{ data?: number[] }>;
  };
  options: unknown;
  loading?: boolean;
}

export default function LineChart({ data, loading = false }: LineChartProps) {
  const values = data?.datasets?.[0]?.data || [];
  const labels = data?.labels || [];
  const max = Math.max(...values, 1);

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-slate-400">Loading chart...</div>;
  }

  if (values.length === 0) {
    return <div className="flex h-64 items-center justify-center text-slate-400">No ride volume data.</div>;
  }

  return (
    <div className="flex h-64 items-end gap-2 border-b border-l border-slate-200 px-2 pt-4 dark:border-slate-800">
      {values.map((value, index) => (
        <div key={`${labels[index] || index}-${value}`} className="flex min-w-10 flex-1 flex-col items-center gap-2">
          <div
            className="w-full rounded-t bg-blue-500 transition hover:bg-blue-600"
            style={{ height: `${Math.max((value / max) * 190, 8)}px` }}
            title={`${labels[index] || 'Period'}: ${value}`}
          />
          <span className="max-w-16 truncate text-xs text-slate-500 dark:text-slate-400">{labels[index]}</span>
        </div>
      ))}
    </div>
  );
}
