'use client';

import { useState } from 'react';
import { Loader, X } from 'lucide-react';
import Drawer from '@/component/utils/Drawer';
import StatusBadge from '@/component/utils/StatusBadge';
import { DEVICE, errorMessage, formatDateTime, STATUS_BADGE } from './broadcastUtils';
import { broadcastService } from '../../../lib/api/services/broadcastService';
import { AdminBroadcast, AUDIENCE_LABELS, CATEGORY_LABELS, CHANNEL_LABELS } from '../../../lib/types/broadcast.types';

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-right text-slate-900 dark:text-slate-100">{value}</span>
    </div>
  );
}

export default function BroadcastDetailsDrawer({
  broadcast,
  onClose,
  onChanged,
}: {
  broadcast: AdminBroadcast | null;
  onClose: () => void;
  onChanged: (broadcast: AdminBroadcast) => void;
}) {
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!broadcast) return null;
  const badge = STATUS_BADGE[broadcast.status];
  const cancellable =
    broadcast.status === 'SCHEDULED' || (broadcast.status === 'SENDING' && !broadcast.cancelRequested);
  const channels = broadcast.channels ?? [];

  const cancel = async () => {
    if (!window.confirm('Cancel this notification? Users already reached keep it.')) return;
    setCancelling(true);
    setError(null);
    try {
      const response = await broadcastService.cancel(DEVICE, broadcast.id);
      onChanged(response.data);
    } catch (requestError) {
      setError(errorMessage(requestError, 'Could not cancel'));
    } finally {
      setCancelling(false);
    }
  };

  return (
    <Drawer open onClose={onClose}>
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">{broadcast.title}</p>
            <div className="mt-1 flex items-center gap-2">
              <StatusBadge status={badge.status} label={badge.label} />
              {broadcast.cancelRequested && broadcast.status === 'SENDING' && (
                <span className="text-xs text-slate-500">stopping…</span>
              )}
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 p-4">
          <section>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Message</p>
            <p className="whitespace-pre-line text-sm text-slate-800 dark:text-slate-200">{broadcast.body}</p>
            {broadcast.smsBody && (
              <p className="mt-2 text-xs text-slate-500">SMS: {broadcast.smsBody}</p>
            )}
            {broadcast.emailSubject && (
              <p className="mt-1 text-xs text-slate-500">Email subject: {broadcast.emailSubject}</p>
            )}
            {broadcast.actionUrl && (
              <p className="mt-1 break-all text-xs text-slate-500">
                Button “{broadcast.actionLabel || 'Open'}”: {broadcast.actionUrl}
              </p>
            )}
            {broadcast.imageUrl && <p className="mt-1 break-all text-xs text-slate-500">Image: {broadcast.imageUrl}</p>}
          </section>

          <section className="divide-y divide-slate-100 dark:divide-slate-800">
            <Row label="Audience" value={AUDIENCE_LABELS[broadcast.audience]} />
            {broadcast.audience === 'SELECTED_USERS' && (
              <Row label="Selected users" value={broadcast.userIds?.length ?? 0} />
            )}
            {(broadcast.signedUpFrom || broadcast.signedUpTo) && (
              <Row label="Signed up" value={`${broadcast.signedUpFrom ?? '…'} → ${broadcast.signedUpTo ?? '…'}`} />
            )}
            <Row label="Channels" value={channels.map((c) => CHANNEL_LABELS[c]).join(', ')} />
            <Row label="Category" value={CATEGORY_LABELS[broadcast.category]} />
            <Row label="Created by" value={broadcast.createdByAdminName || '—'} />
            <Row label="Created" value={formatDateTime(broadcast.createdAt)} />
            <Row label="Scheduled for" value={formatDateTime(broadcast.scheduledAt)} />
            <Row label="Started" value={formatDateTime(broadcast.startedAt)} />
            <Row label="Finished" value={formatDateTime(broadcast.completedAt)} />
          </section>

          <section className="divide-y divide-slate-100 dark:divide-slate-800">
            <p className="pb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Delivery</p>
            <Row
              label="Recipients processed"
              value={`${broadcast.processedRecipients.toLocaleString()} / ${broadcast.totalRecipients.toLocaleString()}`}
            />
            {channels.includes('IN_APP') && <Row label="In-app created" value={broadcast.inAppSent.toLocaleString()} />}
            {channels.includes('PUSH') && (
              <Row
                label="Push queued"
                value={`${broadcast.pushQueued.toLocaleString()} (${broadcast.pushSkipped.toLocaleString()} without app)`}
              />
            )}
            {channels.includes('EMAIL') && (
              <Row
                label="Email queued"
                value={`${broadcast.emailQueued.toLocaleString()} (${broadcast.emailSkipped.toLocaleString()} without email)`}
              />
            )}
            {channels.includes('SMS') && (
              <Row
                label="SMS queued"
                value={`${broadcast.smsQueued.toLocaleString()} (${broadcast.smsSkipped.toLocaleString()} without phone)`}
              />
            )}
            <Row label="Failed recipients" value={broadcast.failedRecipients.toLocaleString()} />
          </section>
          <p className="text-xs text-slate-500">
            “Queued” means handed to the messaging service; provider delivery (email/SMS/push) happens after that.
          </p>

          {broadcast.lastError && (
            <p className="break-words rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
              Last error: {broadcast.lastError}
            </p>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {cancellable && (
            <button type="button" className="btn-secondary gap-2 text-red-600" disabled={cancelling} onClick={cancel}>
              {cancelling && <Loader size={14} className="animate-spin" />}
              {broadcast.status === 'SCHEDULED' ? 'Cancel scheduled notification' : 'Stop sending'}
            </button>
          )}
        </div>
      </div>
    </Drawer>
  );
}
