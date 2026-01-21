# ADR-006: CI/CD e Deploy

**Status:** Aceito  
**Data:** 21/01/2026  
**Decisores:** Equipe de Arquitetura  
**Contexto do Debate:** [DEBATE-001](../debates/DEBATE-001-arquitetura-geral.md)

## Contexto

O projeto precisa de:
- Pipeline de CI automatizado
- Deploy simplificado
- Suporte a TDD (testes no pipeline)
- Custo baixo ou gratuito
- Ambiente 100% containerizado

## Decisão

### GitHub Actions para CI/CD

**Pipeline Principal:**
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # ============================================
  # LINT & TYPE CHECK
  # ============================================
  lint:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Run ESLint
        run: pnpm lint
        
      - name: Run Type Check
        run: pnpm typecheck

  # ============================================
  # UNIT TESTS
  # ============================================
  test-unit:
    name: Unit Tests
    runs-on: ubuntu-latest
    needs: lint
    strategy:
      matrix:
        app: [api, web]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Run Unit Tests
        run: pnpm --filter ${{ matrix.app }} test:unit
        
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./apps/${{ matrix.app }}/coverage/lcov.info
          flags: ${{ matrix.app }}-unit
          fail_ci_if_error: false

  # ============================================
  # INTEGRATION TESTS (API)
  # ============================================
  test-integration:
    name: Integration Tests
    runs-on: ubuntu-latest
    needs: lint
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: testpassword
          MYSQL_DATABASE: pilates_test
        ports:
          - 3306:3306
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=5
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
        options: >-
          --health-cmd="redis-cli ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=5
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Generate Prisma Client
        run: pnpm --filter api prisma generate
        
      - name: Run Migrations
        run: pnpm --filter api prisma migrate deploy
        env:
          DATABASE_URL: mysql://root:testpassword@localhost:3306/pilates_test
          
      - name: Run Integration Tests
        run: pnpm --filter api test:integration
        env:
          DATABASE_URL: mysql://root:testpassword@localhost:3306/pilates_test
          REDIS_URL: redis://localhost:6379
          JWT_SECRET: test-secret-key-for-ci
          
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./apps/api/coverage/lcov.info
          flags: api-integration

  # ============================================
  # E2E TESTS (opcional)
  # ============================================
  test-e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: [test-unit, test-integration]
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Install Playwright
        run: pnpm --filter web exec playwright install --with-deps chromium
        
      - name: Start services
        run: docker compose -f docker-compose.test.yml up -d
        
      - name: Wait for services
        run: |
          timeout 60 bash -c 'until curl -s http://localhost:3001/health; do sleep 2; done'
          
      - name: Run E2E Tests
        run: pnpm --filter web test:e2e
        
      - name: Upload Playwright Report
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: apps/web/playwright-report/

  # ============================================
  # BUILD & PUSH DOCKER
  # ============================================
  build:
    name: Build Docker Images
    runs-on: ubuntu-latest
    needs: [test-unit, test-integration]
    if: github.event_name == 'push'
    permissions:
      contents: read
      packages: write
    strategy:
      matrix:
        app: [api, web]
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
        
      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-${{ matrix.app }}
          tags: |
            type=ref,event=branch
            type=sha,prefix=
            type=raw,value=latest,enable={{is_default_branch}}
            
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./apps/${{ matrix.app }}/Dockerfile
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # ============================================
  # DEPLOY STAGING
  # ============================================
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.pilates.example.com
    steps:
      - name: Deploy to Staging Server
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USER }}
          key: ${{ secrets.STAGING_SSH_KEY }}
          script: |
            cd /opt/pilates
            docker compose pull
            docker compose up -d --remove-orphans
            docker system prune -f

  # ============================================
  # DEPLOY PRODUCTION
  # ============================================
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://pilates.example.com
    steps:
      - name: Deploy to Production Server
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.PROD_SSH_KEY }}
          script: |
            cd /opt/pilates
            docker compose pull
            docker compose up -d --remove-orphans
            docker system prune -f
            
      - name: Notify Sentry of Release
        uses: getsentry/action-release@v1
        env:
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
          SENTRY_ORG: pilates
          SENTRY_PROJECT: api
        with:
          environment: production
          version: ${{ github.sha }}
```

### Workflow de PR

```yaml
# .github/workflows/pr-check.yml
name: PR Check

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  size-check:
    name: PR Size Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          
      - name: Check PR size
        run: |
          ADDITIONS=$(git diff --numstat origin/${{ github.base_ref }}...HEAD | awk '{s+=$1} END {print s}')
          if [ "$ADDITIONS" -gt 500 ]; then
            echo "⚠️ PR muito grande ($ADDITIONS linhas adicionadas). Considere dividir."
            exit 1
          fi

  coverage-check:
    name: Coverage Check
    runs-on: ubuntu-latest
    needs: [test-unit]
    steps:
      - name: Check coverage threshold
        run: |
          # Verifica se coverage está acima de 80%
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "❌ Coverage abaixo de 80% ($COVERAGE%)"
            exit 1
          fi
```

### Dockerfiles

```dockerfile
# apps/api/Dockerfile
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@8 --activate
WORKDIR /app

# Dependencies
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
RUN pnpm fetch

COPY . .
RUN pnpm install --offline --frozen-lockfile

# Build
FROM deps AS builder
RUN pnpm --filter api prisma generate
RUN pnpm --filter api build

# Production
FROM node:20-alpine AS runner
RUN corepack enable && corepack prepare pnpm@8 --activate
WORKDIR /app

ENV NODE_ENV=production

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health/live || exit 1

CMD ["node", "dist/main.js"]
```

```dockerfile
# apps/web/Dockerfile
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@8 --activate
WORKDIR /app

# Dependencies
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
RUN pnpm fetch

COPY . .
RUN pnpm install --offline --frozen-lockfile

# Build
FROM deps AS builder
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter web build

# Production
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app/apps/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose para Desenvolvimento

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
      target: deps
    command: pnpm --filter api dev
    volumes:
      - ./apps/api/src:/app/apps/api/src
      - ./apps/api/prisma:/app/apps/api/prisma
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=mysql://pilates:pilates@mysql:3306/pilates_dev
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=dev-secret-change-in-production
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_healthy

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
      target: deps
    command: pnpm --filter web dev
    volumes:
      - ./apps/web/app:/app/apps/web/app
      - ./apps/web/components:/app/apps/web/components
      - ./apps/web/lib:/app/apps/web/lib
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL=http://localhost:3001

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: pilates_dev
      MYSQL_USER: pilates
      MYSQL_PASSWORD: pilates
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  mailhog:
    image: mailhog/mailhog
    ports:
      - "1025:1025"
      - "8025:8025"

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"

volumes:
  mysql_data:
  redis_data:
  minio_data:
```

## Estratégia de Branches

```
main (produção)
  │
  └── develop (staging)
        │
        ├── feature/xxx
        ├── bugfix/xxx
        └── hotfix/xxx → merge direto em main + develop
```

**Regras:**
- `main`: Sempre deployável, proteção de branch
- `develop`: Integração contínua, deploy automático para staging
- `feature/*`: Requer PR aprovada para develop
- `hotfix/*`: Pode ir direto para main (emergências)

## Regras de Quality Gate

### Coverage Obrigatório (Bloqueante)

```yaml
# Configuração de thresholds
coverage:
  backend:
    lines: 80%
    branches: 75%
    functions: 80%
    statements: 80%
  frontend:
    lines: 80%
    branches: 75%
    functions: 80%
    statements: 80%
```

### Checklist de Merge

| Verificação | Bloqueante | Descrição |
|-------------|------------|-----------|
| Lint Pass | ✅ Sim | Zero erros de ESLint |
| Type Check | ✅ Sim | Zero erros TypeScript |
| Unit Tests | ✅ Sim | 100% passando |
| Coverage ≥ 80% | ✅ Sim | Linhas e funções |
| Integration Tests | ✅ Sim | 100% passando |
| E2E Tests (main) | ✅ Sim | Fluxos críticos |
| Performance (main) | ⚠️ Warning | P95 < 500ms |
| PR Size < 500 lines | ⚠️ Warning | Recomendação |

### Testes por Ambiente

| Ambiente | Unit | Integration | E2E | Performance |
|----------|------|-------------|-----|-------------|
| PR | ✅ | ✅ | ❌ | ❌ |
| develop | ✅ | ✅ | ✅ | ❌ |
| main | ✅ | ✅ | ✅ | ✅ |

## Custos

| Serviço | Limite Gratuito | Uso Esperado |
|---------|-----------------|--------------|
| GitHub Actions | 2000 min/mês (privado) | ~800 min/mês |
| GitHub Packages | 500MB storage | ~200MB |
| Codecov | Gratuito open source | ✓ |
| **Total** | | **$0** |

## Consequências

### Positivas
- ✅ Pipeline completo de CI/CD
- ✅ Testes automatizados obrigatórios
- ✅ Deploy zero-downtime
- ✅ Custo zero com GitHub
- ✅ Images otimizadas (multi-stage)

### Negativas
- ⚠️ Pipeline pode ser lento (~10min)
- ⚠️ Dependência do GitHub

## Referências

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [NestJS Docker Best Practices](https://docs.nestjs.com/recipes/terminus)

