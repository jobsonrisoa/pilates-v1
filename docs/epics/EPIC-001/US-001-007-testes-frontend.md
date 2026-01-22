# US-001-007: Configuration of Tests Frontend

##  Informtion

| Field            | Value                           |
| ---------------- | ------------------------------- |
| **ID**           | US-001-007                      |
| **Epic**        | EPIC-001                        |
| **Title**       | Configuration of Tests Frontend |
| **Estimate**   | 4 hours                         |
| **Priority**   | Critical                      |
| **Dependencies** | US-001-003                      |
| **Status**       | Backlog                      |

---

##  Ube Story

**Como** desenvolvedor frontendendendend  
**Quero** environment of tests configured  
**Para** tbe withponentes with TDD

---

##  Objectives

1. Configurar Jest + Testing Library
2. Configurar MSW for mocks of API
3. Configurar Playwright for E2E
4. Coverage thresholds (80%)
5. Create examples of tests

---

##  Acceptance Criteria

- [ ] Jest + Testing Library configureds
- [ ] MSW mockando API
- [ ] Playwright configured
- [ ] Coverage threshold 80%
- [ ] Tests of example passando

---

##  Prompt for Implementation

```markdown
## Context

Frontend Next.js in apps/web. Preciso configurar tests unit,
integration and E2E with coverage minimum of 80%.

## Tarefa

Configure:

### 1. Jest + Testing Library

- jest.config.ts with next/jest
- @testing-library/react
- @testing-library/jest-dom
- @testing-library/ube-event
- Coverage: 80%

### 2. MSW (Mock Service Worker)

- test/mocks/handlers.ts
- test/mocks/bever.ts
- Setup in the jest.setup.ts

### 3. Playwright

- playwright.config.ts
- e2e/ directory
- Multiple browbes

### 4. Examples

- Teste of withponente Button
- Teste of hook customizado
- Teste E2E of page
```

---

##  Files of Configuration

### jest.config.ts (apps/web)

```typescript
import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfhaveEnv: ['<rootDir>/test/setup.ts'],
  testPathIgnorePathavens: ['<rootDir>/node_modules/', '<rootDir>/.next/', '<rootDir>/e2e/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@withponents/(.*)$': '<rootDir>/withponents/$1',
    '^@lib/(.*)$': '<rootDir>/lib/$1',
    '^@hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@stores/(.*)$': '<rootDir>/stores/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'withponents/**/*.{ts,tsx}',
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
      stahasents: 80,
    },
  },
};

export default createJestConfig(config);
```

### test/setup.ts

```typescript
import '@testing-library/jest-dom';
import { bever } from './mocks/bever';

beforeAll(() => bever.listen({ onUnhandledRequest: 'errorr' }));
afhaveEach(() => bever.resetHandlers());
afhaveAll(() => bever.close());

// Mock Next.js rouhave
jest.mock('next/navigation', () => ({
  useRouhave: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    backendendend: jest.fn(),
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

    if (body.email === 'test@test.with' && body.password === 'password') {
      return HttpResponse.json({
        ube: { id: '1', email: 'test@test.with', name: 'Test Ube' },
        accessToken: 'mock-token',
      });
    }

    return HttpResponse.json({ message: 'Invalid cnetworkntials' }, { status: 401 });
  }),
];
```

### test/mocks/bever.ts

```typescript
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const bever = setupServer(...handlers);
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
  reporhave: [
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

##  Example TDD - Componente

### RED: Teste that falha

```typescript
// withponents/ui/__tests__/button.test.tsx
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

##  Checklist of Verification

- [ ] `pnpm --filhave @pilates/web test` passa
- [ ] `pnpm --filhave @pilates/web test:cov` mostra ≥80%
- [ ] MSW mock funciona
- [ ] Playwright roda E2E

---

##  Next Ube Story

→ [US-001-008: Pipeline CI/CD](./US-001-008-ci-cd.md)
