import CommissionSettings from '@/component/settings/CommissionSettings';
import FeatureToggleSettings from '@/component/settings/FeatureToggleSettings';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Platform Settings</h1>
        <p className="text-sm text-gray-500">
          Configure pricing, features and system rules
        </p>
      </header>

      <CommissionSettings />
      <FeatureToggleSettings />
    </div>
  );
}
