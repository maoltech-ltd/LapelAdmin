interface StatCardProps {
  title: string;
  value: string;
  variant?: 'default' | 'success' | 'danger';
}

export default function StatCard({
  title,
  value,
  variant = 'default',
}: StatCardProps) {
  const variants = {
    default: 'text-slate-900 dark:text-slate-100',
    success: 'text-green-600 dark:text-green-400',
    danger: 'text-red-600 dark:text-red-400',
  };

  return (
    <div className="surface p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:hover:border-blue-900">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <p className={`mt-2 text-xl font-semibold ${variants[variant]}`}>
        {value}
      </p>
    </div>
  );
}
