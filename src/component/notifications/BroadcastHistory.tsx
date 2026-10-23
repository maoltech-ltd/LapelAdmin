'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader, RefreshCw } from 'lucide-react';
import Pagination from '@/component/utils/Pagination';
import StatusBadge from '@/component/utils/StatusBadge';
import BroadcastDetailsDrawer from './BroadcastDetailsDrawer';
import { DEVICE, errorMessage, formatDateTime, STATUS_BADGE } from './broadcastUtils';
import { broadcastService } from '../../../lib/api/services/broadcastService';
import {
  AdminBroadcast,
  AUDIENCE_LABELS,
  BroadcastPage,
  BroadcastStatus,
  CHANNEL_LABELS,
} from '../../../lib/types/broadcast.types';

const PAGE_SIZE = 10;
const STATUSES: BroadcastStatus[] = ['SCHEDULED', 'SENDING', 'SENT', 'FAILED', 'CANCELLED'];

export default function BroadcastHistory({ refreshKey }: { refreshKey: number }) {
  const [data, setData] = useState<BroadcastPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<BroadcastStatus | ''>('');
  const [selected, setSelected] = useState<AdminBroadcast | null>(null);

  const load = useCallback(
    async (quiet = false) => {
      if (!quiet) setLoading(true);
      setError(null);
      try {
        const response = await broadcastService.list(DEVICE, {
          page: page - 1,
          size: PAGE_SIZE,
          status: status || undefined,
        });
        setData(response.data);
        setSelected((current) =>
          current ? response.data.content.find((item) => item.id === current.id) ?? current : current,
        );
      } catch (requestError) {
        setError(errorMessage(requestError, 'Could not load notifications'));
      } finally {
        if (!quiet) setLoading(false);
      }
    },
    [page, status],
  );

  useEffect(() => {
    void load();
  }, [load, refreshKey]);

  // Live progress while anything is sending.
  const active = data?.content.some((item) => item.status === 'SENDING') ?? false;
  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => void load(true), 5000);
    return () => window.clearInterval(timer);
  }, [active, load]);

  const rows = data?.content ?? [];

  return (
    <section className="surface p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Sent & scheduled</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Every notification sent from the admin, newest first.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="input"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as BroadcastStatus | '');
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            {STATUSES.map((value) => (
              <option key={value} value={value}>
                {STATUS_BADGE[value].label}
              </option>
            ))}
          </select>
          <button type="button" className="btn-secondary" aria-label="Refresh" onClick={() => void load()}>
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-slate-800">
            <tr>
              <th className="py-2 pr-4 font-medium">Title</th>
              <th className="py-2 pr-4 font-medium">Audience</th>
              <th className="py-2 pr-4 font-medium">Channels</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium">Progress</th>
              <th className="py-2 pr-4 font-medium">When</th>
              <th className="py-2 font-medium">By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading && rows.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  <Loader size={16} className="mx-auto animate-spin" />
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  No notifications yet.
                </td>
              </tr>
            )}
            {rows.map((item) => {
              const badge = STATUS_BADGE[item.status];
              return (
                <tr
                  key={item.id}
                  className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  onClick={() => setSelected(item)}
                >
                  <td className="max-w-[240px] truncate py-2 pr-4 font-medium text-slate-900 dark:text-slate-100">
                    {item.title}
                  </td>
                  <td className="py-2 pr-4">
                    {AUDIENCE_LABELS[item.audience]}
                    {item.audience === 'SELECTED_USERS' ? ` (${item.userIds?.length ?? 0})` : ''}
                  </td>
                  <td className="py-2 pr-4">{(item.channels ?? []).map((c) => CHANNEL_LABELS[c]).join(', ')}</td>
                  <td className="py-2 pr-4">
                    <StatusBadge status={badge.status} label={badge.label} />
                  </td>
                  <td className="py-2 pr-4 tabular-nums">
                    {item.processedRecipients.toLocaleString()} / {item.totalRecipients.toLocaleString()}
                    {item.failedRecipients > 0 && (
                      <span className="ml-1 text-xs text-red-600">({item.failedRecipients} failed)</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap py-2 pr-4">
                    {formatDateTime(item.completedAt ?? item.startedAt ?? item.scheduledAt)}
                  </td>
                  <td className="py-2">{item.createdByAdminName || '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {(data?.totalPages ?? 1) > 1 && (
        <Pagination page={page} totalPages={data?.totalPages ?? 1} onPageChange={setPage} />
      )}

      <BroadcastDetailsDrawer
        broadcast={selected}
        onClose={() => setSelected(null)}
        onChanged={(updated) => {
          setSelected(updated);
          void load(true);
        }}
      />
    </section>
  );
}
