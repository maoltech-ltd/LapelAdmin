'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { consoleService } from '../../../lib/api/services';
import {
  ApiCatalogEndpoint,
  ApiCatalogService,
  ApiLogEntry,
  ConsoleExecuteResult,
} from '../../../lib/types/console.types';
import CatalogBrowser from '@/component/console/CatalogBrowser';
import RequestPanel from '@/component/console/RequestPanel';
import ResponsePanel from '@/component/console/ResponsePanel';
import RequestLogsTable from '@/component/console/RequestLogsTable';
import Pagination from '@/component/utils/Pagination';

const DEVICE = 'web';
const LOGS_PAGE_SIZE = 10;

function parseJsonObject(text: string): Record<string, unknown> | undefined {
  const trimmed = text.trim();
  if (!trimmed) return undefined;
  const parsed = JSON.parse(trimmed);
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('Expected a JSON object');
  }
  return parsed as Record<string, unknown>;
}

export default function DevConsolePage() {
  const [catalog, setCatalog] = useState<ApiCatalogService[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const [selectedServiceKey, setSelectedServiceKey] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiCatalogEndpoint | null>(null);

  const [method, setMethod] = useState('GET');
  const [path, setPath] = useState('');
  const [queryParamsText, setQueryParamsText] = useState('{}');
  const [headersText, setHeadersText] = useState('{}');
  const [bodyText, setBodyText] = useState('');

  const [executing, setExecuting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<ConsoleExecuteResult | null>(null);

  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState<ApiLogEntry[]>([]);
  const [logsPage, setLogsPage] = useState(1);
  const [logsTotalPages, setLogsTotalPages] = useState(1);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoadingCatalog(true);
    consoleService
      .getCatalog(DEVICE)
      .then((res) => {
        if (cancelled) return;
        setCatalog(res.data);
        if (res.data.length > 0) setSelectedServiceKey(res.data[0].key);
      })
      .catch((err) => {
        if (!cancelled) setCatalogError(err?.response?.data?.message || err.message);
      })
      .finally(() => {
        if (!cancelled) setLoadingCatalog(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!showLogs) return;
    setLoadingLogs(true);
    consoleService
      .getLogs(DEVICE, logsPage - 1, LOGS_PAGE_SIZE)
      .then((res) => {
        setLogs(res.data.content);
        setLogsTotalPages(res.data.totalPages || 1);
      })
      .finally(() => setLoadingLogs(false));
  }, [showLogs, logsPage]);

  const selectEndpoint = (endpoint: ApiCatalogEndpoint) => {
    setSelectedEndpoint(endpoint);
    setMethod(endpoint.method);
    setPath(endpoint.path);
    setBodyText(endpoint.sampleBody ?? '');
    setQueryParamsText('{}');
    setHeadersText('{}');
    setFormError(null);
    setResult(null);
  };

  const runRequest = async () => {
    setFormError(null);
    if (!selectedServiceKey) {
      setFormError('Select a service first.');
      return;
    }
    if (!path.trim().startsWith('/')) {
      setFormError('Path must start with "/".');
      return;
    }

    let queryParams: Record<string, string> | undefined;
    let headers: Record<string, string> | undefined;
    let body: unknown;

    try {
      queryParams = parseJsonObject(queryParamsText) as Record<string, string> | undefined;
    } catch {
      setFormError('Query params must be valid JSON (an object).');
      return;
    }
    try {
      headers = parseJsonObject(headersText) as Record<string, string> | undefined;
    } catch {
      setFormError('Headers must be valid JSON (an object).');
      return;
    }
    if (method !== 'GET' && method !== 'DELETE' && bodyText.trim()) {
      try {
        body = JSON.parse(bodyText);
      } catch {
        setFormError('Body must be valid JSON.');
        return;
      }
    }

    setExecuting(true);
    try {
      const res = await consoleService.execute(DEVICE, {
        serviceKey: selectedServiceKey,
        method,
        path: path.trim(),
        queryParams,
        headers,
        body,
      });
      setResult(res.data);
    } catch (err) {
      const axiosError = axios.isAxiosError(err) ? err : null;
      const fallbackResult: ConsoleExecuteResult = {
        requestUrl: path,
        requestMethod: method,
        status: axiosError?.response?.status ?? 0,
        responseHeaders: {},
        responseBody: null,
        durationMs: 0,
        error: axiosError?.response?.data?.message || (err instanceof Error ? err.message : 'Request failed'),
      };
      setResult(axiosError?.response?.data?.data ?? fallbackResult);
    } finally {
      setExecuting(false);
    }
  };

  if (loadingCatalog) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Loading endpoint catalog…</p>;
  }

  if (catalogError) {
    return <p className="text-sm text-red-600 dark:text-red-400">{catalogError}</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Developer Console</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Browse endpoints across Lapel, maol_payment and maol_service, and fire test requests at them.
          Money-moving endpoints (create transfer, payout, local transfer) are intentionally excluded.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="h-[600px]">
          <CatalogBrowser
            catalog={catalog}
            selectedServiceKey={selectedServiceKey}
            selectedEndpointId={selectedEndpoint?.id ?? null}
            onSelectService={(key) => {
              setSelectedServiceKey(key);
              setSelectedEndpoint(null);
            }}
            onSelectEndpoint={selectEndpoint}
          />
        </div>

        <div className="grid gap-4">
          <RequestPanel
            selectedEndpoint={selectedEndpoint}
            method={method}
            path={path}
            queryParamsText={queryParamsText}
            headersText={headersText}
            bodyText={bodyText}
            onMethodChange={setMethod}
            onPathChange={setPath}
            onQueryParamsChange={setQueryParamsText}
            onHeadersChange={setHeadersText}
            onBodyChange={setBodyText}
            onRun={runRequest}
            executing={executing}
            formError={formError}
          />
          <div className="h-72">
            <ResponsePanel result={result} />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button className="btn-secondary" onClick={() => setShowLogs((v) => !v)}>
          {showLogs ? 'Hide' : 'Show'} recent requests
        </button>

        {showLogs && (
          <>
            {loadingLogs ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading…</p>
            ) : (
              <RequestLogsTable logs={logs} />
            )}
            {logsTotalPages > 1 && (
              <Pagination page={logsPage} totalPages={logsTotalPages} onPageChange={setLogsPage} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
