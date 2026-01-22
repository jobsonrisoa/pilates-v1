# US-001-007: Configuração de Testes Frontend

##  Informações

| Campo            | Valor                           |
| ---------------- | ------------------------------- |
| **ID**           | US-001-007                      |
| **Épico**        | EPIC-001                        |
| **Título**       | Configuração de Testes Frontend |
| **Estimativa**   | 4 horas                         |
| **Prioridade**   | Critical                      |
| **Dependências** | US-001-003                      |
| **Status**       | Backlog                      |

---

##  User Story

**Como** desenvolvedor frontend  
**Quero** ambiente de testes configurado  
**Para** testar componentes com TDD

---

##  Objetivos

1. Configurar Jest + Testing Library
2. Configurar MSW para mocks de API
3. Configurar Playwright para E2E
4. Coverage thresholds (80%)
5. Criar exemplos de testes

---

##  Critérios de Aceite

- [ ] Jest + Testing Library configurados
- [ ] MSW mockando API
- [ ] Playwright configurado
- [ ] Coverage threshold 80%
- [ ] Testes de exemplo passando

---

##  Prompt para Implementação

```markdown
## Contexto

Frontend Next.js em apps/web. Preciso configurar testes unitários,
integração e E2E com coverage mínimo de 80%.

## Tarefa

Configure:

### 1. Jest + Testing Library

- jest.config.ts com next/jest
- @testing-library/react
- @testing-library/jest-dom
- @testing-library/user-event
- Coverage: 80%

### 2. MSW (Mock Service Worker)

- test/mocks/handlers.ts
- test/mocks/server.ts
- Setup no jest.setup.ts

### 3. Playwright

- playwright.config.ts
- e2e/ directory
- Múltiplos browsers

### 4. Exemplos

- Teste de componente Button
- Teste de hook customizado
- Teste E2E de página
```

---

##  Arquivos de Configuração

### jest.config.ts (apps/web)

```typescript
import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/', '<rootDir>/e2e/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@lib/(.*)$': '<rootDir>/lib/$1',
    '^@hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@stores/(.*)$': '<rootDir>/stores/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default createJestConfig(config);
```

### test/setup.ts

```typescript
import '@testing-library/jest-dom';
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));
```

### test/mocks/handlers.ts

```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' });
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    if (body.email === 'test@test.com' && body.password === 'password') {
      return HttpResponse.json({
        user: { id: '1', email: 'test@test.com', name: 'Test User' },
        accessToken: 'mock-token',
      });
    }

    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }),
];
```

### test/mocks/server.ts

```typescript
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

### playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
});
```

---

##  Exemplo TDD - Componente

### RED: Teste que falha

```typescript
// components/ui/__tests__/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click</Button>);

    fireEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

---

##  Checklist de Verificação

- [ ] `pnpm --filter @pilates/web test` passa
- [ ] `pnpm --filter @pilates/web test:cov` mostra ≥80%
- [ ] MSW mock funciona
- [ ] Playwright roda E2E

---

##  Próxima User Story

→ [US-001-008: Pipeline CI/CD](./US-001-008-ci-cd.md)
