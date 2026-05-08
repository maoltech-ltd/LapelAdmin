'use client';

import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import RolesTable from '@/component/roles/RolesTable';
import RoleEditorModal from '@/component/roles/RoleEditorModal';
import { useAppDispatch, useAppSelector } from '../../../lib/store/hooks';
import { fetchPermissions, fetchRoles, Role, updateRolePermissions } from '../../../lib/store/slices/roleSlice';

export default function RolesPermissionsPage() {
  const dispatch = useAppDispatch();
  const { roles, permissions, loading, error } = useAppSelector((state) => state.roles);
  const [selected, setSelected] = useState<Role | null>(null);

  useEffect(() => {
    dispatch(fetchRoles(undefined));
    dispatch(fetchPermissions());
  }, [dispatch]);

  const savePermissions = async (roleId: string, values: string[]) => {
    await dispatch(updateRolePermissions({ roleId, permissions: values }));
    await dispatch(fetchRoles(undefined));
    setSelected(null);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Roles & Permissions</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Control admin access and capabilities
        </p>
      </header>

      {loading && <Loader className="h-5 w-5 animate-spin text-blue-600" />}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      <RolesTable roles={roles} onEdit={setSelected} />

      <RoleEditorModal
        role={selected}
        permissions={permissions.map((permission) => String(permission))}
        open={!!selected}
        onClose={() => setSelected(null)}
        onSave={savePermissions}
      />
    </div>
  );
}
