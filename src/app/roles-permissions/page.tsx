'use client';

import { useState } from 'react';
import RolesTable from '@/component/roles/RolesTable';
import RoleEditorModal from '@/component/roles/RoleEditorModal';
import { Role, roles } from '../../../data/roles.mock';


export default function RolesPermissionsPage() {
  const [selected, setSelected] = useState<Role | null>(null);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Roles & Permissions</h1>
        <p className="text-sm text-gray-500">
          Control admin access and capabilities
        </p>
      </header>

      <RolesTable roles={roles} onEdit={setSelected} />

      <RoleEditorModal
        role={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
