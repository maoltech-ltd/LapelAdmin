'use client';

import { User } from '../../../lib/types/user.types';
import { EmptyTableRow, TableShell, ViewButton } from '../utils/DataTable';
import StatusBadge from '../utils/StatusBadge';

export default function UsersTable({
  users,
  onViewUser,
}: {
  users: User[];
  onViewUser: (user: User) => void;
}) {
  return (
    <TableShell>
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Contact</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Rides</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-t border-slate-200 transition hover:bg-blue-50/60 dark:border-slate-800 dark:hover:bg-slate-800/70"
            >
              <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                {[user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || 'User'}
              </td>
              <td className="px-4 py-3">
                <div>{user.email || 'N/A'}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{user.phoneNumber || 'No phone'}</div>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={user.active ? 'active' : 'inactive'} />
              </td>
              <td className="px-4 py-3">0</td>
              <td className="px-4 py-3 text-right">
                <ViewButton onClick={() => onViewUser(user)} />
              </td>
            </tr>
          ))}
          {users.length === 0 && <EmptyTableRow colSpan={5} message="No users found." />}
        </tbody>
      </table>
    </TableShell>
  );
}
