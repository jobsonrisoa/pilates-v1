# US-002-006: Logs of Acesso

## Information

| Field            | Value            |
| ---------------- | ---------------- |
| **ID**           | US-002-006       |
| **Epic**         | EPIC-002         |
| **Title**        | Logs of Acesso   |
| **Estimate**     | 3 hours          |
| **Priority**     | 🟡 Medium        |
| **Dependencies** | US-002-001       |
| **Status**       | Backlog          |

---

## User Story

**Como** administrador  
**I want to** visualizar histórico de acessos  
**Para** auditoria e segurança

---

## Objectives

1. Criar schema de audit logs
2. Registrar login/logout
3. Capturar IP e user agent
4. Implementar endpoint de listagem
5. Adicionar filtros e paginação
6. Exportação de dados (opcional)

---

## Acceptance Criteria

- [ ] Registro de login/logout
- [ ] IP e user agent registrados
- [ ] Listagem com filtros
- [ ] Paginação implementada
- [ ] Exportação de dados (CSV/JSON)
- [ ] Apenas admins podem acessar
- [ ] Logs não podem ser deletados

---

## Prompt for Implementation

```markdown
## Context

Backend NestJS. Preciso implementar sistema de audit logs
para conformidade LGPD e segurança.

## Tarefa

### 1. Audit Log Schema

- action (login, logout, etc.)
- userId
- ipAddress
- userAgent
- timestamp
- metadata (JSON)

### 2. Audit Interceptor

- Interceptar login/logout
- Capturar IP e user agent
- Salvar no database

### 3. Audit Logs Endpoint

GET /audit-logs
- Filtros: userId, action, date range
- Paginação
- Ordenação

### 4. Export

- CSV export
- JSON export
- Date range filter

## Dependencies

- Interceptor customizado
- Prisma schema
```

---

## Implementation Details

### Prisma Schema

```prisma
// apps/api/prisma/schema.prisma
model AuditLog {
  id        String   @id @default(uuid())
  action    String   // 'login', 'logout', 'password_reset', etc.
  userId    String?
  ipAddress String?
  userAgent String?
  metadata  Json?    // Additional data
  createdAt DateTime @default(now())
  user      User?    @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([action])
  @@index([createdAt])
}
```

### Audit Service

```typescript
// src/modules/audit/infrastructure/services/audit.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/database/prisma.service';

export interface AuditLogData {
  action: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(data: AuditLogData): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        action: data.action,
        userId: data.userId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        metadata: data.metadata || {},
      },
    });
  }

  async findMany(filters: {
    userId?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const { userId, action, startDate, endDate, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (action) {
      where.action = action;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = startDate;
      }
      if (endDate) {
        where.createdAt.lte = endDate;
      }
    }

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data: logs,
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

### Audit Interceptor

```typescript
// src/modules/audit/infrastructure/interceptors/audit.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { AuditService } from '@/modules/audit/infrastructure/services/audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, user, ip, headers } = request;

    // Only log specific actions
    const actionsToLog = ['/auth/login', '/auth/logout', '/auth/forgot-password'];

    if (!actionsToLog.some((action) => url.includes(action))) {
      return next.handle();
    }

    const action = url.includes('login')
      ? 'login'
      : url.includes('logout')
        ? 'logout'
        : url.includes('forgot-password')
          ? 'password_reset_request'
          : 'unknown';

    return next.handle().pipe(
      tap({
        next: async () => {
          // Log successful action
          await this.auditService.log({
            action,
            userId: user?.id,
            ipAddress: ip || request.socket.remoteAddress,
            userAgent: headers['user-agent'],
            metadata: {
              method,
              url,
            },
          });
        },
        error: async (error) => {
          // Log failed action
          await this.auditService.log({
            action: `${action}_failed`,
            userId: user?.id,
            ipAddress: ip || request.socket.remoteAddress,
            userAgent: headers['user-agent'],
            metadata: {
              method,
              url,
              error: error.message,
            },
          });
        },
      }),
    );
  }
}
```

### Audit Logs Controller

```typescript
// src/modules/audit/infrastructure/controllers/audit-logs.controller.ts
import {
  Controller,
  Get,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/modules/auth/infrastructure/guards/permissions.guard';
import { RequirePermissions } from '@/modules/auth/infrastructure/decorators/require-permissions.decorator';
import { PERMISSIONS } from '@/modules/auth/domain/permissions';
import { AuditService } from '@/modules/audit/infrastructure/services/audit.service';
import { ListAuditLogsDto } from '@/modules/audit/application/dto/list-audit-logs.dto';

@ApiTags('Audit Logs')
@Controller('audit-logs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions(PERMISSIONS.REPORTS_READ) // Only admins can view
export class AuditLogsController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'List audit logs' })
  @ApiResponse({ status: 200, description: 'List of audit logs' })
  async findAll(@Query() query: ListAuditLogsDto) {
    return this.auditService.findMany({
      userId: query.userId,
      action: query.action,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      page: query.page,
      limit: query.limit,
    });
  }

  @Get('export')
  @ApiOperation({ summary: 'Export audit logs' })
  async export(
    @Query() query: ListAuditLogsDto,
    @Res() res: Response,
  ) {
    const format = query.format || 'json';

    const logs = await this.auditService.findMany({
      userId: query.userId,
      action: query.action,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      page: 1,
      limit: 10000, // Large limit for export
    });

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=audit-logs.csv');

      // CSV header
      res.write('Date,Action,User,IP Address,User Agent\n');

      // CSV rows
      logs.data.forEach((log) => {
        res.write(
          `${log.createdAt.toISOString()},${log.action},${log.user?.email || 'N/A'},${log.ipAddress || 'N/A'},${log.userAgent || 'N/A'}\n`,
        );
      });

      res.end();
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=audit-logs.json');
      res.json(logs);
    }
  }
}
```

### DTOs

```typescript
// src/modules/audit/application/dto/list-audit-logs.dto.ts
import { IsOptional, IsString, IsDateString, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ListAuditLogsDto {
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
  userId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  action?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ required: false, enum: ['json', 'csv'] })
  @IsOptional()
  @IsIn(['json', 'csv'])
  format?: string;
}
```

### Register Interceptor

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditInterceptor } from '@/modules/audit/infrastructure/interceptors/audit.interceptor';
import { AuditModule } from '@/modules/audit/audit.module';

@Module({
  imports: [
    // ... other modules
    AuditModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
```

### Frontend Audit Logs Page

```typescript
// apps/web/app/(dashboard)/audit-logs/page.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    action: '',
    userId: '',
    startDate: '',
    endDate: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', page, filters],
    queryFn: () =>
      apiClient.get('/audit-logs', {
        params: { page, limit: 20, ...filters },
      }),
  });

  const handleExport = async (format: 'json' | 'csv') => {
    const response = await apiClient.get('/audit-logs/export', {
      params: { ...filters, format },
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `audit-logs.${format}`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      <h1>Audit Logs</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Action"
          value={filters.action}
          onChange={(e) => setFilters({ ...filters, action: e.target.value })}
        />
        <input
          type="date"
          placeholder="Start Date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
        />
        <input
          type="date"
          placeholder="End Date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
        />
      </div>

      <div className="actions">
        <button onClick={() => handleExport('json')}>Export JSON</button>
        <button onClick={() => handleExport('csv')}>Export CSV</button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Action</th>
              <th>User</th>
              <th>IP Address</th>
              <th>User Agent</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.data.map((log: any) => (
              <tr key={log.id}>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
                <td>{log.action}</td>
                <td>{log.user?.email || 'N/A'}</td>
                <td>{log.ipAddress || 'N/A'}</td>
                <td>{log.userAgent || 'N/A'}</td>
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

- [ ] Schema Prisma AuditLog criado
- [ ] AuditService implementado
- [ ] AuditInterceptor registrado
- [ ] Login/logout registrados
- [ ] IP e user agent capturados
- [ ] Endpoint GET /audit-logs funciona
- [ ] Filtros funcionando
- [ ] Paginação implementada
- [ ] Exportação CSV/JSON funciona
- [ ] Apenas admins podem acessar
- [ ] Frontend integrado
- [ ] Testes unitários (≥80%)
- [ ] Testes de integração
- [ ] Documentação Swagger

---

## Epic 2 Complete

All user stories for EPIC-002 (Authentication and Authorization) are now documented.

**Next Steps:**
- Review and implement each US following TDD approach
- Start with US-002-001 (Login)
- Follow the implementation order: US-002-001 → US-002-002 → ... → US-002-006

