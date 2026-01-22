# Project Documentation

## Pilates & Physiotherapy Management System

---

## Documentation Structure

```
docs/
├── README.md                    # This file
├── PRD.md                       # Product Requirements Document
│
├── epics/                       # Jira Epics
│   ├── README.md                # Index and roadmap
│   ├── EPIC-001-environment-setup.md
│   ├── EPIC-002-authentication.md
│   ├── EPIC-003-student-management.md
│   ├── EPIC-004-instructor-management.md
│   ├── EPIC-005-class-management.md
│   ├── EPIC-006-schedule.md
│   ├── EPIC-007-enrollments.md
│   ├── EPIC-008-pricing-plans.md
│   ├── EPIC-009-sicoob-integration.md
│   └── EPIC-010-payments.md
│
├── testing/                      # Testing documentation
│   ├── README.md                # Index and test status
│   └── TESTING.md               # Complete testing documentation
│
└── architecture/
    ├── debates/
    │   └── DEBATE-001-general-architecture.md
    │
    └── adrs/
        ├── ADR-001-modular-monolith-architecture.md
        ├── ADR-002-technology-stack.md
        ├── ADR-003-database.md
        ├── ADR-004-authentication-authorization.md
        ├── ADR-005-observability.md
        ├── ADR-006-ci-cd.md
        ├── ADR-007-containerization.md
        ├── ADR-008-sicoob-integration.md
        └── ADR-009-testing-strategy.md
```

---

## Documents

### Testing

| Document                           | Description                     |
| ---------------------------------- | ------------------------------- |
| [README](./testing/README.md)      | Index and test status           |
| [TESTING.md](./testing/TESTING.md) | Complete testing documentation  |

### PRD (Product Requirements Document)

The [PRD](./PRD.md) is the main document that consolidates all system requirements:

- Overview and objectives
- Technology stack
- Architecture
- Detailed functional modules
- Non-functional requirements
- Development phases

---

### Architectural Debates

| Document                                                             | Description                                   |
| -------------------------------------------------------------------- | --------------------------------------------- |
| [DEBATE-001](./architecture/debates/DEBATE-001-general-architecture.md) | Debate between specialists on general architecture |

---

### ADRs (Architecture Decision Records)

| ADR                                                                      | Title                                     | Status   |
| ------------------------------------------------------------------------ | ----------------------------------------- | -------- |
| [ADR-001](./architecture/adrs/ADR-001-modular-monolith-architecture.md)  | Modular Monolith Architecture             | Accepted |
| [ADR-002](./architecture/adrs/ADR-002-technology-stack.md)               | Technology Stack                          | Accepted |
| [ADR-003](./architecture/adrs/ADR-003-database.md)                       | Database (MySQL + Prisma)                 | Accepted |
| [ADR-004](./architecture/adrs/ADR-004-authentication-authorization.md)   | Authentication and Authorization (JWT + RBAC) | Accepted |
| [ADR-005](./architecture/adrs/ADR-005-observability.md)                  | Observability (Logs, Metrics, Errors)     | Accepted |
| [ADR-006](./architecture/adrs/ADR-006-ci-cd.md)                          | CI/CD (GitHub Actions)                    | Accepted |
| [ADR-007](./architecture/adrs/ADR-007-containerization.md)               | Containerization (Docker)                 | Accepted |
| [ADR-008](./architecture/adrs/ADR-008-sicoob-integration.md)             | Banking Integration (Sicoob)              | Accepted |
| [ADR-009](./architecture/adrs/ADR-009-testing-strategy.md)               | Testing Strategy (TDD, 80% coverage)      | Accepted |

---

## Key Decisions

### Architecture

- **Modular Monolith** with DDD (Domain-Driven Design)
- Prepared to evolve to microservices
- Inter-module communication via domain events

### Stack

- **Backend:** NestJS + TypeScript + Prisma + MySQL
- **Frontend:** Next.js 14 (App Router) + React + TailwindCSS
- **Cache:** Redis
- **Storage:** MinIO (dev) / S3 (prod)

### Quality

- **TDD** (Red-Green-Refactor)
- **Minimum coverage:** 80% (unit tests)
- **Integration tests** with isolated containers
- **E2E** with Playwright
- **Performance** with k6

### Infrastructure

- **100% Docker** (nothing installed locally)
- **CI/CD:** GitHub Actions
- **Hosting:** Hetzner/DigitalOcean (low cost)
- **Observability:** Pino + Prometheus + Grafana + Sentry

---

## Quick Start

```bash
# 1. Clone repository
git clone <repo-url>
cd pilates-system

# 2. Copy environment variables
cp .env.example .env

# 3. Start development environment
docker compose up

# 4. Access
# Frontend: http://localhost:3000
# API: http://localhost:3001
# API Docs: http://localhost:3001/api
```

---

## Roadmap

| Phase                    | Scope                          | Duration    |
| ------------------------ | ------------------------------ | ----------- |
| **Phase 1 - MVP**        | Auth, Records, Schedule        | 8-10 weeks  |
| **Phase 2 - Financial**  | Plans, Sicoob, Payments        | 6-8 weeks   |
| **Phase 3 - Operations** | Rescheduling, Contracts, Stock | 6-8 weeks   |
| **Phase 4 - Refinement** | Permissions, Performance, Docs | 4-6 weeks   |

---

## Conventions

### Commits

```
feat: add student registration
fix: correct CPF validation
docs: update README
test: add tests for StudentService
refactor: extract validation to value object
```

### Branches

```
main        -> production
develop     -> staging
feature/*   -> new features
bugfix/*    -> fixes
hotfix/*    -> urgent fixes in prod
```

---

## Contributing

1. Create branch from `develop`
2. Implement with TDD (tests first!)
3. Ensure coverage >= 80%
4. Open PR to `develop`
5. Wait for review and CI to pass
