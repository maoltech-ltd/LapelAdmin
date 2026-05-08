'use client';

import { ReactNode } from 'react';

export function TableShell({ children }: { children: ReactNode }) {
  return <div className="surface overflow-x-auto">{children}</div>;
}

export function EmptyTableRow({ colSpan, message }: { colSpan: number; message: string }) {
  return (
    <tr>
      <td className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400" colSpan={colSpan}>
        {message}
      </td>
    </tr>
  );
}

export function ViewButton({ onClick, label = 'View' }: { onClick: () => void; label?: string }) {
  return (
    <button className="action-link text-blue-600 dark:text-blue-300" onClick={onClick} title={`${label} details`}>
      {label}
    </button>
  );
}
