# US-001-002: Estrutura do Backend (NestJS + DDD)

## 📋 Informações

| Campo | Valor |
|-------|-------|
| **ID** | US-001-002 |
| **Épico** | EPIC-001 |
| **Título** | Estrutura do Backend (NestJS + DDD) |
| **Estimativa** | 6 horas |
| **Prioridade** | 🔴 Crítica |
| **Dependências** | US-001-001 |
| **Status** | 📋 Backlog |

---

## 📝 User Story

**Como** desenvolvedor backend  
**Quero** uma estrutura NestJS organizada com DDD  
**Para** manter o código escalável e organizado

---

## 🎯 Objetivos

1. Criar projeto NestJS com TypeScript
2. Estruturar seguindo Domain-Driven Design
3. Configurar Prisma com MySQL
4. Implementar Health Checks
5. Configurar Swagger/OpenAPI
6. Criar Dockerfile otimizado

---

## ✅ Critérios de Aceite

- [ ] Projeto NestJS criado em apps/api
- [ ] Estrutura DDD com camadas separadas
- [ ] Prisma configurado e conectando no MySQL
- [ ] Health check endpoint funcionando (/health)
- [ ] Swagger acessível em /api
- [ ] Dockerfile multi-stage criado
- [ ] Hot reload funcionando no container
- [ ] Testes de exemplo passando

---

## 🧠 Chain of Thought (Raciocínio)

```
PASSO 1: Criar projeto NestJS
├── Usar CLI do NestJS
├── Configurar TypeScript strict
├── Remover arquivos desnecessários
└── Ajustar estrutura para DDD

PASSO 2: Estruturar DDD
├── modules/ - Bounded Contexts
│   └── Cada módulo com:
│       ├── domain/ (entidades, VOs, eventos)
│       ├── application/ (use cases, services)
│       └── infrastructure/ (repos, controllers)
├── shared/ - Shared Kernel
│   ├── domain/ (base classes)
│   ├── infrastructure/ (database, http)
│   └── application/ (CQRS base)
└── config/ - Configurações

PASSO 3: Configurar Prisma
├── Instalar dependências
├── Criar schema base
├── Configurar connection
└── Gerar client

PASSO 4: Implementar Health Checks
├── Terminus module
├── Check de database
├── Check de redis
└── Endpoints /health/*

PASSO 5: Configurar Swagger
├── @nestjs/swagger
├── Decorators nos controllers
└── UI em /api

PASSO 6: Criar Dockerfile
├── Multi-stage build
├── Imagem Alpine
├── Usuário não-root
└── Health check
```

---

## 🌳 Tree of Thought (Alternativas)

```
Estrutura de Pastas DDD
├── Opção A: Por feature/módulo ✅ (escolhida)
│   ├── modules/students/domain/
│   ├── modules/students/application/
│   └── modules/students/infrastructure/
│   └── Prós: Isolamento, escalável
│
├── Opção B: Por camada
│   ├── domain/students/
│   ├── application/students/
│   └── infrastructure/students/
│   └── Contras: Menos coeso
│
└── Opção C: Flat structure
    └── Contras: Não escala

ORM Choice
├── Prisma ✅ (escolhido)
│   ├── Prós: Type-safe, DX excelente
│   └── Contras: Menos flexível
│
└── TypeORM
    ├── Prós: Active Record
    └── Contras: Tipos fracos
```

---

## 📁 Estrutura Esperada

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
│   │       ├── database/
│   │       │   ├── prisma.module.ts
│   │       │   └── prisma.service.ts
│   │       │
│   │       └── http/
│   │           ├── filters/
│   │           │   └── http-exception.filter.ts
│   │           └── interceptors/
│   │               └── logging.interceptor.ts
│   │
│   ├── config/
│   │   ├── app.config.ts
│   │   ├── database.config.ts
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

## 🤖 Prompt para Implementação

```markdown
## Contexto
Estou criando o backend de um sistema de gestão para academia de Pilates.
A estrutura do monorepo já existe. Preciso criar o projeto NestJS em apps/api.

## Princípios Obrigatórios
- TDD (Test-Driven Development) - Testes primeiro!
- DDD (Domain-Driven Design) - Bounded contexts
- Clean Architecture - Dependências de fora para dentro
- SOLID principles
- 100% Docker - Container com hot reload

## Tarefa
Crie a estrutura do backend NestJS com DDD em apps/api:

### 1. Inicialização do Projeto
- NestJS com TypeScript strict
- ESM modules
- Path aliases (@/, @modules/, @shared/)

### 2. Estrutura DDD
Crie a estrutura de pastas:
- src/modules/ - Para bounded contexts (health por enquanto)
- src/shared/domain/ - Base classes (Entity, ValueObject, AggregateRoot)
- src/shared/infrastructure/ - Database (Prisma), HTTP (filters, interceptors)
- src/shared/application/ - Use case base, DTOs comuns
- src/config/ - Configurações tipadas

### 3. Base Classes DDD
Implemente:
- Entity base com id, createdAt, updatedAt
- ValueObject base com equals()
- AggregateRoot base com domain events
- Either monad para Result pattern

### 4. Prisma Setup
- Schema inicial (apenas User para teste)
- PrismaService com onModuleInit
- PrismaModule global

### 5. Health Module
- HealthController com endpoints:
  - GET /health (completo)
  - GET /health/live (liveness)
  - GET /health/ready (readiness)
- Checks: database, memory, disk

### 6. Configurações
- ConfigModule com validação (Joi ou Zod)
- Swagger configurado em /api
- CORS configurado
- Helmet para segurança
- Compression

### 7. Dockerfile
- Multi-stage build
- Node 20 Alpine
- Usuário não-root
- Health check
- Otimizado para cache

### 8. Testes
- Jest configurado
- Exemplo de teste unitário
- Mock do Prisma

## Formato de Output
Para cada arquivo, mostre:
1. Path completo
2. Conteúdo completo
3. Breve explicação do porquê

## Importante
- NÃO instale dependências localmente
- Tudo deve funcionar via Docker
- Siga EXATAMENTE a estrutura especificada
```

---

## 📝 Arquivos Principais

### 1. package.json (apps/api)

```json
{
  "name": "@pilates/api",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "typecheck": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "test:integration": "jest --config ./jest.integration.config.ts",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/swagger": "^7.0.0",
    "@nestjs/terminus": "^10.0.0",
    "@prisma/client": "^5.0.0",
    "class-transformer": "^0.5.0",
    "class-validator": "^0.14.0",
    "compression": "^1.7.0",
    "helmet": "^7.0.0",
    "reflect-metadata": "^0.1.0",
    "rxjs": "^7.8.0",
    "zod": "^3.0.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/compression": "^1.7.0",
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

# Copiar arquivos de dependências
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/

# Instalar dependências
RUN pnpm fetch
COPY . .
RUN pnpm install --offline --frozen-lockfile

# =============================================
# STAGE 2: Builder
# =============================================
FROM deps AS builder

WORKDIR /app

# Gerar Prisma Client
RUN pnpm --filter @pilates/api prisma generate

# Build da aplicação
RUN pnpm --filter @pilates/api build

# =============================================
# STAGE 3: Production
# =============================================
FROM node:20-alpine AS runner

RUN corepack enable && corepack prepare pnpm@8 --activate

WORKDIR /app

ENV NODE_ENV=production

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copiar arquivos necessários
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./

USER nestjs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health/live || exit 1

CMD ["node", "dist/main.js"]
```

### 3. Entity Base (src/shared/domain/entity.base.ts)

```typescript
import { randomUUID } from 'crypto';

export interface EntityProps {
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
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '@/shared/infrastructure/database/prisma.service';

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
  @ApiOperation({ summary: 'Health check completo' })
  check() {
    return this.health.check([
      () => this.prisma.pingCheck('database', this.prismaService),
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
      () => this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.9 }),
    ]);
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness probe - servidor está rodando?' })
  live() {
    return { status: 'ok' };
  }

  @Get('ready')
  @HealthCheck()
  @ApiOperation({ summary: 'Readiness probe - pronto para receber tráfego?' })
  ready() {
    return this.health.check([
      () => this.prisma.pingCheck('database', this.prismaService),
    ]);
  }
}
```

---

## 🔴🟢🔵 TDD Workflow

### RED: Escrever teste primeiro

```typescript
// test/shared/domain/entity.base.spec.ts
import { Entity, EntityProps } from '@/shared/domain/entity.base';

interface TestProps extends EntityProps {
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
    expect(entity.id).toHaveLength(36); // UUID format
  });

  it('should use provided id', () => {
    const entity = new TestEntity({ 
      id: 'custom-id',
      name: 'Test' 
    });
    
    expect(entity.id).toBe('custom-id');
  });

  it('should set createdAt and updatedAt', () => {
    const entity = new TestEntity({ name: 'Test' });
    
    expect(entity.createdAt).toBeInstanceOf(Date);
    expect(entity.updatedAt).toBeInstanceOf(Date);
  });

  it('should compare entities by id', () => {
    const entity1 = new TestEntity({ id: 'same-id', name: 'Test 1' });
    const entity2 = new TestEntity({ id: 'same-id', name: 'Test 2' });
    const entity3 = new TestEntity({ id: 'diff-id', name: 'Test 1' });
    
    expect(entity1.equals(entity2)).toBe(true);
    expect(entity1.equals(entity3)).toBe(false);
  });
});
```

### GREEN: Implementar código mínimo

Implemente a classe Entity conforme mostrado acima.

### REFACTOR: Melhorar mantendo testes verdes

- Extrair interface
- Adicionar validações
- Melhorar tipos

---

## ✅ Checklist de Verificação

- [ ] NestJS iniciando corretamente
- [ ] Estrutura DDD implementada
- [ ] Prisma conectando no MySQL
- [ ] `/health` retorna status
- [ ] `/health/live` retorna ok
- [ ] `/health/ready` verifica DB
- [ ] `/api` mostra Swagger
- [ ] Hot reload funcionando
- [ ] Testes passando

---

## 🔗 Próxima User Story

→ [US-001-003: Estrutura do Frontend](./US-001-003-estrutura-frontend.md)

---

## 📎 Referências

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma with NestJS](https://docs.nestjs.com/recipes/prisma)
- [DDD in TypeScript](https://khalilstemmler.com/articles/domain-driven-design-intro/)

