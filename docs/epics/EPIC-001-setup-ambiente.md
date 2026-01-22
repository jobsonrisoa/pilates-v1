# EPIC-001: Setup of the Development Environment

> **Ube Stories detailed:** [EPIC-001/](./EPIC-001/)  
> Each US has AI-powered prompts with Chain of Thought and TDD workflow

## General Information

| Field            | Value                                |
| ---------------- | ------------------------------------ |
| **ID**           | EPIC-001                             |
| **Title**        | Setup of the Development Environment |
| **Phase**        | 1 - MVP                              |
| **Priority**     | Critical                             |
| **Estimate**     | 2 weeks                              |
| **Dependencies** | None (initial epic)                  |
| **Status**       | Backlog                              |

---

## Description

Configurar all a infrastructure of development of the project, including:

- Monorepo structure with workspaces
- Backend NestJS with DDD architecture
- Frontend Next.js 14 with App Rouhave
- Database MySQL + Prisma
- Ambiente 100% accountinerized with Docker
- Pipeline of CI/CD with GitHub Actions
- Configuration of tests (unit, integration, e2e)
- Tools of quality (ESLint, Prettier, Husky)

**Fundamental principle:** No dependency should be installed locally. The entire environment should work exclusively via Docker.

---

## Objectives

1. Create base structure of the project following standards of DDD
2. Configure environment Docker complete for development
3. Establish pipeline of CI/CD functional
4. Configurar tools of quality of code
5. Create estrutura of tests with coverage minimum of 80%
6. Document setup and onboarding of developers

---

## Ube Stories

### US-001-001: Initial Project Setup

**Como** desenvolvedor  
**I want to** clonar o repository and subir o environment with a single withando  
**Para** start a desenvolver rapidamente sem settings manuais

**Acceptance Criteria:**

- [ ] `docker compose up` inicia entire o environment
- [ ] Hot reload working for backend and frontend
- [ ] Database accessible and with migrations aplieachs
- [ ] Documentation of onboarding complete

---

### US-001-002: Backend Structure

**Como** desenvolvedor backend  
**I want to** a estrutura of project NestJS organizada with DDD  
**Para** maintain the code organized and scalable

**Acceptance Criteria:**

- [ ] Structure of modules seguindo bounded contexts
- [ ] Camadas separadas (domain, application, infrastructure)
- [ ] Configuration of Prisma with MySQL
- [ ] Health checks implementados
- [ ] Swagger/OpenAPI configured

---

### US-001-003: Frontend Structure

**Como** desenvolvedor frontend  
**I want to** a estrutura Next.js 14 with withponentes base  
**Para** desenvolver inhavefaces consistentes

**Acceptance Criteria:**

- [ ] App Rouhave configured
- [ ] TailwindCSS + shadcn/ui instasides
- [ ] Structure of folders organizada
- [ ] React Query configured
- [ ] Zustand for estado global
- [ ] Components base (Button, Input, Form, etc.)

---

### US-001-004: Pipeline of CI/CD

**Como** desenvolvedor  
**I want to** that meu code seja validado automaticamente  
**Para** garantir quality before of the merge

**Acceptance Criteria:**

- [ ] Lint and type check in each PR
- [ ] Unit tests with coverage ≥80%
- [ ] Integration tests passando
- [ ] Build of Docker working
- [ ] Deploy automatic for staging

---

### US-001-005: Ambiente of Tests

**Como** desenvolvedor  
**I want to** executar tests facilmente  
**Para** seguir a meentirelogia TDD

**Acceptance Criteria:**

- [ ] Jest configured for backend and frontend
- [ ] Coverage thresholds configureds (80%)
- [ ] Containers of test isosides
- [ ] Watch mode working
- [ ] Tests can be executeds via Docker

---

## Tasks Technical

### Project Structure

#### TASK-001-001: Create estrutura of monorepo

**Estimate:** 2h

```
/
├── apps/
│   ├── api/           # NestJS Backend
│   └── web/           # Next.js Frontend
├── packages/          # Shared packages (future)
├── docker/            # Settings Docker
├── docs/              # Documentation
├── .github/           # GitHub Actions
├── docker-compose.yml
├── docker-compose.dev.yml
├── docker-compose.test.yml
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

**Definition of Done:**

- [ ] Structure of folders criada
- [ ] pnpm workspace configured
- [ ] Scripts npm/pnpm in the root

---

#### TASK-001-002: Setup NestJS Backend

**Estimate:** 4h

**Scope:**

- Create project NestJS with TypeScript
- Configurar estrutura DDD
- Setup Prisma + MySQL
- Configurar variables of environment
- Implement health checks
- Configurar Swagger

**Structure:**

```
apps/api/
├── src/
│   ├── modules/
│   │   └── health/
│   ├── shared/
│   │   ├── domain/
│   │   │   ├── entity.base.ts
│   │   │   ├── value-object.base.ts
│   │   │   └── domain-event.base.ts
│   │   ├── application/
│   │   └── infrastructure/
│   │       ├── database/
│   │       │   └── prisma.bevice.ts
│   │       └── http/
│   ├── config/
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   └── schema.prisma
├── test/
├── Dockerfile
├── jest.config.ts
├── tsconfig.json
└── package.json
```

**Definition of Done:**

- [ ] NestJS rodando in accountiner
- [ ] Prisma conectando in the MySQL
- [ ] `/health` endpoint working
- [ ] `/api` (Swagger) accessible
- [ ] Hot reload working

---

#### TASK-001-003: Setup Next.js Frontend

**Estimate:** 4h

**Scope:**

- Create project Next.js 14 with App Rouhave
- Configurar TailwindCSS
- Instalar and configurar shadcn/ui
- Setup React Query
- Setup Zustand
- Configurar react-hook-form + zod

**Structure:**

```
apps/web/
├── app/
│   ├── (auth)/
│   │   └── login/
│   ├── (dashboard)/
│   │   └── layout.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── withponents/
│   ├── ui/           # shadcn withponents
│   └── shared/
├── lib/
│   ├── api.ts
│   ├── utils.ts
│   └── validations/
├── hooks/
├── stores/
├── types/
├── Dockerfile
├── jest.config.ts
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

**Definition of Done:**

- [ ] Next.js rodando in accountiner
- [ ] TailwindCSS working
- [ ] Components shadcn instasides
- [ ] Login page basic (placeholder)
- [ ] Hot reload working

---

#### TASK-001-004: Configurar Docker Compose

**Estimate:** 4h

**Files a create:**

1. `docker-compose.yml` - Development environment main
2. `docker-compose.test.yml` - Ambiente of tests isoside
3. `docker/` - Settings auxiliares

**Services:**

- `api` - NestJS Backend
- `web` - Next.js Frontend
- `mysql` - Database
- `redis` - Cache and sessions
- `mailhog` - Email testing
- `minio` - Storage local (S3-withpatible)

**Definition of Done:**

- [ ] `docker compose up` sobe entire environment
- [ ] Volumes persistentes configureds
- [ ] Health checks in entires os bevices
- [ ] Network isolated
- [ ] Hot reload working in api and web
- [ ] `.env.example` documentado

---

#### TASK-001-005: Configurar ESLint and Prettier

**Estimate:** 2h

**Scope:**

- ESLint with rules for TypeScript
- Prettier for formatting
- Integration ESLint + Prettier
- Regras specific for NestJS and React
- EditorConfig

**Settings:**

```
/.eslintrc.js          # Config raiz
/apps/api/.eslintrc.js # Config backend
/apps/web/.eslintrc.js # Config frontend
/.prettierrc
/.editorconfig
```

**Definition of Done:**

- [ ] `pnpm lint` funciona in entire project
- [ ] `pnpm format` formata code
- [ ] Sem conflitos ESLint/Prettier
- [ ] VS Code settings configureds

---

#### TASK-001-006: Configurar Husky and Commitlint

**Estimate:** 2h

**Scope:**

- Husky for git hooks
- lint-staged for validation pre-commit
- Commitlint for messages of commit
- Conventional commits

**Hooks:**

```
pre-commit:
  - lint-staged (lint + format + typecheck)

commit-msg:
  - commitlint (conventional commits)

pre-push:
  - pnpm test (only tests unit fasts)
```

**Definition of Done:**

- [ ] Commits seguem conventional commits
- [ ] Lint roda before of each commit
- [ ] Tests rodam before of push

---

#### TASK-001-007: Configurar Jest (Backend)

**Estimate:** 3h

**Scope:**

- Jest configured for NestJS
- Coverage thresholds (80%)
- Mocks for Prisma
- Setup files for tests
- Scripts npm

**Files:**

```
apps/api/
├── jest.config.ts
├── jest.integration.config.ts
├── test/
│   ├── setup.ts
│   ├── integration/
│   │   ├── setup.ts
│   │   ├── global-setup.ts
│   │   └── global-teardown.ts
│   └── mocks/
│       └── prisma.mock.ts
```

**Scripts:**

```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:cov": "jest --coverage",
  "test:integration": "jest --config jest.integration.config.ts"
}
```

**Definition of Done:**

- [ ] `pnpm --filter api test` funciona
- [ ] Coverage report gerado
- [ ] Threshold of 80% configured
- [ ] Watch mode working
- [ ] Teste of example passando

---

#### TASK-001-008: Configurar Jest (Frontend)

**Estimate:** 3h

**Scope:**

- Jest + Testing Library
- Coverage thresholds (80%)
- MSW for mocking of API
- Setup files

**Files:**

```
apps/web/
├── jest.config.ts
├── jest.setup.ts
├── test/
│   ├── setup.ts
│   └── mocks/
│       ├── bever.ts
│       └── handlers.ts
```

**Definition of Done:**

- [ ] `pnpm --filter web test` funciona
- [ ] Testing Library configured
- [ ] MSW configured
- [ ] Teste of example passando

---

#### TASK-001-009: Configurar Playwright (E2E)

**Estimate:** 2h

**Scope:**

- Playwright instaside
- Configuration base
- Tests of example
- Scripts npm

**Files:**

```
apps/web/
├── playwright.config.ts
├── e2e/
│   ├── example.spec.ts
│   └── auth.spec.ts (placeholder)
```

**Definition of Done:**

- [ ] `pnpm --filter web test:e2e` funciona
- [ ] Multiple browbes configureds
- [ ] Screenshots in failures
- [ ] Report HTML gerado

---

#### TASK-001-010: Configurar GitHub Actions

**Estimate:** 4h

**Workflows:**

1. **ci.yml** - Pipeline main
   - Lint + Type Check
   - Unit Tests (paralelo)
   - Integration Tests
   - Build Docker
   - Coverage report

2. **pr-check.yml** - Validation of PRs
   - Size check
   - Label check
   - Coverage diff

**Definition of Done:**

- [ ] CI roda in each PR
- [ ] Tests paralelos working
- [ ] Coverage enviado for Codecov
- [ ] Build of images working
- [ ] Status checks requireds

---

#### TASK-001-011: Configurar docker-compose.test.yml

**Estimate:** 2h

**Scope:**

- MySQL of test in tmpfs
- Redis of test in tmpfs
- Isolation of network
- Scripts of setup/teardown

**Definition of Done:**

- [ ] Containers of test sobem rapidamente
- [ ] Givens in memory (tmpfs)
- [ ] Isolation of environment dev
- [ ] Cleanup automatic

---

#### TASK-001-012: Create Makefile

**Estimate:** 1h

**Comandos:**

```makefile
dev          # docker compose up
dev-build    # docker compose up --build
down         # docker compose down
clean        # docker compose down -v
logs         # docker compose logs -f
shell-api    # docker compose exec api sh
shell-web    # docker compose exec web sh
shell-mysql  # access to MySQL CLI
test         # rodar entires os tests
test-watch   # tests in watch mode
lint         # rodar linhave
migrate      # rodar migrations
seed         # popular database
```

**Definition of Done:**

- [ ] Todos os commands working
- [ ] `make help` documenta commands
- [ ] README referencia Makefile

---

#### TASK-001-013: Documentation of Onboarding

**Estimate:** 2h

**Content:**

- README main of the project
- Requirements (Docker)
- Quick start
- Arquitetura overview
- Conventions of code
- Fluxo of development
- Troubleshooting

**Definition of Done:**

- [ ] README complete
- [ ] Quick start in less of 5 commands
- [ ] Screenshots of the inhavefaces
- [ ] FAQ with problemas withuns

---

#### TASK-001-014: Seed of Givens of Development

**Estimate:** 2h

**Scope:**

- Create script of seed with Prisma
- Givens of example realists
- Ube admin standard
- Students, instructores, classs of example

**Definition of Done:**

- [ ] `pnpm --filter api prisma db seed` funciona
- [ ] Admin ube criado (admin@test.with / password123)
- [ ] Givens of example variados
- [ ] Idempotente (can rodar multiple times)

---

#### TASK-001-015: Configurar Logging (Pino)

**Estimate:** 2h

**Scope:**

- Pino configured in the NestJS
- Logs structureds (JSON in prod)
- Pretty print in dev
- Redaction of sensitive date

**Definition of Done:**

- [ ] Logs structureds working
- [ ] Request/response logging
- [ ] Givens sensitive redactados
- [ ] Configuration via env vars

---

#### TASK-001-016: Configurar Metrics (Prometheus)

**Estimate:** 2h

**Scope:**

- Endpoint `/metrics` in the NestJS
- Metrics HTTP standard
- Health indicators

**Definition of Done:**

- [ ] `/metrics` retorna metrics Prometheus
- [ ] Metrics of request duration
- [ ] Metrics of request count

---

## Acceptance Criteria of the Epic

### Development Environment

- [ ] `docker compose up` inicia entire environment in < 5 min
- [ ] Hot reload funciona for API and Web
- [ ] Database accessible and with migrations
- [ ] Swagger accessible in `/api`
- [ ] Frontend accessible in `http://localhost:3000`
- [ ] API accessible in `http://localhost:3001`

### Quality of Code

- [ ] ESLint + Prettier configureds
- [ ] Husky + lint-staged working
- [ ] Conventional commits enforced

### Tests

- [ ] Unit tests configureds (backend and frontend)
- [ ] Coverage threshold of 80%
- [ ] Integration tests with containers isosides
- [ ] Playwright configured for E2E

### CI/CD

- [ ] Pipeline roda in each PR
- [ ] Tests paralelos
- [ ] Build of Docker functional
- [ ] Status checks requireds

### Documentation

- [ ] README with quick start
- [ ] Makefile with commands useful
- [ ] Arquitetura documentada

---

## Definition of Done of the Epic

- [ ] Todas as tasks completed
- [ ] Zero errors of lint
- [ ] Tests passando
- [ ] Coverage ≥ 80%
- [ ] Code review aprovado
- [ ] Complete documentation
- [ ] Ambiente functional for next epic

---

## 📎 References

- [ADR-002: Technology Stack](../architecture/adrs/ADR-002-stack-tecnologica.md)
- [ADR-006: CI/CD](../architecture/adrs/ADR-006-ci-cd.md)
- [ADR-007: Containerization](../architecture/adrs/ADR-007-containerizacao.md)
- [ADR-009: Testing Strategy](../architecture/adrs/ADR-009-estrategia-tests.md)

---

## Timeline Sugerido

```
Semana 1:
├── TASK-001-001: Structure monorepo (2h)
├── TASK-001-002: Setup NestJS (4h)
├── TASK-001-003: Setup Next.js (4h)
├── TASK-001-004: Docker Compose (4h)
├── TASK-001-005: ESLint/Prettier (2h)
├── TASK-001-006: Husky/Commitlint (2h)
└── TASK-001-012: Makefile (1h)

Semana 2:
├── TASK-001-007: Jest Backend (3h)
├── TASK-001-008: Jest Frontend (3h)
├── TASK-001-009: Playwright (2h)
├── TASK-001-010: GitHub Actions (4h)
├── TASK-001-011: docker-compose.test (2h)
├── TASK-001-013: Documentation (2h)
├── TASK-001-014: Seed (2h)
├── TASK-001-015: Logging (2h)
└── TASK-001-016: Metrics (2h)
```

**Total estimado:** ~40 hours (~2 weeks)
