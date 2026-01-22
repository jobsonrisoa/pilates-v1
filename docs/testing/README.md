# 🧪 Documentação de Testes

## 📚 Índice

- [**TESTING.md**](./TESTING.md) - Documentação completa de testes
- [**Guia Rápido**](#-guia-rápido) - Comandos essenciais
- [**Status dos Testes**](#-status-dos-testes) - Resultados atuais

---

## 🚀 Guia Rápido

### Executar Todos os Testes

```bash
# Testes unitários
docker compose run --rm tools pnpm test

# Com coverage
docker compose run --rm tools pnpm test:cov

# Qualidade de código
docker compose run --rm tools pnpm lint
docker compose run --rm tools pnpm format:check
```

### Testes por Workspace

```bash
# Backend apenas
docker compose run --rm tools pnpm --filter @pilates/api test

# Frontend apenas
docker compose run --rm tools pnpm --filter @pilates/web test
```

---

## ✅ Status dos Testes

### Última Execução: 2026-01-22

#### Testes Unitários

| Workspace | Status  | Testes | Coverage |
| --------- | ------- | ------ | -------- |
| **API**   | ✅ Pass | 4/4    | ~85%     |
| **Web**   | ✅ Pass | 3/3    | ~80%     |

#### Qualidade de Código

| Ferramenta     | Status  | Observações                  |
| -------------- | ------- | ---------------------------- |
| **ESLint**     | ✅ Pass | Sem erros ou warnings        |
| **Prettier**   | ✅ Pass | Todos os arquivos formatados |
| **TypeScript** | ✅ Pass | Sem erros de tipo            |
| **Commitlint** | ✅ Pass | Validação funcionando        |

#### Serviços Docker

| Serviço   | Status     | Health Check      |
| --------- | ---------- | ----------------- |
| **API**   | ✅ Healthy | `/health/live` OK |
| **Web**   | ✅ Running | Página inicial OK |
| **MySQL** | ✅ Healthy | Ping OK           |
| **Redis** | ✅ Healthy | PING OK           |

#### Endpoints da API

| Endpoint             | Status | Resposta                                              |
| -------------------- | ------ | ----------------------------------------------------- |
| `GET /health`        | ✅ OK  | `{"status":"ok"}`                                     |
| `GET /health/live`   | ✅ OK  | `{"status":"ok"}`                                     |
| `GET /health/ready`  | ✅ OK  | `{"status":"ok","info":{"database":{"status":"up"}}}` |
| `GET /api` (Swagger) | ✅ OK  | UI carregando                                         |

---

## 📊 Coverage Atual

### Backend (`apps/api`)

```
PASS test/shared/domain/entity.base.spec.ts
  Entity Base
    ✓ should create entity with auto-generated id
    ✓ should use provided id
    ✓ should set createdAt and updatedAt
    ✓ should compare entities by id

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
```

### Frontend (`apps/web`)

```
PASS components/ui/__tests__/button.test.tsx
  Button
    ✓ renders children correctly
    ✓ calls onClick when clicked
    ✓ is disabled when disabled prop is true

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

---

## 🔗 Links Úteis

- [Documentação Completa](./TESTING.md)
- [ADR-009: Estratégia de Testes](../architecture/adrs/ADR-009-estrategia-testes.md)
- [EPIC-001: Setup Ambiente](../epics/EPIC-001-setup-ambiente.md)

---

**Última atualização**: 2026-01-22
