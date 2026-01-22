# US-001-006: Configuração de Testes Backend

##  Informações

| Campo            | Valor                          |
| ---------------- | ------------------------------ |
| **ID**           | US-001-006                     |
| **Épico**        | EPIC-001                       |
| **Título**       | Configuração de Testes Backend |
| **Estimativa**   | 4 horas                        |
| **Prioridade**   | Critical                     |
| **Dependências** | US-001-002                     |
| **Status**       | Backlog                     |

---

##  User Story

**Como** desenvolvedor backend  
**Quero** ambiente de testes configurado  
**Para** praticar TDD com confiança

---

##  Objetivos

1. Configurar Jest para testes unitários
2. Configurar Jest para testes de integração
3. Configurar mocks do Prisma
4. Configurar coverage thresholds (80%)
5. Criar exemplos de testes

---

##  Critérios de Aceite

- [ ] Jest configurado para unitários
- [ ] Jest configurado para integração
- [ ] Mock do Prisma funcionando
- [ ] Coverage threshold de 80%
- [ ] Testes rodam via Docker
- [ ] Testes de exemplo passando

---

##  Prompt para Implementação

```markdown
## Contexto

Backend NestJS em apps/api. Preciso configurar ambiente completo de testes
seguindo TDD com coverage mínimo de 80%.

## Princípios TDD

1. RED: Escrever teste que falha
2. GREEN: Implementar código mínimo
3. REFACTOR: Melhorar mantendo verde

## Tarefa

Configure os testes:

### 1. Jest Config (Unitários)

- jest.config.ts
- Transform para TypeScript
- Path aliases (@/, @modules/, @shared/)
- Coverage thresholds: 80% lines, branches, functions
- Exclude: _.module.ts, _.dto.ts, main.ts

### 2. Jest Config (Integração)

- jest.integration.config.ts
- Timeout maior (30s)
- Execução sequencial (maxWorkers: 1)
- Global setup/teardown para containers

### 3. Setup Files

- test/setup.ts (mocks globais)
- test/integration/setup.ts (limpeza de DB)
- test/integration/global-setup.ts (start containers)
- test/integration/global-teardown.ts (stop containers)

### 4. Mocks

- test/mocks/prisma.mock.ts (jest-mock-extended)

### 5. Exemplos de Teste

- Teste unitário de Entity base
- Teste unitário de Value Object
- Teste de integração de Health endpoint

### 6. Scripts

- test: jest
- test:watch: jest --watch
- test:cov: jest --coverage
- test:integration: jest --config jest.integration.config.ts
```

---

##  Arquivos de Configuração

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
  coverageReporters: ['text', 'text-summary', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@modules/(.*)$': '<rootDir>/modules/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/../test/setup.ts'],
  maxWorkers: '50%',
  verbose: true,
};

export default config;
```

### test/setup.ts

```typescript
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

import prisma from '@/shared/infrastructure/database/prisma.client';

jest.mock('@/shared/infrastructure/database/prisma.client', () => ({
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

##  Exemplo TDD

### RED: Teste que falha

```typescript
// src/shared/domain/__tests__/value-object.base.spec.ts
import { ValueObject } from '../value-object.base';

interface EmailProps {
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
      const email1 = Email.create('test@test.com');
      const email2 = Email.create('test@test.com');

      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different values', () => {
      const email1 = Email.create('test1@test.com');
      const email2 = Email.create('test2@test.com');

      expect(email1.equals(email2)).toBe(false);
    });

    it('should return false when comparing with null', () => {
      const email = Email.create('test@test.com');

      expect(email.equals(null as any)).toBe(false);
    });
  });
});
```

### GREEN: Implementação

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

##  Checklist de Verificação

- [ ] `pnpm --filter @pilates/api test` passa
- [ ] `pnpm --filter @pilates/api test:cov` mostra ≥80%
- [ ] Mock do Prisma funciona
- [ ] Testes rodam no container

---

##  Próxima User Story

→ [US-001-007: Configuração de Testes Frontend](./US-001-007-testes-frontend.md)
