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
  const [iosWalletFundingCharge, setIosWalletFundingCharge] = useState(settings.iosWalletFundingCharge ?? 0);
  const [androidWalletFundingCharge, setAndroidWalletFundingCharge] = useState(settings.androidWalletFundingCharge ?? 0);
  const [iosWithdrawalCharge, setIosWithdrawalCharge] = useState(settings.iosWithdrawalCharge ?? 0);
  const [androidWithdrawalCharge, setAndroidWithdrawalCharge] = useState(settings.androidWithdrawalCharge ?? 0);
  const [rideChargeType, setRideChargeType] = useState(settings.rideChargeType ?? 'FIXED');
  const [iosRideCharge, setIosRideCharge] = useState(settings.iosRideCharge ?? 0);
  const [androidRideCharge, setAndroidRideCharge] = useState(settings.androidRideCharge ?? 0);

  useEffect(() => {
    setCommission(settings.commissionPercentage);
    setSeatLimit(settings.maxSeatsPerRide);
    setRewardType(settings.referralRewardType);
    setRewardAmount(settings.referralRewardAmount);
    setFreeRideCount(settings.referralFreeRideCount);
    setIosWalletFundingCharge(settings.iosWalletFundingCharge ?? 0);
    setAndroidWalletFundingCharge(settings.androidWalletFundingCharge ?? 0);
    setIosWithdrawalCharge(settings.iosWithdrawalCharge ?? 0);
    setAndroidWithdrawalCharge(settings.androidWithdrawalCharge ?? 0);
    setRideChargeType(settings.rideChargeType ?? 'FIXED');
    setIosRideCharge(settings.iosRideCharge ?? 0);
    setAndroidRideCharge(settings.androidRideCharge ?? 0);
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

      <div className="grid gap-4 md:grid-cols-2">
        <SettingField label="iOS wallet funding charge" description="Extra amount added when iOS users fund wallet.">
          <input
            type="number"
            min={0}
            className="input w-full"
            value={iosWalletFundingCharge}
            onChange={(event) => setIosWalletFundingCharge(Number(event.target.value))}
          />
        </SettingField>

        <SettingField label="Android wallet funding charge" description="Extra amount added when Android users fund wallet.">
          <input
            type="number"
            min={0}
            className="input w-full"
            value={androidWalletFundingCharge}
            onChange={(event) => setAndroidWalletFundingCharge(Number(event.target.value))}
          />
        </SettingField>

        <SettingField label="iOS withdrawal charge" description="Extra amount debited when iOS users withdraw.">
          <input
            type="number"
            min={0}
            className="input w-full"
            value={iosWithdrawalCharge}
            onChange={(event) => setIosWithdrawalCharge(Number(event.target.value))}
          />
        </SettingField>

        <SettingField label="Android withdrawal charge" description="Extra amount debited when Android users withdraw.">
          <input
            type="number"
            min={0}
            className="input w-full"
            value={androidWithdrawalCharge}
            onChange={(event) => setAndroidWithdrawalCharge(Number(event.target.value))}
          />
        </SettingField>

        <SettingField label="Ride platform charge type" description="Apply ride booking platform charges as a fixed amount or percentage of fare.">
          <select
            className="input w-full"
            value={rideChargeType}
            onChange={(event) => setRideChargeType(event.target.value as PlatformSettings['rideChargeType'])}
          >
            <option value="FIXED">Fixed amount</option>
            <option value="PERCENTAGE">Percentage</option>
          </select>
        </SettingField>

        <SettingField label="iOS ride platform charge" description={rideChargeType === 'PERCENTAGE' ? 'Percentage added to iOS ride bookings.' : 'Fixed amount added to iOS ride bookings.'}>
          <input
            type="number"
            min={0}
            className="input w-full"
            value={iosRideCharge}
            onChange={(event) => setIosRideCharge(Number(event.target.value))}
          />
        </SettingField>

        <SettingField label="Android ride platform charge" description={rideChargeType === 'PERCENTAGE' ? 'Percentage added to Android ride bookings.' : 'Fixed amount added to Android ride bookings.'}>
          <input
            type="number"
            min={0}
            className="input w-full"
            value={androidRideCharge}
            onChange={(event) => setAndroidRideCharge(Number(event.target.value))}
          />
        </SettingField>
      </div>

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
            iosWalletFundingCharge,
            androidWalletFundingCharge,
            iosWithdrawalCharge,
            androidWithdrawalCharge,
            rideChargeType,
            iosRideCharge,
            androidRideCharge,
          })
        }
        title="Save pricing settings"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </SettingsSection>
  );
}
