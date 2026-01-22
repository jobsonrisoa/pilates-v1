# ADR-007: Containerização e Ambiente de Desenvolvimento

**Status:** Aceito  
**Data:** 21/01/2026  
**Decisores:** Equipe de Arquitetura  
**Contexto do Debate:** [DEBATE-001](../debates/DEBATE-001-arquitetura-geral.md)

## Contexto

Requisito do cliente:

> "Tudo deve ser em Docker, nada instalado no ambiente local de desenvolvimento"

Isso implica:

- Desenvolvimento 100% containerizado
- Sem necessidade de instalar Node.js, MySQL, Redis localmente
- Ambiente consistente entre desenvolvedores
- Fácil onboarding de novos desenvolvedores

## Decisão

### Estrutura de Containers

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
│  Volumes persistentes: mysql_data, redis_data, minio_data       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Docker Compose Principal

```yaml
# docker-compose.yml
version: '3.8'

services:
  # ============================================
  # APLICAÇÕES
  # ============================================
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
      target: deps
    command: sh -c "pnpm --filter api prisma migrate dev && pnpm --filter api dev"
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
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - pilates-network
    healthcheck:
      test: ['CMD', 'wget', '-qO-', 'http://localhost:3000/health/live']
      interval: 30s
      timeout: 10s
      retries: 3

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
      target: deps
    command: pnpm --filter web dev
    volumes:
      - ./apps/web/app:/app/apps/web/app:delegated
      - ./apps/web/components:/app/apps/web/components:delegated
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
    command:
      - --default-authentication-plugin=mysql_native_password
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_unicode_ci
      - --innodb-buffer-pool-size=256M
      - --max-connections=200
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: pilates_dev
      MYSQL_USER: pilates
      MYSQL_PASSWORD: pilates
    volumes:
      - mysql_data:/var/lib/mysql
      - ./docker/mysql/init:/docker-entrypoint-initdb.d:ro
    ports:
      - '3306:3306'
    networks:
      - pilates-network
    healthcheck:
      test: ['CMD', 'mysqladmin', 'ping', '-h', 'localhost', '-u', 'root', '-proot']
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 30s

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - '6379:6379'
    networks:
      - pilates-network
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
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
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - minio_data:/data
    ports:
      - '9000:9000' # API
      - '9001:9001' # Console
    networks:
      - pilates-network
    healthcheck:
      test: ['CMD', 'mc', 'ready', 'local']
      interval: 30s
      timeout: 20s
      retries: 3

  # ============================================
  # OBSERVABILIDADE (opcional em dev)
  # ============================================
  prometheus:
    image: prom/prometheus:v2.48.0
    volumes:
      - ./docker/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus_data:/prometheus
    ports:
      - '9090:9090'
    networks:
      - pilates-network
    profiles:
      - monitoring

  grafana:
    image: grafana/grafana:10.2.0
    volumes:
      - grafana_data:/var/lib/grafana
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
  mysql_data:
  redis_data:
  minio_data:
  prometheus_data:
  grafana_data:
  api_node_modules:
  web_node_modules:
  web_next:
```

### Scripts de Desenvolvimento

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

### Makefile (alternativa aos scripts)

```makefile
# Makefile
.PHONY: help dev dev-build down clean logs test lint

help: ## Mostra esta ajuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Inicia ambiente de desenvolvimento
	docker compose up

dev-build: ## Inicia ambiente com rebuild
	docker compose up --build

down: ## Para todos os containers
	docker compose down

clean: ## Remove containers e volumes
	docker compose down -v --remove-orphans
	docker system prune -f

logs: ## Mostra logs de todos os serviços
	docker compose logs -f

logs-api: ## Mostra logs da API
	docker compose logs -f api

logs-web: ## Mostra logs do Web
	docker compose logs -f web

shell-api: ## Acessa shell da API
	docker compose exec api sh

shell-mysql: ## Acessa MySQL CLI
	docker compose exec mysql mysql -u pilates -ppilates pilates_dev

migrate: ## Roda migrations do Prisma
	docker compose exec api pnpm --filter api prisma migrate dev

seed: ## Popula banco com dados de teste
	docker compose exec api pnpm --filter api prisma db seed

test: ## Roda todos os testes
	docker compose exec api pnpm --filter api test

test-watch: ## Roda testes em modo watch
	docker compose exec api pnpm --filter api test:watch

test-cov: ## Roda testes com coverage
	docker compose exec api pnpm --filter api test:cov

lint: ## Roda linter
	docker compose exec api pnpm lint
	docker compose exec web pnpm lint
```

### VS Code Dev Container (opcional)

```json
// .devcontainer/devcontainer.json
{
  "name": "Pilates System",
  "dockerComposeFile": ["../docker-compose.yml"],
  "service": "api",
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
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "typescript.tsdk": "node_modules/typescript/lib"
      }
    }
  },

  "forwardPorts": [3000, 3001, 3306, 6379, 8025, 9000],

  "postCreateCommand": "pnpm install",

  "remoteUser": "node"
}
```

### Hot Reload

Para garantir hot reload funcionando no Docker:

```yaml
# Para API (NestJS)
api:
  volumes:
    - ./apps/api/src:/app/apps/api/src:delegated
  environment:
    CHOKIDAR_USEPOLLING: true # Necessário em alguns sistemas

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

# Email (MailHog em dev)
SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=

# Storage (MinIO em dev, S3 em prod)
S3_ENDPOINT=http://minio:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=pilates-dev
S3_REGION=us-east-1

# Sentry (opcional em dev)
SENTRY_DSN=

# API URL (para frontend)
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Onboarding de Desenvolvedor

```bash
# 1. Clonar repositório
git clone https://github.com/org/pilates-system.git
cd pilates-system

# 2. Copiar variáveis de ambiente
cp .env.example .env

# 3. Subir ambiente
make dev
# ou
docker compose up

# 4. Aguardar health checks (primeira vez pode demorar)

# 5. Acessar:
# - Frontend: http://localhost:3000
# - API: http://localhost:3001
# - API Docs: http://localhost:3001/api
# - MailHog: http://localhost:8025
# - MinIO: http://localhost:9001

# 6. Para rodar comandos:
make shell-api
# ou
docker compose exec api sh
```

## Consequências

### Positivas

-  Zero instalação local necessária
-  Ambiente consistente entre devs
-  Onboarding em minutos
-  Serviços auxiliares incluídos (mail, storage)
-  Hot reload funcionando
-  Fácil limpar e recomeçar

### Negativas

-  Docker necessário (consumo de recursos)
-  Primeira inicialização lenta
-  Debugging pode ser mais complexo

### Mitigações

- Usar `delegated` volumes para melhor performance no macOS
- Profiles para serviços opcionais (monitoring)
- VS Code Dev Containers para debugging integrado

## Referências

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [VS Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers)
- [NestJS Docker Guide](https://docs.nestjs.com/recipes/terminus)
