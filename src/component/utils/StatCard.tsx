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
    default: 'text-gray-800',
    success: 'text-green-600',
    danger: 'text-red-600',
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <p className="text-xs text-gray-500">{title}</p>
      <p className={`mt-2 text-xl font-semibold ${variants[variant]}`}>
        {value}
      </p>
    </div>
  );
}
