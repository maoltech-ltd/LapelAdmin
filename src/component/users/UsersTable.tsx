'use client';


import { User } from "../../../lib/types/user.types";
import StatusBadge from "../utils/StatusBadge";



export default function UsersTable({
  users,
  onViewUser,
}: {
  users: User[];
  onViewUser: (user: User) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white dark:bg-gray-900 dark:border-gray-800">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800">
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
              className="border-t dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <td className="px-4 py-3 font-medium">
                {user.firstName} {user.lastName}
              </td>

              <td className="px-4 py-3">
                <div>{user.email}</div>
                <div className="text-xs text-gray-500">
                  {user.phoneNumber}
                </div>
              </td>

              <td className="px-4 py-3">
                <StatusBadge status={user.active ? 'active' : 'inactive'} />
              </td>

              <td className="px-4 py-3">
                {/* {user.rides } */}
                0
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onViewUser(user)}
                  className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
