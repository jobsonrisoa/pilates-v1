# 🧪 Documentação de Testes

## 📋 Visão Geral

Este documento descreve a estratégia de testes do projeto, como executá-los e como contribuir com novos testes.

### Princípios

- **TDD (Test-Driven Development)**: Red → Green → Refactor
- **Coverage mínimo**: 80% para testes unitários
- **Docker-first**: Todos os testes rodam em containers isolados
- **Isolamento**: Cada teste é independente e pode rodar em paralelo

---

## 🚀 Como Executar Testes

### Pré-requisitos

- Docker e Docker Compose instalados
- Nenhuma dependência local necessária (100% Docker)

### Comandos Principais

#### Testes Unitários

```bash
# Todos os testes unitários (API + Web)
docker compose run --rm tools pnpm test

# Apenas backend
docker compose run --rm tools pnpm --filter @pilates/api test

# Apenas frontend
docker compose run --rm tools pnpm --filter @pilates/web test

# Com coverage
docker compose run --rm tools pnpm test:cov

# Watch mode (desenvolvimento)
docker compose run --rm tools pnpm --filter @pilates/api test:watch
```

#### Testes de Integração

```bash
# Backend (requer MySQL e Redis rodando)
docker compose up -d mysql redis
docker compose run --rm tools pnpm --filter @pilates/api test:integration
```

#### Testes E2E (Playwright)

```bash
# Iniciar stack completa
docker compose up -d

# Rodar testes E2E
docker compose run --rm tools pnpm --filter @pilates/web test:e2e
```

#### Qualidade de Código

```bash
# Lint
docker compose run --rm tools pnpm lint

# Format check
docker compose run --rm tools pnpm format:check

# Format (auto-fix)
docker compose run --rm tools pnpm format

# Type check
docker compose run --rm tools pnpm typecheck
```

---

## 📁 Estrutura de Testes

### Backend (`apps/api`)

```
apps/api/
├── test/
│   ├── shared/              # Testes de código compartilhado
│   │   └── domain/
│   │       └── entity.base.spec.ts
│   ├── integration/         # Testes de integração
│   │   ├── health.e2e-spec.ts
│   │   └── setup.ts
│   ├── mocks/               # Mocks compartilhados
│   │   └── prisma.mock.ts
│   └── setup.ts             # Setup global
├── jest.config.ts           # Config unitários
└── jest.integration.config.ts # Config integração
```

### Frontend (`apps/web`)

```
apps/web/
├── components/
│   └── ui/
│       └── __tests__/
│           └── button.test.tsx
├── e2e/                     # Testes Playwright
│   └── login.spec.ts
├── test/
│   ├── mocks/               # MSW handlers
│   │   └── handlers.ts
│   └── setup.ts
├── jest.config.ts
└── playwright.config.ts
```

---

## 🎯 Tipos de Testes

### 1. Testes Unitários

**Objetivo**: Testar unidades isoladas de código (funções, classes, componentes).

**Ferramentas**:

- **Backend**: Jest + jest-mock-extended
- **Frontend**: Jest + Testing Library

**Exemplo (Backend)**:

```typescript
// test/shared/domain/entity.base.spec.ts
import { Entity, EntityProps } from '@/shared/domain/entity.base';

describe('Entity Base', () => {
  it('should create entity with auto-generated id', () => {
    const props: EntityProps = {};
    const entity = new TestEntity(props);
    expect(entity.id).toBeDefined();
  });
});
```

**Exemplo (Frontend)**:

```typescript
// components/ui/__tests__/button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### 2. Testes de Integração

**Objetivo**: Testar interação entre componentes (API + DB, componentes + hooks).

**Ferramentas**:

- **Backend**: Jest + Supertest + MySQL container
- **Frontend**: Jest + MSW (Mock Service Worker)

**Exemplo (Backend)**:

```typescript
// test/integration/health.e2e-spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';

describe('Health (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('ok');
      });
  });
});
```

### 3. Testes E2E (End-to-End)

**Objetivo**: Testar fluxos completos do usuário.

**Ferramentas**: Playwright

**Exemplo**:

```typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('http://localhost:3000/dashboard');
});
```

### 4. Testes de Performance

**Objetivo**: Validar performance e carga do sistema.

**Ferramentas**: k6

**Exemplo**:

```javascript
// tests/performance/health-load.js
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const res = http.get('http://localhost:3001/health');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
}
```

---

## 📊 Coverage

### Requisitos

- **Mínimo**: 80% de cobertura (linhas, branches, functions)
- **Ideal**: 90%+

### Verificar Coverage

```bash
# Backend
docker compose run --rm tools pnpm --filter @pilates/api test:cov

# Frontend
docker compose run --rm tools pnpm --filter @pilates/web test:cov

# Todos
docker compose run --rm tools pnpm test:cov
```

### Relatórios

Os relatórios são gerados em:

- `apps/api/coverage/`
- `apps/web/coverage/`

Abra `coverage/lcov-report/index.html` no navegador para visualizar.

### Thresholds Configurados

```typescript
// jest.config.ts
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
},
```

---

## 🔧 Configuração

### Jest (Backend)

**Arquivo**: `apps/api/jest.config.ts`

```typescript
export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s', '!**/*.module.ts', '!**/*.dto.ts', '!main.ts'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@modules/(.*)$': '<rootDir>/modules/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
  },
};
```

### Jest (Frontend)

**Arquivo**: `apps/web/jest.config.ts`

```typescript
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

export default createJestConfig({
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/*.d.ts', '!**/node_modules/**', '!**/.next/**'],
});
```

### Playwright

**Arquivo**: `apps/web/playwright.config.ts`

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 🐛 Troubleshooting

### Testes falhando no CI

**Problema**: Testes passam localmente mas falham no CI.

**Soluções**:

1. Verificar timeouts (aumentar se necessário)
2. Garantir que containers estão prontos antes dos testes
3. Verificar variáveis de ambiente

### Coverage abaixo do threshold

**Problema**: Coverage abaixo de 80%.

**Soluções**:

1. Adicionar testes para casos não cobertos
2. Verificar `collectCoverageFrom` no `jest.config.ts`
3. Revisar arquivos excluídos (`.module.ts`, `.dto.ts`)

### Testes lentos

**Problema**: Testes demoram muito para executar.

**Soluções**:

1. Usar `--maxWorkers` para paralelizar
2. Otimizar mocks (evitar I/O real)
3. Usar `jest.setTimeout()` apenas quando necessário

### Erro "Cannot find module"

**Problema**: Jest não encontra módulos com path aliases.

**Soluções**:

1. Verificar `moduleNameMapper` no `jest.config.ts`
2. Garantir que `tsconfig.json` tem os paths corretos
3. Reiniciar Jest (cache pode estar desatualizado)

---

## 🔄 CI/CD

### GitHub Actions

Os testes são executados automaticamente em:

- **Pull Requests**: Todos os testes (unit, integration, e2e)
- **Push para main**: Testes + coverage report
- **Cron diário**: Testes completos + performance

**Workflow**: `.github/workflows/test.yml`

```yaml
name: Tests

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - run: docker compose run --rm tools pnpm test
      - run: docker compose run --rm tools pnpm test:cov
```

---

## 📚 Boas Práticas

### 1. Nomenclatura

- **Arquivos de teste**: `*.spec.ts` (backend) ou `*.test.tsx` (frontend)
- **Descrever comportamentos**: Use `describe` e `it` descritivos
- **AAA Pattern**: Arrange → Act → Assert

### 2. Isolamento

- Cada teste deve ser independente
- Limpar estado entre testes (`beforeEach`, `afterEach`)
- Usar mocks para dependências externas

### 3. TDD Workflow

1. **RED**: Escrever teste que falha
2. **GREEN**: Implementar código mínimo para passar
3. **REFACTOR**: Melhorar código mantendo testes verdes

### 4. Testes Significativos

- Teste comportamentos, não implementação
- Evite testes triviais (getters/setters simples)
- Foque em casos de borda e erros

### 5. Performance

- Testes unitários devem ser rápidos (< 100ms cada)
- Testes de integração podem ser mais lentos (< 1s)
- E2E são os mais lentos (aceitável < 5s)

---

## 📖 Referências

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Playwright](https://playwright.dev/)
- [k6](https://k6.io/)
- [TDD by Example](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530)

---

## ✅ Checklist de Validação

Antes de fazer merge, certifique-se de:

- [ ] Todos os testes passando (`pnpm test`)
- [ ] Coverage acima de 80% (`pnpm test:cov`)
- [ ] Lint sem erros (`pnpm lint`)
- [ ] Formatação correta (`pnpm format:check`)
- [ ] Type check passando (`pnpm typecheck`)
- [ ] Testes E2E passando (se aplicável)
- [ ] Documentação atualizada

---

**Última atualização**: 2026-01-22  
**Mantido por**: Equipe de Desenvolvimento
