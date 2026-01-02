'use client';

import { useState } from 'react';
import PermissionMatrix from './PermissionMatrix';
import { permissions, Role } from '../../../data/roles.mock';
import Modal from '../utils/Modal';


export default function RoleEditorModal({
  role,
  open,
  onClose,
}: {
  role: Role | null;
  open: boolean;
  onClose: () => void;
}) {
  const [perms, setPerms] = useState(role?.permissions || []);

  if (!role) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Edit ${role.name}`}>
      <PermissionMatrix
        permissions={permissions}
        selected={perms}
        onChange={setPerms}
      />

      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button className="btn-primary">
          Save Changes
        </button>
      </div>
    </Modal>
  );
}
