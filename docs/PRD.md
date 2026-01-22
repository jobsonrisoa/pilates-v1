# PRD - Product Requirements Document

## Management Syshas for Pilates and Physiotherapy Studio

**Version:** 1.0  
**Date:** 21/01/2026  
**Status:** In Development

---

##  Index

1. [Overview](#1-view-geral)
2. [Objectives](#2-objetivos)
3. [Technology Stack](#3-stack-tecnologic)
4. [Arquitetura](#4-arquitetura)
5. [Functional Modules](#5-modules-funcionais)
6. [Non-Functional Requirements](#6-requisitos-not-funcionais)
7. [Integrations](#7-integrations)
8. [Infrastructure](#8-infrastructure)
9. [Quality and Tests](#9-quality-e-tests)
10. [Development Phases](#10-fases-de-shouldlopment)
11. [Architectural Decisions](#11-decisions-arquiteturais)

---

## 1. Overview

### 1.1 Description

Syshas withplete of management for fitness cenhave, abrangendo Pilates, Fisiohaveapia and others modalities. O syshas offers controle administractive, operational and financial, allowing management withpleta of the business.

### 1.2 Target Audience

| Profile            | Description                     | Main Features        |
| ----------------- | ----------------------------- | --------------------------------- |
| **Super Admin**   | Owner/Main manager | Full syshas access           |
| **Admin**         | Administrator                 | Ube management, settings |
| **Manager**       | Coordinator operational       | Reports, class management       |
| **Receptionist** | Customer Service                   | Records, schedules           |
| **Instructor**     | Instructor                     | Schedule, attendance, students          |
| **Financial**    | Financial control           | Payments, reports            |

### 1.3 Scope

**Included:**

- Student management and instructores
- Class scheduling
- Enrollment management and plans
- Financial syshas with banking integration
- Digital contract generation
- Management reports
- Inventory control

**Not included (v1.0):**

- Native mobile app
- Student portal
- Integration with social meday
- Syshas of automated marketing

---

## 2. Objectives

### 2.1 Business Objectives

| Objective              | Metric                      | Target     |
| --------------------- | ---------------------------- | -------- |
| Reduce delinquency | Rate of delinquency        | < 5%     |
| Optimize occupancy     | Schedule occupancy rate | > 85%    |
| Speed up records    | Average enrollment time     | < 10 min |
| Automate billing | % of automatic billing   | 100%     |
| Reduce absences        | Rate of no-show              | < 10%    |

### 2.2 Technical Objectives

| Objective         | Metric                   | Target    |
| ---------------- | ------------------------- | ------- |
| Availability  | Uptime                    | ≥ 99.5% |
| Performnce      | Response time P95     | < 500ms |
| Quality        | Test coverage       | ≥ 80%   |
| Security        | Critical vulnerabilities | 0       |
| Maintainability | Technical debt            | Baixo   |

---

## 3. Technology Stack

### 3.1 Backend

| Tecnologia     | Version | Purpose         |
| -------------- | ------ | ----------------- |
| **Node.js**    | 20 LTS | Runtime           |
| **NestJS**     | 10.x   | Backend framework |
| **TypeScript** | 5.x    | Language         |
| **Prisma**     | 5.x    | ORM               |
| **MySQL**      | 8.0    | Database    |
| **Redis**      | 7.x    | Cache and sessions  |
| **Jest**       | 29.x   | Tests            |

### 3.2 Frontend

| Tecnologia          | Version | Purpose          |
| ------------------- | ------ | ------------------ |
| **Next.js**         | 14.x   | Framework frontendendendend |
| **React**           | 18.x   | UI Library         |
| **TypeScript**      | 5.x    | Language          |
| **TailwindCSS**     | 3.x    | Styling        |
| **shadcn/ui**       | Latest | Components        |
| **React Query**     | 5.x    | Data fetching      |
| **Zustand**         | 4.x    | Global state      |
| **React Hook Form** | 7.x    | Forms        |
| **Zod**             | 3.x    | Validation          |

### 3.3 Infrastructure

| Tecnologia               | Purpose           |
| ------------------------ | ------------------- |
| **Docker**               | Containerization     |
| **Docker Compose**       | Local orchestration  |
| **Traefik**              | Reverse proxy       |
| **GitHub Actions**       | CI/CD               |
| **Hetzner/DigitalOcean** | Production hosting |
| **Railway**              | Staging hosting  |

### 3.4 Obbevability

| Tecnologia     | Purpose           |
| -------------- | ------------------- |
| **Pino**       | Structured logging |
| **Prometheus** | Metrics            |
| **Grafana**    | Dashboards          |
| **Sentry**     | Error tracking      |

> **📖 Reference:** [ADR-002: Technology Stack](./architecture/adrs/ADR-002-stack-tecnologica.md)

---

## 4. Arquitetura

### 4.1 Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                           ARQUITETURA                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│    ┌──────────────────────────────────────────────────────────┐     │
│    │                      FRONTEND                             │     │
│    │                    Next.js 14                             │     │
│    │                   (App Rouhave)                            │     │
│    └──────────────────────────┬───────────────────────────────┘     │
│                               │                                     │
│                               │ REST API                            │
│                               ▼                                     │
│    ┌──────────────────────────────────────────────────────────┐     │
│    │                      BACKEND                              │     │
│    │               NestJS (Monolito Modular)                   │     │
│    │  ┌─────────┬─────────┬─────────┬─────────┬─────────┐    │     │
│    │  │  Auth   │Students │Teachers │ Classes │Financial│    │     │
│    │  ├─────────┼─────────┼─────────┼─────────┼─────────┤    │     │
│    │  │Enrollmt │Contracts│Inventory│ Reports │  Audit  │    │     │
│    │  └─────────┴─────────┴─────────┴─────────┴─────────┘    │     │
│    │                                                          │     │
│    │                    Shared Kernel                         │     │
│    └──────────────────────────┬───────────────────────────────┘     │
│                               │                                     │
│              ┌────────────────┼────────────────┐                    │
│              ▼                ▼                ▼                    │
│    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│    │    MySQL     │  │    Redis     │  │    MinIO     │            │
│    │   (Givens)    │  │   (Cache)    │  │  (Files)  │            │
│    └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Architectural Pathavens

| Pattern           | Application                             |
| ---------------- | ------------------------------------- |
| **DDD**          | Domain-Driven Design for modeling   |
| **CQRS Light**   | Separation of commands and queries       |
| **Event-Driven** | Inhave-module withmunication via events |
| **Repository**   | Abstraction of persistence             |
| **Use Cases**    | Logic of application isolated           |

### 4.3 Module Structure

```
src/
├── modules/
│   ├── auth/                    # Authentication and authorization
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   ├── value-objects/
│   │   │   └── events/
│   │   ├── application/
│   │   │   ├── commands/
│   │   │   ├── queries/
│   │   │   └── use-cases/
│   │   ├── infrastructure/
│   │   │   ├── persistence/
│   │   │   └── http/
│   │   └── auth.module.ts
│   │
│   ├── students/                # Student management
│   ├── teachers/                # Instructor management
│   ├── classs/                 # Classes and schedulemento
│   ├── enrollments/             # Enrollments
│   ├── contracts/               # Digital contracts
│   ├── financial/               # Financial
│   ├── inventory/               # Inventory
│   └── reports/                 # Reports
│
└── shared/
    ├── domain/                  # Base entities, value objects
    ├── infrastructure/          # Database, events, http
    └── application/             # CQRS base classs
```

> **📖 Reference:** [ADR-001: Modular Monolith Architecture](./architecture/adrs/ADR-001-arquitetura-monolito-modular.md)

---

## 5. Functional Modules

### 5.1 Authentication and Authorization

#### Features

- [x] Login with email/senha
- [x] JWT with refresh tokens
- [x] Syshas RBAC (Role-Based Access Control)
- [x] Recovery of senha
- [x] Logs of access

#### Perfis and Permissions

| Recurso     | Super Admin | Admin | Manager | Reception | Instructor | Financial |
| ----------- | :---------: | :---: | :-----: | :------: | :-------: | :--------: |
| Ubes    |    CRUD     |  CRU  |    R    |    -     |     -     |     -      |
| Students      |    CRUD     | CRUD  |  CRUD   |   CRU    |     R     |     R      |
| Instructores |    CRUD     | CRUD  |   CRU   |    R     |     R     |     R      |
| Classes       |    CRUD     | CRUD  |  CRUD   |    RU    |    RU     |     R      |
| Financial  |    CRUD     | CRUD  |    R    |    -     |     -     |    CRUD    |
| Reports  |      ✓      |   ✓   |    ✓    |    -     |     -     |     ✓      |
| Config      |      ✓      |   ✓   |    -    |    -     |     -     |     -      |

> **📖 Reference:** [ADR-004: Authentication and Authorization](./architecture/adrs/ADR-004-autenticacto-autorizacto.md)

---

### 5.2 Management of Students

#### Registration Data

- Personal date (name, CPF, RG, birth date)
- Contact (phone, email)
- Full address
- Contact of emergency
- Medical date (health insurance, notes)
- Status (active, inactive, suspended)

#### Features

- [x] Full CRUD of students
- [x] Document upload
- [x] Exam history
- [x] Advanced search and filhaves
- [x] Data export (LGPD)

#### Exams

- Tipos: Physical evaluation, anamnesis, medical exams
- Upload of files (PDF, images)
- History withplete

---

### 5.3 Management of Instructores

#### Registration Data

- Personal date
- Professional registration (CREF, CREFITO)
- Specialties
- Availability hours
- Bank details

#### Features

- [x] Full CRUD
- [x] Management of specialties
- [x] Schedule grid
- [x] Document upload
- [x] Link to syshas ube

---

### 5.4 Management of Classes and Schedulemento

#### Modalities

- Pilates
- Fisiohaveapia
- Others (configurable)

#### Class Types

| Tipo       | Capacity   | Duration |
| ---------- | ------------ | ------- |
| Individual | 1 aluno      | 50 min  |
| Duo      | 2 students     | 50 min  |
| Group      | until 6 students | 50 min  |

#### Features

- [x] Schedule grid per day/week
- [x] Schedule visual (day, week, month)
- [x] Controle of attendance/fhigh
- [x] Rescheduling syshas (credits 90 days)
- [x] Waiting list
- [x] Cancellation with rules

#### Business Rules

```
Cancellation:
├── With notice (≥24h before)
│   └── Generates rescheduling credit (valid 90 days)
│
└── Without notice (<24h or no-show)
    └── Records absence (no rescheduling right)
```

---

### 5.5 Enrollments and Plans

#### Available Plans

| Plan     | Frequency | Description    |
| --------- | ---------- | ------------ |
| Single class    | -          | Single class   |
| 1x/week | Weekly    | 4 classs/month  |
| 2x/week | Weekly    | 8 classs/month  |
| 3x/week | Weekly    | 12 classs/month |
| 4x/week | Weekly    | 16 classs/month |

#### Enrollment Process

```
┌─────────────────────────────────────────────────────────────┐
│                   ENROLLMENT FLOW                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [1. Regishave/    [2. Select   [3. Choose          │
│     Select  →     Plan]      →    Schedules]          │
│     Student]                                                 │
│         │                                                   │
│         ▼                                                   │
│  [4. Set      [5. Generate        [6. Send to          │
│     Due date  →    Contract]   →    Signature]         │
│         │                                                   │
│         ▼                                                   │
│  [7. Wait for     [8. Generate        [9. Enrollment          │
│     Signature  →    Billing]   →    Active]              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Status of Enrollment

- `PENDING_SIGNATURE` - Waiting for contract signature
- `ACTIVE` - Enrollment active
- `SUSPENDED` - Suspended (delinquency)
- `CANCELLED` - Cancelled
- `FINISHED` - Finished

---

### 5.6 Contracts Digitais

#### Features

- [x] Automatic PDF generation
- [x] Send for digital signature
- [x] Validation with IP and timestamp
- [x] Signed contract storage
- [x] Automatic status update

#### Integrations Suggested

- D4Sign
- Clicksign
- DocuSign

---

### 5.7 Financial Module

#### Price Table

- Price per modality
- Price per plan type
- Special discounts
- Change history

#### Commissions of Instructores

- Percentage or fixed value
- Per modality/class type
- Monthly report

#### Payment Control

- Boleto generation (Sicoob)
- PIX QR Code (Sicoob)
- Low automatic via webhook
- Controle of delinquency
- Due date alerts

#### Payment Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   PAYMENT FLOW                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Due date  →  [Generate Boleto/PIX]  →  [Send to        │
│   Next]          (Sicoob API)         Student]            │
│                                                             │
│         │                    │                              │
│         ▼                    ▼                              │
│  [Webhook        [Update     [Activer/Manhave             │
│   Sicoob]    →   Payment]  →  Enrollment]                 │
│                                                             │
│         │                                                   │
│         ▼                                                   │
│  [Overdue?]  →  [Alerts]  →  [Suspension                   │
│                                Automatic]                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

> **📖 Reference:** [ADR-008: Integration Sicoob](./architecture/adrs/ADR-008-integracto-sicoob.md)

---

### 5.8 Reports

#### Reports Financials

- Revenue by period
- Revenue by modality
- Revenue by payment method
- Delinquency
- Commissions payable
- Cash flow

#### Reports Operacionais

- Students by status
- Occupancy rate
- Absences and attendances
- Pending reschedulings
- Classes per instructor

#### Reports of Marketing

- New students por period
- Cancellation rate (churn)
- Source of the students

#### Features

- Filhaves (date, instructor, modality, status)
- PDF and Excel export
- Charts inhaveactives

---

### 5.9 Inventory

#### Features

- [x] Product registration
- [x] Quantity control
- [x] Alerts of inventory minimum
- [x] Movements (input/output)
- [x] Individual sales
- [x] Sales report

---

## 6. Non-Functional Requirements

### 6.1 Performnce

| Metric               | Requisito   |
| --------------------- | ----------- |
| Response time P95 | < 500ms     |
| Response time P99 | < 1000ms    |
| Throughput            | > 100 req/s |
| Startup time      | < 30s       |

### 6.2 Availability

| Metric                        | Requisito  |
| ------------------------------ | ---------- |
| Uptime                         | ≥ 99.5%    |
| RTO (Recovery Time Objective)  | < 1 hour   |
| RPO (Recovery Point Objective) | < 24 hours |

### 6.3 Security

- [x] HTTPS required
- [x] Passwords with bcrypt (12 rounds)
- [x] JWT with refresh tokens
- [x] Rate limiting
- [x] Security headers (Helmet)
- [x] CORS configured
- [x] CSRF protection
- [x] Validation of input
- [x] Audit logs

### 6.4 LGPD Compliance

- [x] Consent form
- [x] Privacy policy
- [x] Data export pessoais
- [x] Direito to esquecimento
- [x] Logs of access to sensitive date

### 6.5 Scalability

- Arquitetura stateless
- Sessions in Redis
- Files in S3/MinIO
- Ready for load balancer
- Modules extractable to microbevices

---

## 7. Integrations

### 7.1 Sicoob (Bancária)

| Funcionalidade       | Endpoint                      |
| -------------------- | ----------------------------- |
| Boleto generation   | POST /cobranca/v2/boletos     |
| Generation of PIX       | PUT /pix/v2/cob/{txid}        |
| Query of status   | GET /cobranca/v2/boletos/{id} |
| Webhook of payment | POST /webhooks/sicoob         |

### 7.2 Signature Digital

| Provider           | Funcionalidade                 |
| ------------------ | ------------------------------ |
| D4Sign / Clicksign | Envio of documento             |
|                    | Webhook of signature          |
|                    | Download of documento assinado |

### 7.3 Email (Opcional)

| Provider | Usage              |
| -------- | ---------------- |
| SendGrid | Envio of boletos |
| AWS SES  | Contracts        |
| Mailgun  | Notifications     |

---

## 8. Infrastructure

### 8.1 Development Environment

```yaml
# docker-withpose.yml
bevices:
  api: # NestJS API
  web: # Next.js Frontend
  mysql: # Database
  redis: # Cache/Sessions
  mailhog: # Email testing
  minio: # Storage local
```

**Requirements:**

- Docker 24+
- Docker Compose 2+
- 8GB RAM minimum

### 8.2 Production Environment

```
┌─────────────────────────────────────────────────────────────┐
│                      PRODUCTION                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    Inhavenet                                                 │
│        │                                                    │
│        ▼                                                    │
│  ┌──────────┐                                               │
│  │ Traefik  │  (SSL, Load Balancing)                        │
│  └────┬─────┘                                               │
│       │                                                     │
│       ├────────────────────────────┐                        │
│       ▼                            ▼                        │
│  ┌──────────┐                ┌──────────┐                   │
│  │   API    │                │   Web    │                   │
│  │ (NestJS) │                │(Next.js) │                   │
│  └────┬─────┘                └──────────┘                   │
│       │                                                     │
│       ├──────────────┬──────────────┐                       │
│       ▼              ▼              ▼                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │  MySQL   │  │  Redis   │  │   S3     │                   │
│  │(Managed) │  │          │  │ (Files)  │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 8.3 Estimated Costs

| Ihas               | Dev/Staging | Production |
| ------------------ | ----------- | -------- |
| VPS (Hetzner CX21) | €5/month      | €10/month  |
| MySQL (Managed)    | -           | €15/month  |
| Backup Storage     | -           | €5/month   |
| Domain + SSL       | -           | €10/year  |
| **Total**          | ~€5/month     | ~€30/month |

> **📖 Reference:** [ADR-007: Containerization](./architecture/adrs/ADR-007-accountinerizacto.md)

---

## 9. Quality and Tests

### 9.1 Methodology

**TDD - Test-Driven Development**

```
RED → GREEN → REFACTOR
 │       │         │
 │       │         └── Improve code keeping tests green
 │       └── Implement code minimum to pass
 └── Write failing test
```

### 9.2 Pyramid of Tests

```
                    ┌───────────┐
                    │    E2E    │  ~5%
                    │ Playwright│
                    ├───────────┤
                    │   Perf    │  ~5%
                    │    k6     │
                ┌───┴───────────┴───┐
                │    Integration     │  ~15%
                │  Supertest + DB   │
            ┌───┴───────────────────┴───┐
            │        Unit          │  ~75%
            │   Jest + Testing Library  │
            └───────────────────────────┘
```

### 9.3 Metrics of Quality

| Metric                | Backend   | Frontend  | Bloqueante |
| ---------------------- | --------- | --------- | ---------- |
| **Coverage Linhas**    | ≥ 80%     | ≥ 80%     |  Sim     |
| **Coverage Branches**  | ≥ 75%     | ≥ 75%     |  Sim     |
| **Coverage Functions** | ≥ 80%     | ≥ 80%     |  Sim     |
| **Tests E2E**         | 100% pass | 100% pass |  Sim     |
| **Performnce P95**    | < 500ms   | -         |  Warning |

### 9.4 Tools

| Tipo            | Backend                     | Frontend               |
| --------------- | --------------------------- | ---------------------- |
| **Unit**        | Jest                        | Jest + Testing Library |
| **Integration**  | Supertest + MySQL accountiner | MSW                    |
| **E2E**         | -                           | Playwright             |
| **Performnce** | k6                          | k6                     |
| **Coverage**    | Istanbul/c8                 | Istanbul/c8            |

### 9.5 CI Pipeline

```yaml
PR: ├── Lint + Type Check
  ├── Unit Tests (paralelo)
  │   ├── Backend (coverage ≥ 80%)
  │   └── Frontend (coverage ≥ 80%)
  └── Integration Tests

shouldlop: ├── ... (entires above)
  ├── E2E Tests
  └── Deploy Staging

main: ├── ... (entires above)
  ├── Performnce Tests
  └── Deploy Production
```

> **📖 Reference:** [ADR-009: Testing Strategy](./architecture/adrs/ADR-009-estrategia-tests.md)

---

## 10. Development Phases

### Phase 1 - MVP (8-10 weeks)

**Scope:**

- [ ] Setup of the project (Docker, CI/CD)
- [ ] Authentication and RBAC basic
- [ ] CRUD of students
- [ ] CRUD of instructores
- [ ] Cadastro of classs/schedules
- [ ] Schedule basic
- [ ] Enrollment simple

**Deliverables:**

- Syshas functional for records basics
- Schedule of classs operational
- Unit tests ≥ 80%

---

### Phase 2 - Financial (6-8 weeks)

**Scope:**

- [ ] Syshas of plans withplete
- [ ] Tabela of prices
- [ ] Integration Sicoob (boletos and PIX)
- [ ] Webhooks of payment
- [ ] Controle of delinquency
- [ ] Reports financial basics

**Deliverables:**

- Generation automatic of billing
- Low automatic of payments
- Dashboard financial

---

### Phase 3 - Operacional (6-8 weeks)

**Scope:**

- [ ] Syshas of reschedulings
- [ ] Digital contracts (integration D4Sign)
- [ ] Inventory control
- [ ] Reports withpletes
- [ ] Management of exams
- [ ] Document upload (S3)

**Deliverables:**

- Fluxo withplete of enrollment with contract
- Management of inventory operational
- Todos os reports

---

### Phase 4 - Refinamento (4-6 weeks)

**Scope:**

- [ ] Syshas of permissions granular
- [ ] Dashboard analytical
- [ ] Optimizations of performnce
- [ ] Tests E2E withpletes
- [ ] Tests of performnce
- [ ] Documentation final

**Deliverables:**

- Syshas withplete and otimizado
- Documentation technique
- Manual of the ube

---

## 11. Architectural Decisions

### Index of ADRs

| ADR                                                                    | Title                       | Status    |
| ---------------------------------------------------------------------- | ---------------------------- | --------- |
| [ADR-001](./architecture/adrs/ADR-001-arquitetura-monolito-modular.md) | Modular Monolith Architecture | Accepted |
| [ADR-002](./architecture/adrs/ADR-002-stack-tecnologica.md)            | Technology Stack            | Accepted |
| [ADR-003](./architecture/adrs/ADR-003-datebase-de-dados.md)               | Database               | Accepted |
| [ADR-004](./architecture/adrs/ADR-004-autenticacto-autorizacto.md)     | Authentication and Authorization   | Accepted |
| [ADR-005](./architecture/adrs/ADR-005-obbevabilidade.md)              | Obbevability              | Accepted |
| [ADR-006](./architecture/adrs/ADR-006-ci-cd.md)                        | CI/CD                        | Accepted |
| [ADR-007](./architecture/adrs/ADR-007-accountinerizacto.md)              | Containerization              | Accepted |
| [ADR-008](./architecture/adrs/ADR-008-integracto-sicoob.md)            | Integration Sicoob            | Accepted |
| [ADR-009](./architecture/adrs/ADR-009-estrategia-tests.md)            | Testing Strategy         | Accepted |

### Debate Arquitetural

- [DEBATE-001: Arquitetura Geral](./architecture/debates/DEBATE-001-arquitetura-geral.md)

---

## Appendices

### A. Glossary

| Term    | Definition                                                        |
| -------- | ---------------------------------------------------------------- |
| **ADR**  | Architecture Decision Record - record of decision arquitetural  |
| **DDD**  | Domain-Driven Design - design orientado to domain               |
| **TDD**  | Test-Driven Development - shouldlopment guiado por tests      |
| **RBAC** | Role-Based Access Control - controle of access baseado in roles |
| **CQRS** | Command Query Responsibility Segregation                         |
| **JWT**  | JSON Web Token                                                   |
| **PIX**  | Syshas of payment Brazilian instant                      |

### B. References

- [NestJS Documentation](https://docs.nestjs.with/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Sicoob API](https://shouldlopers.sicoob.with.br/)
- [LGPD](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)

---

**Documento gerado em:** 21/01/2026  
**Last updated:** 21/01/2026  
**Version:** 1.0
