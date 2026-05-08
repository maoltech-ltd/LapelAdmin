'use client';

import { ReactNode } from 'react';

type DetailItem = {
  label: string;
  value?: ReactNode;
};

type StatItem = {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
};

export function DetailSection({
  title,
  children,
  className = '',
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`surface p-4 ${className}`}>
      <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      {children}
    </section>
  );
}

export function DetailGrid({ items }: { items: DetailItem[] }) {
  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-md border border-slate-200 px-3 py-2 dark:border-slate-800">
          <dt className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">{item.label}</dt>
          <dd className="mt-1 break-words text-sm font-medium text-slate-900 dark:text-slate-100">
            {item.value ?? 'N/A'}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function StatSummaryGrid({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="surface p-4">
          <div className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">{stat.label}</div>
          <div className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">{stat.value}</div>
          {stat.hint && <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{stat.hint}</div>}
        </div>
      ))}
    </div>
  );
}
