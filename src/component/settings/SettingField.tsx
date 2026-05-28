export default function SettingField({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 rounded-md border border-slate-200 p-3 dark:border-slate-800 md:grid-cols-[1fr_auto] md:items-center">
      <div className="min-w-0">
        <div className="text-sm font-medium text-slate-800 dark:text-slate-100">{label}</div>
        {description && (
          <div className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{description}</div>
        )}
      </div>
      <div className="md:min-w-36">{children}</div>
    </div>
  );
}
