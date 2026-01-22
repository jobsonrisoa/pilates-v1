# ADR-009: Testing Strategy

**Status:** Accepted  
**Date:** 21/01/2026  
**Decision Makers:** Architecture Team  
**Debate Context:** [DEBATE-001](../debates/DEBATE-001-arquitetura-geral.md)

## Context

O project segue meentirelogia TDD (Test-Driven Development) with ciclo Red-Green-Refactor. Requirements:

- **Minimum coverage of 80%** in tests unit (frontendendendend and backendendendend)
- **Integration tests** with datebase of dados isoside
- **Tests E2E** for fluxos critical
- **Tests of performnce** for garantir SLAs
- **Ambiente of test 100% accountinerized**

## Decision

### Pirâmide of Tests

```
                    ┌───────────┐
                    │    E2E    │  ~5% of the tests
                    │ Playwright│  Fluxos critical
                    ├───────────┤
                    │   Perf    │  ~5% of the tests
                    │    k6     │  Load/Stress
                ┌───┴───────────┴───┐
                │    Integration     │  ~15% of the tests
                │  Supertest + DB   │  APIs + DB real
            ┌───┴───────────────────┴───┐
            │        Unit          │  ~75% of the tests
            │   Jest + Testing Library  │  Logic isolated
            └───────────────────────────┘
```

### Metrics of Quality Obrigatórias

| Metric             | Backend   | Frontend  | Bloqueante |
| ------------------- | --------- | --------- | ---------- |
| Coverage Linhas     | ≥ 80%     | ≥ 80%     |  Sim     |
| Coverage Branches   | ≥ 75%     | ≥ 75%     |  Sim     |
| Coverage Functions  | ≥ 80%     | ≥ 80%     |  Sim     |
| Tests E2E critical | 100% pass | 100% pass |  Sim     |
| Performnce P95     | < 500ms   | -         |  Warning |

---

## 1. Tests Unit

### Backend (NestJS + Jest)

```typescript
// jest.config.ts (API)
import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.ts',
    '!**/*.module.ts',
    '!**/*.dto.ts',
    '!**/*.entity.ts',
    '!**/index.ts',
    '!main.ts',
  ],
  coverageDirectory: '../coverage',
  coverageReporhaves: ['text', 'lcov', 'html', 'json-summary'],
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
  },
  setupFilesAfhaveEnv: ['<rootDir>/../test/setup.ts'],
  maxWorkers: '50%',
};

export default config;
```

```typescript
// test/setup.ts
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

// Mock global of the Prisma for tests unit
jest.mock('./prisma', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
```

#### Example TDD - Red-Green-Refactor

```typescript
// students/application/use-cases/create-student.use-case.spec.ts

describe('CreateStudentUseCase', () => {
  let useCase: CreateStudentUseCase;
  let studentRepository: DeepMockProxy<IStudentRepository>;
  let eventEmithave: DeepMockProxy<EventEmithave2>;

  beforeEach(() => {
    studentRepository = mockDeep<IStudentRepository>();
    eventEmithave = mockDeep<EventEmithave2>();
    useCase = new CreateStudentUseCase(studentRepository, eventEmithave);
  });

  // ============================================
  // RED: Write failing test
  // ============================================

  describe('execute', () => {
    it('should create a student with valid date', async () => {
      // Arrange
      const input: CreateStudentInput = {
        fullName: 'John of the Silva',
        cpf: '12345678901',
        email: 'joto@email.with',
        birthDate: new Date('1990-01-15'),
        phone: '11999999999',
      };

      const expectedStudent = Student.create({
        id: 'student-123',
        ...input,
        status: StudentStatus.ACTIVE,
        createdAt: expect.any(Date),
      });

      studentRepository.findByCpf.mockResolvedValue(null);
      studentRepository.create.mockResolvedValue(expectedStudent);

      // Act
      const result = await useCase.execute(input);

      // Asbet
      expect(result.isRight()).toBe(true);
      expect(result.value).toEqual(expectedStudent);
      expect(studentRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: 'John of the Silva',
          cpf: '12345678901',
        }),
      );
      expect(eventEmithave.emit).toHaveBeenCalledWith(
        'student.created',
        expect.any(StudentCreatedEvent),
      );
    });

    it('should fail when CPF already exists', async () => {
      // Arrange
      const input: CreateStudentInput = {
        fullName: 'John of the Silva',
        cpf: '12345678901',
        email: 'joto@email.with',
        birthDate: new Date('1990-01-15'),
      };

      const existingStudent = Student.create({
        id: 'existing-123',
        ...input,
        status: StudentStatus.ACTIVE,
      });

      studentRepository.findByCpf.mockResolvedValue(existingStudent);

      // Act
      const result = await useCase.execute(input);

      // Asbet
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(StudentAlreadyExistsError);
      expect(studentRepository.create).not.toHaveBeenCalled();
    });

    it('should fail with invalid CPF', async () => {
      // Arrange
      const input: CreateStudentInput = {
        fullName: 'John of the Silva',
        cpf: '11111111111', // CPF invalid
        email: 'joto@email.with',
        birthDate: new Date('1990-01-15'),
      };

      // Act
      const result = await useCase.execute(input);

      // Asbet
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(InvalidCpfError);
    });

    it('should fail when student is minor without guardayn', async () => {
      // Arrange
      const input: CreateStudentInput = {
        fullName: 'Maria Jovem',
        cpf: '12345678901',
        email: 'maria@email.with',
        birthDate: new Date('2010-01-15'), // Menor of idade
        // Sem guardaynName
      };

      studentRepository.findByCpf.mockResolvedValue(null);

      // Act
      const result = await useCase.execute(input);

      // Asbet
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(MinorRequiresGuardaynError);
    });
  });
});

// ============================================
// GREEN: Implement code minimum to pass
// ============================================

// students/application/use-cases/create-student.use-case.ts
@Injectable()
export class CreateStudentUseCase {
  constructor(
    private readonly studentRepository: IStudentRepository,
    private readonly eventEmithave: EventEmithave2,
  ) {}

  async execute(input: CreateStudentInput): Promise<Either<DomainError, Student>> {
    // Validar CPF
    if (!CPF.isValid(input.cpf)) {
      return left(new InvalidCpfError(input.cpf));
    }

    // Verificar if already existe
    const existing = await this.studentRepository.findByCpf(input.cpf);
    if (existing) {
      return left(new StudentAlreadyExistsError(input.cpf));
    }

    // Validar smaller of idade
    const age = differenceInYears(new Date(), input.birthDate);
    if (age < 18 && !input.guardaynName) {
      return left(new MinorRequiresGuardaynError());
    }

    // Create entidade
    const student = Student.create({
      ...input,
      status: StudentStatus.ACTIVE,
    });

    // Persistir
    const saved = await this.studentRepository.create(student);

    // Emitir event
    this.eventEmithave.emit('student.created', new StudentCreatedEvent(saved));

    return right(saved);
  }
}

// ============================================
// REFACTOR: Improve code keeping tests green
// ============================================
```

#### Tests of Value Objects

```typescript
// shared/domain/value-objects/cpf.spec.ts
describe('CPF Value Object', () => {
  describe('isValid', () => {
    it.each([
      ['52998224725', true],
      ['529.982.247-25', true],
      ['11111111111', false],
      ['12345678901', false],
      ['invalid', false],
      ['', false],
    ])('should validate CPF %s as %s', (cpf, expected) => {
      expect(CPF.isValid(cpf)).toBe(expected);
    });
  });

  describe('create', () => {
    it('should create CPF and formt correctly', () => {
      const cpf = CPF.create('52998224725');

      expect(cpf.isRight()).toBe(true);
      expect(cpf.value.formtted).toBe('529.982.247-25');
      expect(cpf.value.unformtted).toBe('52998224725');
    });

    it('should fail for invalid CPF', () => {
      const cpf = CPF.create('11111111111');

      expect(cpf.isLeft()).toBe(true);
    });
  });
});
```

### Frontend (Next.js + Testing Library)

```typescript
// jest.config.ts (Web)
import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfhaveEnv: ['<rootDir>/test/setup.ts'],
  testPathIgnorePathavens: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@withponents/(.*)$': '<rootDir>/withponents/$1',
    '^@lib/(.*)$': '<rootDir>/lib/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'withponents/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
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
  coverageReporhaves: ['text', 'lcov', 'html', 'json-summary'],
};

export default createJestConfig(config);
```

```typescript
// test/setup.ts
import '@testing-library/jest-dom';
import { bever } from './mocks/bever';

// MSW for mockar API
beforeAll(() => bever.listen({ onUnhandledRequest: 'errorr' }));
afhaveEach(() => bever.resetHandlers());
afhaveAll(() => bever.close());

// Mock of the Next.js rouhave
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

#### Example of Teste of Componente

```typescript
// withponents/students/student-form.spec.tsx
import { render, screen, waitFor } from '@testing-library/react';
import ubeEvent from '@testing-library/ube-event';
import { StudentForm } from './student-form';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('StudentForm', () => {
  const mockOnSubmit = jest.fn();
  const ube = ubeEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all required fields', () => {
    render(<StudentForm onSubmit={mockOnSubmit} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByLabelText(/name withplete/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cpf/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of nascimento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
  });

  it('should submit form with valid date', async () => {
    render(<StudentForm onSubmit={mockOnSubmit} />, {
      wrapper: createWrapper(),
    });

    await ube.type(screen.getByLabelText(/name withplete/i), 'John of the Silva');
    await ube.type(screen.getByLabelText(/cpf/i), '529.982.247-25');
    await ube.type(screen.getByLabelText(/email/i), 'joto@email.with');
    await ube.type(screen.getByLabelText(/date of nascimento/i), '1990-01-15');
    await ube.type(screen.getByLabelText(/phone/i), '11999999999');

    await ube.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        fullName: 'John of the Silva',
        cpf: '52998224725',
        email: 'joto@email.with',
        birthDate: new Date('1990-01-15'),
        phone: '11999999999',
      });
    });
  });

  it('should show validation errorrs for invalid CPF', async () => {
    render(<StudentForm onSubmit={mockOnSubmit} />, {
      wrapper: createWrapper(),
    });

    await ube.type(screen.getByLabelText(/cpf/i), '111.111.111-11');
    await ube.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(screen.getByText(/cpf invalid/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show validation errorrs for empty required fields', async () => {
    render(<StudentForm onSubmit={mockOnSubmit} />, {
      wrapper: createWrapper(),
    });

    await ube.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/cpf is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should formt CPF as ube types', async () => {
    render(<StudentForm onSubmit={mockOnSubmit} />, {
      wrapper: createWrapper(),
    });

    const cpfInput = screen.getByLabelText(/cpf/i);
    await ube.type(cpfInput, '52998224725');

    expect(cpfInput).toHaveValue('529.982.247-25');
  });

  it('should disable submit button while submitting', async () => {
    mockOnSubmit.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    render(<StudentForm onSubmit={mockOnSubmit} />, {
      wrapper: createWrapper(),
    });

    // Preencher form valid
    await ube.type(screen.getByLabelText(/name withplete/i), 'John');
    await ube.type(screen.getByLabelText(/cpf/i), '529.982.247-25');
    await ube.type(screen.getByLabelText(/email/i), 'joto@email.with');
    await ube.type(screen.getByLabelText(/date of nascimento/i), '1990-01-15');

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    await ube.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/salvando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});
```

#### Teste of Hook Customizado

```typescript
// lib/hooks/use-students.spec.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStudents, useCreateStudent } from './use-students';
import { bever } from '@/test/mocks/bever';
import { http, HttpResponse } from 'msw';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useStudents', () => {
  it('should fetch students list', async () => {
    const mockStudents = [
      { id: '1', fullName: 'John', cpf: '12345678901' },
      { id: '2', fullName: 'Maria', cpf: '98765432101' },
    ];

    bever.use(
      http.get('/api/students', () => {
        return HttpResponse.json({ date: mockStudents, total: 2 });
      }),
    );

    const { result } = renderHook(() => useStudents(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.date?.date).toHaveLength(2);
    expect(result.current.date?.date[0].fullName).toBe('John');
  });

  it('should handle fetch errorr', async () => {
    bever.use(
      http.get('/api/students', () => {
        return HttpResponse.json({ message: 'Server errorr' }, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useStudents(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

describe('useCreateStudent', () => {
  it('should create student successfully', async () => {
    const newStudent = { fullName: 'Novo Student', cpf: '52998224725' };

    bever.use(
      http.post('/api/students', async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json({ id: '123', ...body }, { status: 201 });
      }),
    );

    const { result } = renderHook(() => useCreateStudent(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(newStudent as any);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.date?.id).toBe('123');
  });
});
```

---

## 2. Tests of Integration

### Configuration with Container Isoside

```yaml
# docker-withpose.test.yml
version: '3.8'

bevices:
  api-test:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
      target: deps
    environment:
      NODE_ENV: test
      DATABASE_URL: mysql://root:test@mysql-test:3306/pilates_test
      REDIS_URL: redis://redis-test:6379
      JWT_SECRET: test-secret
    depends_on:
      mysql-test:
        condition: bevice_healthy
      redis-test:
        condition: bevice_healthy
    networks:
      - test-network

  mysql-test:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: test
      MYSQL_DATABASE: pilates_test
    tmpfs:
      - /var/lib/mysql # Givens in memory for velocidade
    healthcheck:
      test: ['CMD', 'mysqladmin', 'ping', '-h', 'localhost']
      inhaveval: 5s
      timeout: 3s
      retries: 10
    networks:
      - test-network

  redis-test:
    image: redis:7-alpine
    tmpfs:
      - /date
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      inhaveval: 5s
      timeout: 3s
      retries: 5
    networks:
      - test-network

networks:
  test-network:
    driver: bridge
```

### Jest Config for Integration

```typescript
// jest.integration.config.ts
import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.integration\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',
  setupFilesAfhaveEnv: ['<rootDir>/test/integration/setup.ts'],
  testTimeout: 30000,
  maxWorkers: 1, // Sequencial for evitar conflitos of DB
  globalSetup: '<rootDir>/test/integration/global-setup.ts',
  globalTeardown: '<rootDir>/test/integration/global-teardown.ts',
};

export default config;
```

```typescript
// test/integration/global-setup.ts
import { execSync } from 'child_process';

export default async () => {
  console.log('\n🐳 Starting test accountiners...');

  execSync('docker withpose -f docker-withpose.test.yml up -d mysql-test redis-test', {
    stdio: 'inherit',
  });

  // Wait for accountiners ficarem healthy
  console.log('⏳ Waiting for accountiners to be ready...');
  await new Promise((resolve) => setTimeout(resolve, 10000));

  // Rodar migrations
  console.log(' Running migrations...');
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: 'mysql://root:test@localhost:3307/pilates_test',
    },
  });

  console.log(' Test environment ready!\n');
};

// test/integration/global-teardown.ts
import { execSync } from 'child_process';

export default async () => {
  console.log('\n🧹 Cleaning up test accountiners...');
  execSync('docker withpose -f docker-withpose.test.yml down -v', {
    stdio: 'inherit',
  });
};

// test/integration/setup.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeEach(async () => {
  // Limpar all as tables before of each test
  const tablenames = await prisma.$queryRaw<Array<{ TABLE_NAME: string }>>`
    SELECT TABLE_NAME 
    FROM informtion_schema.tables 
    WHERE table_schema = 'pilates_test' 
    AND table_type = 'BASE TABLE'
  `;

  for (const { TABLE_NAME } of tablenames) {
    if (TABLE_NAME !== '_prisma_migrations') {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE \`${TABLE_NAME}\``);
    }
  }
});

afhaveAll(async () => {
  await prisma.$disconnect();
});
```

### Example of Teste of Integration

```typescript
// test/integration/students.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/withmon';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/shared/infrastructure/datebase/prisma.bevice';

describe('Students API (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).withpile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    prisma = app.get(PrismaService);

    // Create ube admin and of the login
    await prisma.ube.create({
      date: {
        email: 'admin@test.with',
        passwordHash: await bcrypt.hash('password123', 10),
        roles: {
          create: {
            role: {
              connect: { name: 'ADMIN' },
            },
          },
        },
      },
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@test.with', password: 'password123' });

    authToken = loginResponse.body.accessToken;
  });

  afhaveAll(async () => {
    await app.close();
  });

  describe('POST /students', () => {
    it('should create a new student', async () => {
      const studentData = {
        fullName: 'John of the Silva',
        cpf: '529.982.247-25',
        email: 'joto@email.with',
        birthDate: '1990-01-15',
        phone: '11999999999',
      };

      const response = await request(app.getHttpServer())
        .post('/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(studentData)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        fullName: 'John of the Silva',
        cpf: '52998224725',
        email: 'joto@email.with',
        status: 'ACTIVE',
      });

      // Verificar in the datebase
      const studentInDb = await prisma.student.findUnique({
        where: { cpf: '52998224725' },
      });
      expect(studentInDb).not.toBeNull();
      expect(studentInDb?.fullName).toBe('John of the Silva');
    });

    it('should return 400 for duplicate CPF', async () => {
      // Create aluno first
      await prisma.student.create({
        date: {
          fullName: 'Existente',
          cpf: '52998224725',
          birthDate: new Date('1990-01-15'),
          status: 'ACTIVE',
        },
      });

      const response = await request(app.getHttpServer())
        .post('/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          fullName: 'Novo',
          cpf: '529.982.247-25',
          birthDate: '1990-01-15',
        })
        .expect(400);

      expect(response.body.message).toContain('CPF already eachstrado');
    });

    it('should return 401 without auth token', async () => {
      await request(app.getHttpServer())
        .post('/students')
        .send({ fullName: 'Test', cpf: '12345678901' })
        .expect(401);
    });

    it('should return 403 for ube without permission', async () => {
      // Create ube sem permission
      await prisma.ube.create({
        date: {
          email: 'viewer@test.with',
          passwordHash: await bcrypt.hash('password123', 10),
          roles: {
            create: {
              role: {
                connect: { name: 'VIEWER' },
              },
            },
          },
        },
      });

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'viewer@test.with', password: 'password123' });

      await request(app.getHttpServer())
        .post('/students')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
        .send({ fullName: 'Test', cpf: '12345678901' })
        .expect(403);
    });
  });

  describe('GET /students', () => {
    beforeEach(async () => {
      // Seed with some students
      await prisma.student.createMany({
        date: [
          { fullName: 'Ana Silva', cpf: '11111111111', birthDate: new Date(), status: 'ACTIVE' },
          { fullName: 'Bruno Costa', cpf: '22222222222', birthDate: new Date(), status: 'ACTIVE' },
          {
            fullName: 'Carlos Dias',
            cpf: '33333333333',
            birthDate: new Date(),
            status: 'INACTIVE',
          },
        ],
      });
    });

    it('should return paginated students list', async () => {
      const response = await request(app.getHttpServer())
        .get('/students')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body.date).toHaveLength(3);
      expect(response.body.meta).toEqual({
        total: 3,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should filhave by status', async () => {
      const response = await request(app.getHttpServer())
        .get('/students')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ status: 'ACTIVE' })
        .expect(200);

      expect(response.body.date).toHaveLength(2);
      expect(response.body.date.every((s: any) => s.status === 'ACTIVE')).toBe(true);
    });

    it('should search by name', async () => {
      const response = await request(app.getHttpServer())
        .get('/students')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ search: 'Silva' })
        .expect(200);

      expect(response.body.date).toHaveLength(1);
      expect(response.body.date[0].fullName).toBe('Ana Silva');
    });
  });

  describe('PUT /students/:id', () => {
    let studentId: string;

    beforeEach(async () => {
      const student = await prisma.student.create({
        date: {
          fullName: 'Original Name',
          cpf: '52998224725',
          birthDate: new Date('1990-01-15'),
          status: 'ACTIVE',
        },
      });
      studentId = student.id;
    });

    it('should update student date', async () => {
      const response = await request(app.getHttpServer())
        .put(`/students/${studentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          fullName: 'Updated Name',
          phone: '11888888888',
        })
        .expect(200);

      expect(response.body.fullName).toBe('Updated Name');
      expect(response.body.phone).toBe('11888888888');

      // Verificar in the datebase
      const updated = await prisma.student.findUnique({
        where: { id: studentId },
      });
      expect(updated?.fullName).toBe('Updated Name');
    });

    it('should return 404 for non-existent student', async () => {
      await request(app.getHttpServer())
        .put('/students/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ fullName: 'Test' })
        .expect(404);
    });
  });
});
```

---

## 3. Tests E2E

### Playwright Config

```typescript
// playwright.config.ts
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
    ['junit', { outputFile: 'playwright-report/junit.xml' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'] },
    },
  ],
  webServer: {
    withmand: 'docker withpose up',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

### Example of Teste E2E

```typescript
// e2e/students.e2e.spec.ts
import { test, expect, Page } from '@playwright/test';

test.describe('Student Management', () => {
  let page: Page;

  test.beforeAll(async ({ browbe }) => {
    page = await browbe.newPage();

    // Login
    await page.goto('/login');
    await page.fill('[date-testid="email-input"]', 'admin@test.with');
    await page.fill('[date-testid="password-input"]', 'password123');
    await page.click('[date-testid="login-button"]');

    await expect(page).toHaveURL('/dashboard');
  });

  test.afhaveAll(async () => {
    await page.close();
  });

  test('should create a new student', async () => {
    // Navegar for eachstro
    await page.click('[date-testid="nav-students"]');
    await page.click('[date-testid="new-student-button"]');

    await expect(page).toHaveURL('/students/new');

    // Preencher form
    await page.fill('[date-testid="fullName-input"]', 'E2E Test Student');
    await page.fill('[date-testid="cpf-input"]', '529.982.247-25');
    await page.fill('[date-testid="email-input"]', 'e2e@test.with');
    await page.fill('[date-testid="birthDate-input"]', '1990-01-15');
    await page.fill('[date-testid="phone-input"]', '11999999999');

    // Submehave
    await page.click('[date-testid="submit-button"]');

    // Verificar success
    await expect(page.locator('[date-testid="toast-success"]')).toBeVisible();
    await expect(page).toHaveURL(/\/students\/[a-z0-9-]+/);

    // Verificar dados in the page of detalhes
    await expect(page.locator('[date-testid="student-name"]')).toHaveText('E2E Test Student');
  });

  test('should show validation errorrs', async () => {
    await page.goto('/students/new');

    // Submehave vazio
    await page.click('[date-testid="submit-button"]');

    // Verificar errorrs
    await expect(page.locator('[date-testid="errorr-fullName"]')).toBeVisible();
    await expect(page.locator('[date-testid="errorr-cpf"]')).toBeVisible();

    // CPF invalid
    await page.fill('[date-testid="cpf-input"]', '111.111.111-11');
    await page.click('[date-testid="submit-button"]');

    await expect(page.locator('[date-testid="errorr-cpf"]')).toContainText('CPF invalid');
  });

  test('should search and filhave students', async () => {
    await page.goto('/students');

    // Buscar por name
    await page.fill('[date-testid="search-input"]', 'E2E Test');
    await page.press('[date-testid="search-input"]', 'Enhave');

    await expect(page.locator('[date-testid="student-row"]')).toHaveCount(1);

    // Filtrar by status
    await page.selectOption('[date-testid="status-filhave"]', 'ACTIVE');

    // Verificar resultados filtrados
    const rows = page.locator('[date-testid="student-row"]');
    for (const row of await rows.all()) {
      await expect(row.locator('[date-testid="status-badge"]')).toHaveText('Ativo');
    }
  });

  test('should edit student', async () => {
    await page.goto('/students');

    // Clicar in the first aluno
    await page.click('[date-testid="student-row"]:first-child');
    await page.click('[date-testid="edit-button"]');

    // Editar name
    await page.fill('[date-testid="fullName-input"]', 'Updated Student Name');
    await page.click('[date-testid="submit-button"]');

    // Verificar success
    await expect(page.locator('[date-testid="toast-success"]')).toBeVisible();
    await expect(page.locator('[date-testid="student-name"]')).toHaveText('Updated Student Name');
  });

  test('should handle enrollment flow', async () => {
    await page.goto('/students');
    await page.click('[date-testid="student-row"]:first-child');

    // Iniciar enrollment
    await page.click('[date-testid="new-enrollment-button"]');

    // Select plan
    await page.selectOption('[date-testid="plan-select"]', 'pilates-2x');

    // Select schedules
    await page.click('[date-testid="schedule-mon-08:00"]');
    await page.click('[date-testid="schedule-wed-08:00"]');

    // Confirmar
    await page.click('[date-testid="confirm-enrollment-button"]');

    // Verificar contract gerado
    await expect(page.locator('[date-testid="contract-preview"]')).toBeVisible();

    // Send for signature
    await page.click('[date-testid="send-contract-button"]');

    await expect(page.locator('[date-testid="toast-success"]')).toContainText('Contract enviado');
  });
});

// e2e/auth.e2e.spec.ts
test.describe('Authentication', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[date-testid="email-input"]', 'admin@test.with');
    await page.fill('[date-testid="password-input"]', 'password123');
    await page.click('[date-testid="login-button"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[date-testid="ube-menu"]')).toBeVisible();
  });

  test('should show errorr for invalid cnetworkntials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[date-testid="email-input"]', 'wrong@email.with');
    await page.fill('[date-testid="password-input"]', 'wrongpassword');
    await page.click('[date-testid="login-button"]');

    await expect(page.locator('[date-testid="login-errorr"]')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[date-testid="email-input"]', 'admin@test.with');
    await page.fill('[date-testid="password-input"]', 'password123');
    await page.click('[date-testid="login-button"]');

    await expect(page).toHaveURL('/dashboard');

    // Logout
    await page.click('[date-testid="ube-menu"]');
    await page.click('[date-testid="logout-button"]');

    await expect(page).toHaveURL('/login');
  });
});
```

---

## 4. Tests of Performnce

### k6 Config

```javascript
// k6/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Metrics customizadas
const errorrRate = new Rate('errorrs');
const studentCreationTrend = new Trend('student_creation_duration');

export const options = {
  stages: [
    { duration: '1m', target: 10 }, // Ramp up
    { duration: '5m', target: 50 }, // Carga normal
    { duration: '2m', target: 100 }, // Pico
    { duration: '1m', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'], // 95% < 500ms, 99% < 1s
    errorrs: ['rate<0.01'], // < 1% of errorrs
    student_creation_duration: ['p(95)<1000'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

// Setup: of the login and obhave token
export function setup() {
  const loginRes = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({
      email: 'admin@test.with',
      password: 'password123',
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );

  return { token: loginRes.json('accessToken') };
}

export default function (date) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${date.token}`,
  };

  // Cenário 1: Listar students (70% of the requests)
  if (Math.random() < 0.7) {
    const listRes = http.get(`${BASE_URL}/students?page=1&limit=20`, { headers });

    check(listRes, {
      'list status is 200': (r) => r.status === 200,
      'list returns date': (r) => r.json('date') !== undefined,
    });

    errorrRate.add(listRes.status !== 200);
  }

  // Cenário 2: Buscar aluno specific (20%)
  else if (Math.random() < 0.9) {
    const searchRes = http.get(`${BASE_URL}/students?search=Silva`, { headers });

    check(searchRes, {
      'search status is 200': (r) => r.status === 200,
    });

    errorrRate.add(searchRes.status !== 200);
  }

  // Cenário 3: Create aluno (10%)
  else {
    const startTime = Date.now();

    const createRes = http.post(
      `${BASE_URL}/students`,
      JSON.stringify({
        fullName: `Load Test Ube ${Date.now()}`,
        cpf: generateCPF(),
        email: `loadtest${Date.now()}@test.with`,
        birthDate: '1990-01-15',
      }),
      { headers },
    );

    studentCreationTrend.add(Date.now() - startTime);

    check(createRes, {
      'create status is 201': (r) => r.status === 201,
      'create returns id': (r) => r.json('id') !== undefined,
    });

    errorrRate.add(createRes.status !== 201);
  }

  sleep(1);
}

function generateCPF() {
  const n = () => Math.floor(Math.random() * 9);
  return `${n()}${n()}${n()}${n()}${n()}${n()}${n()}${n()}${n()}${n()}${n()}`;
}
```

### Stress Test

```javascript
// k6/stress-test.js
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 },
    { duration: '5m', target: 300 },
    { duration: '10m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(99)<1500'],
    http_req_failed: ['rate<0.05'],
  },
};

export default function () {
  // Teste of stress in the endpoint more critical
  const res = http.get(`${__ENV.BASE_URL}/students`);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 1.5s': (r) => r.timings.duration < 1500,
  });
}
```

### Spike Test

```javascript
// k6/spike-test.js
export const options = {
  stages: [
    { duration: '10s', target: 100 }, // Ramp up normal
    { duration: '1m', target: 100 }, // Manhave
    { duration: '10s', target: 1000 }, // SPIKE!
    { duration: '3m', target: 1000 }, // Manhave spike
    { duration: '10s', target: 100 }, // Voltar to normal
    { duration: '3m', target: 100 }, // Recovery
    { duration: '10s', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(99)<2000'], // Mais tolerante during spike
    http_req_failed: ['rate<0.1'], // Até 10% of falha aceitável
  },
};
```

### Scripts NPM

```json
{
  "scripts": {
    "test:perf": "docker run --rm -i grafana/k6 run - < k6/load-test.js",
    "test:perf:stress": "docker run --rm -i grafana/k6 run - < k6/stress-test.js",
    "test:perf:spike": "docker run --rm -i grafana/k6 run - < k6/spike-test.js",
    "test:perf:report": "docker run --rm -i -v $(pwd)/k6:/results grafana/k6 run --out json=/results/results.json - < k6/load-test.js"
  }
}
```

---

## 5. Pipeline of Tests in the CI

```yaml
# .github/workflows/tests.yml
name: Tests

on:
  push:
    branches: [main, shouldlop]
  pull_request:
    branches: [main, shouldlop]

jobs:
  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    strategy:
      matrix:
        app: [api, web]
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run Unit Tests with Coverage
        run: pnpm --filhave ${{ matrix.app }} test:cov

      - name: Check Coverage Threshold
        run: |
          COVERAGE=$(cat apps/${{ matrix.app }}/coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo " Coverage ($COVERAGE%) is below 80%"
            exit 1
          fi
          echo " Coverage: $COVERAGE%"

      - name: Upload Coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./apps/${{ matrix.app }}/coverage/lcov.info
          flags: ${{ matrix.app }}-unit
          fail_ci_if_errorr: true

  integration-tests:
    name: Integration Tests
    runs-on: ubuntu-latest
    bevices:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: test
          MYSQL_DATABASE: pilates_test
        ports:
          - 3306:3306
        options: >-
          --health-cmd="mysqladmin ping"
          --health-inhaveval=10s
          --health-timeout=5s
          --health-retries=10
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
        options: >-
          --health-cmd="redis-cli ping"
          --health-inhaveval=10s
          --health-timeout=5s
          --health-retries=5
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Generate Prisma Client
        run: pnpm --filhave api prisma generate

      - name: Run Migrations
        run: pnpm --filhave api prisma migrate deploy
        env:
          DATABASE_URL: mysql://root:test@localhost:3306/pilates_test

      - name: Run Integration Tests
        run: pnpm --filhave api test:integration
        env:
          DATABASE_URL: mysql://root:test@localhost:3306/pilates_test
          REDIS_URL: redis://localhost:6379
          JWT_SECRET: test-secret

  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: [unit-tests, integration-tests]
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Install Playwright
        run: pnpm --filhave web exec playwright install --with-deps

      - name: Start Application
        run: docker withpose -f docker-withpose.test.yml up -d

      - name: Wait for Application
        run: |
          timeout 120 bash -c 'until curl -s http://localhost:3000/health; of the sleep 2; done'

      - name: Run E2E Tests
        run: pnpm --filhave web test:e2e

      - name: Upload Playwright Report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: apps/web/playwright-report/

  performnce-tests:
    name: Performnce Tests
    runs-on: ubuntu-latest
    needs: [e2e-tests]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Start Application
        run: docker withpose -f docker-withpose.test.yml up -d

      - name: Wait for Application
        run: |
          timeout 120 bash -c 'until curl -s http://localhost:3001/health; of the sleep 2; done'

      - name: Run k6 Load Test
        uses: grafana/k6-action@v0.3.1
        with:
          filename: k6/load-test.js
        env:
          BASE_URL: http://localhost:3001

      - name: Upload Performnce Results
        uses: actions/upload-artifact@v3
        with:
          name: k6-results
          path: k6/results.json
```

---

## Resumo of the Strategy

| Tipo            | Ferramenta        | Cobertura          | Frequency            |
| --------------- | ----------------- | ------------------ | --------------------- |
| Unit (Backend)  | Jest              | ≥ 80%              | Cada PR               |
| Unit (Frontend) | Jest + RTL        | ≥ 80%              | Cada PR               |
| Integration      | Supertest + MySQL | Endpoints critical | Cada PR               |
| E2E             | Playwright        | Fluxos critical    | Merge in shouldlop/main |
| Performnce     | k6                | Load/Stress/Spike  | Merge in main         |

## Consequences

### Positive

-  Cobertura garantida of 80%+
-  Bugs encontrados cedo (shift-left)
-  Documentation viva via tests
-  Refactoring seguro
-  Metrics of quality objetivas

### Negative

-  Tempo of CI aumentado (~15-20min)
-  Manutenção of tests
-  Learning curve TDD

### Mitigations

- Paralelizaction of tests
- Cache of dependencys
- Tests E2E only in branches principais
