# US-002-004: Controle of Acesso por Profile

## Information

| Field            | Value                        |
| ---------------- | ---------------------------- |
| **ID**           | US-002-004                   |
| **Epic**         | EPIC-002                     |
| **Title**        | Controle of Acesso por Profile |
| **Estimate**     | 6 hours                      |
| **Priority**     | 🔴 Critical                  |
| **Dependencies** | US-002-001                   |
| **Status**       | Backlog                      |

---

## User Story

**Como** administrador  
**I want to** que cada usuário tenha permissões específicas  
**Para** controlar o que cada um pode acessar

---

## Objectives

1. Implementar sistema RBAC (Role-Based Access Control)
2. Criar 6 perfis pre-definidos
3. Definir permissões por recurso e ação
4. Implementar guards de permissão no backend
5. Adaptar UI baseado em permissões
6. Seed de perfis e permissões

---

## Acceptance Criteria

- [ ] 6 perfis pre-definidos
- [ ] Permissões por resource e action
- [ ] Verificação no backend
- [ ] UI adapta-se às permissões
- [ ] Super Admin tem acesso total
- [ ] Guards funcionando corretamente

---

## Prompt for Implementation

```markdown
## Context

Backend NestJS com DDD. Preciso implementar RBAC completo
com perfis e permissões granulares.

## Tarefa

### 1. Schema Prisma

Adicionar:
- Permission model
- RolePermission (many-to-many)
- Seed de 6 perfis
- Seed de permissões

### 2. Permissions System

Definir permissões:
- students:create, read, update, delete
- users:create, read, update, delete
- classes:create, read, update, delete
- payments:create, read, update, delete
- reports:read
- settings:read, update

### 3. Guards

- PermissionsGuard
- @RequirePermissions decorator
- Verificação de permissões do usuário

### 4. Frontend

- usePermissions hook
- CanAccess component
- Ocultar elementos sem permissão

## Dependencies

- @nestjs/passport
- Guards customizados
```

---

## Implementation Details

### Prisma Schema

```prisma
// apps/api/prisma/schema.prisma
model Permission {
  id          String           @id @default(uuid())
  resource    String           // e.g., 'students', 'users'
  action      String           // e.g., 'create', 'read', 'update', 'delete'
  description String?
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
  roles       RolePermission[]

  @@unique([resource, action])
  @@index([resource])
}

model RolePermission {
  id           String     @id @default(uuid())
  roleId       String
  permissionId String
  createdAt    DateTime   @default(now())
  role         Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission   Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@unique([roleId, permissionId])
  @@index([roleId])
  @@index([permissionId])
}
```

### Permissions Constants

```typescript
// src/modules/auth/domain/permissions.ts
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

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
```

### Permissions Guard

```typescript
// src/modules/auth/infrastructure/guards/permissions.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '@/modules/auth/infrastructure/decorators/require-permissions.decorator';
import { AuthService } from '@/modules/auth/application/services/auth.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true; // No permissions required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Super Admin has all permissions
    if (user.roles.includes('SUPER_ADMIN')) {
      return true;
    }

    // Get user permissions
    const userPermissions = await this.authService.getUserPermissions(user.id);

    // Check if user has all required permissions
    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
```

### Require Permissions Decorator

```typescript
// src/modules/auth/infrastructure/decorators/require-permissions.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
```

### Usage in Controller

```typescript
// src/modules/users/infrastructure/controllers/users.controller.ts
import { Controller, Get, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/modules/auth/infrastructure/guards/permissions.guard';
import { RequirePermissions } from '@/modules/auth/infrastructure/decorators/require-permissions.decorator';
import { PERMISSIONS } from '@/modules/auth/domain/permissions';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  @Get()
  @RequirePermissions(PERMISSIONS.USERS_READ)
  findAll() {
    // ...
  }

  @Post()
  @RequirePermissions(PERMISSIONS.USERS_CREATE)
  create() {
    // ...
  }

  @Put(':id')
  @RequirePermissions(PERMISSIONS.USERS_UPDATE)
  update() {
    // ...
  }

  @Delete(':id')
  @RequirePermissions(PERMISSIONS.USERS_DELETE)
  delete() {
    // ...
  }
}
```

### Seed Permissions and Roles

```typescript
// apps/api/prisma/seed.ts
async function seedPermissions() {
  const permissions = [
    { resource: 'students', action: 'create' },
    { resource: 'students', action: 'read' },
    { resource: 'students', action: 'update' },
    { resource: 'students', action: 'delete' },
    { resource: 'users', action: 'create' },
    { resource: 'users', action: 'read' },
    { resource: 'users', action: 'update' },
    { resource: 'users', action: 'delete' },
    { resource: 'classes', action: 'create' },
    { resource: 'classes', action: 'read' },
    { resource: 'classes', action: 'update' },
    { resource: 'classes', action: 'delete' },
    { resource: 'payments', action: 'create' },
    { resource: 'payments', action: 'read' },
    { resource: 'payments', action: 'update' },
    { resource: 'payments', action: 'delete' },
    { resource: 'reports', action: 'read' },
    { resource: 'settings', action: 'read' },
    { resource: 'settings', action: 'update' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: {
        resource_action: {
          resource: perm.resource,
          action: perm.action,
        },
      },
      update: {},
      create: perm,
    });
  }
}

async function assignPermissionsToRoles() {
  const superAdmin = await prisma.role.findUnique({ where: { name: 'SUPER_ADMIN' } });
  const admin = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  const manager = await prisma.role.findUnique({ where: { name: 'MANAGER' } });
  const receptionist = await prisma.role.findUnique({ where: { name: 'RECEPTIONIST' } });
  const teacher = await prisma.role.findUnique({ where: { name: 'TEACHER' } });
  const financial = await prisma.role.findUnique({ where: { name: 'FINANCIAL' } });

  const allPermissions = await prisma.permission.findMany();

  // Super Admin: All permissions
  for (const perm of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdmin!.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: superAdmin!.id,
        permissionId: perm.id,
      },
    });
  }

  // Admin: Most permissions except user management
  const adminPermissions = allPermissions.filter(
    (p) => !p.resource.startsWith('users'),
  );
  for (const perm of adminPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: admin!.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: admin!.id,
        permissionId: perm.id,
      },
    });
  }

  // Manager: Read and update (no delete)
  const managerPermissions = allPermissions.filter(
    (p) => p.action === 'read' || p.action === 'update',
  );
  // ... similar for other roles
}
```

### Frontend Hook

```typescript
// apps/web/hooks/use-permissions.ts
import { useContext } from 'react';
import { AuthContext } from '@/contexts/auth-context';

export function usePermissions() {
  const { user } = useContext(AuthContext);

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.roles.includes('SUPER_ADMIN')) return true;
    return user.permissions?.includes(permission) ?? false;
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some((perm) => hasPermission(perm));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every((perm) => hasPermission(perm));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
```

### Frontend Component

```typescript
// apps/web/components/can-access.tsx
'use client';

import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/use-permissions';

interface CanAccessProps {
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
  } else if (permissions) {
    hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
```

### Usage in Frontend

```typescript
// apps/web/app/(dashboard)/users/page.tsx
import { CanAccess } from '@/components/can-access';
import { PERMISSIONS } from '@/lib/permissions';

export default function UsersPage() {
  return (
    <div>
      <CanAccess permission={PERMISSIONS.USERS_CREATE}>
        <Button>Create User</Button>
      </CanAccess>

      <CanAccess permissions={[PERMISSIONS.USERS_READ, PERMISSIONS.USERS_UPDATE]}>
        <UserTable />
      </CanAccess>
    </div>
  );
}
```

---

## Checklist of Verification

- [ ] Schema Prisma com Permission e RolePermission
- [ ] 6 perfis criados no seed
- [ ] Permissões definidas e seedadas
- [ ] PermissionsGuard implementado
- [ ] @RequirePermissions decorator funcionando
- [ ] Super Admin tem acesso total
- [ ] Frontend usePermissions hook
- [ ] Frontend CanAccess component
- [ ] UI adapta-se às permissões
- [ ] Testes unitários (≥80%)
- [ ] Testes de integração
- [ ] Documentação Swagger

---

## Next User Story

→ [US-002-005: Management of Users](./US-002-005-management-users.md)

