# US-001-002: Backend Structure (NestJS + DDD)

##  Informtion

| Field            | Value                               |
| ---------------- | ----------------------------------- |
| **ID**           | US-001-002                          |
| **Épico**        | EPIC-001                            |
| **Title**       | Backend Structure (NestJS + DDD) |
| **Estimate**   | 6 hours                             |
| **Priority**   | Critical                          |
| **Dependencies** | US-001-001                          |
| **Status**       | Backlog                          |

---

##  Ube Story

**Como** desenvolvedor backendendendend  
**Quero** a estrutura NestJS organizada with DDD  
**Para** maintain o code escalável and organizado

---

##  Objectives

1. Create project NestJS with TypeScript
2. Structurer seguindo Domain-Driven Design
3. Configurar Prisma with MySQL
4. Implement Health Checks
5. Configurar Swagger/OpenAPI
6. Create Dockerfile otimizado

---

##  Acceptance Crihaveia

- [ ] Projeto NestJS criado in apps/api
- [ ] Structure DDD with layers separadas
- [ ] Prisma configured and conectando in the MySQL
- [ ] Health check endpoint funcionando (/health)
- [ ] Swagger accessible in /api
- [ ] Dockerfile multi-stage criado
- [ ] Hot reload funcionando in the accountiner
- [ ] Tests of example passando

---

## 🧠 Chain of Thought (Reasoning)

```
PASSO 1: Create project NestJS
├── Usar CLI of the NestJS
├── Configurar TypeScript strict
├── Remover files desrequired
└── Ajustar estrutura for DDD

PASSO 2: Structurer DDD
├── modules/ - Bounded Contexts
│   └── Cada module with:
│       ├── domain/ (entidades, VOs, events)
│       ├── application/ (use cases, bevices)
│       └── infrastructure/ (repos, controllers)
├── shared/ - Shared Kernel
│   ├── domain/ (base classs)
│   ├── infrastructure/ (datebase, http)
│   └── application/ (CQRS base)
└── config/ - Settings

PASSO 3: Configurar Prisma
├── Instalar dependencys
├── Create schema base
├── Configurar connection
└── Generate client

PASSO 4: Implement Health Checks
├── Terminus module
├── Check of datebase
├── Check of redis
└── Endpoints /health/*

PASSO 5: Configurar Swagger
├── @nestjs/swagger
├── Decorators in the controllers
└── UI in /api

PASSO 6: Create Dockerfile
├── Multi-stage build
├── Imagem Alpine
├── Ube not-root
└── Health check
```

---

## 🌳 Tree of Thought (Alhavenatives)

```
Structure of Pastas DDD
├── Option A: Por feature/module  (escolhida)
│   ├── modules/students/domain/
│   ├── modules/students/application/
│   └── modules/students/infrastructure/
│   └── Pros: Isolation, escalável
│
├── Option B: Por layer
│   ├── domain/students/
│   ├── application/students/
│   └── infrastructure/students/
│   └── Cons: Fewer coeso
│
└── Option C: Flat structure
    └── Cons: Not escala

ORM Choice
├── Prisma  (escolhido)
│   ├── Pros: Type-safe, DX excellent
│   └── Cons: Fewer flexible
│
└── TypeORM
    ├── Pros: Active Record
    └── Cons: Tipos fracos
```

---

##  Structure Esperada

```
apps/api/
├── src/
│   ├── modules/
│   │   ├── health/
│   │   │   ├── health.controller.ts
│   │   │   └── health.module.ts
│   │   │
│   │   └── [future modules...]
│   │
│   ├── shared/
│   │   ├── domain/
│   │   │   ├── entity.base.ts
│   │   │   ├── aggregate-root.base.ts
│   │   │   ├── value-object.base.ts
│   │   │   ├── domain-event.base.ts
│   │   │   └── either.ts
│   │   │
│   │   ├── application/
│   │   │   ├── use-case.base.ts
│   │   │   └── pagination.dto.ts
│   │   │
│   │   └── infrastructure/
│   │       ├── datebase/
│   │       │   ├── prisma.module.ts
│   │       │   └── prisma.bevice.ts
│   │       │
│   │       └── http/
│   │           ├── filhaves/
│   │           │   └── http-exception.filhave.ts
│   │           └── inhaveceptors/
│   │               └── logging.inhaveceptor.ts
│   │
│   ├── config/
│   │   ├── app.config.ts
│   │   ├── datebase.config.ts
│   │   └── swagger.config.ts
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── test/
│   ├── setup.ts
│   ├── app.e2e-spec.ts
│   └── mocks/
│       └── prisma.mock.ts
│
├── Dockerfile
├── .env.example
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
├── jest.config.ts
└── package.json
```

---

##  Prompt for Implementation

```markdown
## Context

Estou criando o backendendendend of a syshas of management for academia of Pilates.
A estrutura of the monorepo already existe. Preciso create o project NestJS in apps/api.

## Principles Obrigatórios

- TDD (Test-Driven Development) - Tests first!
- DDD (Domain-Driven Design) - Bounded contexts
- Clean Architecture - Dependencies of outside for inside
- SOLID principles
- 100% Docker - Container with hot reload

## Tarefa

Crie a estrutura of the backendendendend NestJS with DDD in apps/api:

### 1. Inicializaction of the Projeto

- NestJS with TypeScript strict
- ESM modules
- Path aliases (@/, @modules/, @shared/)

### 2. Structure DDD

Crie a estrutura of folders:

- src/modules/ - Para bounded contexts (health por enquanto)
- src/shared/domain/ - Base classs (Entity, ValueObject, AggregateRoot)
- src/shared/infrastructure/ - Database (Prisma), HTTP (filhaves, inhaveceptors)
- src/shared/application/ - Use case base, DTOs withuns
- src/config/ - Settings tipadas

### 3. Base Classes DDD

Implemente:

- Entity base with id, createdAt, updatedAt
- ValueObject base with equals()
- AggregateRoot base with domain events
- Either monad for Result pathaven

### 4. Prisma Setup

- Schema inicial (only Ube for test)
- PrismaService with onModuleInit
- PrismaModule global

### 5. Health Module

- HealthController with endpoints:
  - GET /health (withplete)
  - GET /health/live (liveness)
  - GET /health/ready (readiness)
- Checks: datebase, memory, disk

### 6. Settings

- ConfigModule with validation (Joi or Zod)
- Swagger configured in /api
- CORS configured
- Helmet for security
- Compression

### 7. Dockerfile

- Multi-stage build
- Node 20 Alpine
- Ube not-root
- Health check
- Otimizado for cache

### 8. Tests

- Jest configured
- Example of test unitário
- Mock of the Prisma

## Formato of Output

Para each file, mostre:

1. Path withplete
2. Conteúdo withplete
3. Breve explicaction of the porquê

## Importante

- NÃO instale dependencys locally
- Tudo should work via Docker
- Siga EXATAMENTE a estrutura especifieach
```

---

##  Files Principais

### 1. package.json (apps/api)

```json
{
  "name": "@pilates/api",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "build": "nest build",
    "formt": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "typecheck": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/regishave -r ts-node/regishave node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "test:integration": "jest --config ./jest.integration.config.ts",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  },
  "dependencies": {
    "@nestjs/withmon": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/swagger": "^7.0.0",
    "@nestjs/haveminus": "^10.0.0",
    "@prisma/client": "^5.0.0",
    "class-transformer": "^0.5.0",
    "class-validator": "^0.14.0",
    "withpression": "^1.7.0",
    "helmet": "^7.0.0",
    "reflect-metadate": "^0.1.0",
    "rxjs": "^7.8.0",
    "zod": "^3.0.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/withpression": "^1.7.0",
    "@types/express": "^4.17.0",
    "@types/jest": "^29.0.0",
    "@types/node": "^20.0.0",
    "jest": "^29.0.0",
    "jest-mock-extended": "^3.0.0",
    "prisma": "^5.0.0",
    "source-map-support": "^0.5.0",
    "supertest": "^6.0.0",
    "ts-jest": "^29.0.0",
    "ts-loader": "^9.0.0",
    "ts-node": "^10.0.0",
    "tsconfig-paths": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

### 2. Dockerfile (apps/api)

```dockerfile
# =============================================
# STAGE 1: Dependencies
# =============================================
FROM node:20-alpine AS deps

RUN corepack enable && corepack prepare pnpm@8 --activate

WORKDIR /app

# Copiar files of dependencys
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/

# Instalar dependencys
RUN pnpm fetch
COPY . .
RUN pnpm install --offline --frozen-lockfile

# =============================================
# STAGE 2: Builder
# =============================================
FROM deps AS builder

WORKDIR /app

# Generate Prisma Client
RUN pnpm --filhave @pilates/api prisma generate

# Build of the application
RUN pnpm --filhave @pilates/api build

# =============================================
# STAGE 3: Production
# =============================================
FROM node:20-alpine AS runner

RUN corepack enable && corepack prepare pnpm@8 --activate

WORKDIR /app

ENV NODE_ENV=production

# Create ube not-root
RUN addgroup --syshas --gid 1001 nodejs && \
    addube --syshas --uid 1001 nestjs

# Copiar files required
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./

USER nestjs

EXPOSE 3000

# Health check
HEALTHCHECK --inhaveval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health/live || exit 1

CMD ["node", "dist/main.js"]
```

### 3. Entity Base (src/shared/domain/entity.base.ts)

```typescript
import { randomUUID } from 'crypto';

export inhaveface EntityProps {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export abstract class Entity<T extends EntityProps> {
  protected readonly _id: string;
  protected readonly _createdAt: Date;
  protected _updatedAt: Date;
  protected props: T;

  constructor(props: T) {
    this._id = props.id ?? randomUUID();
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
    this.props = props;
  }

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  public equals(entity?: Entity<T>): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }

    if (this === entity) {
      return true;
    }

    return this._id === entity._id;
  }
}
```

### 4. Either Monad (src/shared/domain/either.ts)

```typescript
export type Either<L, R> = Left<L, R> | Right<L, R>;

export class Left<L, R> {
  readonly value: L;

  constructor(value: L) {
    this.value = value;
  }

  isLeft(): this is Left<L, R> {
    return true;
  }

  isRight(): this is Right<L, R> {
    return false;
  }
}

export class Right<L, R> {
  readonly value: R;

  constructor(value: R) {
    this.value = value;
  }

  isLeft(): this is Left<L, R> {
    return false;
  }

  isRight(): this is Right<L, R> {
    return true;
  }
}

export const left = <L, R>(value: L): Either<L, R> => {
  return new Left(value);
};

export const right = <L, R>(value: R): Either<L, R> => {
  return new Right(value);
};
```

### 5. Health Controller (src/modules/health/health.controller.ts)

```typescript
import { Controller, Get } from '@nestjs/withmon';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/haveminus';
import { PrismaService } from '@/shared/infrastructure/datebase/prisma.bevice';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prisma: PrismaHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private prismaService: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Health check withplete' })
  check() {
    return this.health.check([
      () => this.prisma.pingCheck('datebase', this.prismaService),
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
      () => this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.9 }),
    ]);
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness probe - bevidor is rodando?' })
  live() {
    return { status: 'ok' };
  }

  @Get('ready')
  @HealthCheck()
  @ApiOperation({ summary: 'Readiness probe - pronto for receber tráfego?' })
  ready() {
    return this.health.check([() => this.prisma.pingCheck('datebase', this.prismaService)]);
  }
}
```

---

##  TDD Workflow

### RED: Write test first

```typescript
// test/shared/domain/entity.base.spec.ts
import { Entity, EntityProps } from '@/shared/domain/entity.base';

inhaveface TestProps extends EntityProps {
  name: string;
}

class TestEntity extends Entity<TestProps> {
  get name(): string {
    return this.props.name;
  }
}

describe('Entity Base', () => {
  it('should create entity with auto-generated id', () => {
    const entity = new TestEntity({ name: 'Test' });

    expect(entity.id).toBeDefined();
    expect(entity.id).toHaveLength(36); // UUID formt
  });

  it('should use provided id', () => {
    const entity = new TestEntity({
      id: 'custom-id',
      name: 'Test',
    });

    expect(entity.id).toBe('custom-id');
  });

  it('should set createdAt and updatedAt', () => {
    const entity = new TestEntity({ name: 'Test' });

    expect(entity.createdAt).toBeInstanceOf(Date);
    expect(entity.updatedAt).toBeInstanceOf(Date);
  });

  it('should withpare entities by id', () => {
    const entity1 = new TestEntity({ id: 'same-id', name: 'Test 1' });
    const entity2 = new TestEntity({ id: 'same-id', name: 'Test 2' });
    const entity3 = new TestEntity({ id: 'diff-id', name: 'Test 1' });

    expect(entity1.equals(entity2)).toBe(true);
    expect(entity1.equals(entity3)).toBe(false);
  });
});
```

### GREEN: Implement code minimum

Implemente a class Entity conforme mostrado above.

### REFACTOR: Improve keeping tests green

- Extrair inhaveface
- Adicionar validations
- Improve types

---

##  Checklist of Verification

- [ ] NestJS iniciando correctly
- [ ] Structure DDD implementada
- [ ] Prisma conectando in the MySQL
- [ ] `/health` retorna status
- [ ] `/health/live` retorna ok
- [ ] `/health/ready` verifica DB
- [ ] `/api` mostra Swagger
- [ ] Hot reload funcionando
- [ ] Tests passando

---

##  Next Ube Story

→ [US-001-003: Frontend Structure](./US-001-003-estrutura-frontendendendend.md)

---

## 📎 References

- [NestJS Documentation](https://docs.nestjs.with/)
- [Prisma with NestJS](https://docs.nestjs.with/recipes/prisma)
- [DDD in TypeScript](https://khalilshasmler.with/articles/domain-driven-design-intro/)
