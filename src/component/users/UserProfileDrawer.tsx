'use client';

import { useEffect, useState } from 'react';
import EntityStatsSection from '@/component/stats/EntityStatsSection';
import { DetailSection, StatSummaryGrid } from '@/component/utils/DetailBlocks';
import DetailDrawer from '@/component/utils/DetailDrawer';
import StatusBadge from '@/component/utils/StatusBadge';
import { userService } from '../../../lib/api/services/userService';
import { User, UserReport } from '../../../lib/types/user.types';
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
  const [workingUser, setWorkingUser] = useState<User | null>(user);
  const [reports, setReports] = useState<UserReport[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setWorkingUser(user);
    if (!user?.id) return;
    userService
      .getUserReports('web', user.id)
      .then((response) => setReports(response.data ?? []))
      .catch(() => setReports([]));
  }, [user]);

  if (!open || !user) return null;

  const displayUser = workingUser ?? user;
  const fullName = [displayUser.firstName, displayUser.lastName].filter(Boolean).join(' ') || displayUser.username || 'User';

  const setActive = async (active: boolean) => {
    setBusy(true);
    try {
      const response = active
        ? await userService.activateUser('web', displayUser.id)
        : await userService.deactivateUser('web', displayUser.id, 'Manual admin safety action');
      setWorkingUser(response.data);
    } finally {
      setBusy(false);
    }
  };

  return (
    <DetailDrawer
      open={open}
      onClose={onClose}
      widthClassName="max-w-5xl"
      title={fullName}
      subtitle={displayUser.email || displayUser.phoneNumber || displayUser.id}
      badge={<StatusBadge status={displayUser.active ? 'active' : 'inactive'} />}
      footer={
        <div className="flex flex-wrap gap-2">
          {displayUser.active ? (
            <button disabled={busy} onClick={() => setActive(false)} className="btn-secondary">
              Deactivate
            </button>
          ) : (
            <button disabled={busy} onClick={() => setActive(true)} className="btn-secondary">
              Activate
            </button>
          )}
        </div>
      }
    >
      <div className="space-y-5">
        <StatSummaryGrid
          stats={[
            { label: 'Account', value: displayUser.active ? 'Active' : 'Inactive', hint: displayUser.blockReason || 'Current user status' },
            { label: 'Reports', value: String(displayUser.reportCount ?? reports.length), hint: 'Safety reports received' },
            { label: 'Points', value: String(displayUser.reportPoints ?? 100), hint: 'Drops after non-instant reports' },
            {
              label: 'Joined',
              value: displayUser.createdAt ? new Date(displayUser.createdAt).toLocaleDateString() : 'N/A',
              hint: 'Registration date',
            },
            { label: 'Phone', value: displayUser.phoneNumber || 'N/A', hint: 'Primary contact' },
            { label: 'User ID', value: displayUser.id, hint: 'Platform identifier' },
          ]}
        />

        <DetailSection title="Profile">
          <UserDetailsTabs user={displayUser} />
        </DetailSection>

        <DetailSection title="Report review">
          <div className="space-y-3">
            {reports.length === 0 ? (
              <p className="text-sm text-slate-500">No reports found for this user.</p>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="rounded-md border border-slate-200 p-3 text-sm dark:border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">{report.reasonLabel || report.reason}</span>
                    <StatusBadge status={report.blockedUser ? 'blocked' : report.instantBlock ? 'pending' : 'active'} />
                  </div>
                  <p className="mt-1 text-slate-600 dark:text-slate-300">{report.details || 'No extra details supplied.'}</p>
                  <div className="mt-2 text-xs text-slate-500">
                    {report.createdAt ? new Date(report.createdAt).toLocaleString() : 'No date'} | Reporter: {report.reporterUserId || 'N/A'}
                  </div>
                </div>
              ))
            )}
          </div>
        </DetailSection>

        <EntityStatsSection
          entityType="USER"
          entityId={displayUser.id}
          title="User stats and transaction usage"
          exportFilename="user-stats.csv"
        />
      </div>
    </DetailDrawer>
  );
}
