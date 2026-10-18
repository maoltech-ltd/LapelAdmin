'use client';

import { useState } from 'react';
import Modal from '../utils/Modal';
import { companyService, CompanyStatusAction } from '../../../lib/api/services/companyService';
import { CompanyDto, CompanyStatus } from '../../../lib/types/company.types';
import { discountSummary, errorMessage } from './companyAdminUtils';

const ACTION_COPY: Record<
  CompanyStatusAction,
  { label: string; needsReason: boolean; buttonClass: string; confirm: (company: CompanyDto) => string }
> = {
  approve: {
    label: 'Approve',
    needsReason: false,
    buttonClass: 'bg-emerald-600 hover:bg-emerald-700',
    confirm: (company) =>
      `Approve ${company.name}? Staff will be able to charge rides to the company wallet. Business rate: ${discountSummary(company)}. The owner is emailed.`,
  },
  reject: {
    label: 'Reject',
    needsReason: true,
    buttonClass: 'bg-red-600 hover:bg-red-700',
    confirm: (company) =>
      `Reject ${company.name}? Staff won't be able to join or charge rides, and wallet funding is blocked. The owner is emailed the reason.`,
  },
  suspend: {
    label: 'Suspend',
    needsReason: true,
    buttonClass: 'bg-amber-600 hover:bg-amber-700',
    confirm: (company) =>
      `Suspend ${company.name}? Staff can't join or charge rides until it's reactivated. The owner is emailed the reason.`,
  },
  reactivate: {
    label: 'Reactivate',
    needsReason: false,
    buttonClass: 'bg-emerald-600 hover:bg-emerald-700',
    confirm: (company) => `Reactivate ${company.name}? Staff can charge rides to the company again.`,
  },
};

// Which transitions the backend allows from each status (docs/COMPANY_ACCOUNTS.md section 4).
const ACTIONS_BY_STATUS: Record<CompanyStatus, CompanyStatusAction[]> = {
  [CompanyStatus.PENDING_APPROVAL]: ['reject', 'approve'],
  [CompanyStatus.ACTIVE]: ['suspend'],
  [CompanyStatus.SUSPENDED]: ['reactivate'],
  [CompanyStatus.REJECTED]: ['approve'],
};

export default function CompanyStatusActions({
  device,
  company,
  onUpdated,
}: {
  device: string;
  company: CompanyDto;
  onUpdated: (updated: CompanyDto) => void;
}) {
  const [pending, setPending] = useState<CompanyStatusAction | null>(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const actions = ACTIONS_BY_STATUS[company.status] ?? [];
  if (actions.length === 0) return null;

  const open = (action: CompanyStatusAction) => {
    setPending(action);
    setReason('');
    setError(null);
    setSuccess(null);
  };

  const submit = async (action: CompanyStatusAction) => {
    if (ACTION_COPY[action].needsReason && !reason.trim()) {
      setError('Please give a reason. It is included in the email to the owner.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const response = await companyService.changeStatus(device, company.id, action, {
        reason: reason.trim() || undefined,
      });
      onUpdated(response.data);
      setPending(null);
      setSuccess(response.message || `${ACTION_COPY[action].label} succeeded`);
    } catch (requestError) {
      setError(errorMessage(requestError, 'Failed to update company status'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {error && !pending && (
        <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-2 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {success}
        </div>
      )}
      <div className="flex flex-wrap justify-end gap-2">
        {actions.map((action) => (
          <button
            key={action}
            className={`rounded-md px-3 py-2 text-sm font-medium text-white disabled:opacity-60 ${ACTION_COPY[action].buttonClass}`}
            onClick={() => open(action)}
            disabled={submitting}
          >
            {ACTION_COPY[action].label}
          </button>
        ))}
      </div>

      <Modal open={!!pending} onClose={() => setPending(null)} title={pending ? `${ACTION_COPY[pending].label} company` : ''}>
        {pending && (
          <div className="space-y-4">
            <p className="text-sm text-slate-700 dark:text-slate-300">{ACTION_COPY[pending].confirm(company)}</p>
            <label className="block space-y-1">
              <span className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
                Reason{ACTION_COPY[pending].needsReason ? '' : ' (optional)'}
              </span>
              <textarea
                className="input w-full"
                rows={3}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder={ACTION_COPY[pending].needsReason ? 'Shown to the company owner' : ''}
              />
            </label>
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button className="btn-secondary" onClick={() => setPending(null)} disabled={submitting}>
                Cancel
              </button>
              <button
                className={`rounded-md px-3 py-2 text-sm font-medium text-white disabled:opacity-60 ${ACTION_COPY[pending].buttonClass}`}
                onClick={() => submit(pending)}
                disabled={submitting}
              >
                {submitting ? 'Processing...' : `Confirm ${ACTION_COPY[pending].label.toLowerCase()}`}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
