# US-002-005: Management of Users

## Information

| Field            | Value                |
| ---------------- | -------------------- |
| **ID**           | US-002-005           |
| **Epic**         | EPIC-002             |
| **Title**        | Management of Users  |
| **Estimate**     | 4 hours              |
| **Priority**     | 🟡 Medium            |
| **Dependencies** | US-002-004           |
| **Status**       | Backlog              |

---

## User Story

**Como** administrador  
**I want to** criar, editar e desativar usuários  
**Para** gerenciar quem acessa o sistema

---

## Objectives

1. Implementar CRUD completo de usuários
2. Atribuição de perfis
3. Ativação/desativação de usuários
4. Listagem com filtros e paginação
5. Validação de permissões
6. Proteção contra auto-desativação

---

## Acceptance Criteria

- [ ] CRUD de usuários
- [ ] Atribuição de perfil
- [ ] Ativação/desativação
- [ ] Listagem com filtros
- [ ] Paginação implementada
- [ ] Apenas admins podem gerenciar
- [ ] Não pode desativar próprio usuário
- [ ] Validação de permissões

---

## Prompt for Implementation

```markdown
## Context

Backend NestJS com DDD. Preciso implementar CRUD completo
de usuários com controle de permissões.

## Tarefa

### 1. Users Module (DDD)

Estrutura:
- Domain: User entity, repositories
- Application: Use cases (Create, Update, Delete, List)
- Infrastructure: Controllers, DTOs, Prisma repository

### 2. Endpoints

- GET /users (listagem paginada, filtros)
- GET /users/:id
- POST /users
- PUT /users/:id
- DELETE /users/:id (soft delete)

### 3. Validações

- Email único
- Permissões verificadas
- Não pode desativar a si mesmo
- Validação de senha forte

### 4. Frontend

- Listagem com DataTable
- Filtros e busca
- Modal de create/editar
- Ativação/desativação

## Dependencies

- class-validator
- Pagination DTO
- Permissions guard
```

---

## Implementation Details

### Users Module Structure

```typescript
// src/modules/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersController } from './infrastructure/controllers/users.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';
import { UserRepository } from './domain/repositories/user.repository';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    ListUsersUseCase,
    GetUserUseCase,
  ],
  exports: [UserRepository],
})
export class UsersModule {}
```

### Create User Use Case

```typescript
// src/modules/users/application/use-cases/create-user.use-case.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { Either, left, right } from '@/shared/domain/either';
import { UserRepository } from '@/modules/users/domain/repositories/user.repository';
import { PasswordService } from '@/modules/auth/infrastructure/services/password.service';
import { CreateUserDto } from '@/modules/users/application/dto/create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(
    dto: CreateUserDto,
  ): Promise<Either<Error, any>> {
    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      return left(new ConflictException('Email already exists'));
    }

    // Hash password
    const passwordHash = await this.passwordService.hash(dto.password);

    // Create user
    const user = await this.userRepository.create({
      email: dto.email,
      passwordHash,
      isActive: dto.isActive ?? true,
      roles: dto.roleIds,
    });

    return right(user);
  }
}
```

### List Users Use Case

```typescript
// src/modules/users/application/use-cases/list-users.use-case.ts
import { Injectable } from '@nestjs/common';
import { UserRepository } from '@/modules/users/domain/repositories/user.repository';
import { ListUsersDto } from '@/modules/users/application/dto/list-users.dto';

@Injectable()
export class ListUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: ListUsersDto) {
    const { page = 1, limit = 10, search, isActive, roleId } = dto;

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userRepository.findMany({
        skip,
        take: limit,
        where: {
          ...(search && {
            email: { contains: search, mode: 'insensitive' },
          }),
          ...(isActive !== undefined && { isActive }),
          ...(roleId && {
            roles: {
              some: {
                roleId,
              },
            },
          }),
        },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      }),
      this.userRepository.count({
        ...(search && {
          email: { contains: search, mode: 'insensitive' },
        }),
        ...(isActive !== undefined && { isActive }),
        ...(roleId && {
          roles: {
            some: {
              roleId,
            },
          },
        }),
      }),
    ]);

    return {
      data: users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
```

### Users Controller

```typescript
// src/modules/users/infrastructure/controllers/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/modules/auth/infrastructure/guards/permissions.guard';
import { RequirePermissions } from '@/modules/auth/infrastructure/decorators/require-permissions.decorator';
import { PERMISSIONS } from '@/modules/auth/domain/permissions';
import { CreateUserDto } from '@/modules/users/application/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/application/dto/update-user.dto';
import { ListUsersDto } from '@/modules/users/application/dto/list-users.dto';
import { CreateUserUseCase } from '@/modules/users/application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from '@/modules/users/application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '@/modules/users/application/use-cases/delete-user.use-case';
import { ListUsersUseCase } from '@/modules/users/application/use-cases/list-users.use-case';
import { GetUserUseCase } from '@/modules/users/application/use-cases/get-user.use-case';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

  @Get()
  @RequirePermissions(PERMISSIONS.USERS_READ)
  @ApiOperation({ summary: 'List users' })
  async findAll(@Query() query: ListUsersDto) {
    return this.listUsersUseCase.execute(query);
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.USERS_READ)
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id') id: string) {
    return this.getUserUseCase.execute(id);
  }

  @Post()
  @RequirePermissions(PERMISSIONS.USERS_CREATE)
  @ApiOperation({ summary: 'Create user' })
  async create(@Body() dto: CreateUserDto) {
    const result = await this.createUserUseCase.execute(dto);
    if (result.isLeft()) {
      throw result.value;
    }
    return result.value;
  }

  @Put(':id')
  @RequirePermissions(PERMISSIONS.USERS_UPDATE)
  @ApiOperation({ summary: 'Update user' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Request() req: any,
  ) {
    // Prevent user from deactivating themselves
    if (id === req.user.id && dto.isActive === false) {
      throw new ForbiddenException('Cannot deactivate your own account');
    }

    const result = await this.updateUserUseCase.execute(id, dto);
    if (result.isLeft()) {
      throw result.value;
    }
    return result.value;
  }

  @Delete(':id')
  @RequirePermissions(PERMISSIONS.USERS_DELETE)
  @ApiOperation({ summary: 'Delete user (soft delete)' })
  async delete(@Param('id') id: string, @Request() req: any) {
    // Prevent user from deleting themselves
    if (id === req.user.id) {
      throw new ForbiddenException('Cannot delete your own account');
    }

    const result = await this.deleteUserUseCase.execute(id);
    if (result.isLeft()) {
      throw result.value;
    }
    return { message: 'User deleted successfully' };
  }
}
```

### DTOs

```typescript
// src/modules/users/application/dto/create-user.dto.ts
import { IsEmail, IsString, MinLength, IsBoolean, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ type: [String] })
  @IsArray()
  roleIds: string[];
}

// src/modules/users/application/dto/list-users.dto.ts
import { IsOptional, IsString, IsBoolean, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ListUsersDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  roleId?: string;
}
```

### Frontend Users Page

```typescript
// apps/web/app/(dashboard)/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { CanAccess } from '@/components/can-access';
import { PERMISSIONS } from '@/lib/permissions';
import { apiClient } from '@/lib/api/client';

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, search],
    queryFn: () =>
      apiClient.get('/users', {
        params: { page, limit: 10, search },
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Users</h1>
        <CanAccess permission={PERMISSIONS.USERS_CREATE}>
          <Button>Create User</Button>
        </CanAccess>
      </div>

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Roles</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.data.map((user: any) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.roles.map((r: any) => r.role.name).join(', ')}</td>
                <td>{user.isActive ? 'Active' : 'Inactive'}</td>
                <td>
                  <CanAccess permission={PERMISSIONS.USERS_UPDATE}>
                    <Button>Edit</Button>
                  </CanAccess>
                  <CanAccess permission={PERMISSIONS.USERS_DELETE}>
                    <Button onClick={() => deleteMutation.mutate(user.id)}>
                      Delete
                    </Button>
                  </CanAccess>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
```

---

## Checklist of Verification

- [ ] Endpoint GET /users funciona
- [ ] Endpoint GET /users/:id funciona
- [ ] Endpoint POST /users funciona
- [ ] Endpoint PUT /users/:id funciona
- [ ] Endpoint DELETE /users/:id funciona
- [ ] Paginação implementada
- [ ] Filtros funcionando
- [ ] Validação de permissões
- [ ] Não pode desativar/deletar a si mesmo
- [ ] Frontend integrado
- [ ] Testes unitários (≥80%)
- [ ] Testes de integração
- [ ] Documentação Swagger

---

## Next User Story

→ [US-002-006: Logs of Acesso](./US-002-006-logs-acesso.md)

