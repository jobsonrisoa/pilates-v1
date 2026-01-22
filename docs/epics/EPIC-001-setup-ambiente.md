# EPIC-001: Setup do Ambiente de Desenvolvimento

>  **User Stories detalhadas:** [EPIC-001/](./EPIC-001/)  
> Cada US possui prompts AI-powered com Chain of Thought e TDD workflow

##  Informações Gerais

| Campo            | Valor                                |
| ---------------- | ------------------------------------ |
| **ID**           | EPIC-001                             |
| **Título**       | Setup do Ambiente de Desenvolvimento |
| **Fase**         | 1 - MVP                              |
| **Prioridade**   | Critical                           |
| **Estimativa**   | 2 semanas                            |
| **Dependências** | Nenhuma (épico inicial)              |
| **Status**       | Backlog                           |

---

##  Descrição

Configurar toda a infraestrutura de desenvolvimento do projeto, incluindo:

- Estrutura de monorepo com workspaces
- Backend NestJS com arquitetura DDD
- Frontend Next.js 14 com App Router
- Banco de dados MySQL + Prisma
- Ambiente 100% containerizado com Docker
- Pipeline de CI/CD com GitHub Actions
- Configuração de testes (unit, integração, e2e)
- Ferramentas de qualidade (ESLint, Prettier, Husky)

**Princípio fundamental:** Nenhuma dependência deve ser instalada localmente. Todo o ambiente deve funcionar exclusivamente via Docker.

---

##  Objetivos

1. Criar estrutura base do projeto seguindo padrões de DDD
2. Configurar ambiente Docker completo para desenvolvimento
3. Estabelecer pipeline de CI/CD funcional
4. Configurar ferramentas de qualidade de código
5. Criar estrutura de testes com coverage mínimo de 80%
6. Documentar setup e onboarding de desenvolvedores

---

##  User Stories

### US-001-001: Setup Inicial do Projeto

**Como** desenvolvedor  
**Quero** clonar o repositório e subir o ambiente com um único comando  
**Para** começar a desenvolver rapidamente sem configurações manuais

**Critérios de Aceite:**

- [ ] `docker compose up` inicia todo o ambiente
- [ ] Hot reload funcionando para backend e frontend
- [ ] Banco de dados acessível e com migrations aplicadas
- [ ] Documentação de onboarding completa

---

### US-001-002: Estrutura do Backend

**Como** desenvolvedor backend  
**Quero** uma estrutura de projeto NestJS organizada com DDD  
**Para** manter o código organizado e escalável

**Critérios de Aceite:**

- [ ] Estrutura de módulos seguindo bounded contexts
- [ ] Camadas separadas (domain, application, infrastructure)
- [ ] Configuração de Prisma com MySQL
- [ ] Health checks implementados
- [ ] Swagger/OpenAPI configurado

---

### US-001-003: Estrutura do Frontend

**Como** desenvolvedor frontend  
**Quero** uma estrutura Next.js 14 com componentes base  
**Para** desenvolver interfaces consistentes

**Critérios de Aceite:**

- [ ] App Router configurado
- [ ] TailwindCSS + shadcn/ui instalados
- [ ] Estrutura de pastas organizada
- [ ] React Query configurado
- [ ] Zustand para estado global
- [ ] Componentes base (Button, Input, Form, etc.)

---

### US-001-004: Pipeline de CI/CD

**Como** desenvolvedor  
**Quero** que meu código seja validado automaticamente  
**Para** garantir qualidade antes do merge

**Critérios de Aceite:**

- [ ] Lint e type check em cada PR
- [ ] Testes unitários com coverage ≥80%
- [ ] Testes de integração passando
- [ ] Build de Docker funcionando
- [ ] Deploy automático para staging

---

### US-001-005: Ambiente de Testes

**Como** desenvolvedor  
**Quero** executar testes facilmente  
**Para** seguir a metodologia TDD

**Critérios de Aceite:**

- [ ] Jest configurado para backend e frontend
- [ ] Coverage thresholds configurados (80%)
- [ ] Containers de teste isolados
- [ ] Watch mode funcionando
- [ ] Testes podem ser executados via Docker

---

##  Tasks Técnicas

### Estrutura do Projeto

#### TASK-001-001: Criar estrutura de monorepo

**Estimativa:** 2h

```
/
├── apps/
│   ├── api/           # NestJS Backend
│   └── web/           # Next.js Frontend
├── packages/          # Shared packages (futuro)
├── docker/            # Configurações Docker
├── docs/              # Documentação
├── .github/           # GitHub Actions
├── docker-compose.yml
├── docker-compose.dev.yml
├── docker-compose.test.yml
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

**Definition of Done:**

- [ ] Estrutura de pastas criada
- [ ] pnpm workspace configurado
- [ ] Scripts npm/pnpm no root

---

#### TASK-001-002: Setup NestJS Backend

**Estimativa:** 4h

**Escopo:**

- Criar projeto NestJS com TypeScript
- Configurar estrutura DDD
- Setup Prisma + MySQL
- Configurar variáveis de ambiente
- Implementar health checks
- Configurar Swagger

**Estrutura:**

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
│   │       │   └── prisma.service.ts
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

- [ ] NestJS rodando em container
- [ ] Prisma conectando no MySQL
- [ ] `/health` endpoint funcionando
- [ ] `/api` (Swagger) acessível
- [ ] Hot reload funcionando

---

#### TASK-001-003: Setup Next.js Frontend

**Estimativa:** 4h

**Escopo:**

- Criar projeto Next.js 14 com App Router
- Configurar TailwindCSS
- Instalar e configurar shadcn/ui
- Setup React Query
- Setup Zustand
- Configurar react-hook-form + zod

**Estrutura:**

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
├── components/
│   ├── ui/           # shadcn components
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

- [ ] Next.js rodando em container
- [ ] TailwindCSS funcionando
- [ ] Componentes shadcn instalados
- [ ] Página de login básica (placeholder)
- [ ] Hot reload funcionando

---

#### TASK-001-004: Configurar Docker Compose

**Estimativa:** 4h

**Arquivos a criar:**

1. `docker-compose.yml` - Ambiente de desenvolvimento principal
2. `docker-compose.test.yml` - Ambiente de testes isolado
3. `docker/` - Configurações auxiliares

**Serviços:**

- `api` - NestJS Backend
- `web` - Next.js Frontend
- `mysql` - Banco de dados
- `redis` - Cache e sessions
- `mailhog` - Email testing
- `minio` - Storage local (S3-compatible)

**Definition of Done:**

- [ ] `docker compose up` sobe todo ambiente
- [ ] Volumes persistentes configurados
- [ ] Health checks em todos os serviços
- [ ] Network isolada
- [ ] Hot reload funcionando em api e web
- [ ] `.env.example` documentado

---

#### TASK-001-005: Configurar ESLint e Prettier

**Estimativa:** 2h

**Escopo:**

- ESLint com regras para TypeScript
- Prettier para formatação
- Integração ESLint + Prettier
- Regras específicas para NestJS e React
- EditorConfig

**Configurações:**

```
/.eslintrc.js          # Config raiz
/apps/api/.eslintrc.js # Config backend
/apps/web/.eslintrc.js # Config frontend
/.prettierrc
/.editorconfig
```

**Definition of Done:**

- [ ] `pnpm lint` funciona em todo projeto
- [ ] `pnpm format` formata código
- [ ] Sem conflitos ESLint/Prettier
- [ ] VS Code settings configurados

---

#### TASK-001-006: Configurar Husky e Commitlint

**Estimativa:** 2h

**Escopo:**

- Husky para git hooks
- lint-staged para validação pré-commit
- Commitlint para mensagens de commit
- Conventional commits

**Hooks:**

```
pre-commit:
  - lint-staged (lint + format + typecheck)

commit-msg:
  - commitlint (conventional commits)

pre-push:
  - pnpm test (apenas testes unitários rápidos)
```

**Definition of Done:**

- [ ] Commits seguem conventional commits
- [ ] Lint roda antes de cada commit
- [ ] Testes rodam antes de push

---

#### TASK-001-007: Configurar Jest (Backend)

**Estimativa:** 3h

**Escopo:**

- Jest configurado para NestJS
- Coverage thresholds (80%)
- Mocks para Prisma
- Setup files para testes
- Scripts npm

**Arquivos:**

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
- [ ] Threshold de 80% configurado
- [ ] Watch mode funcionando
- [ ] Teste de exemplo passando

---

#### TASK-001-008: Configurar Jest (Frontend)

**Estimativa:** 3h

**Escopo:**

- Jest + Testing Library
- Coverage thresholds (80%)
- MSW para mocking de API
- Setup files

**Arquivos:**

```
apps/web/
├── jest.config.ts
├── jest.setup.ts
├── test/
│   ├── setup.ts
│   └── mocks/
│       ├── server.ts
│       └── handlers.ts
```

**Definition of Done:**

- [ ] `pnpm --filter web test` funciona
- [ ] Testing Library configurado
- [ ] MSW configurado
- [ ] Teste de exemplo passando

---

#### TASK-001-009: Configurar Playwright (E2E)

**Estimativa:** 2h

**Escopo:**

- Playwright instalado
- Configuração base
- Testes de exemplo
- Scripts npm

**Arquivos:**

```
apps/web/
├── playwright.config.ts
├── e2e/
│   ├── example.spec.ts
│   └── auth.spec.ts (placeholder)
```

**Definition of Done:**

- [ ] `pnpm --filter web test:e2e` funciona
- [ ] Múltiplos browsers configurados
- [ ] Screenshots em falhas
- [ ] Report HTML gerado

---

#### TASK-001-010: Configurar GitHub Actions

**Estimativa:** 4h

**Workflows:**

1. **ci.yml** - Pipeline principal
   - Lint + Type Check
   - Unit Tests (paralelo)
   - Integration Tests
   - Build Docker
   - Coverage report

2. **pr-check.yml** - Validação de PRs
   - Size check
   - Label check
   - Coverage diff

**Definition of Done:**

- [ ] CI roda em cada PR
- [ ] Testes paralelos funcionando
- [ ] Coverage enviado para Codecov
- [ ] Build de imagens funcionando
- [ ] Status checks obrigatórios

---

#### TASK-001-011: Configurar docker-compose.test.yml

**Estimativa:** 2h

**Escopo:**

- MySQL de teste em tmpfs
- Redis de teste em tmpfs
- Isolamento de rede
- Scripts de setup/teardown

**Definition of Done:**

- [ ] Containers de teste sobem rapidamente
- [ ] Dados em memória (tmpfs)
- [ ] Isolamento de ambiente dev
- [ ] Cleanup automático

---

#### TASK-001-012: Criar Makefile

**Estimativa:** 1h

**Comandos:**

```makefile
dev          # docker compose up
dev-build    # docker compose up --build
down         # docker compose down
clean        # docker compose down -v
logs         # docker compose logs -f
shell-api    # docker compose exec api sh
shell-web    # docker compose exec web sh
shell-mysql  # acesso ao MySQL CLI
test         # rodar todos os testes
test-watch   # testes em watch mode
lint         # rodar linter
migrate      # rodar migrations
seed         # popular banco
```

**Definition of Done:**

- [ ] Todos os comandos funcionando
- [ ] `make help` documenta comandos
- [ ] README referencia Makefile

---

#### TASK-001-013: Documentação de Onboarding

**Estimativa:** 2h

**Conteúdo:**

- README principal do projeto
- Requisitos (Docker)
- Quick start
- Arquitetura overview
- Convenções de código
- Fluxo de desenvolvimento
- Troubleshooting

**Definition of Done:**

- [ ] README completo
- [ ] Quick start em menos de 5 comandos
- [ ] Screenshots das interfaces
- [ ] FAQ com problemas comuns

---

#### TASK-001-014: Seed de Dados de Desenvolvimento

**Estimativa:** 2h

**Escopo:**

- Criar script de seed com Prisma
- Dados de exemplo realistas
- Usuário admin padrão
- Alunos, professores, aulas de exemplo

**Definition of Done:**

- [ ] `pnpm --filter api prisma db seed` funciona
- [ ] Admin user criado (admin@test.com / password123)
- [ ] Dados de exemplo variados
- [ ] Idempotente (pode rodar múltiplas vezes)

---

#### TASK-001-015: Configurar Logging (Pino)

**Estimativa:** 2h

**Escopo:**

- Pino configurado no NestJS
- Logs estruturados (JSON em prod)
- Pretty print em dev
- Redação de dados sensíveis

**Definition of Done:**

- [ ] Logs estruturados funcionando
- [ ] Request/response logging
- [ ] Dados sensíveis redactados
- [ ] Configuração via env vars

---

#### TASK-001-016: Configurar Métricas (Prometheus)

**Estimativa:** 2h

**Escopo:**

- Endpoint `/metrics` no NestJS
- Métricas HTTP padrão
- Health indicators

**Definition of Done:**

- [ ] `/metrics` retorna métricas Prometheus
- [ ] Métricas de request duration
- [ ] Métricas de request count

---

##  Critérios de Aceite do Épico

### Ambiente de Desenvolvimento

- [ ] `docker compose up` inicia todo ambiente em < 5 min
- [ ] Hot reload funciona para API e Web
- [ ] Banco de dados acessível e com migrations
- [ ] Swagger acessível em `/api`
- [ ] Frontend acessível em `http://localhost:3000`
- [ ] API acessível em `http://localhost:3001`

### Qualidade de Código

- [ ] ESLint + Prettier configurados
- [ ] Husky + lint-staged funcionando
- [ ] Conventional commits enforçados

### Testes

- [ ] Testes unitários configurados (backend e frontend)
- [ ] Coverage threshold de 80%
- [ ] Testes de integração com containers isolados
- [ ] Playwright configurado para E2E

### CI/CD

- [ ] Pipeline roda em cada PR
- [ ] Testes paralelos
- [ ] Build de Docker funcional
- [ ] Status checks obrigatórios

### Documentação

- [ ] README com quick start
- [ ] Makefile com comandos úteis
- [ ] Arquitetura documentada

---

##  Definition of Done do Épico

- [ ] Todas as tasks concluídas
- [ ] Zero erros de lint
- [ ] Testes passando
- [ ] Coverage ≥ 80%
- [ ] Code review aprovado
- [ ] Documentação completa
- [ ] Ambiente funcional para próximo épico

---

## 📎 Referências

- [ADR-002: Stack Tecnológica](../architecture/adrs/ADR-002-stack-tecnologica.md)
- [ADR-006: CI/CD](../architecture/adrs/ADR-006-ci-cd.md)
- [ADR-007: Containerização](../architecture/adrs/ADR-007-containerizacao.md)
- [ADR-009: Estratégia de Testes](../architecture/adrs/ADR-009-estrategia-testes.md)

---

##  Timeline Sugerido

```
Semana 1:
├── TASK-001-001: Estrutura monorepo (2h)
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
├── TASK-001-013: Documentação (2h)
├── TASK-001-014: Seed (2h)
├── TASK-001-015: Logging (2h)
└── TASK-001-016: Métricas (2h)
```

**Total estimado:** ~40 horas (~2 semanas)
