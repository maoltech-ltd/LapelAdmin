'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';

type DetailDrawerProps = {
  open: boolean;
  title: string;
  subtitle?: ReactNode;
  badge?: ReactNode;
  widthClassName?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export default function DetailDrawer({
  open,
  title,
  subtitle,
  badge,
  widthClassName = 'max-w-4xl',
  onClose,
  children,
  footer,
}: DetailDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/45" onClick={onClose}>
      <aside
        className={`flex h-full w-full ${widthClassName} flex-col bg-white shadow-2xl dark:bg-slate-950`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-lg font-semibold text-slate-950 dark:text-slate-50">{title}</h2>
                {badge}
              </div>
              {subtitle && <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</div>}
            </div>
            <button className="btn-secondary h-9 w-9 shrink-0 p-0" onClick={onClose} aria-label="Close drawer">
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>

        {footer && <footer className="border-t border-slate-200 px-5 py-4 dark:border-slate-800">{footer}</footer>}
      </aside>
    </div>
  );
}
