# Technology Stack

**Last Updated:** 2026-01-25  
**Project:** Pilates & Physiotherapy Management System

---

## 📋 Overview

This document lists all technologies, frameworks, libraries, and tools used in this repository.

---

## 🚀 Runtime & Language

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.18.0 LTS | JavaScript runtime |
| **TypeScript** | 5.3.3 | Type-safe JavaScript |
| **pnpm** | 8.15.0 | Package manager |

---

## 🏗️ Architecture

| Pattern | Implementation |
|---------|----------------|
| **Architecture** | Modular Monolith (DDD) |
| **Backend Pattern** | Domain-Driven Design (DDD) |
| **Frontend Pattern** | Component-based (React) |
| **Testing** | Test-Driven Development (TDD) |

---

## 🔧 Backend (NestJS)

### Core Framework

| Package | Version | Purpose |
|---------|---------|---------|
| `@nestjs/core` | ^10.0.0 | Core framework |
| `@nestjs/common` | ^10.0.0 | Common utilities |
| `@nestjs/platform-express` | ^10.0.0 | Express adapter |
| `@nestjs/config` | ^3.1.1 | Configuration management |
| `@nestjs/cli` | ^10.4.9 | NestJS CLI (dev) |

### API Documentation

| Package | Version | Purpose |
|---------|---------|---------|
| `@nestjs/swagger` | ^7.4.2 | OpenAPI/Swagger documentation |

### Health Checks

| Package | Version | Purpose |
|---------|---------|---------|
| `@nestjs/terminus` | ^10.3.0 | Health check endpoints |

### Validation & Transformation

| Package | Version | Purpose |
|---------|---------|---------|
| `class-validator` | ^0.14.3 | DTO validation |
| `class-transformer` | ^0.5.1 | Object transformation |
| `zod` | ^3.24.1 | Schema validation (env) |

### Security

| Package | Version | Purpose |
|---------|---------|---------|
| `helmet` | ^7.1.0 | Security headers |
| `compression` | ^1.7.5 | Response compression |
| `bcrypt` | ^6.0.0 | Password hashing |
| `@types/bcrypt` | ^6.0.0 | TypeScript types |

### Database & ORM

| Package | Version | Purpose |
|---------|---------|---------|
| `@prisma/client` | ^5.22.0 | Prisma ORM client |
| `prisma` | ^5.22.0 | Prisma CLI (dev) |

### Observability

| Package | Version | Purpose |
|---------|---------|---------|
| `nestjs-pino` | ^4.5.0 | Pino logger integration |
| `pino-http` | ^11.0.0 | HTTP request logging |
| `pino-pretty` | ^13.1.3 | Pretty logs (dev) |
| `@willsoto/nestjs-prometheus` | ^6.0.2 | Prometheus metrics |
| `prom-client` | ^15.1.3 | Prometheus client |
| `@sentry/node` | ^10.36.0 | Error tracking |
| `@sentry/profiling-node` | ^10.36.0 | Performance profiling |

### Testing

| Package | Version | Purpose |
|---------|---------|---------|
| `@nestjs/testing` | ^10.4.15 | NestJS testing utilities |
| `jest` | ^29.7.0 | Testing framework |
| `ts-jest` | ^29.2.5 | TypeScript Jest transformer |
| `supertest` | ^7.2.2 | HTTP testing |
| `jest-mock-extended` | ^3.0.7 | Extended Jest mocks |
| `@types/jest` | ^29.5.14 | Jest TypeScript types |
| `@types/supertest` | ^6.0.3 | Supertest TypeScript types |

### Development Tools

| Package | Version | Purpose |
|---------|---------|---------|
| `ts-node` | ^10.9.2 | TypeScript execution |
| `tsconfig-paths` | ^4.2.0 | Path mapping support |
| `reflect-metadata` | ^0.2.2 | Metadata reflection |
| `rxjs` | ^7.8.1 | Reactive programming |

---

## 🎨 Frontend (Next.js)

### Core Framework

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | ^14.2.24 | Next.js framework |
| `react` | ^18.3.1 | React library |
| `react-dom` | ^18.3.1 | React DOM renderer |

### State Management

| Package | Version | Purpose |
|---------|---------|---------|
| `@tanstack/react-query` | ^5.66.0 | Server state management |
| `zustand` | ^4.5.5 | Client state management |

### Styling

| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | ^3.4.17 | Utility-first CSS |
| `autoprefixer` | ^10.4.20 | CSS autoprefixer |
| `postcss` | ^8.5.1 | CSS post-processor |
| `class-variance-authority` | ^0.7.1 | Component variants |
| `clsx` | ^2.1.1 | Conditional classes |
| `tailwind-merge` | ^2.6.0 | Tailwind class merging |

### UI Components

| Package | Version | Purpose |
|---------|---------|---------|
| `lucide-react` | ^0.476.0 | Icon library |

### Theming

| Package | Version | Purpose |
|---------|---------|---------|
| `next-themes` | ^0.4.4 | Theme management |

### Validation

| Package | Version | Purpose |
|---------|---------|---------|
| `zod` | ^3.24.1 | Schema validation |

### Testing

| Package | Version | Purpose |
|---------|---------|---------|
| `@testing-library/react` | ^16.2.0 | React testing utilities |
| `@testing-library/jest-dom` | ^6.6.3 | DOM matchers |
| `@playwright/test` | ^1.58.0 | E2E testing |
| `msw` | ^2.12.7 | API mocking |
| `@mswjs/interceptors` | ^0.40.0 | MSW interceptors |
| `jest` | ^29.7.0 | Testing framework |
| `jest-environment-jsdom` | ^29.7.0 | JSDOM environment |
| `ts-jest` | ^29.2.5 | TypeScript Jest transformer |

### Development Tools

| Package | Version | Purpose |
|---------|---------|---------|
| `eslint-config-next` | ^14.2.24 | Next.js ESLint config |
| `@types/react` | ^18.3.18 | React TypeScript types |
| `@types/react-dom` | ^18.3.5 | React DOM TypeScript types |

---

## 🗄️ Database & Cache

| Technology | Version | Purpose |
|------------|---------|---------|
| **MySQL** | 8.0 | Primary database |
| **Redis** | 7-alpine | Cache & sessions |
| **Prisma** | 5.22.0 | ORM & migrations |

---

## 🐳 Containerization

| Technology | Version | Purpose |
|------------|---------|---------|
| **Docker** | 24+ | Container runtime |
| **Docker Compose** | 2+ | Multi-container orchestration |
| **Base Image (API)** | node:20.18.0-bookworm-slim | Debian-based image |
| **Base Image (Web)** | node:20.18.0-alpine | Alpine-based image |

---

## 🔍 Code Quality

### Linting

| Package | Version | Purpose |
|---------|---------|---------|
| `eslint` | ^8.57.0 | JavaScript linter |
| `@typescript-eslint/parser` | ^8.19.0 | TypeScript ESLint parser |
| `@typescript-eslint/eslint-plugin` | ^8.19.0 | TypeScript ESLint rules |
| `eslint-config-prettier` | ^9.1.0 | Prettier integration |
| `eslint-plugin-import` | ^2.31.0 | Import/export linting |

### Formatting

| Package | Version | Purpose |
|---------|---------|---------|
| `prettier` | ^3.4.2 | Code formatter |

### Git Hooks

| Package | Version | Purpose |
|---------|---------|---------|
| `husky` | ^9.0.0 | Git hooks |
| `lint-staged` | ^15.3.0 | Run linters on staged files |
| `@commitlint/cli` | ^19.6.1 | Commit message linting |
| `@commitlint/config-conventional` | ^19.6.0 | Conventional commits |

---

## 🚢 CI/CD

| Technology | Purpose |
|------------|---------|
| **GitHub Actions** | Continuous Integration |
| **GitHub Container Registry** | Docker image registry |
| **Codecov** | Coverage tracking |

### CI/CD Workflows

- `.github/workflows/ci.yml` - Lint, test, build
- `.github/workflows/deploy.yml` - Staging/Production deployment
- `.github/workflows/pr-check.yml` - PR validation

---

## 📊 Observability & Monitoring

| Technology | Purpose |
|------------|---------|
| **Pino** | Structured logging |
| **Prometheus** | Metrics collection |
| **Grafana** | Metrics visualization |
| **Sentry** | Error tracking & profiling |

---

## 🛠️ Development Services

| Service | Version | Purpose |
|---------|---------|---------|
| **MailHog** | latest | Email testing (dev) |
| **MinIO** | latest | Object storage (dev) |

---

## 📦 Package Management

| Tool | Version | Purpose |
|------|---------|---------|
| **pnpm** | 8.15.0 | Package manager |
| **Corepack** | Built-in | Package manager versioning |

---

## 🧪 Testing Strategy

### Backend Testing

- **Unit Tests:** Jest + @nestjs/testing
- **Integration Tests:** Jest + Supertest
- **Coverage Threshold:** ≥80%

### Frontend Testing

- **Unit Tests:** Jest + Testing Library
- **E2E Tests:** Playwright
- **API Mocking:** MSW (Mock Service Worker)
- **Coverage Threshold:** ≥80%

---

## 📁 Project Structure

```
pilates/
├── apps/
│   ├── api/          # NestJS backend
│   └── web/          # Next.js frontend
├── packages/          # Shared packages (future)
├── docker/           # Docker configurations
├── docs/             # Documentation
│   ├── architecture/ # ADRs, debates
│   ├── epics/        # User stories
│   └── testing/      # Testing docs
└── .github/          # CI/CD workflows
```

---

## 🔐 Security

| Technology | Purpose |
|------------|---------|
| **Helmet** | Security headers |
| **bcrypt** | Password hashing (12 rounds) |
| **JWT** | Authentication tokens |
| **CORS** | Cross-origin resource sharing |
| **Rate Limiting** | API protection (planned) |

---

## 📚 Documentation

| Tool | Purpose |
|------|---------|
| **Swagger/OpenAPI** | API documentation |
| **Markdown** | Project documentation |
| **ADRs** | Architecture Decision Records |

---

## 🌐 Deployment

| Environment | Technology |
|-------------|------------|
| **Development** | Docker Compose (local) |
| **Staging** | Automated (GitHub Actions) |
| **Production** | Manual approval (GitHub Actions) |

---

## 📊 Version Summary

### Core Versions

- **Node.js:** 20.18.0 LTS
- **TypeScript:** 5.3.3
- **NestJS:** 10.x
- **Next.js:** 14.2.24
- **React:** 18.3.1
- **Prisma:** 5.22.0
- **pnpm:** 8.15.0

### Database Versions

- **MySQL:** 8.0
- **Redis:** 7-alpine

---

## 🔄 Update Policy

- **Node.js:** LTS versions only
- **Dependencies:** Regular updates with testing
- **Security:** Immediate updates for vulnerabilities
- **Breaking Changes:** Major version updates require ADR

---

## 📖 References

- [ADR-002: Technology Stack](../docs/architecture/adrs/ADR-002-stack-tecnologica.md)
- [ADR-001: Architecture](../docs/architecture/adrs/ADR-001-arquitetura-monolito-modular.md)
- [ADR-007: Containerization](../docs/architecture/adrs/ADR-007-containerizacao.md)
- [ADR-006: CI/CD](../docs/architecture/adrs/ADR-006-ci-cd.md)

---

**Last Updated:** 2026-01-25  
**Maintained By:** Development Team

