'use client';

import { Fragment, useState } from 'react';
import { ApiLogEntry } from '../../../lib/types/console.types';
import { EmptyTableRow, TableShell } from '../utils/DataTable';

function statusColor(status: string): string {
  const code = Number(status);
  if (!Number.isFinite(code)) return 'text-slate-500 dark:text-slate-400';
  if (code >= 200 && code < 300) return 'text-green-600 dark:text-green-400';
  if (code >= 400) return 'text-red-600 dark:text-red-400';
  return 'text-amber-600 dark:text-amber-400';
}

export default function RequestLogsTable({ logs }: { logs: ApiLogEntry[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <TableShell>
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <tr>
            <th className="px-4 py-3 text-left">Time</th>
            <th className="px-4 py-3 text-left">Service</th>
            <th className="px-4 py-3 text-left">Method</th>
            <th className="px-4 py-3 text-left">URL</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">ms</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <Fragment key={log.id}>
              <tr
                className="cursor-pointer border-t border-slate-200 transition hover:bg-blue-50/60 dark:border-slate-800 dark:hover:bg-slate-800/70"
                onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
              >
                <td className="px-4 py-3 whitespace-nowrap text-slate-500 dark:text-slate-400">
                  {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A'}
                </td>
                <td className="px-4 py-3">{log.microserviceName}</td>
                <td className="px-4 py-3 font-mono text-xs">{log.requestMethod}</td>
                <td className="max-w-xs truncate px-4 py-3 font-mono text-xs" title={log.requestUrl}>
                  {log.requestUrl}
                </td>
                <td className={`px-4 py-3 font-medium ${statusColor(log.responseStatus)}`}>{log.responseStatus}</td>
                <td className="px-4 py-3">{log.processingTimeMs}</td>
              </tr>
              {expandedId === log.id && (
                <tr className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40">
                  <td colSpan={6} className="px-4 py-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">Request body</p>
                        <pre className="max-h-40 overflow-auto rounded bg-white p-2 text-xs dark:bg-slate-950">
                          {log.requestBody || '(none)'}
                        </pre>
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">Response body</p>
                        <pre className="max-h-40 overflow-auto rounded bg-white p-2 text-xs dark:bg-slate-950">
                          {log.responseBody || '(none)'}
                        </pre>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
          {logs.length === 0 && <EmptyTableRow colSpan={6} message="No requests logged yet." />}
        </tbody>
      </table>
    </TableShell>
  );
}
