export default function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="surface p-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      )}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
