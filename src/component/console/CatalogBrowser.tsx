'use client';

import { ApiCatalogEndpoint, ApiCatalogService } from '../../../lib/types/console.types';

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  POST: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  PUT: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  PATCH: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

export default function CatalogBrowser({
  catalog,
  selectedServiceKey,
  selectedEndpointId,
  onSelectService,
  onSelectEndpoint,
}: {
  catalog: ApiCatalogService[];
  selectedServiceKey: string;
  selectedEndpointId: string | null;
  onSelectService: (key: string) => void;
  onSelectEndpoint: (endpoint: ApiCatalogEndpoint) => void;
}) {
  const activeService = catalog.find((s) => s.key === selectedServiceKey) ?? catalog[0];

  const grouped = (activeService?.endpoints ?? []).reduce<Record<string, ApiCatalogEndpoint[]>>((acc, ep) => {
    (acc[ep.category] ??= []).push(ep);
    return acc;
  }, {});

  return (
    <div className="surface flex h-full flex-col overflow-hidden">
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        {catalog.map((service) => (
          <button
            key={service.key}
            onClick={() => onSelectService(service.key)}
            className={`flex-1 truncate px-3 py-2 text-sm font-medium transition ${
              service.key === activeService?.key
                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
            title={service.name}
          >
            {service.name}
          </button>
        ))}
      </div>

      {activeService && (
        <p className="border-b border-slate-200 px-3 py-2 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          {activeService.description}
        </p>
      )}

      <div className="flex-1 overflow-y-auto p-2">
        {Object.entries(grouped).map(([category, endpoints]) => (
          <div key={category} className="mb-3">
            <div className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {category}
            </div>
            <div className="space-y-1">
              {endpoints.map((endpoint) => (
                <button
                  key={endpoint.id}
                  onClick={() => onSelectEndpoint(endpoint)}
                  className={`flex w-full items-start gap-2 rounded-md px-2 py-2 text-left text-sm transition ${
                    endpoint.id === selectedEndpointId
                      ? 'bg-blue-50 dark:bg-blue-950/40'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span
                    className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                      METHOD_COLORS[endpoint.method] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {endpoint.method}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-mono text-xs text-slate-700 dark:text-slate-300">
                      {endpoint.path}
                    </span>
                    <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                      {endpoint.description}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
