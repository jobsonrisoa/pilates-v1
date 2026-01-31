'use client';

import { CanAccess } from '@/components/can-access';
import { PERMISSIONS } from '@/lib/permissions';

export function DashboardContent() {
  return (
    <>
      <p>Dashboard placeholder.</p>
      <CanAccess permission={PERMISSIONS.REPORTS_READ}>
        <p className="mt-2 text-sm text-gray-600">
          Você tem permissão para ver relatórios.
        </p>
      </CanAccess>
      <CanAccess permission={PERMISSIONS.USERS_READ}>
        <p className="mt-2 text-sm text-gray-600">
          Você tem permissão para gerenciar usuários.
        </p>
      </CanAccess>
    </>
  );
}
