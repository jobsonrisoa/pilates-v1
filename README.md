# Pilates & Physiotherapy Management System

Management system for Pilates and Physiotherapy studios.

## Quick Start (100% Docker)

### Requirements

- Docker 24+
- Docker Compose 2+
- Git

> **Note:** No need to install Node.js, pnpm, or databases locally.

### Installation

```bash
git clone <repo-url>
cd pilates
cp .env.example .env
make dev
```

## Project Structure

```
├── apps/
│   ├── api/          # Backend (NestJS)
│   └── web/          # Frontend (Next.js)
├── packages/         # Shared packages
├── docker/           # Docker configs (local infra)
├── docs/             # Documentation (PRD, ADRs, Epics)
└── .github/          # CI/CD
```

## Documentation

- **PRD**: `docs/PRD.md`
- **Architecture/ADRs**: `docs/architecture/`
- **Epics**: `docs/epics/`
- **EPIC-001 (User Stories)**: `docs/epics/EPIC-001/`
- **Testing**: `docs/testing/README.md`
- **FAQ**: `docs/FAQ.md`

## Useful Commands

```bash
make help
make dev
make down
make clean
```

## Monitoring (optional)

Start Prometheus + Grafana with:

```bash
docker compose --profile monitoring up
```

### Access URLs (dev)

- Web: `http://localhost:3000`
- API: `http://localhost:3001`
- Swagger: `http://localhost:3001/api`
- MailHog: `http://localhost:8025`
- MinIO Console: `http://localhost:9001`
- Prometheus (monitoring profile): `http://localhost:9090`
- Grafana (monitoring profile): `http://localhost:3002` (admin/admin)

## Project Principles

- **DDD** (Bounded Contexts, Shared Kernel)
- **TDD** (Red -> Green -> Refactor)
- **Minimum coverage**: 80% (frontend and backend)
- **Docker-first**: fully containerized local environment

## Best Practices

This project follows official NestJS and Next.js best practices:

### NestJS Best Practices ✅

- ✅ Global exception filter for consistent error handling
- ✅ Validation pipe with class-validator
- ✅ Environment variable validation with Zod
- ✅ Logging interceptor for request/response logging
- ✅ Secure CORS configuration
- ✅ DTOs with Swagger documentation
- ✅ Health checks with Terminus

### Next.js Best Practices ✅

- ✅ Error boundaries (root and route-specific)
- ✅ Loading states for all routes
- ✅ Custom not-found pages
- ✅ Middleware for route protection
- ✅ Environment variable validation
- ✅ Page metadata for SEO
- ✅ Font optimization (Inter)

### CI/CD Pipeline ✅

- ✅ Automated CI on every PR and push to `main`/`develop`
- ✅ Coverage threshold enforcement (≥80% required)
- ✅ Docker image builds and push to GitHub Container Registry
- ✅ Integration tests with MySQL/Redis services
- ✅ Staging auto-deploy on `develop`, Production manual approval on `main`
- ✅ PR size validation and required label checks
- ✅ Codecov integration for coverage tracking

See [BEST_PRACTICES_REVIEW.md](./BEST_PRACTICES_REVIEW.md) for detailed analysis and [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for implementation details.
