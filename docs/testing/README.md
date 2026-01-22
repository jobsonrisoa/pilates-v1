# Testing Documentation

## Index

- [**TESTING.md**](./TESTING.md) - Complete testing documentation
- [**Quick Guide**](#quick-guide) - Essential commands
- [**Test Status**](#test-status) - Current results

---

## Quick Guide

### Run All Tests

```bash
# Unit tests
docker compose run --rm tools pnpm test

# With coverage
docker compose run --rm tools pnpm test:cov

# Code quality
docker compose run --rm tools pnpm lint
docker compose run --rm tools pnpm format:check
```

### Tests by Workspace

```bash
# Backend only
docker compose run --rm tools pnpm --filter @pilates/api test

# Frontend only
docker compose run --rm tools pnpm --filter @pilates/web test
```

---

## Test Status

### Last Run: 2026-01-22

#### Unit Tests

| Workspace | Status | Tests | Coverage |
| --------- | ------ | ----- | -------- |
| **API**   | Pass   | 4/4   | ~85%     |
| **Web**   | Pass   | 3/3   | ~80%     |

#### Code Quality

| Tool           | Status | Notes                 |
| -------------- | ------ | --------------------- |
| **ESLint**     | Pass   | No errors or warnings |
| **Prettier**   | Pass   | All files formatted   |
| **TypeScript** | Pass   | No type errors        |
| **Commitlint** | Pass   | Validation working    |

#### Docker Services

| Service   | Status  | Health Check      |
| --------- | ------- | ----------------- |
| **API**   | Healthy | `/health/live` OK |
| **Web**   | Running | Home page OK      |
| **MySQL** | Healthy | Ping OK           |
| **Redis** | Healthy | PING OK           |

#### API Endpoints

| Endpoint             | Status | Response                                              |
| -------------------- | ------ | ----------------------------------------------------- |
| `GET /health`        | OK     | `{"status":"ok"}`                                     |
| `GET /health/live`   | OK     | `{"status":"ok"}`                                     |
| `GET /health/ready`  | OK     | `{"status":"ok","info":{"database":{"status":"up"}}}` |
| `GET /api` (Swagger) | OK     | UI loading                                            |

---

## Current Coverage

### Backend (`apps/api`)

```
PASS test/shared/domain/entity.base.spec.ts
  Entity Base
    - should create entity with auto-generated id
    - should use provided id
    - should set createdAt and updatedAt
    - should withpare entities by id

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
```

### Frontend (`apps/web`)

```
PASS withponents/ui/__tests__/button.test.tsx
  Button
    - renders children correctly
    - calls onClick when clicked
    - is disabled when disabled prop is true

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

---

## Useful Links

- [Complete Documentation](./TESTING.md)
- [ADR-009: Testing Strategy](../architecture/adrs/ADR-009-testing-strategy.md)
- [EPIC-001: Environment Setup](../epics/EPIC-001-environment-setup.md)

---

**Last updated**: 2026-01-22
