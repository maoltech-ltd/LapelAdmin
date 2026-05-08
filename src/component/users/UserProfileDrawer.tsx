'use client';

import EntityStatsSection from '@/component/stats/EntityStatsSection';
import { DetailSection, StatSummaryGrid } from '@/component/utils/DetailBlocks';
import DetailDrawer from '@/component/utils/DetailDrawer';
import StatusBadge from '@/component/utils/StatusBadge';
import { User } from '../../../lib/types/user.types';
import UserDetailsTabs from './UserDetailsTabs';

export default function UserProfileDrawer({
  user,
  open,
  onClose,
}: {
  user: User | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!open || !user) return null;

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || 'User';

  return (
    <DetailDrawer
      open={open}
      onClose={onClose}
      widthClassName="max-w-5xl"
      title={fullName}
      subtitle={user.email || user.phoneNumber || user.id}
      badge={<StatusBadge status={user.active ? 'active' : 'inactive'} />}
      footer={
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary">Suspend</button>
          <button className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700">
            Flag
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <StatSummaryGrid
          stats={[
            { label: 'Account', value: user.active ? 'Active' : 'Inactive', hint: 'Current user status' },
            {
              label: 'Joined',
              value: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
              hint: 'Registration date',
            },
            { label: 'Phone', value: user.phoneNumber || 'N/A', hint: 'Primary contact' },
            { label: 'User ID', value: user.id, hint: 'Platform identifier' },
          ]}
        />

        <DetailSection title="Profile">
          <UserDetailsTabs user={user} />
        </DetailSection>

        <EntityStatsSection
          entityType="USER"
          entityId={user.id}
          title="User stats and transaction usage"
          exportFilename="user-stats.csv"
        />
      </div>
    </DetailDrawer>
  );
}
