'use client';

import { useState } from 'react';
import BroadcastComposer from '@/component/notifications/BroadcastComposer';
import BroadcastHistory from '@/component/notifications/BroadcastHistory';
import PermissionGuard from '@/component/guards/PermissionGuard';

export default function NotificationsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Notifications</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Message customers and drivers in the SharedDrive app, by push, email or SMS.
        </p>
      </header>

      <PermissionGuard permissions={['NOTIFICATION_SEND']}>
        <BroadcastComposer onCreated={() => setRefreshKey((key) => key + 1)} />
      </PermissionGuard>
      <BroadcastHistory refreshKey={refreshKey} />
    </div>
  );
}
