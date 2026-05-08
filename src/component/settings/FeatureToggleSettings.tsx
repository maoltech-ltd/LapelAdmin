'use client';

import ToggleSwitch from '../utils/ToggleSwitch';
import SettingsSection from './SettingsSection';
import { PlatformSettings } from '../../../lib/api/services/settingsService';

export default function FeatureToggleSettings({
  settings,
  saving,
  onSave,
}: {
  settings: PlatformSettings;
  saving: boolean;
  onSave: (settings: PlatformSettings) => void;
}) {
  const update = (key: keyof PlatformSettings, value: boolean) => {
    onSave({ ...settings, [key]: value });
  };

  return (
    <SettingsSection title="Platform Features" description="Enable or disable core features">
      <ToggleSwitch
        label="Enable ride matching"
        checked={settings.rideMatchingEnabled}
        onChange={(value) => update('rideMatchingEnabled', value)}
        disabled={saving}
      />
      <ToggleSwitch
        label="Enable scheduled rides"
        checked={settings.scheduledRidesEnabled}
        onChange={(value) => update('scheduledRidesEnabled', value)}
        disabled={saving}
      />
      <ToggleSwitch
        label="Enable driver auto-approval"
        checked={settings.driverAutoApprovalEnabled}
        onChange={(value) => update('driverAutoApprovalEnabled', value)}
        disabled={saving}
      />
      <ToggleSwitch
        label="Enable notifications"
        checked={settings.notificationsEnabled}
        onChange={(value) => update('notificationsEnabled', value)}
        disabled={saving}
      />
      <ToggleSwitch
        label="Enable first ride free"
        checked={settings.firstRideFreeEnabled}
        onChange={(value) => update('firstRideFreeEnabled', value)}
        disabled={saving}
      />
      <ToggleSwitch
        label="Enable referral rewards"
        checked={settings.referralEnabled}
        onChange={(value) => update('referralEnabled', value)}
        disabled={saving}
      />
    </SettingsSection>
  );
}
