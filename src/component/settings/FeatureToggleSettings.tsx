'use client';

import ToggleSwitch from '../utils/ToggleSwitch';
import SettingsSection from './SettingsSection';

export default function FeatureToggleSettings() {
  return (
    <SettingsSection
      title="Platform Features"
      description="Enable or disable core features"
    >
      <ToggleSwitch label="Enable ride matching" />
      <ToggleSwitch label="Enable scheduled rides" />
      <ToggleSwitch label="Enable driver auto-approval" />
      <ToggleSwitch label="Enable notifications" />
    </SettingsSection>
  );
}
