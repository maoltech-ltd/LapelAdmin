"use client"
import { useEffect, useState } from 'react';
import UsersTable from '@/component/users/UsersTable';
import UserProfileDrawer from '@/component/users/UserProfileDrawer';
import Pagination from '@/component/utils/Pagination';
import TableFilterBar from '@/component/filters/TableFilterBar';
import { useUser } from '../../../lib/hooks/userUsers';
import { useDebouncedValue } from '../../../lib/hooks/useDebouncedValue';

const PAGE_SIZE = 10;

export default function UsersPage() {
  const {
    users,
    currentUser,
    searchUsers,
    getUserById,
    clearCurrentUser
  } = useUser();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const [status, setStatus] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);

  // 🔄 Fetch users whenever filters change
  useEffect(() => {
    searchUsers('admin', {
      query: debouncedSearch || undefined,
      page: page - 1,
      size: PAGE_SIZE,
      sortBy: 'createdAt',
      sortDirection: 'DESC',
    });
  }, [debouncedSearch, page, searchUsers]);

  const userList = users?.content ?? [];
  const totalPages = users?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Users Management</h1>
        <p className="text-sm text-gray-500">
          Manage riders, view profiles, and take actions
        </p>
      </div>

      {/* Filters */}
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
      <UsersTable
        users={userList}
        onViewUser={(u) => getUserById('web', u.id)}
      />

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
        user={currentUser}
        open={!!currentUser}
        onClose={clearCurrentUser}
      />
    </div>
  );
}
