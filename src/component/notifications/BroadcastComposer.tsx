'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bell, Loader, Send } from 'lucide-react';
import Modal from '@/component/utils/Modal';
import UserPicker, { PickedUser } from './UserPicker';
import { DEVICE, errorMessage } from './broadcastUtils';
import { broadcastService } from '../../../lib/api/services/broadcastService';
import { useDebouncedValue } from '../../../lib/hooks/useDebouncedValue';
import {
  AdminBroadcast,
  AUDIENCE_LABELS,
  BroadcastAudience,
  BroadcastAudiencePreview,
  BroadcastAudienceRequest,
  BroadcastCategory,
  BroadcastChannel,
  CATEGORY_LABELS,
  CHANNEL_LABELS,
  CreateBroadcastRequest,
} from '../../../lib/types/broadcast.types';

// Keep in sync with Lapel's AdminBroadcastService limits.
const TITLE_MAX = 120;
const BODY_MAX = 2000;
const SMS_MAX = 459;
const LARGE_AUDIENCE = 500;

const AUDIENCES: { value: BroadcastAudience; hint: string }[] = [
  { value: 'ALL_USERS', hint: 'Everyone with an active account' },
  { value: 'PASSENGERS', hint: 'Users who have never signed up to drive' },
  { value: 'DRIVERS', hint: 'Everyone who signed up to drive' },
  { value: 'VERIFIED_DRIVERS', hint: 'Drivers whose documents were accepted' },
  { value: 'UNVERIFIED_DRIVERS', hint: 'Drivers not yet approved' },
  { value: 'SELECTED_USERS', hint: 'Pick specific people (or send yourself a test)' },
];

const CHANNEL_HINTS: Record<BroadcastChannel, string> = {
  IN_APP: 'Notifications inbox in the app',
  PUSH: 'Phone notification (users with the app installed)',
  EMAIL: 'Branded email',
  SMS: 'Text message — costs money per recipient',
};

function isHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !!url.hostname;
  } catch {
    return false;
  }
}

function previewText(text: string): string {
  return text.replace(/\{\{\s*firstName\s*\}\}/gi, 'Ada');
}

export default function BroadcastComposer({ onCreated }: { onCreated: (broadcast: AdminBroadcast) => void }) {
  const [audience, setAudience] = useState<BroadcastAudience>('ALL_USERS');
  const [selectedUsers, setSelectedUsers] = useState<PickedUser[]>([]);
  const [signedUpFrom, setSignedUpFrom] = useState('');
  const [signedUpTo, setSignedUpTo] = useState('');
  const [channels, setChannels] = useState<BroadcastChannel[]>(['IN_APP', 'PUSH']);
  const [category, setCategory] = useState<BroadcastCategory>('ANNOUNCEMENT');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [smsBody, setSmsBody] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [actionUrl, setActionUrl] = useState('');
  const [actionLabel, setActionLabel] = useState('');
  const [scheduleMode, setScheduleMode] = useState<'now' | 'later'>('now');
  const [scheduledAt, setScheduledAt] = useState('');

  const [reach, setReach] = useState<BroadcastAudiencePreview | null>(null);
  const [reachLoading, setReachLoading] = useState(false);
  const [reachError, setReachError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const audienceRequest = useMemo<BroadcastAudienceRequest>(
    () => ({
      audience,
      userIds: audience === 'SELECTED_USERS' ? selectedUsers.map((user) => user.id) : undefined,
      signedUpFrom: audience !== 'SELECTED_USERS' && signedUpFrom ? signedUpFrom : undefined,
      signedUpTo: audience !== 'SELECTED_USERS' && signedUpTo ? signedUpTo : undefined,
    }),
    [audience, selectedUsers, signedUpFrom, signedUpTo],
  );
  const debouncedAudience = useDebouncedValue(audienceRequest);

  useEffect(() => {
    if (debouncedAudience.audience === 'SELECTED_USERS' && !debouncedAudience.userIds?.length) {
      setReach(null);
      setReachError(null);
      return;
    }
    let cancelled = false;
    setReachLoading(true);
    setReachError(null);
    broadcastService
      .previewAudience(DEVICE, debouncedAudience)
      .then((response) => {
        if (!cancelled) setReach(response.data);
      })
      .catch((error) => {
        if (!cancelled) {
          setReach(null);
          setReachError(errorMessage(error, 'Could not count the audience'));
        }
      })
      .finally(() => {
        if (!cancelled) setReachLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedAudience]);

  const smsText = (smsBody.trim() || body.trim());
  const validationError = useMemo(() => {
    if (channels.length === 0) return 'Choose at least one channel.';
    if (!title.trim()) return 'Add a title.';
    if (title.trim().length > TITLE_MAX) return `Title must be at most ${TITLE_MAX} characters.`;
    if (!body.trim()) return 'Add a message.';
    if (body.trim().length > BODY_MAX) return `Message must be at most ${BODY_MAX} characters.`;
    if (channels.includes('SMS') && smsText.length > SMS_MAX)
      return `SMS text must be at most ${SMS_MAX} characters — add a shorter SMS version.`;
    if (imageUrl.trim() && !isHttpsUrl(imageUrl.trim())) return 'Image URL must start with https://';
    if (actionUrl.trim() && !isHttpsUrl(actionUrl.trim())) return 'Button link must start with https://';
    if (audience === 'SELECTED_USERS' && selectedUsers.length === 0) return 'Select at least one user.';
    if (scheduleMode === 'later') {
      if (!scheduledAt) return 'Pick a date and time to send.';
      if (new Date(scheduledAt).getTime() <= Date.now()) return 'Scheduled time must be in the future.';
    }
    if (reach && reach.totalUsers === 0) return 'No active users match this audience.';
    return null;
  }, [channels, title, body, smsText, imageUrl, actionUrl, audience, selectedUsers, scheduleMode, scheduledAt, reach]);

  const toggleChannel = (channel: BroadcastChannel) => {
    setChannels((current) =>
      current.includes(channel) ? current.filter((item) => item !== channel) : [...current, channel],
    );
  };

  const reset = () => {
    setTitle('');
    setBody('');
    setSmsBody('');
    setEmailSubject('');
    setImageUrl('');
    setActionUrl('');
    setActionLabel('');
    setScheduleMode('now');
    setScheduledAt('');
  };

  const send = async () => {
    setSending(true);
    setSendError(null);
    const request: CreateBroadcastRequest = {
      ...audienceRequest,
      title: title.trim(),
      body: body.trim(),
      smsBody: channels.includes('SMS') && smsBody.trim() ? smsBody.trim() : undefined,
      emailSubject: channels.includes('EMAIL') && emailSubject.trim() ? emailSubject.trim() : undefined,
      imageUrl: imageUrl.trim() || undefined,
      actionUrl: actionUrl.trim() || undefined,
      actionLabel: actionUrl.trim() && actionLabel.trim() ? actionLabel.trim() : undefined,
      category,
      channels,
      scheduledAt: scheduleMode === 'later' && scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
    };
    try {
      const response = await broadcastService.create(DEVICE, request);
      setConfirmOpen(false);
      setNotice(response.message || 'Broadcast created');
      reset();
      onCreated(response.data);
    } catch (error) {
      setSendError(errorMessage(error, 'Could not create the broadcast'));
    } finally {
      setSending(false);
    }
  };

  const reachLine = (channel: BroadcastChannel): string | null => {
    if (!reach) return null;
    switch (channel) {
      case 'IN_APP':
        return `${reach.totalUsers.toLocaleString()} inboxes`;
      case 'PUSH':
        return `${reach.withPushToken.toLocaleString()} devices`;
      case 'EMAIL':
        return `${reach.withEmail.toLocaleString()} emails`;
      case 'SMS':
        return `${reach.withPhoneNumber.toLocaleString()} phones`;
    }
  };

  return (
    <section className="surface p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">New notification</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Send an announcement to customers, drivers, everyone, or a hand-picked list.
        </p>
      </div>

      {notice && (
        <div className="mt-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
          {notice}
        </div>
      )}

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          {/* Audience */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-slate-800 dark:text-slate-200">1. Who should get it?</legend>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {AUDIENCES.map((option) => (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-md border p-3 text-sm transition ${
                    audience === option.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="audience"
                    className="sr-only"
                    checked={audience === option.value}
                    onChange={() => setAudience(option.value)}
                  />
                  <span className="block font-medium text-slate-900 dark:text-slate-100">
                    {AUDIENCE_LABELS[option.value]}
                  </span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">{option.hint}</span>
                </label>
              ))}
            </div>

            {audience === 'SELECTED_USERS' ? (
              <UserPicker selected={selectedUsers} onChange={setSelectedUsers} />
            ) : (
              <div className="flex flex-wrap items-end gap-3 text-sm">
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500">Signed up from (optional)</span>
                  <input type="date" className="input" value={signedUpFrom} onChange={(e) => setSignedUpFrom(e.target.value)} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500">Signed up to (optional)</span>
                  <input type="date" className="input" value={signedUpTo} onChange={(e) => setSignedUpTo(e.target.value)} />
                </label>
                {(signedUpFrom || signedUpTo) && (
                  <button
                    type="button"
                    className="text-xs text-slate-500 underline"
                    onClick={() => {
                      setSignedUpFrom('');
                      setSignedUpTo('');
                    }}
                  >
                    Clear dates
                  </button>
                )}
              </div>
            )}

            <p className="text-sm text-slate-600 dark:text-slate-400">
              {reachLoading ? (
                <span className="inline-flex items-center gap-1">
                  <Loader size={14} className="animate-spin" /> Counting…
                </span>
              ) : reachError ? (
                <span className="text-red-600">{reachError}</span>
              ) : reach ? (
                <>
                  <strong className="text-slate-900 dark:text-slate-100">{reach.totalUsers.toLocaleString()}</strong>{' '}
                  matching users · {reach.withPushToken.toLocaleString()} with push ·{' '}
                  {reach.withEmail.toLocaleString()} with email · {reach.withPhoneNumber.toLocaleString()} with phone
                </>
              ) : null}
            </p>
          </fieldset>

          {/* Channels */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-slate-800 dark:text-slate-200">2. How should it reach them?</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {(Object.keys(CHANNEL_LABELS) as BroadcastChannel[]).map((channel) => (
                <label
                  key={channel}
                  className="flex cursor-pointer items-start gap-3 rounded-md border border-slate-200 p-3 text-sm dark:border-slate-700"
                >
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={channels.includes(channel)}
                    onChange={() => toggleChannel(channel)}
                  />
                  <span>
                    <span className="block font-medium text-slate-900 dark:text-slate-100">
                      {CHANNEL_LABELS[channel]}
                      {reachLine(channel) && (
                        <span className="ml-2 text-xs font-normal text-slate-500">{reachLine(channel)}</span>
                      )}
                    </span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">{CHANNEL_HINTS[channel]}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Content */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-slate-800 dark:text-slate-200">3. What does it say?</legend>
            <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
              <label className="flex flex-col gap-1 text-sm">
                <span className="flex justify-between text-xs text-slate-500">
                  Title <span>{title.trim().length}/{TITLE_MAX}</span>
                </span>
                <input className="input" value={title} maxLength={TITLE_MAX} onChange={(e) => setTitle(e.target.value)} />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-xs text-slate-500">Category</span>
                <select className="input" value={category} onChange={(e) => setCategory(e.target.value as BroadcastCategory)}>
                  {(Object.keys(CATEGORY_LABELS) as BroadcastCategory[]).map((value) => (
                    <option key={value} value={value}>
                      {CATEGORY_LABELS[value]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="flex flex-col gap-1 text-sm">
              <span className="flex justify-between text-xs text-slate-500">
                Message <span>{body.trim().length}/{BODY_MAX}</span>
              </span>
              <textarea
                className="input min-h-32"
                value={body}
                maxLength={BODY_MAX}
                onChange={(e) => setBody(e.target.value)}
              />
              <span className="text-xs text-slate-500">
                Use <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">{'{{firstName}}'}</code> to greet
                each person by name. Push shows the first 240 characters.
              </span>
            </label>

            {channels.includes('SMS') && (
              <label className="flex flex-col gap-1 text-sm">
                <span className="flex justify-between text-xs text-slate-500">
                  SMS version (optional — defaults to the message)
                  <span className={smsText.length > SMS_MAX ? 'text-red-600' : ''}>
                    {smsText.length}/{SMS_MAX}
                  </span>
                </span>
                <textarea className="input min-h-20" value={smsBody} onChange={(e) => setSmsBody(e.target.value)} />
              </label>
            )}
            {channels.includes('EMAIL') && (
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-xs text-slate-500">Email subject (optional — defaults to the title)</span>
                <input className="input" value={emailSubject} maxLength={150} onChange={(e) => setEmailSubject(e.target.value)} />
              </label>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-xs text-slate-500">Image URL (optional, https)</span>
                <input className="input" placeholder="https://…" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              </label>
              <div className="grid grid-cols-[1fr_120px] gap-2">
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-xs text-slate-500">Button link (optional, https)</span>
                  <input className="input" placeholder="https://…" value={actionUrl} onChange={(e) => setActionUrl(e.target.value)} />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-xs text-slate-500">Button text</span>
                  <input
                    className="input"
                    placeholder="Open"
                    maxLength={40}
                    value={actionLabel}
                    disabled={!actionUrl.trim()}
                    onChange={(e) => setActionLabel(e.target.value)}
                  />
                </label>
              </div>
            </div>
          </fieldset>

          {/* Timing */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-slate-800 dark:text-slate-200">4. When?</legend>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="radio" checked={scheduleMode === 'now'} onChange={() => setScheduleMode('now')} />
                Send now
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" checked={scheduleMode === 'later'} onChange={() => setScheduleMode('later')} />
                Schedule
              </label>
              {scheduleMode === 'later' && (
                <input
                  type="datetime-local"
                  className="input"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                />
              )}
            </div>
          </fieldset>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="btn-primary gap-2"
              disabled={!!validationError || reachLoading}
              onClick={() => {
                setSendError(null);
                setNotice(null);
                setConfirmOpen(true);
              }}
            >
              <Send size={16} /> Review & {scheduleMode === 'later' ? 'schedule' : 'send'}
            </button>
            {validationError && <span className="text-sm text-slate-500">{validationError}</span>}
          </div>
        </div>

        {/* Preview */}
        <aside className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Preview</p>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950">
            <div className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm dark:bg-slate-900">
              <span className="mt-0.5 rounded-md bg-blue-600 p-1.5 text-white">
                <Bell size={14} />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">SharedDrive · now</p>
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {previewText(title) || 'Notification title'}
                </p>
                <p className="line-clamp-3 text-sm text-slate-600 dark:text-slate-300">
                  {previewText(body) || 'Your message appears here.'}
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            {imageUrl.trim() && isHttpsUrl(imageUrl.trim()) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl.trim()} alt="" className="max-h-40 w-full object-cover" />
            )}
            <div className="space-y-2 p-4">
              <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {previewText(title) || 'Notification title'}
              </p>
              <p className="whitespace-pre-line text-sm text-slate-600 dark:text-slate-300">
                {previewText(body) || 'Your message appears here.'}
              </p>
              {actionUrl.trim() && (
                <span className="inline-block rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                  {actionLabel.trim() || 'Open'}
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-500">In-app announcement screen. “Ada” stands in for each user’s first name.</p>
        </aside>
      </div>

      <Modal open={confirmOpen} onClose={() => !sending && setConfirmOpen(false)} title="Confirm notification">
        <div className="space-y-4 text-sm">
          <p>
            <strong>{previewText(title)}</strong> will be {scheduleMode === 'later' ? 'scheduled for ' : 'sent now to '}
            {scheduleMode === 'later' && scheduledAt ? `${new Date(scheduledAt).toLocaleString()} to ` : ''}
            <strong>{reach ? reach.totalUsers.toLocaleString() : '?'}</strong>{' '}
            {AUDIENCE_LABELS[audience].toLowerCase()}
            {audience !== 'SELECTED_USERS' && reach ? ' (counted now; the final list is taken at send time)' : ''}.
          </p>
          <ul className="list-inside list-disc text-slate-600 dark:text-slate-300">
            {channels.map((channel) => (
              <li key={channel}>
                {CHANNEL_LABELS[channel]}: {reachLine(channel) ?? '—'}
              </li>
            ))}
          </ul>
          {channels.includes('SMS') && reach && reach.withPhoneNumber > 0 && (
            <p className="rounded-md bg-amber-50 px-3 py-2 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
              SMS is billed per message: about {reach.withPhoneNumber.toLocaleString()} ×{' '}
              {Math.max(1, Math.ceil(smsText.length / 153))} segment(s).
            </p>
          )}
          {reach && reach.totalUsers >= LARGE_AUDIENCE && (
            <p className="rounded-md bg-amber-50 px-3 py-2 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
              This is a large audience. Consider sending to yourself first with “Selected users”.
            </p>
          )}
          {sendError && <p className="text-red-600">{sendError}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" disabled={sending} onClick={() => setConfirmOpen(false)}>
              Back
            </button>
            <button type="button" className="btn-primary gap-2" disabled={sending} onClick={send}>
              {sending && <Loader size={14} className="animate-spin" />}
              {scheduleMode === 'later' ? 'Schedule' : 'Send now'}
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
