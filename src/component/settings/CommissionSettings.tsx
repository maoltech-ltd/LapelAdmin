'use client';

import { useEffect, useState } from 'react';
import SettingsSection from './SettingsSection';
import SettingField from './SettingField';
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
      <SettingField label="Commission (%)" description="Percentage retained by the platform from completed rides.">
        <input
          type="number"
          className="input w-full"
          value={commission}
          onChange={(event) => setCommission(Number(event.target.value))}
        />
      </SettingField>

      <SettingField label="Max seats per ride" description="Upper passenger seat limit for driver offers.">
        <input
          type="number"
          className="input w-full"
          value={seatLimit}
          onChange={(event) => setSeatLimit(Number(event.target.value))}
        />
      </SettingField>

      <SettingField label="Referral reward" description="Reward type issued when referral rules are met.">
        <select
          className="input w-full"
          value={rewardType}
          onChange={(event) => setRewardType(event.target.value as PlatformSettings['referralRewardType'])}
        >
          <option value="WALLET">Wallet funding</option>
          <option value="FREE_RIDE">Free ride</option>
        </select>
      </SettingField>

      <SettingField label="Referral wallet amount" description="Wallet credit when wallet reward is selected.">
        <input
          type="number"
          className="input w-full"
          value={rewardAmount}
          onChange={(event) => setRewardAmount(Number(event.target.value))}
        />
      </SettingField>

      <SettingField label="Referral free rides" description="Free ride count when free ride reward is selected.">
        <input
          type="number"
          className="input w-full"
          value={freeRideCount}
          onChange={(event) => setFreeRideCount(Number(event.target.value))}
        />
      </SettingField>

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
