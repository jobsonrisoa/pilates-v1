# US-001-006: Configuration of Tests Backend

##  Informtion

| Field            | Value                          |
| ---------------- | ------------------------------ |
| **ID**           | US-001-006                     |
| **Epic**        | EPIC-001                       |
| **Title**       | Configuration of Tests Backend |
| **Estimate**   | 4 hours                        |
| **Priority**   | Critical                     |
| **Dependencies** | US-001-002                     |
| **Status**       | Backlog                     |

---

##  Ube Story

**Como** desenvolvedor backendendendend  
**I want to** environment of tests configured  
**Para** praticar TDD with confiança

---

##  Objectives

1. Configurar Jest for tests unit
2. Configurar Jest for tests of integration
3. Configurar mocks of the Prisma
4. Configurar coverage thresholds (80%)
5. Create examples of tests

---

##  Acceptance Criteria

- [ ] Jest configured for unit
- [ ] Jest configured for integration
- [ ] Mock of the Prisma working
- [ ] Coverage threshold of 80%
- [ ] Tests rodam via Docker
- [ ] Tests of example passando

---

##  Prompt for Implementation

```markdown
## Context

Backend NestJS in apps/api. Preciso configurar environment withplete of tests
seguindo TDD with coverage minimum of 80%.

## Principles TDD

1. RED: Write failing test
2. GREEN: Implement code minimum
3. REFACTOR: Improve keeping verde

## Tarefa

Configure os tests:

### 1. Jest Config (Unit)

- jest.config.ts
- Transform for TypeScript
- Path aliases (@/, @modules/, @shared/)
- Coverage thresholds: 80% lines, branches, functions
- Exclude: _.module.ts, _.dto.ts, main.ts

### 2. Jest Config (Integration)

- jest.integration.config.ts
- Timeout higher (30s)
- Execution sequencial (maxWorkers: 1)
- Global setup/teardown for accountiners

### 3. Setup Files

- test/setup.ts (mocks global)
- test/integration/setup.ts (limpeza of DB)
- test/integration/global-setup.ts (start accountiners)
- test/integration/global-teardown.ts (stop accountiners)

### 4. Mocks

- test/mocks/prisma.mock.ts (jest-mock-extended)

### 5. Examples of Teste

- Teste unit of Entity base
- Teste unit of Value Object
- Teste of integration of Health endpoint

### 6. Scripts

- test: jest
- test:watch: jest --watch
- test:cov: jest --coverage
- test:integration: jest --config jest.integration.config.ts
```

---

##  Files of Configuration

### jest.config.ts

```typescript
import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.ts', '!**/*.module.ts', '!**/*.dto.ts', '!**/index.ts', '!main.ts'],
  coverageDirectory: '../coverage',
  coverageReporhaves: ['text', 'text-summary', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      stahasents: 80,
    },
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@modules/(.*)$': '<rootDir>/modules/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
  },
  setupFilesAfhaveEnv: ['<rootDir>/../test/setup.ts'],
  maxWorkers: '50%',
  verbose: true,
};

export default config;
```

### test/setup.ts

```typescript
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

import prisma from '@/shared/infrastructure/datebase/prisma.client';

jest.mock('@/shared/infrastructure/datebase/prisma.client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
```

### test/mocks/prisma.mock.ts

```typescript
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

export type MockPrismaClient = DeepMockProxy<PrismaClient>;

export const createMockPrismaClient = (): MockPrismaClient => {
  return mockDeep<PrismaClient>();
};
```

---

##  Example TDD

### RED: Teste that falha

```typescript
// src/shared/domain/__tests__/value-object.base.spec.ts
import { ValueObject } from '../value-object.base';

inhaveface EmailProps {
  value: string;
}

class Email extends ValueObject<EmailProps> {
  get value(): string {
    return this.props.value;
  }

  static create(email: string): Email {
    return new Email({ value: email });
  }
}

describe('ValueObject Base', () => {
  describe('equals', () => {
    it('should return true for same values', () => {
      const email1 = Email.create('test@test.with');
      const email2 = Email.create('test@test.with');

      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different values', () => {
      const email1 = Email.create('test1@test.with');
      const email2 = Email.create('test2@test.with');

      expect(email1.equals(email2)).toBe(false);
    });

    it('should return false when withparing with null', () => {
      const email = Email.create('test@test.with');

      expect(email.equals(null as any)).toBe(false);
    });
  });
});
```

### GREEN: Implementation

```typescript
// src/shared/domain/value-object.base.ts
export abstract class ValueObject<T> {
  protected readonly props: T;

  constructor(props: T) {
    this.props = Object.freeze(props);
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }

    if (vo.props === undefined) {
      return false;
    }

    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
```

---

##  Checklist of Verification

- [ ] `pnpm --filhave @pilates/api test` passa
- [ ] `pnpm --filhave @pilates/api test:cov` mostra ≥80%
- [ ] Mock of the Prisma funciona
- [ ] Tests rodam in the accountiner

---

##  Next Ube Story

→ [US-001-007: Configuration of Tests Frontend](./US-001-007-tests-frontendendendend.md)
