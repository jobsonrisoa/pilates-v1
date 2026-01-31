/**
 * RBAC permissions: resource:action
 * Must match backend PERMISSIONS in apps/api
 */
export const PERMISSIONS = {
  STUDENTS_CREATE: 'students:create',
  STUDENTS_READ: 'students:read',
  STUDENTS_UPDATE: 'students:update',
  STUDENTS_DELETE: 'students:delete',

  USERS_CREATE: 'users:create',
  USERS_READ: 'users:read',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',

  CLASSES_CREATE: 'classes:create',
  CLASSES_READ: 'classes:read',
  CLASSES_UPDATE: 'classes:update',
  CLASSES_DELETE: 'classes:delete',

  PAYMENTS_CREATE: 'payments:create',
  PAYMENTS_READ: 'payments:read',
  PAYMENTS_UPDATE: 'payments:update',
  PAYMENTS_DELETE: 'payments:delete',

  REPORTS_READ: 'reports:read',

  SETTINGS_READ: 'settings:read',
  SETTINGS_UPDATE: 'settings:update',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
