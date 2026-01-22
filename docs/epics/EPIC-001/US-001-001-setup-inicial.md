# US-001-001: Setup Inicial do Projeto

##  Informações

| Campo            | Valor                    |
| ---------------- | ------------------------ |
| **ID**           | US-001-001               |
| **Épico**        | EPIC-001                 |
| **Título**       | Setup Inicial do Projeto |
| **Estimativa**   | 4 horas                  |
| **Prioridade**   | Critical               |
| **Dependências** | Nenhuma                  |
| **Status**       | Backlog               |

---

##  User Story

**Como** desenvolvedor  
**Quero** uma estrutura de monorepo configurada  
**Para** começar o desenvolvimento com padrões definidos

---

##  Objetivos

1. Criar estrutura de pastas do monorepo
2. Configurar pnpm workspaces
3. Criar arquivos de configuração base
4. Preparar estrutura para Docker

---

##  Critérios de Aceite

- [ ] Estrutura de pastas criada conforme especificado
- [ ] pnpm workspace configurado e funcionando
- [ ] package.json root com scripts básicos
- [ ] .gitignore configurado
- [ ] .env.example com variáveis documentadas
- [ ] README.md com instruções básicas

---

## 🧠 Chain of Thought (Raciocínio)

```
PASSO 1: Analisar a estrutura necessária
├── Monorepo com pnpm workspaces
├── Apps: api (NestJS) e web (Next.js)
├── Packages: shared (futuro)
├── Docker: configurações
└── Docs: documentação

PASSO 2: Definir a ordem de criação
├── 1. Criar diretórios
├── 2. Inicializar pnpm
├── 3. Configurar workspaces
├── 4. Criar arquivos de config
└── 5. Documentar

PASSO 3: Identificar dependências
├── pnpm (gerenciador de pacotes)
├── Node.js 20 (via Docker)
└── Git (versionamento)

PASSO 4: Validar resultado
├── pnpm install funciona
├── Estrutura está correta
└── Git inicializado
```

---

## 🌳 Tree of Thought (Alternativas)

```
Estrutura do Monorepo
├── Opção A: Turborepo ⭐ (escolhida futuramente)
│   ├── Prós: Cache, parallelismo
│   └── Contras: Complexidade adicional
│
├── Opção B: pnpm workspaces simples  (MVP)
│   ├── Prós: Simples, nativo
│   └── Contras: Menos features
│
└── Opção C: Lerna
    ├── Prós: Maduro
    └── Contras: Abandonado, complexo

Decisão: pnpm workspaces simples para MVP
Motivo: Simplicidade, pode evoluir para Turborepo
```

---

##  Estrutura Esperada

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
│       ├── components/
│       ├── lib/
│       └── package.json
│
├── packages/                   # Shared packages (futuro)
│   └── .gitkeep
│
├── docker/                     # Configurações Docker
│   ├── mysql/
│   ├── prometheus/
│   └── grafana/
│
├── docs/                       # Documentação (já existe)
│
├── .github/                    # GitHub Actions
│   └── workflows/
│
├── docker-compose.yml
├── docker-compose.dev.yml
├── docker-compose.test.yml
├── pnpm-workspace.yaml
├── package.json
├── .gitignore
├── .env.example
├── Makefile
└── README.md
```

---

##  Prompt para Implementação

```markdown
## Contexto

Estou criando um sistema de gestão para academia de Pilates/Fisioterapia.
Preciso configurar a estrutura inicial do monorepo.

## Princípios

- TDD (Test-Driven Development)
- DDD (Domain-Driven Design)
- 100% Docker (nada instalado localmente)
- pnpm como gerenciador de pacotes

## Tarefa

Crie a estrutura inicial do monorepo com:

1. **Estrutura de pastas:**
   - apps/api (backend NestJS - vazio por enquanto)
   - apps/web (frontend Next.js - vazio por enquanto)
   - packages/ (shared - futuro)
   - docker/ (configurações)
   - .github/workflows/

2. **Arquivos de configuração:**
   - pnpm-workspace.yaml
   - package.json (root com scripts)
   - .gitignore (Node, Docker, IDE)
   - .env.example (documentado)
   - Makefile (comandos úteis)
   - README.md (instruções)

3. **Scripts no package.json root:**
   - dev: subir ambiente
   - build: build de produção
   - test: rodar testes
   - lint: verificar código
   - format: formatar código

## Requisitos

- Use pnpm workspaces
- Prepare para Docker (apps terão Dockerfiles)
- Documente variáveis de ambiente
- Inclua comandos no Makefile

## Output Esperado

Forneça os arquivos completos com explicações.
Siga o formato: nome do arquivo → conteúdo
```

---

##  Arquivos a Criar

### 1. pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### 2. package.json (root)

```json
{
  "name": "pilates-system",
  "version": "0.0.1",
  "private": true,
  "description": "Sistema de Gestão para Academia de Pilates e Fisioterapia",
  "scripts": {
    "dev": "docker compose up",
    "dev:build": "docker compose up --build",
    "dev:down": "docker compose down",
    "dev:clean": "docker compose down -v --remove-orphans",
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "test:cov": "pnpm -r test:cov",
    "lint": "pnpm -r lint",
    "format": "pnpm -r format",
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
docker/mysql/data/
docker/redis/data/
docker/minio/data/

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
# Copie este arquivo para .env e ajuste os valores

# ---------------------------------------------
# Aplicação
# ---------------------------------------------
NODE_ENV=development
APP_PORT=3001
WEB_PORT=3000

# ---------------------------------------------
# Banco de Dados (MySQL)
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
JWT_SECRET=sua-chave-secreta-mude-em-producao
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# ---------------------------------------------
# Email (MailHog em dev)
# ---------------------------------------------
SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=

# ---------------------------------------------
# Storage (MinIO em dev, S3 em prod)
# ---------------------------------------------
S3_ENDPOINT=http://minio:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=pilates-dev
S3_REGION=us-east-1

# ---------------------------------------------
# Observabilidade (opcional em dev)
# ---------------------------------------------
SENTRY_DSN=
LOG_LEVEL=debug

# ---------------------------------------------
# Sicoob (produção apenas)
# ---------------------------------------------
SICOOB_API_URL=https://api.sicoob.com.br
SICOOB_CLIENT_ID=
SICOOB_CLIENT_SECRET=
SICOOB_CONVENIO=
SICOOB_WEBHOOK_SECRET=
```

### 5. Makefile

```makefile
.PHONY: help dev dev-build down clean logs test lint shell-api shell-web shell-mysql migrate seed

# Cores para output
CYAN := \033[36m
RESET := \033[0m

help: ## Mostra esta ajuda
	@echo "$(CYAN)Comandos disponíveis:$(RESET)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-15s$(RESET) %s\n", $$1, $$2}'

# =============================================
# DESENVOLVIMENTO
# =============================================

dev: ## Inicia ambiente de desenvolvimento
	docker compose up

dev-build: ## Inicia ambiente com rebuild das imagens
	docker compose up --build

down: ## Para todos os containers
	docker compose down

clean: ## Remove containers, volumes e imagens não utilizadas
	docker compose down -v --remove-orphans
	docker system prune -f

logs: ## Mostra logs de todos os serviços
	docker compose logs -f

logs-api: ## Mostra logs da API
	docker compose logs -f api

logs-web: ## Mostra logs do Web
	docker compose logs -f web

# =============================================
# SHELLS
# =============================================

shell-api: ## Acessa shell do container da API
	docker compose exec api sh

shell-web: ## Acessa shell do container Web
	docker compose exec web sh

shell-mysql: ## Acessa MySQL CLI
	docker compose exec mysql mysql -u pilates -ppilates pilates_dev

shell-redis: ## Acessa Redis CLI
	docker compose exec redis redis-cli

# =============================================
# BANCO DE DADOS
# =============================================

migrate: ## Roda migrations do Prisma
	docker compose exec api pnpm prisma migrate dev

migrate-prod: ## Roda migrations em produção
	docker compose exec api pnpm prisma migrate deploy

seed: ## Popula banco com dados de desenvolvimento
	docker compose exec api pnpm prisma db seed

db-reset: ## Reseta banco de dados (CUIDADO!)
	docker compose exec api pnpm prisma migrate reset --force

db-studio: ## Abre Prisma Studio
	docker compose exec api pnpm prisma studio

# =============================================
# TESTES
# =============================================

test: ## Roda todos os testes
	docker compose exec api pnpm test
	docker compose exec web pnpm test

test-watch: ## Roda testes em modo watch
	docker compose exec api pnpm test:watch

test-cov: ## Roda testes com cobertura
	docker compose exec api pnpm test:cov
	docker compose exec web pnpm test:cov

test-e2e: ## Roda testes E2E
	docker compose exec web pnpm test:e2e

test-int: ## Roda testes de integração
	docker compose exec api pnpm test:integration

# =============================================
# QUALIDADE
# =============================================

lint: ## Roda linter em todos os projetos
	docker compose exec api pnpm lint
	docker compose exec web pnpm lint

format: ## Formata código em todos os projetos
	docker compose exec api pnpm format
	docker compose exec web pnpm format

typecheck: ## Verifica tipos TypeScript
	docker compose exec api pnpm typecheck
	docker compose exec web pnpm typecheck

# =============================================
# PRODUÇÃO
# =============================================

build: ## Build de produção
	docker compose -f docker-compose.prod.yml build

deploy-staging: ## Deploy para staging
	@echo "Deploy para staging..."

deploy-prod: ## Deploy para produção
	@echo "Deploy para produção..."
```

### 6. README.md (root)

````markdown
#  Sistema de Gestão - Pilates & Fisioterapia

Sistema completo de gestão para academia de Pilates e Fisioterapia.

##  Quick Start

### Requisitos

- Docker 24+
- Docker Compose 2+
- Git

> **Nota:** Não é necessário instalar Node.js, pnpm ou qualquer outra dependência localmente. Todo o ambiente roda em Docker.

### Instalação

```bash
# 1. Clone o repositório
git clone <repo-url>
cd pilates-system

# 2. Copie as variáveis de ambiente
cp .env.example .env

# 3. Suba o ambiente
make dev
# ou
docker compose up
```
````

### Acessos

| Serviço            | URL                       |
| ------------------ | ------------------------- |
| Frontend           | http://localhost:3000     |
| API                | http://localhost:3001     |
| API Docs (Swagger) | http://localhost:3001/api |
| MailHog            | http://localhost:8025     |
| MinIO Console      | http://localhost:9001     |
| Prometheus         | http://localhost:9090     |
| Grafana            | http://localhost:3002     |

### Comandos Úteis

```bash
# Ver todos os comandos
make help

# Desenvolvimento
make dev          # Inicia ambiente
make down         # Para ambiente
make clean        # Limpa tudo

# Banco de Dados
make migrate      # Roda migrations
make seed         # Popula dados de teste
make shell-mysql  # Acessa MySQL

# Testes
make test         # Roda todos os testes
make test-cov     # Testes com cobertura
make test-e2e     # Testes E2E

# Qualidade
make lint         # Verifica código
make format       # Formata código
```

##  Estrutura do Projeto

```
├── apps/
│   ├── api/          # Backend NestJS
│   └── web/          # Frontend Next.js
├── packages/         # Shared packages
├── docker/           # Configurações Docker
├── docs/             # Documentação
└── .github/          # CI/CD
```

##  Tecnologias

- **Backend:** NestJS, TypeScript, Prisma, MySQL
- **Frontend:** Next.js 14, React, TailwindCSS
- **Infra:** Docker, GitHub Actions
- **Testes:** Jest, Testing Library, Playwright

## 📖 Documentação

- [PRD](./docs/PRD.md)
- [Arquitetura](./docs/architecture/)
- [Épicos](./docs/epics/)

##  Contribuição

1. Crie uma branch: `git checkout -b feature/nome`
2. Faça commits: `git commit -m 'feat: descrição'`
3. Push: `git push origin feature/nome`
4. Abra um Pull Request

##  Licença

Privado - Todos os direitos reservados.

```

---

##  Checklist de Verificação

Após implementar, verifique:

- [ ] Estrutura de pastas criada corretamente
- [ ] `pnpm install` funciona no root
- [ ] `.env.example` está documentado
- [ ] `make help` mostra os comandos
- [ ] README está claro e útil
- [ ] Git inicializado com .gitignore

---

##  Próxima User Story

Após concluir esta US, prossiga para:
→ [US-001-002: Estrutura do Backend](./US-001-002-estrutura-backend.md)

---

## 📎 Referências

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Monorepo Best Practices](https://monorepo.tools/)

```
