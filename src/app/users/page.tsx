// 'use client';

// import { useState } from 'react';
// import { User, users } from '../../../user.mock';
// import UsersTable from '@/component/users/UsersTable';
// import UserProfileDrawer from '@/component/users/UserProfileDrawer';


// export default function UsersPage() {
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);

//   return (
//     <div className="space-y-6">
//       {/* Page Header */}
//       <div>
//         <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
//           Users Management
//         </h1>
//         <p className="text-sm text-gray-500 dark:text-gray-400">
//           Manage riders, view profiles, and take actions
//         </p>
//       </div>

//       {/* Users Table */}
//       <UsersTable users={users} onViewUser={setSelectedUser} />

//       {/* Profile Drawer */}
//       <UserProfileDrawer
//         user={selectedUser}
//         open={!!selectedUser}
//         onClose={() => setSelectedUser(null)}
//       />
//     </div>
//   );
// }
'use client';

import { useMemo, useState } from 'react';
import { User, users } from '../../../data/user.mock';
import UsersTable from '@/component/users/UsersTable';
import UserProfileDrawer from '@/component/users/UserProfileDrawer';
import UsersFilterBar from '@/component/users/UserFilterBadge';
import Pagination from '@/component/utils/Pagination';
import TableFilterBar from '@/component/filters/TableFilterBar';

const PAGE_SIZE = 5;

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);

  // 🔍 Filtering logic
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.phone.includes(search);

      const matchesStatus =
        status === 'all' || u.status === status;

      const joined = new Date(u.joinedAt).getTime();
      const afterFrom = from ? joined >= new Date(from).getTime() : true;
      const beforeTo = to ? joined <= new Date(to).getTime() : true;

      return matchesSearch && matchesStatus && afterFrom && beforeTo;
    });
  }, [search, status, from, to]);

  // 📄 Pagination
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Users Management
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage riders, view profiles, and take actions
        </p>
      </div>

      {/* Filters */}
      {/* <UsersFilterBar
        search={search}
        status={status}
        from={from}
        to={to}
        onSearch={setSearch}
        onStatusChange={setStatus}
        onFromChange={setFrom}
        onToChange={setTo}
      /> */}

      <TableFilterBar
        search={search}
        status={status}
        from={from}
        to={to}
        onSearch={setSearch}
        onStatusChange={setStatus}
        onFromChange={setFrom}
        onToChange={setTo}
        statusOptions={[
          { label: 'All', value: 'all' },
          { label: 'Active', value: 'active' },
          { label: 'Suspended', value: 'suspended' },
        ]}
      />


      {/* Table */}
      <UsersTable users={paginatedUsers} onViewUser={setSelectedUser} />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Drawer */}
      <UserProfileDrawer
        user={selectedUser}
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}
