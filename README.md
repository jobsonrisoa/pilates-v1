# 🏋️ Sistema de Gestão - Pilates & Fisioterapia

Sistema de gestão para academia de Pilates e Fisioterapia.

## 🚀 Quick Start (100% Docker)

### Requisitos

- Docker 24+
- Docker Compose 2+
- Git

> **Nota:** não é necessário instalar Node.js, pnpm ou banco de dados localmente.

### Instalação

```bash
git clone <repo-url>
cd pilates
cp .env.example .env
make dev
```

## 📁 Estrutura do Projeto

```
├── apps/
│   ├── api/          # Backend (NestJS) - a ser implementado
│   └── web/          # Frontend (Next.js) - a ser implementado
├── packages/         # Shared packages
├── docker/           # Configurações Docker (infra local)
├── docs/             # Documentação (PRD, ADRs, Épicos)
└── .github/          # CI/CD
```

## 🧭 Documentação

- **PRD**: `docs/PRD.md`
- **Arquitetura/ADRs**: `docs/architecture/`
- **Épicos**: `docs/epics/`
- **EPIC-001 (USs)**: `docs/epics/EPIC-001/`

## 🛠️ Comandos Úteis

```bash
make help
make dev
make down
make clean
```

## 📈 Monitoring (opcional)

Suba Prometheus + Grafana com:

```bash
docker compose --profile monitoring up
```

### Acessos (dev)

- Web: `http://localhost:3000`
- API: `http://localhost:3001`
- Swagger: `http://localhost:3001/api`
- MailHog: `http://localhost:8025`
- MinIO Console: `http://localhost:9001`
- Prometheus (profile monitoring): `http://localhost:9090`
- Grafana (profile monitoring): `http://localhost:3002` (admin/admin)

## ✅ Princípios do Projeto

- **DDD** (Bounded Contexts, Shared Kernel)
- **TDD** (Red → Green → Refactor)
- **Cobertura mínima**: 80% (front e back)
- **Docker-first**: ambiente local totalmente containerizado

