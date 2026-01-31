'use client';

import { useAuthStore } from '@/stores/auth.store';

export function usePermissions() {
  const user = useAuthStore((s) => s.user);

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.roles?.includes('SUPER_ADMIN')) return true;
    return user.permissions?.includes(permission) ?? false;
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some((p) => hasPermission(p));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every((p) => hasPermission(p));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
