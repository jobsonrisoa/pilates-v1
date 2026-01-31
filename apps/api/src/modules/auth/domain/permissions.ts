/**
 * RBAC permissions: resource:action
 * Used by @RequirePermissions() and PermissionsGuard
 */
export const PERMISSIONS = {
  // Students
  STUDENTS_CREATE: 'students:create',
  STUDENTS_READ: 'students:read',
  STUDENTS_UPDATE: 'students:update',
  STUDENTS_DELETE: 'students:delete',

  // Users
  USERS_CREATE: 'users:create',
  USERS_READ: 'users:read',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',

  // Classes
  CLASSES_CREATE: 'classes:create',
  CLASSES_READ: 'classes:read',
  CLASSES_UPDATE: 'classes:update',
  CLASSES_DELETE: 'classes:delete',

  // Payments
  PAYMENTS_CREATE: 'payments:create',
  PAYMENTS_READ: 'payments:read',
  PAYMENTS_UPDATE: 'payments:update',
  PAYMENTS_DELETE: 'payments:delete',

  // Reports
  REPORTS_READ: 'reports:read',

  // Settings
  SETTINGS_READ: 'settings:read',
  SETTINGS_UPDATE: 'settings:update',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export function formatPermission(resource: string, action: string): string {
  return `${resource}:${action}`;
}
