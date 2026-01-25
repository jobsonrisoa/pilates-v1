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
# 1. Clone the repository
git clone <repo-url>
cd pilates

# 2. Copy environment variables
cp .env.example .env

# 3. Start the development environment
make dev

# 4. (Optional) Seed the database with initial data
make seed
```

### Quick Start (3 Steps)

1. **Clone and setup**
   ```bash
   git clone <repo-url> && cd pilates
   cp .env.example .env
   ```

2. **Start services**
   ```bash
   make dev
   ```

3. **Seed database (optional)**
   ```bash
   make seed
   ```

**Default Admin Credentials:**
- Email: `admin@pilates.with`
- Password: `Admin@123`

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

| Service | URL | Description |
|---------|-----|-------------|
| **Web** | http://localhost:3000 | Frontend application |
| **API** | http://localhost:3001 | Backend API |
| **Swagger** | http://localhost:3001/api | API documentation |
| **Metrics** | http://localhost:3001/metrics | Prometheus metrics |
| **MailHog** | http://localhost:8025 | Email testing |
| **MinIO Console** | http://localhost:9001 | File storage |
| **Prometheus** | http://localhost:9090 | Metrics (monitoring profile) |
| **Grafana** | http://localhost:3002 | Dashboards (monitoring profile) |

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
- ✅ Structured logging (Pino) - JSON in prod, pretty in dev
- ✅ Prometheus metrics endpoint (`/metrics`)
- ✅ Sentry error tracking (production only)
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

### Observability ✅

- ✅ Structured logging with Pino (JSON in production, pretty in development)
- ✅ Prometheus metrics endpoint at `/metrics`
- ✅ Sentry error tracking (production only, filters 4xx errors)
- ✅ Sensitive data redaction in logs (passwords, tokens, CPF)

See [BEST_PRACTICES_REVIEW.md](./BEST_PRACTICES_REVIEW.md) for detailed analysis and [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for implementation details.
