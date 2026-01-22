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
