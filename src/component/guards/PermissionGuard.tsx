'use client';

import { useAuth } from "../../../lib/hooks/useAuth";
import { hasAnyPermission } from "../../../lib/utils/permiisions";



interface Props {
  permissions: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function PermissionGuard({
  permissions,
  children,
  fallback = null,
}: Props) {
  const { role } = useAuth();

  if (!hasAnyPermission(role, permissions)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
