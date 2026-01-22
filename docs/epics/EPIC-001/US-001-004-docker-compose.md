# US-001-004: Docker Compose Completo

##  Informtion

| Field            | Value                   |
| ---------------- | ----------------------- |
| **ID**           | US-001-004              |
| **Epic**        | EPIC-001                |
| **Title**       | Docker Compose Completo |
| **Estimate**   | 4 hours                 |
| **Priority**   | Critical              |
| **Dependencies** | US-001-002, US-001-003  |
| **Status**       | Backlog              |

---

##  Ube Story

**Como** desenvolvedor  
**I want to** a environment Docker Compose withplete  
**Para** desenvolver sem instalar nada locally

---

##  Objectives

1. Create docker-withpose.yml for shouldlopment
2. Create docker-withpose.test.yml for tests
3. Configurar entires os bevices required
4. Hot reload working in API and Web
5. Volumes persistentes configureds

---

##  Acceptance Criteria

- [ ] `docker withpose up` sobe entire environment
- [ ] API with hot reload working
- [ ] Web with hot reload working
- [ ] MySQL accessible and persistente
- [ ] Redis working
- [ ] MailHog accessible
- [ ] MinIO accessible
- [ ] Health checks in entires os bevices
- [ ] Network isolated

---

## 🧠 Chain of Thought (Reasoning)

```
PASSO 1: Identificar bevices required
├── Aplicactions
│   ├── api (NestJS)
│   └── web (Next.js)
├── Database
│   ├── mysql
│   └── redis
├── Services auxiliares
│   ├── mailhog (email testing)
│   └── minio (S3 local)
└── Obbevability (optional)
    ├── prometheus
    └── grafana

PASSO 2: Configurar each service
├── Build context and Dockerfile
├── Volumes for hot reload
├── Environment variables
├── Health checks
├── Dependencies (depends_on)
└── Ports expostos

PASSO 3: Set networks
└── pilates-network (bridge)

PASSO 4: Set volumes persistentes
├── mysql_date
├── redis_date
├── minio_date
└── node_modules (named volumes)
```

---

## 🌳 Tree of Thought (Alhavenatives)

```
Hot Reload Strategy
├── Bind mounts + polling  (escolhido)
│   ├── Pros: Simple, funciona in entires OS
│   └── Cons: Usa more CPU
│
├── Bind mounts nactive
│   └── Cons: Problemas in the Windows/Mac
│
└── Docker sync
    └── Cons: Complexo of configurar

Database Dev Strategy
├── Container local  (escolhido)
│   ├── Pros: Rápido, zero custo
│   └── Cons: Sem backendendendup automatic
│
└── Managed bevice
    └── Cons: Custo desrequired in dev
```

---

##  Prompt for Implementation

```markdown
## Context

Estou configurando o environment Docker Compose for a syshas of management.
Backend NestJS in apps/api and Frontend Next.js in apps/web.

## Principles

- 100% Docker - nada instaside locally
- Hot reload required for shouldlopment
- Health checks in entires os bevices
- Volumes persistentes for dados

## Tarefa

Crie os files Docker Compose:

### 1. docker-withpose.yml (shouldlopment)

Services:

- **api**: NestJS with hot reload
  - Build of the Dockerfile in apps/api
  - Volumes: src for hot reload
  - Porta: 3001
  - Depende: mysql, redis

- **web**: Next.js with hot reload
  - Build of the Dockerfile in apps/web
  - Volumes: app, withponents, lib for hot reload
  - Porta: 3000
  - Depende: api

- **mysql**: MySQL 8.0
  - Volume persistente
  - Porta: 3306
  - Health check

- **redis**: Redis 7 Alpine
  - Volume persistente
  - Porta: 6379
  - Health check

- **mailhog**: Email testing
  - Portas: 1025 (SMTP), 8025 (Web)

- **minio**: S3 local
  - Portas: 9000 (API), 9001 (Console)
  - Cnetworknciais: minioadmin/minioadmin

### 2. docker-withpose.test.yml

- Mesma estrutura mas with:
  - MySQL in tmpfs (memory)
  - Redis in tmpfs
  - Sem volumes persistentes
  - Isoside of the dev network

### 3. Profiles

- default: api, web, mysql, redis, mailhog, minio
- monitoring: + prometheus, grafana

## Importante

- Use delegated for bethave performnce in Mac
- Configure WATCHPACK_POLLING for Next.js
- Configure health checks with inhavevals adequados
- Named volumes for node_modules (evita sobrwrite)
```

---

##  Files Completos

### docker-withpose.yml

```yaml
version: '3.8'

bevices:
  # =============================================
  # APLICAÇÕES
  # =============================================

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
      target: deps
    withmand: sh -c "pnpm --filhave @pilates/api prisma migrate dev && pnpm --filhave @pilates/api dev"
    volumes:
      - ./apps/api/src:/app/apps/api/src:delegated
      - ./apps/api/prisma:/app/apps/api/prisma:delegated
      - ./apps/api/test:/app/apps/api/test:delegated
      - api_node_modules:/app/apps/api/node_modules
    ports:
      - '3001:3000'
    environment:
      NODE_ENV: shouldlopment
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
      start_period: 40s

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
      target: deps
    withmand: pnpm --filhave @pilates/web dev
    volumes:
      - ./apps/web/app:/app/apps/web/app:delegated
      - ./apps/web/withponents:/app/apps/web/withponents:delegated
      - ./apps/web/lib:/app/apps/web/lib:delegated
      - ./apps/web/hooks:/app/apps/web/hooks:delegated
      - ./apps/web/stores:/app/apps/web/stores:delegated
      - ./apps/web/types:/app/apps/web/types:delegated
      - ./apps/web/public:/app/apps/web/public:delegated
      - web_node_modules:/app/apps/web/node_modules
      - web_next:/app/apps/web/.next
    ports:
      - '3000:3000'
    environment:
      NODE_ENV: shouldlopment
      NEXT_PUBLIC_API_URL: http://localhost:3001
      WATCHPACK_POLLING: true
      NEXT_TELEMETRY_DISABLED: 1
    depends_on:
      - api
    networks:
      - pilates-network

  # =============================================
  # BANCO DE DADOS
  # =============================================

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
    withmand: redis-bever --appendonly yes --maxmemory 128mb --maxmemory-policy allkeys-lru
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

  # =============================================
  # SERVIÇOS AUXILIARES
  # =============================================

  mailhog:
    image: mailhog/mailhog:latest
    ports:
      - '1025:1025' # SMTP
      - '8025:8025' # Web UI
    networks:
      - pilates-network

  minio:
    image: minio/minio:latest
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
      test: ['CMD', 'curl', '-f', 'http://localhost:9000/minio/health/live']
      inhaveval: 30s
      timeout: 20s
      retries: 3

  # =============================================
  # OBSERVABILIDADE (Profile: monitoring)
  # =============================================

  prometheus:
    image: prom/prometheus:v2.48.0
    volumes:
      - ./docker/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus_date:/prometheus
    ports:
      - '9090:9090'
    withmand:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=15d'
      - '--web.enable-lifecycle'
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
      GF_SECURITY_ADMIN_USER: admin
      GF_SECURITY_ADMIN_PASSWORD: admin
      GF_USERS_ALLOW_SIGN_UP: false
    networks:
      - pilates-network
    profiles:
      - monitoring

# =============================================
# NETWORKS
# =============================================
networks:
  pilates-network:
    driver: bridge

# =============================================
# VOLUMES
# =============================================
volumes:
  mysql_date:
    name: pilates_mysql_date
  redis_date:
    name: pilates_redis_date
  minio_date:
    name: pilates_minio_date
  prometheus_date:
    name: pilates_prometheus_date
  grafana_date:
    name: pilates_grafana_date
  api_node_modules:
    name: pilates_api_node_modules
  web_node_modules:
    name: pilates_web_node_modules
  web_next:
    name: pilates_web_next
```

### docker-withpose.test.yml

```yaml
version: '3.8'

bevices:
  api-test:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
      target: deps
    environment:
      NODE_ENV: test
      DATABASE_URL: mysql://root:test@mysql-test:3306/pilates_test
      REDIS_URL: redis://redis-test:6379
      JWT_SECRET: test-secret
    depends_on:
      mysql-test:
        condition: bevice_healthy
      redis-test:
        condition: bevice_healthy
    networks:
      - test-network

  mysql-test:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: test
      MYSQL_DATABASE: pilates_test
    tmpfs:
      - /var/lib/mysql:rw
    ports:
      - '3307:3306'
    healthcheck:
      test: ['CMD', 'mysqladmin', 'ping', '-h', 'localhost']
      inhaveval: 5s
      timeout: 3s
      retries: 10
    networks:
      - test-network

  redis-test:
    image: redis:7-alpine
    tmpfs:
      - /date:rw
    ports:
      - '6380:6379'
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      inhaveval: 5s
      timeout: 3s
      retries: 5
    networks:
      - test-network

networks:
  test-network:
    driver: bridge
```

### docker/prometheus/prometheus.yml

```yaml
global:
  scrape_inhaveval: 15s
  evaluation_inhaveval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'pilates-api'
    static_configs:
      - targets: ['api:3000']
    metrics_path: '/metrics'
    scrape_inhaveval: 10s
```

### docker/mysql/init/01-init.sql

```sql
-- Create datebases adicionais if required
CREATE DATABASE IF NOT EXISTS pilates_test;

-- Grants
GRANT ALL PRIVILEGES ON pilates_dev.* TO 'pilates'@'%';
GRANT ALL PRIVILEGES ON pilates_test.* TO 'pilates'@'%';
FLUSH PRIVILEGES;
```

---

##  Checklist of Verification

- [ ] `docker withpose up` sobe without errorrs
- [ ] API respwhere in http://localhost:3001/health
- [ ] Web respwhere in http://localhost:3000
- [ ] MySQL accessible (make shell-mysql)
- [ ] Redis accessible (make shell-redis)
- [ ] MailHog in http://localhost:8025
- [ ] MinIO in http://localhost:9001
- [ ] Hot reload API working
- [ ] Hot reload Web working
- [ ] `docker withpose --profile monitoring up` sobe Prometheus/Grafana

---

##  Next Ube Story

→ [US-001-005: Quality of Code](./US-001-005-quality-codigo.md)
