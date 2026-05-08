'use client';

import { useEffect, useState } from 'react';
import PermissionMatrix from './PermissionMatrix';
import Modal from '../utils/Modal';
import { Role } from '../../../lib/store/slices/roleSlice';

const selectedPermissions = (role: Role | null) =>
  role?.permissions || [];

export default function RoleEditorModal({
  role,
  permissions,
  open,
  onClose,
  onSave,
}: {
  role: Role | null;
  permissions: string[];
  open: boolean;
  onClose: () => void;
  onSave: (roleId: string, permissions: string[]) => void;
}) {
  const [perms, setPerms] = useState<string[]>([]);

  useEffect(() => {
    setPerms(selectedPermissions(role));
  }, [role]);

  if (!role) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Edit ${role.name}`}>
      <PermissionMatrix permissions={permissions} selected={perms} onChange={setPerms} />

      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="btn-secondary" title="Close without saving">
          Cancel
        </button>
        <button className="btn-primary" onClick={() => onSave(role.id, perms)} title="Save role permissions">
          Save Changes
        </button>
      </div>
    </Modal>
  );
}
