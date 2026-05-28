'use client';

import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { PlatformSettings } from '../../../lib/api/services/settingsService';
import SettingsSection from './SettingsSection';

const templateOptions = [
  'wallet-transaction',
  'transaction-success',
  'transaction-failed',
  'ride-notification',
];

export default function TransactionNotificationSettings({
  settings,
  saving,
  onSave,
}: {
  settings: PlatformSettings;
  saving: boolean;
  onSave: (settings: PlatformSettings) => void;
}) {
  const [smsCharge, setSmsCharge] = useState(settings.transactionNotificationSmsCharge);
  const [emailCharge, setEmailCharge] = useState(settings.transactionNotificationEmailCharge);
  const [pushCharge, setPushCharge] = useState(settings.transactionNotificationPushCharge);
  const [smsTemplate, setSmsTemplate] = useState(settings.smsTransactionTemplate);
  const [emailTemplate, setEmailTemplate] = useState(settings.emailTransactionTemplate);
  const [pushTemplate, setPushTemplate] = useState(settings.pushTransactionTemplate);

  useEffect(() => {
    setSmsCharge(settings.transactionNotificationSmsCharge ?? 0);
    setEmailCharge(settings.transactionNotificationEmailCharge ?? 0);
    setPushCharge(settings.transactionNotificationPushCharge ?? 0);
    setSmsTemplate(settings.smsTransactionTemplate || 'wallet-transaction');
    setEmailTemplate(settings.emailTransactionTemplate || 'wallet-transaction');
    setPushTemplate(settings.pushTransactionTemplate || 'wallet-transaction');
  }, [settings]);

  const save = () => {
    onSave({
      ...settings,
      transactionNotificationSmsCharge: smsCharge,
      transactionNotificationEmailCharge: emailCharge,
      transactionNotificationPushCharge: pushCharge,
      smsTransactionTemplate: smsTemplate,
      emailTransactionTemplate: emailTemplate,
      pushTransactionTemplate: pushTemplate,
    });
  };

  return (
    <SettingsSection
      title="Transaction Notifications"
      description="Manage customer transaction alert charges and message templates"
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <ChannelSettings
          title="SMS"
          charge={smsCharge}
          template={smsTemplate}
          onChargeChange={setSmsCharge}
          onTemplateChange={setSmsTemplate}
        />
        <ChannelSettings
          title="Email"
          charge={emailCharge}
          template={emailTemplate}
          onChargeChange={setEmailCharge}
          onTemplateChange={setEmailTemplate}
        />
        <ChannelSettings
          title="Push"
          charge={pushCharge}
          template={pushTemplate}
          onChargeChange={setPushCharge}
          onTemplateChange={setPushTemplate}
        />
      </div>

      <button className="btn-primary w-fit gap-2" disabled={saving} onClick={save} title="Save transaction notification settings">
        <Save size={16} aria-hidden="true" />
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </SettingsSection>
  );
}

function ChannelSettings({
  title,
  charge,
  template,
  onChargeChange,
  onTemplateChange,
}: {
  title: string;
  charge: number;
  template: string;
  onChargeChange: (value: number) => void;
  onTemplateChange: (value: string) => void;
}) {
  return (
    <div className="rounded-md border border-slate-200 p-4 dark:border-slate-800">
      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</div>
      <div className="mt-3 space-y-3">
        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">
          Charge
          <input
            type="number"
            min={0}
            className="input mt-1 w-full"
            value={charge}
            onChange={(event) => onChargeChange(Number(event.target.value))}
          />
        </label>
        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">
          Template
          <select
            className="input mt-1 w-full"
            value={template}
            onChange={(event) => onTemplateChange(event.target.value)}
          >
            {templateOptions.map((option) => (
              <option key={`${title}-${option}`} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
