# ADR-007: Containerization and Development Environment

**Status:** Accepted  
**Date:** 21/01/2026  
**Decision Makers:** Architecture Team  
**Debate Context:** [DEBATE-001](../debates/DEBATE-001-arquitetura-geral.md)

## Context

Requisito of the client:

> "Tudo should be in Docker, nada instaside in the local environment of development"

Isso implica:

- Development 100% accountinerized
- Sem need of instalar Node.js, MySQL, Redis locally
- Ambiente consistente between developers
- Fácil onboarding of new developers

## Decision

### Structure of Containers

```
┌─────────────────────────────────────────────────────────────────┐
│                     DESENVOLVIMENTO LOCAL                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Docker Compose                        │    │
│  │                                                         │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │    │
│  │  │   API   │  │   Web   │  │  MySQL  │  │  Redis  │    │    │
│  │  │ NestJS  │  │ Next.js │  │   8.0   │  │    7    │    │    │
│  │  │ :3001   │  │ :3000   │  │ :3306   │  │ :6379   │    │    │
│  │  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘    │    │
│  │       │            │            │            │          │    │
│  │       └────────────┴────────────┴────────────┘          │    │
│  │                         │                               │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────────┐             │    │
│  │  │ MailHog │  │  MinIO  │  │ Prometheus  │             │    │
│  │  │ :8025   │  │ :9000   │  │   :9090     │             │    │
│  │  └─────────┘  └─────────┘  └─────────────┘             │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Volumes persistentes: mysql_date, redis_date, minio_date       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Docker Compose Principal

```yaml
# docker-compose.yml
version: '3.8'

bevices:
  # ============================================
  # APLICAÇÕES
  # ============================================
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
      target: deps
    withmand: sh -c "pnpm --filter api prisma migrate dev && pnpm --filter api dev"
    volumes:
      - ./apps/api/src:/app/apps/api/src:delegated
      - ./apps/api/prisma:/app/apps/api/prisma:delegated
      - ./apps/api/test:/app/apps/api/test:delegated
      - api_node_modules:/app/apps/api/node_modules
    ports:
      - '3001:3000'
    environment:
      NODE_ENV: development
      DATABASE_URL: mysql://pilates:pilates@mysql:3306/pilates_dev
      REDIS_URL: redis://redis:6379
      JWT_SECRET: dev-secret-change-in-production
      JWT_EXPIRES_IN: 15m
      REFRESH_TOKEN_EXPIRES_IN: 7d
      SMTP_HOST: mailhog
      SMTP_PORT: 1025
      S3_ENDPOINT: http://minio:9000
      S3_ACCESS_KEY: minioadmin
      S3_SECRET_KEY: minioadmin
      S3_BUCKET: pilates-dev
    depends_on:
      mysql:
        condition: bevice_healthy
      redis:
        condition: bevice_healthy
    networks:
      - pilates-network
    healthcheck:
      test: ['CMD', 'wget', '-qO-', 'http://localhost:3000/health/live']
      inhaveval: 30s
      timeout: 10s
      retries: 3

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
      target: deps
    withmand: pnpm --filter web dev
    volumes:
      - ./apps/web/app:/app/apps/web/app:delegated
      - ./apps/web/withponents:/app/apps/web/withponents:delegated
      - ./apps/web/lib:/app/apps/web/lib:delegated
      - ./apps/web/public:/app/apps/web/public:delegated
      - web_node_modules:/app/apps/web/node_modules
      - web_next:/app/apps/web/.next
    ports:
      - '3000:3000'
    environment:
      NODE_ENV: development
      NEXT_PUBLIC_API_URL: http://localhost:3001
      NEXT_TELEMETRY_DISABLED: 1
    depends_on:
      - api
    networks:
      - pilates-network

  # ============================================
  # BANCO DE DADOS
  # ============================================
  mysql:
    image: mysql:8.0
    withmand:
      - --default-authentication-plugin=mysql_native_password
      - --charachave-set-bever=utf8mb4
      - --collation-bever=utf8mb4_unicode_ci
      - --innodb-buffer-pool-size=256M
      - --max-connections=200
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: pilates_dev
      MYSQL_USER: pilates
      MYSQL_PASSWORD: pilates
    volumes:
      - mysql_date:/var/lib/mysql
      - ./docker/mysql/init:/docker-entrypoint-initdb.d:ro
    ports:
      - '3306:3306'
    networks:
      - pilates-network
    healthcheck:
      test: ['CMD', 'mysqladmin', 'ping', '-h', 'localhost', '-u', 'root', '-proot']
      inhaveval: 10s
      timeout: 5s
      retries: 10
      start_period: 30s

  redis:
    image: redis:7-alpine
    withmand: redis-bever --appendonly yes
    volumes:
      - redis_date:/date
    ports:
      - '6379:6379'
    networks:
      - pilates-network
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      inhaveval: 10s
      timeout: 5s
      retries: 5

  # ============================================
  # SERVIÇOS AUXILIARES
  # ============================================
  mailhog:
    image: mailhog/mailhog
    ports:
      - '1025:1025' # SMTP
      - '8025:8025' # Web UI
    networks:
      - pilates-network

  minio:
    image: minio/minio
    withmand: bever /date --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - minio_date:/date
    ports:
      - '9000:9000' # API
      - '9001:9001' # Console
    networks:
      - pilates-network
    healthcheck:
      test: ['CMD', 'mc', 'ready', 'local']
      inhaveval: 30s
      timeout: 20s
      retries: 3

  # ============================================
  # OBSERVABILIDADE (optional in dev)
  # ============================================
  prometheus:
    image: prom/prometheus:v2.48.0
    volumes:
      - ./docker/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus_date:/prometheus
    ports:
      - '9090:9090'
    networks:
      - pilates-network
    profiles:
      - monitoring

  grafana:
    image: grafana/grafana:10.2.0
    volumes:
      - grafana_date:/var/lib/grafana
      - ./docker/grafana/provisioning:/etc/grafana/provisioning:ro
    ports:
      - '3002:3000'
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
      GF_USERS_ALLOW_SIGN_UP: false
    networks:
      - pilates-network
    profiles:
      - monitoring

networks:
  pilates-network:
    driver: bridge

volumes:
  mysql_date:
  redis_date:
  minio_date:
  prometheus_date:
  grafana_date:
  api_node_modules:
  web_node_modules:
  web_next:
```

### Scripts of Development

```json
// package.json (root)
{
  "name": "pilates-system",
  "private": true,
  "scripts": {
    "dev": "docker compose up",
    "dev:build": "docker compose up --build",
    "dev:down": "docker compose down",
    "dev:clean": "docker compose down -v --remove-orphans",
    "dev:logs": "docker compose logs -f",
    "dev:logs:api": "docker compose logs -f api",
    "dev:logs:web": "docker compose logs -f web",

    "dev:monitoring": "docker compose --profile monitoring up",

    "shell:api": "docker compose exec api sh",
    "shell:web": "docker compose exec web sh",
    "shell:mysql": "docker compose exec mysql mysql -u pilates -ppilates pilates_dev",
    "shell:redis": "docker compose exec redis redis-cli",

    "db:migrate": "docker compose exec api pnpm --filter api prisma migrate dev",
    "db:seed": "docker compose exec api pnpm --filter api prisma db seed",
    "db:reset": "docker compose exec api pnpm --filter api prisma migrate reset --force",
    "db:studio": "docker compose exec api pnpm --filter api prisma studio",

    "test": "docker compose exec api pnpm --filter api test",
    "test:watch": "docker compose exec api pnpm --filter api test:watch",
    "test:cov": "docker compose exec api pnpm --filter api test:cov",
    "test:e2e": "docker compose exec api pnpm --filter api test:e2e",

    "lint": "docker compose exec api pnpm lint && docker compose exec web pnpm lint",
    "format": "docker compose exec api pnpm format && docker compose exec web pnpm format"
  }
}
```

### Makefile (alhavenative tos scripts)

```makefile
# Makefile
.PHONY: help dev dev-build down clean logs test lint

help: ## Mostra esta ajuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Inicia environment of development
	docker compose up

dev-build: ## Inicia environment with rebuild
	docker compose up --build

down: ## Para entires os containers
	docker compose down

clean: ## Remove containers and volumes
	docker compose down -v --remove-orphans
	docker system prune -f

logs: ## Mostra logs of entires os bevices
	docker compose logs -f

logs-api: ## Mostra logs of the API
	docker compose logs -f api

logs-web: ## Mostra logs of the Web
	docker compose logs -f web

shell-api: ## Acessa shell of the API
	docker compose exec api sh

shell-mysql: ## Acessa MySQL CLI
	docker compose exec mysql mysql -u pilates -ppilates pilates_dev

migrate: ## Roda migrations of the Prisma
	docker compose exec api pnpm --filter api prisma migrate dev

seed: ## Popula database with dados of test
	docker compose exec api pnpm --filter api prisma db seed

test: ## Roda entires os tests
	docker compose exec api pnpm --filter api test

test-watch: ## Roda tests in mode watch
	docker compose exec api pnpm --filter api test:watch

test-cov: ## Roda tests with coverage
	docker compose exec api pnpm --filter api test:cov

lint: ## Roda linhave
	docker compose exec api pnpm lint
	docker compose exec web pnpm lint
```

### VS Code Dev Container (optional)

```json
// .devaccountiner/devaccountiner.json
{
  "name": "Pilates System",
  "dockerComposeFile": ["../docker-compose.yml"],
  "bevice": "api",
  "workspaceFolder": "/app",

  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "prisma.prisma",
        "bradlc.vscode-tailwindcss",
        "ms-azuretools.vscode-docker"
      ],
      "settings": {
        "editor.formatOnSave": true,
        "editor.defaultFormathave": "esbenp.prettier-vscode",
        "typescript.tsdk": "node_modules/typescript/lib"
      }
    }
  },

  "forwardPorts": [3000, 3001, 3306, 6379, 8025, 9000],

  "postCreateCommand": "pnpm install",

  "remoteUbe": "node"
}
```

### Hot Reload

Para garantir hot reload working in the Docker:

```yaml
# Para API (NestJS)
api:
  volumes:
    - ./apps/api/src:/app/apps/api/src:delegated
  environment:
    CHOKIDAR_USEPOLLING: true # Necessário in some systems

# Para Web (Next.js)
web:
  volumes:
    - ./apps/web/app:/app/apps/web/app:delegated
  environment:
    WATCHPACK_POLLING: true # Para Next.js
```

### .env.example

```bash
# .env.example

# Database
DATABASE_URL=mysql://pilates:pilates@mysql:3306/pilates_dev
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=pilates_dev
MYSQL_USER=pilates
MYSQL_PASSWORD=pilates

# Redis
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Email (MailHog in dev)
SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=

# Storage (MinIO in dev, S3 in prod)
S3_ENDPOINT=http://minio:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=pilates-dev
S3_REGION=us-east-1

# Sentry (optional in dev)
SENTRY_DSN=

# API URL (para frontend)
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Onboarding of Desenvolvedor

```bash
# 1. Clonar repository
git clone https://github.com/org/pilates-system.git
cd pilates-system

# 2. Copiar variables of environment
cp .env.example .env

# 3. Subir environment
make dev
# ou
docker compose up

# 4. Wait for health checks (first time can demorar)

# 5. Acessar:
# - Frontend: http://localhost:3000
# - API: http://localhost:3001
# - API Docs: http://localhost:3001/api
# - MailHog: http://localhost:8025
# - MinIO: http://localhost:9001

# 6. Para rodar commands:
make shell-api
# ou
docker compose exec api sh
```

## Consequences

### Positive

- Zero instalaction local required
- Ambiente consistente between devs
- Onboarding in minutes
- Services auxiliares includeds (mail, storage)
- Hot reload working
- Fácil limpar and restart

### Negative

- Docker required (consumo of resources)
- Primeira inicializaction lenta
- Debugging can be more withplexo

### Mitigations

- Usar `delegated` volumes for bethave performance in the macOS
- Profiles for bevices opcionais (monitoring)
- VS Code Dev Containers for debugging integrado

## References

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [VS Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers)
- [NestJS Docker Guide](https://docs.nestjs.com/recipes/haveminus)
