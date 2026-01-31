'use client';

import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/use-permissions';

export interface CanAccessProps {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

export function CanAccess({
  permission,
  permissions,
  requireAll = false,
  children,
  fallback = null,
}: CanAccessProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions?.length) {
    hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
