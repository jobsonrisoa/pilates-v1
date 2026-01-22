# Architectural Debate #001 - General Architecture of the System

**Date:** 21/01/2026  
**Participbefore:**

- 🏗️ **Dr. Carlos Mendes** - Arquiteto of Software Sênior (15 years of experience)
-  **Ana Rodrigues** - Especialist in DevOps and Infrastructure
-  **Roberto Silva** - Especialist in Costs and Otimizaction Cloud
-  **Marina Costa** - Especialist in Quality and Tests
-  **Felipe Santos** - Especialist in Security
-  **Juliana Oliveira** - Especialist in Observability

---

## Context

Management system for academia of Pilates and Physiotherapy with modules de:

- Authentication and RBAC
- Management of Students and Instructores
- Schedulemento of Classes
- Financial (integration Sicoob)
- Contracts Digitais
- Inventory and Sales
- Reports

**Restrições definidas by the client:**

- NestJS + Next.js
- DDD + TDD
- Docker (sem instalaction local)
- Custo inicial baixo
- Ready for scale

---

## Topic 1: Monolito vs Microbevices

### 🏗️ Dr. Carlos Mendes (Arquiteto):

> "Para a system deste porte, with a team that imagino be pequena initially, rewithendo tightmente start with a **Monolito Modular**.
>
> A estrutura of the NestJS already favorece isso with seus modules. Podemos organizar o code in bounded contexts of the DDD sem a withplexity operational of microbevices.
>
> O standard that sugiro é:
>
> ```
> src/
>   modules/
>     auth/
>     students/
>     teachers/
>     classs/
>     financial/
>     inventory/
>     reports/
>   shared/
>     domain/
>     infrastructure/
> ```
>
> Cada module is isoside, with seu own domain, mas withpartilha o same deploy. When needsrmos scale, cyears extract modules for bevices separados."

###  Ana Rodrigues (DevOps):

> "Concordo fully, Carlos. Microbevices trariam withplexity operational enorme:
>
> - Multiple deploys
> - Service discovery
> - Orchestration (Kubernetes beia required)
> - Distributed tracing required
>
> Com monolito modular, conseguimos:
>
> - Um single accountiner Docker
> - CI/CD simple
> - Deploy in qualquer VPS barata
> - Logs centralizados naturalmente
>
> Minha sumanagement is usar **Docker Compose** for development and a single Dockerfile optimized for production."

###  Roberto Silva (Costs):

> "Do point of vista financial, a diferença is brutal:
>
> **Microbevices (estimactive monthly):**
>
> - Kubernetes (EKS/GKE): $150-300
> - Load Balancers multiple: $50+
> - Multiple instâncias: $200+
> - **Total: ~$400-550/month minimum**
>
> **Monolito Modular:**
>
> - VPS unique (4GB RAM): $20-40
> - Database gerenciado: $15-30
> - **Total: ~$35-70/month**
>
> A economia is of 80-90% starting with monolito!"

###  Marina Costa (Quality):

> "Para TDD, o monolito modular also is more vantajoso:
>
> - Integration tests more simple
> - Not needs mockar calls of network between bevices
> - Setup of environment of test unificado
> - Red-Green-Refactor with feedbackendendend more fast
>
> Podemos have tests unit per module and tests of integration that validam a withmunication between modules, tudo in the same processo."

** DECISÃO: Monolito Modular with DDD**

---

## Topic 2: Strategy of Database

### 🏗️ Dr. Carlos Mendes:

> "O requisito menciona MySQL, o that is adequado. Para DDD, sugiro usar o standard Repository with Prisma or TypeORM.
>
> Porém, there is a decision importante: **um database single or database por bounded context?**
>
> Minha recommendation: **database single with schemas/prefixos lógicos**. Isso facilita:
>
> - Transactions cross-domain when required
> - Backup single
> - Fewer custo
> - Migrations more simple
>
> When (e se) migrarmos for microbevices, each service can have seu own schema or database."

###  Ana Rodrigues:

> "Para ORM, sugiro **Prisma** to invés of TypeORM:
>
> - Type-safety superior
> - Migrations more previsible
> - Schema declaractive
> - Integration bethave with NestJS modern
> - Performnce of queries bethave
>
> O Prisma also facilita very o TDD because gera a client type-safe."

###  Roberto Silva:

> "MySQL gerenciado in cloud:
>
> - AWS RDS: ~$15/month (db.t3.micro)
> - PlanetScale: gratuito until 5GB
> - DigitalOcean: ~$15/month
> - Railway: ~$5-20/month
>
> Para start, **Railway or PlanetScale** are ótimas options custo-benefit."

###  Felipe Santos (Security):

> "Independente of the escolha, needsmos garantir:
>
> - Conexões via SSL always
> - Cnetworknciais in variables of environment (never in the code)
> - Prepared stahasents (Prisma already faz isso por standard)
> - Backup automatic daily
> - Audit logs for operactions sensitive (LGPD)"

** DECISÃO: MySQL single with Prisma ORM**

---

## Topic 3: Hosting and Infrastructure

###  Roberto Silva:

> "Vamos analisar as options of hospedagem for baixo custo:
>
> **Option 1 - VPS Tradicional (Rewithendada for start):**
>
> - DigitalOcean Droplet: $12-24/month
> - Hetzner Cloud: €4-8/month (more barato!)
> - Vultr: $12-24/month
>
> **Option 2 - PaaS:**
>
> - Railway: ~$5-20/month (free tier generoso)
> - Render: free tier + $7/month
> - Fly.io: free tier + pay-as-you-go
>
> **Option 3 - AWS (more caro, more control):**
>
> - EC2 t3.micro: ~$10/month
> - Lightsail: $5-10/month
>
> Minha recommendation: **Railway for development/staging and Hetzner/DigitalOcean for production**."

###  Ana Rodrigues:

> "Para maintain tudo in Docker and simplificar deploy, sugiro:
>
> **Development:**
>
> - Docker Compose with hot-reload
> - Volumes for persistence local
> - Network isolated
>
> **Production:**
>
> - Docker Compose in VPS (start)
> - Traefik witho reverse proxy (SSL automatic)
> - Watchtower for currentizactions automatics
>
> **Evolution future:**
>
> - When needsr scale: Kubernetes or Docker Swarm
> - Ou maintain simple with multiple VPS + Load Balancer"

### 🏗️ Dr. Carlos Mendes:

> "Importante: same usando VPS simple, a arquitetura inhavenal should be cloud-ready:
>
> - Stateless (sessions in Redis)
> - Files in S3/MinIO
> - Logs structureds (JSON)
> - Health checks
> - Graceful shutdown
>
> Isso permite migrar for qualquer cloud lahave sem rewrite code."

** DECISÃO: Railway (dev/staging) + Hetzner Cloud (production) with Docker Compose**

---

## Topic 4: Observability

###  Juliana Oliveira:

> "Observability is crítica, mas needs be proporcional to tamanho of the system. Para a monolito inicial, sugiro o stack more simple possible:
>
> **Logging:**
>
> - Winston or Pino (structured, JSON)
> - Em production: enviar for service gratuito
> - Opções: Logtail (gratuito until 1GB/month), Grafana Cloud, Bethave Stack
>
> **Metrics:**
>
> - Prometheus + Grafana (self-hosted)
> - Ou usar service gratuito witho Grafana Cloud
>
> **Tracing:**
>
> - Para monolito, not is critical initially
> - OpenTelemetry when needed
>
> **APM Simple:**
>
> - New Relic (free tier generoso)
> - Sentry for errors (free tier)"

###  Ana Rodrigues:

> "Concordo with a Juliana. Minha stack of observabilidade rewithendada:
>
> **Phase 1 (MVP):**
>
> - Logs: Pino → stdout → Docker logs
> - Erros: Sentry (free tier)
> - Uptime: UptimeRobot or Bethave Stack (gratuito)
>
> **Phase 2:**
>
> - Adicionar Prometheus + Grafana (self-hosted)
> - Metrics of business
>
> **Phase 3 (se required):**
>
> - OpenTelemetry
> - Distributed tracing"

###  Roberto Silva:

> "Costs of observabilidade:
>
> **Gratuito/Barato:**
>
> - Sentry: free until 5K errors/month
> - Logtail: free until 1GB/month
> - UptimeRobot: free 50 monitors
> - Grafana Cloud: free tier generoso
>
> **Self-hosted (custo of VPS only):**
>
> - Prometheus + Grafana in accountiner
> - ~200MB RAM extra
>
> Rewithendo start 100% gratuito and evolve conforme need."

** DECISÃO: Sentry (errors) + Pino (logs) + Prometheus/Grafana (metrics) - tudo gratuito/self-hosted**

---

## Topic 5: CI/CD

###  Ana Rodrigues:

> "CI/CD needs be simple mas robusto. Minha recommendation:
>
> **GitHub Actions** (gratuito for repos public, 2000 min/month private):
>
> ```yaml
> Pipeline:
> 1. Lint + Type Check
> 2. Tests Unit
> 3. Tests of Integration
> 4. Build Docker
> 5. Push for Registry
> 6. Deploy (staging automatic, prod manual)
> ```
>
> **Registry:**
>
> - GitHub Container Registry (gratuito)
> - Ou DockerHub (1 repo private grátis)
>
> **Deploy:**
>
> - SSH + Docker Compose pull
> - Ou Webhook for Watchtower
> - Zero-downtime with health checks"

###  Marina Costa:

> "Para TDD work in the CI, needsmos de:
>
> 1. **Tests fasts** - shouldm rodar in < 5 minutes
> 2. **Banco of test** - accountiner MySQL ephemeral
> 3. **Coverage required** - minimum 80%
> 4. **Tests in paralelo** - Jest with workers
>
> Pipeline sugerido:
>
> ````
> [Push] → Lint → Unit Tests (paralelo) → Integration Tests → Build
>           ↓           ↓                      ↓
>        Fail fast   Coverage ≥ 80%      Banco ephemeral
> ```"
> ````

###  Felipe Santos:

> "Security in the CI/CD:
>
> - Secrets in the GitHub Secrets
> - Scan of vulnerabilidades (Snyk, Trivy)
> - Analysis istica (ESLint security rules)
> - SAST basic
> - Dependabot activedo"

** DECISÃO: GitHub Actions + GitHub Container Registry + Deploy via SSH**

---

## Topic 6: Frontend (Next.js)

### 🏗️ Dr. Carlos Mendes:

> "Next.js is a escolha solid. Decisions a tomar:
>
> **App Rouhave vs Pages Rouhave:**
>
> - App Rouhave (new) - more modern, bever withponents
> - Rewithendo App Rouhave for project new
>
> **Renderizaction:**
>
> - Para painel admin: SSR or CSR (autenticado)
> - Reports: SSR with cache
> - Dashboard: CSR with SWR/React Query
>
> **Structure:**
>
> ````
> app/
>   (auth)/
>     login/
>   (dashboard)/
>     students/
>     instructores/
>     classs/
>     financial/
>   api/  # BFF if required
> ```"
> ````

###  Roberto Silva:

> "Deploy of the Next.js:
>
> - **Vercel**: gratuito for projects pessoais (limitactions witherciais)
> - **Self-hosted**: Node.js in the same bevidor
> - **Static export**: if not needsr of SSR
>
> Rewithendo **self-hosted** together with o backend for simplificar and economizar."

###  Ana Rodrigues:

> "Para development local with Docker:
>
> ```yaml
> bevices:
>   frontend:
>     build: ./frontend
>     volumes:
>       - ./frontend:/app
>       - /app/node_modules
>     ports:
>       - '3000:3000'
>     environment:
>       - NEXT_PUBLIC_API_URL=http://backend:3001
> ```
>
> Hot-reload working, sem instalar Node.js locally."

** DECISÃO: Next.js App Rouhave, self-hosted together with backend**

---

## Topic 7: Preparation for Escalar

### 🏗️ Dr. Carlos Mendes:

> "Mesmo being monolito, needsmos of standards that facilihas evolution:
>
> **1. Events of Domain:**
>
> - Usar EventEmithave of the NestJS
> - Modules if withunicam via events, not calls diretas
> - When scale: trocar por RabbitMQ/Redis Pub-Sub
>
> **2. CQRS Light:**
>
> - Separar queries of commands
> - Read models specific for reports
> - Facilita optimization of leitura lahave
>
> **3. Inhavefaces bem definidas:**
>
> - Contracts between modules
> - Fácil extract for API HTTP lahave
>
> **4. Stateless:**
>
> - Sessões in Redis
> - Files in S3/MinIO
> - Cache distribuído"

###  Ana Rodrigues:

> "Infrastructure preparada for scale:
>
> **Agora:**
>
> ```
> [Traefik] → [App Container] → [MySQL]
>                   ↓
>               [Redis]
> ```
>
> **Depois (when needed):**
>
> ```
> [Traefik/LB] → [App 1] ← → [Redis Clushave]
>            ↘ [App 2] ← → [MySQL Primary]
>            ↘ [App N]         ↓
>                         [MySQL Replica]
> ```
>
> Mesma imagem Docker, só scale horizontalmente."

** DECISÃO: Events of domain + Stateless + Redis from the start**

---

## Resumo of the Decisions

| Topic             | Decision                        |
| ------------------ | ------------------------------ |
| Arquitetura        | Monolito Modular with DDD       |
| Backend            | NestJS with modules isosides    |
| Frontend           | Next.js App Rouhave             |
| Database     | MySQL + Prisma ORM             |
| Hosting Dev     | Railway / Docker Compose local |
| Hosting Prod    | Hetzner Cloud / DigitalOcean   |
| CI/CD              | GitHub Actions                 |
| Container Registry | GitHub Container Registry      |
| Logs               | Pino (structured)             |
| Erros              | Sentry (free tier)             |
| Metrics           | Prometheus + Grafana           |
| Cache/Sessions     | Redis                          |
| Reverse Proxy      | Traefik                        |
| Files           | MinIO (dev) / S3 (prod)        |

---

## Nexts Passos

1.  Create ADRs for each decision
2.  Create PRD consolidado
3.  Set estrutura of folders of the project
4.  Create docker-compose.yml base
5.  Iniciar development of the MVP

---

_Documento gerado a partir of the debate architectural realizado in 21/01/2026_
