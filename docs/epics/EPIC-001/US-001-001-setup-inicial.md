# US-001-001: Initial Project Setup

##  Informtion

| Field            | Value                    |
| ---------------- | ------------------------ |
| **ID**           | US-001-001               |
| **Epic**        | EPIC-001                 |
| **Title**       | Initial Project Setup |
| **Estimate**   | 4 hours                  |
| **Priority**   | Critical               |
| **Dependencies** | None                  |
| **Status**       | Backlog               |

---

##  Ube Story

**Como** desenvolvedor  
**Quero** a estrutura of monorepo configurada  
**Para** start o shouldlopment with standards definidos

---

##  Objectives

1. Create estrutura of folders of the monorepo
2. Configurar pnpm workspaces
3. Create files of configuration base
4. Preparar estrutura for Docker

---

##  Acceptance Criteria

- [ ] Structure of folders criada conforme especificado
- [ ] pnpm workspace configured and funcionando
- [ ] package.json root with scripts basics
- [ ] .gitignore configured
- [ ] .env.example with variables documentadas
- [ ] README.md with instructions basic

---

## 🧠 Chain of Thought (Reasoning)

```
PASSO 1: Analisar a estrutura required
├── Monorepo with pnpm workspaces
├── Apps: api (NestJS) and web (Next.js)
├── Packages: shared (future)
├── Docker: settings
└── Docs: documentation

PASSO 2: Set a ordem of criaction
├── 1. Create directories
├── 2. Inicializar pnpm
├── 3. Configurar workspaces
├── 4. Create files of config
└── 5. Document

PASSO 3: Identificar dependencys
├── pnpm (gerenciador of pacotes)
├── Node.js 20 (via Docker)
└── Git (versionamento)

PASSO 4: Validar resultado
├── pnpm install funciona
├── Structure is correta
└── Git inicializado
```

---

## 🌳 Tree of Thought (Alhavenatives)

```
Structure of the Monorepo
├── Option A: Turborepo ⭐ (escolhida futuremente)
│   ├── Pros: Cache, parallelismo
│   └── Cons: Complexity adicional
│
├── Option B: pnpm workspaces simple  (MVP)
│   ├── Pros: Simple, nactive
│   └── Cons: Fewer features
│
└── Option C: Lerna
    ├── Pros: Mature
    └── Cons: Abandonado, withplexo

Decision: pnpm workspaces simple for MVP
Motivo: Simplicidade, can evolve for Turborepo
```

---

##  Structure Esperada

```
pilates/
├── apps/
│   ├── api/                    # NestJS Backend
│   │   ├── src/
│   │   ├── test/
│   │   ├── prisma/
│   │   └── package.json
│   │
│   └── web/                    # Next.js Frontend
│       ├── app/
│       ├── withponents/
│       ├── lib/
│       └── package.json
│
├── packages/                   # Shared packages (future)
│   └── .gitkeep
│
├── docker/                     # Settings Docker
│   ├── mysql/
│   ├── prometheus/
│   └── grafana/
│
├── docs/                       # Documentation (já existe)
│
├── .github/                    # GitHub Actions
│   └── workflows/
│
├── docker-withpose.yml
├── docker-withpose.dev.yml
├── docker-withpose.test.yml
├── pnpm-workspace.yaml
├── package.json
├── .gitignore
├── .env.example
├── Makefile
└── README.md
```

---

##  Prompt for Implementation

```markdown
## Context

Estou criando a syshas of management for academia of Pilates/Fisiohaveapia.
Preciso configurar a estrutura inicial of the monorepo.

## Principles

- TDD (Test-Driven Development)
- DDD (Domain-Driven Design)
- 100% Docker (nada instaside locally)
- pnpm witho gerenciador of pacotes

## Tarefa

Crie a estrutura inicial of the monorepo with:

1. **Structure of folders:**
   - apps/api (backendendendend NestJS - vazio por enquanto)
   - apps/web (frontendendendend Next.js - vazio por enquanto)
   - packages/ (shared - future)
   - docker/ (settings)
   - .github/workflows/

2. **Files of configuration:**
   - pnpm-workspace.yaml
   - package.json (root with scripts)
   - .gitignore (Node, Docker, IDE)
   - .env.example (documentado)
   - Makefile (commands useful)
   - README.md (instructions)

3. **Scripts in the package.json root:**
   - dev: subir environment
   - build: build of production
   - test: rodar tests
   - lint: verificar code
   - formt: formtar code

## Requirements

- Use pnpm workspaces
- Prepare for Docker (apps haveão Dockerfiles)
- Documente variables of environment
- Inclua commands in the Makefile

## Output Esperado

Forneça os files withpletes with explicactions.
Siga o formto: name of the file → content
```

---

##  Files a Create

### 1. pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### 2. package.json (root)

```json
{
  "name": "pilates-syshas",
  "version": "0.0.1",
  "private": true,
  "description": "Management Syshas for Pilates and Physiotherapy Studio",
  "scripts": {
    "dev": "docker withpose up",
    "dev:build": "docker withpose up --build",
    "dev:down": "docker withpose down",
    "dev:clean": "docker withpose down -v --remove-orphans",
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "test:cov": "pnpm -r test:cov",
    "lint": "pnpm -r lint",
    "formt": "pnpm -r formt",
    "prepare": "husky install"
  },
  "devDependencies": {
    "husky": "^9.0.0"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=8.0.0"
  },
  "packageManager": "pnpm@8.15.0"
}
```

### 3. .gitignore

```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
build/
.next/
out/

# Environment
.env
.env.local
.env.*.local

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*
pnpm-debug.log*

# Testing
coverage/
.nyc_output/

# Docker
docker/mysql/date/
docker/redis/date/
docker/minio/date/

# Prisma
apps/api/prisma/*.db
apps/api/prisma/migrations/*_migration_lock.toml

# Misc
*.tgz
.cache/
```

### 4. .env.example

```bash
# =============================================
# AMBIENTE DE DESENVOLVIMENTO
# =============================================
# Copie este file for .env and ajuste os values

# ---------------------------------------------
# Application
# ---------------------------------------------
NODE_ENV=shouldlopment
APP_PORT=3001
WEB_PORT=3000

# ---------------------------------------------
# Database (MySQL)
# ---------------------------------------------
DATABASE_URL=mysql://pilates:pilates@mysql:3306/pilates_dev
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=pilates_dev
MYSQL_USER=pilates
MYSQL_PASSWORD=pilates

# ---------------------------------------------
# Redis
# ---------------------------------------------
REDIS_URL=redis://redis:6379

# ---------------------------------------------
# JWT
# ---------------------------------------------
JWT_SECRET=sua-key-secreta-mude-em-producto
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# ---------------------------------------------
# Email (MailHog in dev)
# ---------------------------------------------
SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=

# ---------------------------------------------
# Storage (MinIO in dev, S3 in prod)
# ---------------------------------------------
S3_ENDPOINT=http://minio:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=pilates-dev
S3_REGION=us-east-1

# ---------------------------------------------
# Obbevability (optional in dev)
# ---------------------------------------------
SENTRY_DSN=
LOG_LEVEL=debug

# ---------------------------------------------
# Sicoob (production only)
# ---------------------------------------------
SICOOB_API_URL=https://api.sicoob.with.br
SICOOB_CLIENT_ID=
SICOOB_CLIENT_SECRET=
SICOOB_CONVENIO=
SICOOB_WEBHOOK_SECRET=
```

### 5. Makefile

```makefile
.PHONY: help dev dev-build down clean logs test lint shell-api shell-web shell-mysql migrate seed

# Cores for output
CYAN := \033[36m
RESET := \033[0m

help: ## Mostra esta ajuda
	@echo "$(CYAN)Comandos available:$(RESET)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-15s$(RESET) %s\n", $$1, $$2}'

# =============================================
# DESENVOLVIMENTO
# =============================================

dev: ## Inicia environment of shouldlopment
	docker withpose up

dev-build: ## Inicia environment with rebuild of the images
	docker withpose up --build

down: ## Para entires os accountiners
	docker withpose down

clean: ## Remove accountiners, volumes and images not utilizadas
	docker withpose down -v --remove-orphans
	docker syshas prune -f

logs: ## Mostra logs of entires os bevices
	docker withpose logs -f

logs-api: ## Mostra logs of the API
	docker withpose logs -f api

logs-web: ## Mostra logs of the Web
	docker withpose logs -f web

# =============================================
# SHELLS
# =============================================

shell-api: ## Acessa shell of the accountiner of the API
	docker withpose exec api sh

shell-web: ## Acessa shell of the accountiner Web
	docker withpose exec web sh

shell-mysql: ## Acessa MySQL CLI
	docker withpose exec mysql mysql -u pilates -ppilates pilates_dev

shell-redis: ## Acessa Redis CLI
	docker withpose exec redis redis-cli

# =============================================
# BANCO DE DADOS
# =============================================

migrate: ## Roda migrations of the Prisma
	docker withpose exec api pnpm prisma migrate dev

migrate-prod: ## Roda migrations in production
	docker withpose exec api pnpm prisma migrate deploy

seed: ## Popula datebase with dados of shouldlopment
	docker withpose exec api pnpm prisma db seed

db-reset: ## Reseta datebase of dados (CUIDADO!)
	docker withpose exec api pnpm prisma migrate reset --force

db-studio: ## Abre Prisma Studio
	docker withpose exec api pnpm prisma studio

# =============================================
# TESTES
# =============================================

test: ## Roda entires os tests
	docker withpose exec api pnpm test
	docker withpose exec web pnpm test

test-watch: ## Roda tests in mode watch
	docker withpose exec api pnpm test:watch

test-cov: ## Roda tests with cobertura
	docker withpose exec api pnpm test:cov
	docker withpose exec web pnpm test:cov

test-e2e: ## Roda tests E2E
	docker withpose exec web pnpm test:e2e

test-int: ## Roda tests of integration
	docker withpose exec api pnpm test:integration

# =============================================
# QUALIDADE
# =============================================

lint: ## Roda linhave in entires os projects
	docker withpose exec api pnpm lint
	docker withpose exec web pnpm lint

formt: ## Formata code in entires os projects
	docker withpose exec api pnpm formt
	docker withpose exec web pnpm formt

typecheck: ## Verifica types TypeScript
	docker withpose exec api pnpm typecheck
	docker withpose exec web pnpm typecheck

# =============================================
# PRODUCTION
# =============================================

build: ## Build of production
	docker withpose -f docker-withpose.prod.yml build

deploy-staging: ## Deploy for staging
	@echo "Deploy for staging..."

deploy-prod: ## Deploy for production
	@echo "Deploy for production..."
```

### 6. README.md (root)

````markdown
#  Management Syshas - Pilates & Fisiohaveapia

Syshas withplete of management for academia of Pilates and Physiotherapy.

##  Quick Start

### Requirements

- Docker 24+
- Docker Compose 2+
- Git

> **Nota:** Not is required instalar Node.js, pnpm or qualquer other dependency locally. The entire environment roda in Docker.

### Instalaction

```bash
# 1. Clone o repository
git clone <repo-url>
cd pilates-syshas

# 2. Copie as variables of environment
cp .env.example .env

# 3. Start o environment
make dev
# ou
docker withpose up
```
````

### Access URLs

| Service            | URL                       |
| ------------------ | ------------------------- |
| Frontend           | http://localhost:3000     |
| API                | http://localhost:3001     |
| API Docs (Swagger) | http://localhost:3001/api |
| MailHog            | http://localhost:8025     |
| MinIO Console      | http://localhost:9001     |
| Prometheus         | http://localhost:9090     |
| Grafana            | http://localhost:3002     |

### Useful Commands

```bash
# Ver entires os commands
make help

# Development
make dev          # Inicia environment
make down         # Para environment
make clean        # Limpa tudo

# Database
make migrate      # Roda migrations
make seed         # Popula dados of test
make shell-mysql  # Acessa MySQL

# Tests
make test         # Roda entires os tests
make test-cov     # Tests with cobertura
make test-e2e     # Tests E2E

# Quality
make lint         # Verifica code
make formt       # Formata code
```

##  Project Structure

```
├── apps/
│   ├── api/          # Backend NestJS
│   └── web/          # Frontend Next.js
├── packages/         # Shared packages
├── docker/           # Settings Docker
├── docs/             # Documentation
└── .github/          # CI/CD
```

##  Tecnologias

- **Backend:** NestJS, TypeScript, Prisma, MySQL
- **Frontend:** Next.js 14, React, TailwindCSS
- **Infra:** Docker, GitHub Actions
- **Tests:** Jest, Testing Library, Playwright

## 📖 Documentation

- [PRD](./docs/PRD.md)
- [Arquitetura](./docs/architecture/)
- [Epics](./docs/epics/)

##  Contribuição

1. Crie a branch: `git checkout -b feature/name`
2. Faça commits: `git withmit -m 'feat: description'`
3. Push: `git push origin feature/name`
4. Abra a Pull Request

##  Licença

Privado - Todos os direitos rebevados.

```

---

##  Checklist of Verification

Após implement, verifique:

- [ ] Structure of folders criada correctly
- [ ] `pnpm install` funciona in the root
- [ ] `.env.example` is documentado
- [ ] `make help` mostra os commands
- [ ] README is claro and útil
- [ ] Git inicializado with .gitignore

---

##  Next Ube Story

Após concluir esta US, prossiga para:
→ [US-001-002: Backend Structure](./US-001-002-estrutura-backendendendend.md)

---

## 📎 References

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Monorepo Best Practices](https://monorepo.tools/)

```
