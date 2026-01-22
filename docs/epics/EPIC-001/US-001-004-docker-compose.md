# US-001-004: Docker Compose Completo

## 📋 Informações

| Campo            | Valor                   |
| ---------------- | ----------------------- |
| **ID**           | US-001-004              |
| **Épico**        | EPIC-001                |
| **Título**       | Docker Compose Completo |
| **Estimativa**   | 4 horas                 |
| **Prioridade**   | 🔴 Crítica              |
| **Dependências** | US-001-002, US-001-003  |
| **Status**       | 📋 Backlog              |

---

## 📝 User Story

**Como** desenvolvedor  
**Quero** um ambiente Docker Compose completo  
**Para** desenvolver sem instalar nada localmente

---

## 🎯 Objetivos

1. Criar docker-compose.yml para desenvolvimento
2. Criar docker-compose.test.yml para testes
3. Configurar todos os serviços necessários
4. Hot reload funcionando em API e Web
5. Volumes persistentes configurados

---

## ✅ Critérios de Aceite

- [ ] `docker compose up` sobe todo ambiente
- [ ] API com hot reload funcionando
- [ ] Web com hot reload funcionando
- [ ] MySQL acessível e persistente
- [ ] Redis funcionando
- [ ] MailHog acessível
- [ ] MinIO acessível
- [ ] Health checks em todos os serviços
- [ ] Network isolada

---

## 🧠 Chain of Thought (Raciocínio)

```
PASSO 1: Identificar serviços necessários
├── Aplicações
│   ├── api (NestJS)
│   └── web (Next.js)
├── Banco de dados
│   ├── mysql
│   └── redis
├── Serviços auxiliares
│   ├── mailhog (email testing)
│   └── minio (S3 local)
└── Observabilidade (opcional)
    ├── prometheus
    └── grafana

PASSO 2: Configurar cada serviço
├── Build context e Dockerfile
├── Volumes para hot reload
├── Environment variables
├── Health checks
├── Dependências (depends_on)
└── Ports expostos

PASSO 3: Definir networks
└── pilates-network (bridge)

PASSO 4: Definir volumes persistentes
├── mysql_data
├── redis_data
├── minio_data
└── node_modules (named volumes)
```

---

## 🌳 Tree of Thought (Alternativas)

```
Hot Reload Strategy
├── Bind mounts + polling ✅ (escolhido)
│   ├── Prós: Simples, funciona em todos OS
│   └── Contras: Usa mais CPU
│
├── Bind mounts nativo
│   └── Contras: Problemas no Windows/Mac
│
└── Docker sync
    └── Contras: Complexo de configurar

Database Dev Strategy
├── Container local ✅ (escolhido)
│   ├── Prós: Rápido, zero custo
│   └── Contras: Sem backup automático
│
└── Managed service
    └── Contras: Custo desnecessário em dev
```

---

## 🤖 Prompt para Implementação

```markdown
## Contexto

Estou configurando o ambiente Docker Compose para um sistema de gestão.
Backend NestJS em apps/api e Frontend Next.js em apps/web.

## Princípios

- 100% Docker - nada instalado localmente
- Hot reload obrigatório para desenvolvimento
- Health checks em todos os serviços
- Volumes persistentes para dados

## Tarefa

Crie os arquivos Docker Compose:

### 1. docker-compose.yml (desenvolvimento)

Serviços:

- **api**: NestJS com hot reload
  - Build do Dockerfile em apps/api
  - Volumes: src para hot reload
  - Porta: 3001
  - Depende: mysql, redis

- **web**: Next.js com hot reload
  - Build do Dockerfile em apps/web
  - Volumes: app, components, lib para hot reload
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
  - Credenciais: minioadmin/minioadmin

### 2. docker-compose.test.yml

- Mesma estrutura mas com:
  - MySQL em tmpfs (memória)
  - Redis em tmpfs
  - Sem volumes persistentes
  - Isolado da dev network

### 3. Profiles

- default: api, web, mysql, redis, mailhog, minio
- monitoring: + prometheus, grafana

## Importante

- Use delegated para melhor performance em Mac
- Configure WATCHPACK_POLLING para Next.js
- Configure health checks com intervals adequados
- Named volumes para node_modules (evita sobrescrever)
```

---

## 📝 Arquivos Completos

### docker-compose.yml

```yaml
version: '3.8'

services:
  # =============================================
  # APLICAÇÕES
  # =============================================

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
      target: deps
    command: sh -c "pnpm --filter @pilates/api prisma migrate dev && pnpm --filter @pilates/api dev"
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
      start_period: 40s

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
      target: deps
    command: pnpm --filter @pilates/web dev
    volumes:
      - ./apps/web/app:/app/apps/web/app:delegated
      - ./apps/web/components:/app/apps/web/components:delegated
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
      NODE_ENV: development
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
    command: redis-server --appendonly yes --maxmemory 128mb --maxmemory-policy allkeys-lru
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
      test: ['CMD', 'curl', '-f', 'http://localhost:9000/minio/health/live']
      interval: 30s
      timeout: 20s
      retries: 3

  # =============================================
  # OBSERVABILIDADE (Profile: monitoring)
  # =============================================

  prometheus:
    image: prom/prometheus:v2.48.0
    volumes:
      - ./docker/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus_data:/prometheus
    ports:
      - '9090:9090'
    command:
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
      - grafana_data:/var/lib/grafana
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
  mysql_data:
    name: pilates_mysql_data
  redis_data:
    name: pilates_redis_data
  minio_data:
    name: pilates_minio_data
  prometheus_data:
    name: pilates_prometheus_data
  grafana_data:
    name: pilates_grafana_data
  api_node_modules:
    name: pilates_api_node_modules
  web_node_modules:
    name: pilates_web_node_modules
  web_next:
    name: pilates_web_next
```

### docker-compose.test.yml

```yaml
version: '3.8'

services:
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
        condition: service_healthy
      redis-test:
        condition: service_healthy
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
      interval: 5s
      timeout: 3s
      retries: 10
    networks:
      - test-network

  redis-test:
    image: redis:7-alpine
    tmpfs:
      - /data:rw
    ports:
      - '6380:6379'
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 5s
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
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'pilates-api'
    static_configs:
      - targets: ['api:3000']
    metrics_path: '/metrics'
    scrape_interval: 10s
```

### docker/mysql/init/01-init.sql

```sql
-- Criar databases adicionais se necessário
CREATE DATABASE IF NOT EXISTS pilates_test;

-- Grants
GRANT ALL PRIVILEGES ON pilates_dev.* TO 'pilates'@'%';
GRANT ALL PRIVILEGES ON pilates_test.* TO 'pilates'@'%';
FLUSH PRIVILEGES;
```

---

## ✅ Checklist de Verificação

- [ ] `docker compose up` sobe sem erros
- [ ] API responde em http://localhost:3001/health
- [ ] Web responde em http://localhost:3000
- [ ] MySQL acessível (make shell-mysql)
- [ ] Redis acessível (make shell-redis)
- [ ] MailHog em http://localhost:8025
- [ ] MinIO em http://localhost:9001
- [ ] Hot reload API funcionando
- [ ] Hot reload Web funcionando
- [ ] `docker compose --profile monitoring up` sobe Prometheus/Grafana

---

## 🔗 Próxima User Story

→ [US-001-005: Qualidade de Código](./US-001-005-qualidade-codigo.md)
