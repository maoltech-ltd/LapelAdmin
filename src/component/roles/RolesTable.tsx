'use client';

import { Role } from "../../../data/roles.mock";



export default function RolesTable({
  roles,
  onEdit,
}: {
  roles: Role[];
  onEdit: (role: Role) => void;
}) {
  return (
    <div className="rounded-xl border bg-white dark:border-gray-800 dark:bg-gray-900">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-left">Permissions</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>

        <tbody>
          {roles.map((role) => (
            <tr key={role.id} className="border-t dark:border-gray-800">
              <td className="px-4 py-3 font-medium">{role.name}</td>
              <td className="px-4 py-3 text-gray-500">
                {role.permissions.length} permissions
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onEdit(role)}
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
