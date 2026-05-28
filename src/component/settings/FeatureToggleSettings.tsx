'use client';

import ToggleSwitch from '../utils/ToggleSwitch';
import SettingField from './SettingField';
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
      <SettingField label="Ride matching" description="Allow customers to be matched with available ride offers.">
        <ToggleSwitch
          label="Enable ride matching"
          checked={settings.rideMatchingEnabled}
          onChange={(value) => update('rideMatchingEnabled', value)}
          disabled={saving}
          hideLabel
        />
      </SettingField>
      <SettingField label="Scheduled rides" description="Allow rides to be planned for a later time.">
        <ToggleSwitch
          label="Enable scheduled rides"
          checked={settings.scheduledRidesEnabled}
          onChange={(value) => update('scheduledRidesEnabled', value)}
          disabled={saving}
          hideLabel
        />
      </SettingField>
      <SettingField label="Driver auto-approval" description="Automatically approve qualified driver applications.">
        <ToggleSwitch
          label="Enable driver auto-approval"
          checked={settings.driverAutoApprovalEnabled}
          onChange={(value) => update('driverAutoApprovalEnabled', value)}
          disabled={saving}
          hideLabel
        />
      </SettingField>
      <SettingField label="Notifications" description="Master switch for platform notification delivery.">
        <ToggleSwitch
          label="Enable notifications"
          checked={settings.notificationsEnabled}
          onChange={(value) => update('notificationsEnabled', value)}
          disabled={saving}
          hideLabel
        />
      </SettingField>
      <SettingField label="First ride free" description="Enable first ride free promotions for eligible users.">
        <ToggleSwitch
          label="Enable first ride free"
          checked={settings.firstRideFreeEnabled}
          onChange={(value) => update('firstRideFreeEnabled', value)}
          disabled={saving}
          hideLabel
        />
      </SettingField>
      <SettingField label="Referral rewards" description="Allow referral rewards to be issued.">
        <ToggleSwitch
          label="Enable referral rewards"
          checked={settings.referralEnabled}
          onChange={(value) => update('referralEnabled', value)}
          disabled={saving}
          hideLabel
        />
      </SettingField>
    </SettingsSection>
  );
}
