'use client';

import { ConsoleExecuteResult } from '../../../lib/types/console.types';

function statusColor(status: number): string {
  if (status === 0) return 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200';
  if (status >= 200 && status < 300) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
  if (status >= 400 && status < 500) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
  if (status >= 500) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
  return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
}

function prettyBody(body: string | null): string {
  if (!body) return '';
  try {
    return JSON.stringify(JSON.parse(body), null, 2);
  } catch {
    return body;
  }
}

export default function ResponsePanel({ result }: { result: ConsoleExecuteResult | null }) {
  if (!result) {
    return (
      <div className="surface flex h-full items-center justify-center p-6 text-sm text-slate-400">
        Response will appear here after you send a request.
      </div>
    );
  }

  return (
    <div className="surface flex h-full flex-col overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <span className={`rounded px-2 py-0.5 text-xs font-semibold ${statusColor(result.status)}`}>
          {result.status === 0 ? 'ERROR' : result.status}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">{result.durationMs}ms</span>
        <span className="truncate text-xs text-slate-400" title={result.requestUrl}>
          {result.requestMethod} {result.requestUrl}
        </span>
      </div>

      {result.error && (
        <div className="border-b border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
          {result.error}
        </div>
      )}

      <div className="flex-1 overflow-auto p-4">
        {result.responseHeaders && Object.keys(result.responseHeaders).length > 0 && (
          <details className="mb-3">
            <summary className="cursor-pointer text-xs font-medium text-slate-500 dark:text-slate-400">
              Response headers
            </summary>
            <pre className="mt-2 overflow-auto rounded bg-slate-50 p-2 text-xs dark:bg-slate-800/60">
              {Object.entries(result.responseHeaders)
                .map(([k, v]) => `${k}: ${v}`)
                .join('\n')}
            </pre>
          </details>
        )}
        <pre className="overflow-auto rounded bg-slate-50 p-3 text-xs dark:bg-slate-800/60">
          {prettyBody(result.responseBody) || '(empty body)'}
        </pre>
      </div>
    </div>
  );
}
