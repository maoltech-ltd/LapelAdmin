'use client';

import { FormEvent, useState } from 'react';
import ToggleSwitch from '../utils/ToggleSwitch';
import { companyService } from '../../../lib/api/services/companyService';
import { CompanyDto } from '../../../lib/types/company.types';
import { errorMessage, toDateTimeInput } from './companyAdminUtils';

// Edits the admin-only "business rate". Dates are server-local date-times
// (Lapel compares them against its own clock), so no timezone conversion here.
export default function CompanyDiscountForm({
  device,
  company,
  onUpdated,
}: {
  device: string;
  company: CompanyDto;
  onUpdated: (updated: CompanyDto) => void;
}) {
  const [active, setActive] = useState(company.discountActive);
  const [percentage, setPercentage] = useState(String(company.discountPercentage ?? 0));
  const [maxPerRide, setMaxPerRide] = useState(String(company.maxDiscountPerRide ?? 0));
  const [startsAt, setStartsAt] = useState(toDateTimeInput(company.discountStartsAt));
  const [endsAt, setEndsAt] = useState(toDateTimeInput(company.discountEndsAt));
  const [note, setNote] = useState(company.discountNote ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validate = (): string | null => {
    const pct = Number(percentage);
    const cap = Number(maxPerRide);
    if (!Number.isFinite(pct) || pct < 0 || pct > 90) return 'Discount percentage must be between 0 and 90.';
    if (active && pct <= 0) return 'Set a percentage above 0 to turn the business rate on.';
    if (!Number.isFinite(cap) || cap < 0) return 'Max discount per ride must be 0 (no cap) or more.';
    if (startsAt && endsAt && endsAt <= startsAt) return 'The end date must be after the start date.';
    return null;
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSuccess(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const response = await companyService.updateDiscount(device, company.id, {
        discountActive: active,
        discountPercentage: Number(percentage),
        maxDiscountPerRide: Number(maxPerRide),
        discountStartsAt: startsAt || null,
        discountEndsAt: endsAt || null,
        discountNote: note.trim() || null,
      });
      onUpdated(response.data);
      setSuccess('Business rate saved. The owner has been emailed.');
    } catch (requestError) {
      setError(errorMessage(requestError, 'Failed to update business rate'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <ToggleSwitch label="Business rate active" checked={active} onChange={setActive} disabled={submitting} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Discount % (0-90)</span>
          <input
            className="input w-full"
            type="number"
            min={0}
            max={90}
            step="0.5"
            value={percentage}
            onChange={(event) => setPercentage(event.target.value)}
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
            Max per ride (NGN, 0 = no cap)
          </span>
          <input
            className="input w-full"
            type="number"
            min={0}
            step="50"
            value={maxPerRide}
            onChange={(event) => setMaxPerRide(event.target.value)}
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Starts (optional)</span>
          <input
            className="input w-full"
            type="datetime-local"
            value={startsAt}
            onChange={(event) => setStartsAt(event.target.value)}
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Ends (optional)</span>
          <input
            className="input w-full"
            type="datetime-local"
            value={endsAt}
            onChange={(event) => setEndsAt(event.target.value)}
          />
        </label>
      </div>
      <label className="block space-y-1">
        <span className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Internal note</span>
        <textarea
          className="input w-full"
          rows={2}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="e.g. Agreed on call with finance, renew in Q1"
        />
      </label>
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-2 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {success}
        </div>
      )}
      <div className="flex justify-end">
        <button className="btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save business rate'}
        </button>
      </div>
    </form>
  );
}
