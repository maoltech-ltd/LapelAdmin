'use client';

import { useEffect, useState } from 'react';
import SettingsSection from './SettingsSection';
import { PlatformSettings } from '../../../lib/api/services/settingsService';

export default function CommissionSettings({
  settings,
  saving,
  onSave,
}: {
  settings: PlatformSettings;
  saving: boolean;
  onSave: (settings: PlatformSettings) => void;
}) {
  const [commission, setCommission] = useState(settings.commissionPercentage);
  const [seatLimit, setSeatLimit] = useState(settings.maxSeatsPerRide);
  const [rewardType, setRewardType] = useState(settings.referralRewardType);
  const [rewardAmount, setRewardAmount] = useState(settings.referralRewardAmount);
  const [freeRideCount, setFreeRideCount] = useState(settings.referralFreeRideCount);

  useEffect(() => {
    setCommission(settings.commissionPercentage);
    setSeatLimit(settings.maxSeatsPerRide);
    setRewardType(settings.referralRewardType);
    setRewardAmount(settings.referralRewardAmount);
    setFreeRideCount(settings.referralFreeRideCount);
  }, [settings]);

  return (
    <SettingsSection title="Pricing & Commission" description="Control platform earnings and ride limits">
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm font-medium">Commission (%)</label>
        <input
          type="number"
          className="input w-28"
          value={commission}
          onChange={(event) => setCommission(Number(event.target.value))}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <label className="text-sm font-medium">Max seats per ride</label>
        <input
          type="number"
          className="input w-28"
          value={seatLimit}
          onChange={(event) => setSeatLimit(Number(event.target.value))}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <label className="text-sm font-medium">Referral reward</label>
        <select
          className="input w-36"
          value={rewardType}
          onChange={(event) => setRewardType(event.target.value as PlatformSettings['referralRewardType'])}
        >
          <option value="WALLET">Wallet funding</option>
          <option value="FREE_RIDE">Free ride</option>
        </select>
      </div>

      <div className="flex items-center justify-between gap-4">
        <label className="text-sm font-medium">Referral wallet amount</label>
        <input
          type="number"
          className="input w-28"
          value={rewardAmount}
          onChange={(event) => setRewardAmount(Number(event.target.value))}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <label className="text-sm font-medium">Referral free rides</label>
        <input
          type="number"
          className="input w-28"
          value={freeRideCount}
          onChange={(event) => setFreeRideCount(Number(event.target.value))}
        />
      </div>

      <button
        className="btn-primary w-fit"
        disabled={saving}
        onClick={() =>
          onSave({
            ...settings,
            commissionPercentage: commission,
            maxSeatsPerRide: seatLimit,
            referralRewardType: rewardType,
            referralRewardAmount: rewardAmount,
            referralFreeRideCount: freeRideCount,
          })
        }
        title="Save pricing settings"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </SettingsSection>
  );
}
