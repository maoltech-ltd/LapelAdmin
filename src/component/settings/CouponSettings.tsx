'use client';

import { useEffect, useState } from 'react';
import SettingsSection from './SettingsSection';
import { Coupon, settingsService } from '../../../lib/api/services/settingsService';

const emptyCoupon: Coupon = {
  code: '',
  discountType: 'PERCENTAGE',
  discountValue: 0,
  maxDiscountAmount: 0,
  usageLimit: 0,
  active: true,
};

export default function CouponSettings({ device }: { device: string }) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [draft, setDraft] = useState<Coupon>(emptyCoupon);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    settingsService
      .getCoupons(device)
      .then((response) => setCoupons(response.data ?? []))
      .catch(() => setCoupons([]));
  }, [device]);

  const issueCoupon = async () => {
    setSaving(true);
    try {
      const response = await settingsService.issueCoupon(device, draft);
      setCoupons((current) => [response.data, ...current]);
      setDraft(emptyCoupon);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingsSection title="Coupons" description="Issue ride discounts for customers">
      <div className="grid gap-3 md:grid-cols-5">
        <input
          className="input"
          placeholder="Code"
          value={draft.code}
          onChange={(event) => setDraft({ ...draft, code: event.target.value.toUpperCase() })}
        />
        <select
          className="input"
          value={draft.discountType}
          onChange={(event) => setDraft({ ...draft, discountType: event.target.value as Coupon['discountType'] })}
        >
          <option value="PERCENTAGE">Percent</option>
          <option value="FIXED">Fixed</option>
        </select>
        <input
          className="input"
          type="number"
          placeholder="Value"
          value={draft.discountValue}
          onChange={(event) => setDraft({ ...draft, discountValue: Number(event.target.value) })}
        />
        <input
          className="input"
          type="number"
          placeholder="Usage limit"
          value={draft.usageLimit}
          onChange={(event) => setDraft({ ...draft, usageLimit: Number(event.target.value) })}
        />
        <button className="btn-primary" disabled={saving || !draft.code} onClick={issueCoupon}>
          {saving ? 'Issuing...' : 'Issue'}
        </button>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {coupons.map((coupon) => (
          <div key={coupon.id ?? coupon.code} className="flex items-center justify-between py-3 text-sm">
            <span className="font-medium">{coupon.code}</span>
            <span className="text-slate-500">
              {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : coupon.discountValue} ·{' '}
              {coupon.usageCount ?? 0}/{coupon.usageLimit || 'unlimited'}
            </span>
          </div>
        ))}
      </div>
    </SettingsSection>
  );
}
