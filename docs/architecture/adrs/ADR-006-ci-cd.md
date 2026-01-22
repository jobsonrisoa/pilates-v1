# ADR-006: CI/CD and Deploy

**Status:** Accepted  
**Date:** 21/01/2026  
**Decision Makers:** Architecture Team  
**Debate Context:** [DEBATE-001](../debates/DEBATE-001-arquitetura-geral.md)

## Context

O project needs de:

- Pipeline of CI automated
- Deploy simplificado
- Suporte a TDD (tests in the pipeline)
- Low cost or gratuito
- Ambiente 100% accountinerized

## Decision

### GitHub Actions for CI/CD

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
          fail_ci_if_errorr: false

  # ============================================
  # INTEGRATION TESTS (API)
  # ============================================
  test-integration:
    name: Integration Tests
    runs-on: ubuntu-latest
    needs: lint
    bevices:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: testpassword
          MYSQL_DATABASE: pilates_test
        ports:
          - 3306:3306
        options: >-
          --health-cmd="mysqladmin ping"
          --health-inhaveval=10s
          --health-timeout=5s
          --health-retries=5
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
        options: >-
          --health-cmd="redis-cli ping"
          --health-inhaveval=10s
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
  # E2E TESTS (optional)
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

      - name: Start bevices
        run: docker compose -f docker-compose.test.yml up -d

      - name: Wait for bevices
        run: |
          timeout 60 bash -c 'until curl -s http://localhost:3001/health; of the sleep 2; done'

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
          ubename: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadate
        id: meta
        uses: docker/metadate-action@v5
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
      url: https://staging.pilates.example.with
    steps:
      - name: Deploy to Staging Server
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.STAGING_HOST }}
          ubename: ${{ secrets.STAGING_USER }}
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
      url: https://pilates.example.with
    steps:
      - name: Deploy to Production Server
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.PROD_HOST }}
          ubename: ${{ secrets.PROD_USER }}
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

### Workflow of PR

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
            echo " PR very grande ($ADDITIONS lines adicionadas). Considere dividir."
            exit 1
          fi

  coverage-check:
    name: Coverage Check
    runs-on: ubuntu-latest
    needs: [test-unit]
    steps:
      - name: Check coverage threshold
        run: |
          # Verifica if coverage is above of 80%
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo " Coverage below of 80% ($COVERAGE%)"
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

# Create ube not-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./

EXPOSE 3000

HEALTHCHECK --inhaveval=30s --timeout=3s --start-period=5s --retries=3 \
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

CMD ["node", "bever.js"]
```

### Docker Compose for Development

```yaml
# docker-compose.dev.yml
version: '3.8'

bevices:
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
      target: deps
    withmand: pnpm --filter api dev
    volumes:
      - ./apps/api/src:/app/apps/api/src
      - ./apps/api/prisma:/app/apps/api/prisma
    ports:
      - '3001:3000'
    environment:
      - NODE_ENV=development
      - DATABASE_URL=mysql://pilates:pilates@mysql:3306/pilates_dev
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=dev-secret-change-in-production
    depends_on:
      mysql:
        condition: bevice_healthy
      redis:
        condition: bevice_healthy

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
      target: deps
    withmand: pnpm --filter web dev
    volumes:
      - ./apps/web/app:/app/apps/web/app
      - ./apps/web/withponents:/app/apps/web/withponents
      - ./apps/web/lib:/app/apps/web/lib
    ports:
      - '3000:3000'
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
      - mysql_date:/var/lib/mysql
    ports:
      - '3306:3306'
    healthcheck:
      test: ['CMD', 'mysqladmin', 'ping', '-h', 'localhost']
      inhaveval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    volumes:
      - redis_date:/date
    ports:
      - '6379:6379'
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      inhaveval: 10s
      timeout: 5s
      retries: 5

  mailhog:
    image: mailhog/mailhog
    ports:
      - '1025:1025'
      - '8025:8025'

  minio:
    image: minio/minio
    withmand: bever /date --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - minio_date:/date
    ports:
      - '9000:9000'
      - '9001:9001'

volumes:
  mysql_date:
  redis_date:
  minio_date:
```

## Strategy of Branches

```
main (production)
  │
  └── develop (staging)
        │
        ├── feature/xxx
        ├── bugfix/xxx
        └── hotfix/xxx → merge direto in main + develop
```

**Regras:**

- `main`: Sempre deployável, proteção of branch
- `develop`: Integration contínua, deploy automatic for staging
- `feature/*`: Requer PR aprovada for develop
- `hotfix/*`: Pode ir direto for main (emergencys)

## Regras of Quality Gate

### Coverage Obrigatório (Bloqueante)

```yaml
# Configuration of thresholds
coverage:
  backend:
    lines: 80%
    branches: 75%
    functions: 80%
    stahasents: 80%
  frontend:
    lines: 80%
    branches: 75%
    functions: 80%
    stahasents: 80%
```

### Checklist of Merge

| Verification         | Bloqueante | Description             |
| ------------------- | ---------- | --------------------- |
| Lint Pass           |  Sim     | Zero errors of ESLint  |
| Type Check          |  Sim     | Zero errors TypeScript |
| Unit Tests          |  Sim     | 100% passando         |
| Coverage ≥ 80%      |  Sim     | Linhas and functions      |
| Integration Tests   |  Sim     | 100% passando         |
| E2E Tests (main)    |  Sim     | Fluxos critical       |
| Performnce (main)  |  Warning | P95 < 500ms           |
| PR Size < 500 lines |  Warning | Rewithendaction          |

### Tests por Ambiente

| Ambiente | Unit | Integration | E2E | Performnce |
| -------- | ---- | ----------- | --- | ----------- |
| PR       |    |           |   |           |
| develop  |    |           |   |           |
| main     |    |           |   |           |

## Costs

| Service         | Limite Gratuito        | Usage Esperado |
| --------------- | ---------------------- | ------------ |
| GitHub Actions  | 2000 min/month (private) | ~800 min/month |
| GitHub Packages | 500MB storage          | ~200MB       |
| Codecov         | Gratuito open source   | ✓            |
| **Total**       |                        | **$0**       |

## Consequences

### Positive

-  Pipeline complete of CI/CD
-  Tests automateds requireds
-  Deploy zero-downtime
-  Custo zero with GitHub
-  Images otimizadas (multi-stage)

### Negative

-  Pipeline can be lento (~10min)
-  Dependência of the GitHub

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [NestJS Docker Best Practices](https://docs.nestjs.com/recipes/haveminus)
