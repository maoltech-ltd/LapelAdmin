'use client';

import { ApiCatalogEndpoint } from '../../../lib/types/console.types';

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

export default function RequestPanel({
  selectedEndpoint,
  method,
  path,
  queryParamsText,
  headersText,
  bodyText,
  onMethodChange,
  onPathChange,
  onQueryParamsChange,
  onHeadersChange,
  onBodyChange,
  onRun,
  executing,
  formError,
}: {
  selectedEndpoint: ApiCatalogEndpoint | null;
  method: string;
  path: string;
  queryParamsText: string;
  headersText: string;
  bodyText: string;
  onMethodChange: (v: string) => void;
  onPathChange: (v: string) => void;
  onQueryParamsChange: (v: string) => void;
  onHeadersChange: (v: string) => void;
  onBodyChange: (v: string) => void;
  onRun: () => void;
  executing: boolean;
  formError: string | null;
}) {
  const showBody = method !== 'GET' && method !== 'DELETE';

  return (
    <div className="surface flex flex-col gap-3 p-4">
      {selectedEndpoint?.authNote && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300">
          {selectedEndpoint.authNote}
        </div>
      )}
      {selectedEndpoint?.sideEffectNote && (
        <div className="rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
          ⚠ {selectedEndpoint.sideEffectNote}
        </div>
      )}

      <div className="flex gap-2">
        <select
          className="input w-28 shrink-0"
          value={method}
          onChange={(e) => onMethodChange(e.target.value)}
        >
          {METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <input
          className="input flex-1 font-mono text-sm"
          value={path}
          onChange={(e) => onPathChange(e.target.value)}
          placeholder="/transfers/{id}"
        />
        <button className="btn-primary shrink-0" onClick={onRun} disabled={executing}>
          {executing ? 'Sending…' : 'Send'}
        </button>
      </div>

      {formError && <p className="text-xs text-red-600 dark:text-red-400">{formError}</p>}

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
            Query params (JSON object)
          </label>
          <textarea
            className="input h-20 w-full font-mono text-xs"
            value={queryParamsText}
            onChange={(e) => onQueryParamsChange(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
            Headers (JSON object)
          </label>
          <textarea
            className="input h-20 w-full font-mono text-xs"
            value={headersText}
            onChange={(e) => onHeadersChange(e.target.value)}
          />
        </div>
      </div>

      {selectedEndpoint && selectedEndpoint.headers.length > 0 && (
        <div className="rounded-md border border-slate-200 p-2 text-xs dark:border-slate-800">
          <p className="mb-1 font-medium text-slate-500 dark:text-slate-400">Headers this endpoint uses:</p>
          <ul className="space-y-0.5">
            {selectedEndpoint.headers.map((h) => (
              <li key={h.name} className="flex flex-wrap gap-1 text-slate-600 dark:text-slate-300">
                <span className="font-mono">{h.name}</span>
                {h.required && <span className="text-red-500">*</span>}
                <span className="text-slate-400">— {h.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showBody && (
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
            Body (JSON)
          </label>
          <textarea
            className="input h-40 w-full font-mono text-xs"
            value={bodyText}
            onChange={(e) => onBodyChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
