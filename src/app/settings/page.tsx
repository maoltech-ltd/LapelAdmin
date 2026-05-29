'use client';

import { useEffect, useState } from 'react';
import CommissionSettings from '@/component/settings/CommissionSettings';
import CouponSettings from '@/component/settings/CouponSettings';
import FeatureToggleSettings from '@/component/settings/FeatureToggleSettings';
import TransactionNotificationSettings from '@/component/settings/TransactionNotificationSettings';
import { PlatformSettings, settingsService } from '../../../lib/api/services/settingsService';

const DEVICE = 'web';
const fallbackSettings: PlatformSettings = {
  commissionPercentage: 0,
  maxSeatsPerRide: 0,
  rideMatchingEnabled: false,
  scheduledRidesEnabled: false,
  driverAutoApprovalEnabled: false,
  notificationsEnabled: false,
  transactionNotificationEmailCharge: 0,
  transactionNotificationSmsCharge: 0,
  transactionNotificationPushCharge: 0,
  smsTransactionTemplate: 'wallet-transaction',
  emailTransactionTemplate: 'wallet-transaction',
  pushTransactionTemplate: 'wallet-transaction',
  referralEnabled: false,
  referralRewardType: 'WALLET',
  referralRewardAmount: 0,
  referralFreeRideCount: 1,
  firstRideFreeEnabled: false,
  iosWalletFundingCharge: 0,
  androidWalletFundingCharge: 0,
  iosWithdrawalCharge: 0,
  androidWithdrawalCharge: 0,
  rideChargeType: 'FIXED',
  iosRideCharge: 0,
  androidRideCharge: 0,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>(fallbackSettings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    settingsService
      .getSettings(DEVICE)
      .then((response) => setSettings(response.data))
      .catch(() => setMessage('Settings endpoint is unavailable.'));
  }, []);

  const save = async (nextSettings: PlatformSettings) => {
    setSaving(true);
    setMessage('');
    try {
      const response = await settingsService.updateSettings(DEVICE, nextSettings);
      setSettings(response.data);
      setMessage('Settings saved.');
    } catch {
      setMessage('Settings could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Platform Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Configure pricing, features and system rules
        </p>
      </header>

      {message && (
        <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
          {message}
        </div>
      )}

      <CommissionSettings settings={settings} saving={saving} onSave={save} />
      <FeatureToggleSettings settings={settings} saving={saving} onSave={save} />
      <TransactionNotificationSettings settings={settings} saving={saving} onSave={save} />
      <CouponSettings device={DEVICE} />
    </div>
  );
}
