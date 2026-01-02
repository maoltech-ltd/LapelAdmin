'use client';

import { User } from '../../../data/user.mock';
import Drawer from '../utils/Drawer';
import StatusBadge from '../utils/StatusBadge';
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
  if (!user) return null;

  return (
    <Drawer open={open} onClose={onClose}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b px-6 py-4 dark:border-gray-800">
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <div className="mt-1 flex items-center gap-2">
            <StatusBadge status={user.status} />
            <span className="text-xs text-gray-500">
              Joined {user.joinedAt}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <UserDetailsTabs user={user} />
        </div>

        {/* Actions */}
        <div className="border-t px-6 py-4 dark:border-gray-800">
          <div className="flex gap-2">
            <button className="flex-1 rounded-md bg-yellow-500 px-3 py-2 text-sm text-white">
              Suspend
            </button>
            <button className="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm text-white">
              Flag
            </button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
