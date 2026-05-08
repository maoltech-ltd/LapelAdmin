'use client';

import { Role } from '../../../lib/store/slices/roleSlice';

const permissionCount = (permissions: Role['permissions']) => permissions?.length || 0;

export default function RolesTable({
  roles,
  onEdit,
}: {
  roles: Role[];
  onEdit: (role: Role) => void;
}) {
  return (
    <div className="surface overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <tr>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-left">Description</th>
            <th className="px-4 py-3 text-left">Permissions</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>

        <tbody>
          {roles.map((role) => (
            <tr key={role.id} className="border-t border-slate-200 transition hover:bg-blue-50/60 dark:border-slate-800 dark:hover:bg-slate-800/70">
              <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{role.name}</td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{role.description || 'No description'}</td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {permissionCount(role.permissions)} permissions
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onEdit(role)}
                  className="action-link text-blue-600 dark:text-blue-300"
                  title={`Edit ${role.name} permissions`}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
          {roles.length === 0 && (
            <tr>
              <td className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400" colSpan={4}>
                No roles found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
