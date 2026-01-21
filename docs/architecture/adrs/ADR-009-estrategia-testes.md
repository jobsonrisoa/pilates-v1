# ADR-009: Estratégia de Testes

**Status:** Aceito  
**Data:** 21/01/2026  
**Decisores:** Equipe de Arquitetura  
**Contexto do Debate:** [DEBATE-001](../debates/DEBATE-001-arquitetura-geral.md)

## Contexto

O projeto segue metodologia TDD (Test-Driven Development) com ciclo Red-Green-Refactor. Requisitos:

- **Cobertura mínima de 80%** em testes unitários (frontend e backend)
- **Testes de integração** com banco de dados isolado
- **Testes E2E** para fluxos críticos
- **Testes de performance** para garantir SLAs
- **Ambiente de teste 100% containerizado**

## Decisão

### Pirâmide de Testes

```
                    ┌───────────┐
                    │    E2E    │  ~5% dos testes
                    │ Playwright│  Fluxos críticos
                    ├───────────┤
                    │   Perf    │  ~5% dos testes
                    │    k6     │  Load/Stress
                ┌───┴───────────┴───┐
                │    Integração     │  ~15% dos testes
                │  Supertest + DB   │  APIs + DB real
            ┌───┴───────────────────┴───┐
            │        Unitários          │  ~75% dos testes
            │   Jest + Testing Library  │  Lógica isolada
            └───────────────────────────┘
```

### Métricas de Qualidade Obrigatórias

| Métrica | Backend | Frontend | Bloqueante |
|---------|---------|----------|------------|
| Coverage Linhas | ≥ 80% | ≥ 80% | ✅ Sim |
| Coverage Branches | ≥ 75% | ≥ 75% | ✅ Sim |
| Coverage Functions | ≥ 80% | ≥ 80% | ✅ Sim |
| Testes E2E críticos | 100% pass | 100% pass | ✅ Sim |
| Performance P95 | < 500ms | - | ⚠️ Warning |

---

## 1. Testes Unitários

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
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
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
  },
  setupFilesAfterEnv: ['<rootDir>/../test/setup.ts'],
  maxWorkers: '50%',
};

export default config;
```

```typescript
// test/setup.ts
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

// Mock global do Prisma para testes unitários
jest.mock('./prisma', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
```

#### Exemplo TDD - Red-Green-Refactor

```typescript
// students/application/use-cases/create-student.use-case.spec.ts

describe('CreateStudentUseCase', () => {
  let useCase: CreateStudentUseCase;
  let studentRepository: DeepMockProxy<IStudentRepository>;
  let eventEmitter: DeepMockProxy<EventEmitter2>;

  beforeEach(() => {
    studentRepository = mockDeep<IStudentRepository>();
    eventEmitter = mockDeep<EventEmitter2>();
    useCase = new CreateStudentUseCase(studentRepository, eventEmitter);
  });

  // ============================================
  // RED: Escrever teste que falha
  // ============================================
  
  describe('execute', () => {
    it('should create a student with valid data', async () => {
      // Arrange
      const input: CreateStudentInput = {
        fullName: 'João da Silva',
        cpf: '12345678901',
        email: 'joao@email.com',
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

      // Assert
      expect(result.isRight()).toBe(true);
      expect(result.value).toEqual(expectedStudent);
      expect(studentRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: 'João da Silva',
          cpf: '12345678901',
        }),
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'student.created',
        expect.any(StudentCreatedEvent),
      );
    });

    it('should fail when CPF already exists', async () => {
      // Arrange
      const input: CreateStudentInput = {
        fullName: 'João da Silva',
        cpf: '12345678901',
        email: 'joao@email.com',
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

      // Assert
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(StudentAlreadyExistsError);
      expect(studentRepository.create).not.toHaveBeenCalled();
    });

    it('should fail with invalid CPF', async () => {
      // Arrange
      const input: CreateStudentInput = {
        fullName: 'João da Silva',
        cpf: '11111111111', // CPF inválido
        email: 'joao@email.com',
        birthDate: new Date('1990-01-15'),
      };

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(InvalidCpfError);
    });

    it('should fail when student is minor without guardian', async () => {
      // Arrange
      const input: CreateStudentInput = {
        fullName: 'Maria Jovem',
        cpf: '12345678901',
        email: 'maria@email.com',
        birthDate: new Date('2010-01-15'), // Menor de idade
        // Sem guardianName
      };

      studentRepository.findByCpf.mockResolvedValue(null);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(MinorRequiresGuardianError);
    });
  });
});

// ============================================
// GREEN: Implementar código mínimo para passar
// ============================================

// students/application/use-cases/create-student.use-case.ts
@Injectable()
export class CreateStudentUseCase {
  constructor(
    private readonly studentRepository: IStudentRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(input: CreateStudentInput): Promise<Either<DomainError, Student>> {
    // Validar CPF
    if (!CPF.isValid(input.cpf)) {
      return left(new InvalidCpfError(input.cpf));
    }

    // Verificar se já existe
    const existing = await this.studentRepository.findByCpf(input.cpf);
    if (existing) {
      return left(new StudentAlreadyExistsError(input.cpf));
    }

    // Validar menor de idade
    const age = differenceInYears(new Date(), input.birthDate);
    if (age < 18 && !input.guardianName) {
      return left(new MinorRequiresGuardianError());
    }

    // Criar entidade
    const student = Student.create({
      ...input,
      status: StudentStatus.ACTIVE,
    });

    // Persistir
    const saved = await this.studentRepository.create(student);

    // Emitir evento
    this.eventEmitter.emit('student.created', new StudentCreatedEvent(saved));

    return right(saved);
  }
}

// ============================================
// REFACTOR: Melhorar código mantendo testes verdes
// ============================================
```

#### Testes de Value Objects

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
    it('should create CPF and format correctly', () => {
      const cpf = CPF.create('52998224725');
      
      expect(cpf.isRight()).toBe(true);
      expect(cpf.value.formatted).toBe('529.982.247-25');
      expect(cpf.value.unformatted).toBe('52998224725');
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
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@lib/(.*)$': '<rootDir>/lib/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
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
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
};

export default createJestConfig(config);
```

```typescript
// test/setup.ts
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// MSW para mockar API
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock do Next.js router
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

#### Exemplo de Teste de Componente

```typescript
// components/students/student-form.spec.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all required fields', () => {
    render(<StudentForm onSubmit={mockOnSubmit} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cpf/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data de nascimento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
  });

  it('should submit form with valid data', async () => {
    render(<StudentForm onSubmit={mockOnSubmit} />, {
      wrapper: createWrapper(),
    });

    await user.type(screen.getByLabelText(/nome completo/i), 'João da Silva');
    await user.type(screen.getByLabelText(/cpf/i), '529.982.247-25');
    await user.type(screen.getByLabelText(/email/i), 'joao@email.com');
    await user.type(screen.getByLabelText(/data de nascimento/i), '1990-01-15');
    await user.type(screen.getByLabelText(/telefone/i), '11999999999');

    await user.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        fullName: 'João da Silva',
        cpf: '52998224725',
        email: 'joao@email.com',
        birthDate: new Date('1990-01-15'),
        phone: '11999999999',
      });
    });
  });

  it('should show validation errors for invalid CPF', async () => {
    render(<StudentForm onSubmit={mockOnSubmit} />, {
      wrapper: createWrapper(),
    });

    await user.type(screen.getByLabelText(/cpf/i), '111.111.111-11');
    await user.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(screen.getByText(/cpf inválido/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show validation errors for empty required fields', async () => {
    render(<StudentForm onSubmit={mockOnSubmit} />, {
      wrapper: createWrapper(),
    });

    await user.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/cpf é obrigatório/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should format CPF as user types', async () => {
    render(<StudentForm onSubmit={mockOnSubmit} />, {
      wrapper: createWrapper(),
    });

    const cpfInput = screen.getByLabelText(/cpf/i);
    await user.type(cpfInput, '52998224725');

    expect(cpfInput).toHaveValue('529.982.247-25');
  });

  it('should disable submit button while submitting', async () => {
    mockOnSubmit.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    render(<StudentForm onSubmit={mockOnSubmit} />, {
      wrapper: createWrapper(),
    });

    // Preencher formulário válido
    await user.type(screen.getByLabelText(/nome completo/i), 'João');
    await user.type(screen.getByLabelText(/cpf/i), '529.982.247-25');
    await user.type(screen.getByLabelText(/email/i), 'joao@email.com');
    await user.type(screen.getByLabelText(/data de nascimento/i), '1990-01-15');

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/salvando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});
```

#### Teste de Hook Customizado

```typescript
// lib/hooks/use-students.spec.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStudents, useCreateStudent } from './use-students';
import { server } from '@/test/mocks/server';
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
      { id: '1', fullName: 'João', cpf: '12345678901' },
      { id: '2', fullName: 'Maria', cpf: '98765432101' },
    ];

    server.use(
      http.get('/api/students', () => {
        return HttpResponse.json({ data: mockStudents, total: 2 });
      }),
    );

    const { result } = renderHook(() => useStudents(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data).toHaveLength(2);
    expect(result.current.data?.data[0].fullName).toBe('João');
  });

  it('should handle fetch error', async () => {
    server.use(
      http.get('/api/students', () => {
        return HttpResponse.json({ message: 'Server error' }, { status: 500 });
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
    const newStudent = { fullName: 'Novo Aluno', cpf: '52998224725' };

    server.use(
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

    expect(result.current.data?.id).toBe('123');
  });
});
```

---

## 2. Testes de Integração

### Configuração com Container Isolado

```yaml
# docker-compose.test.yml
version: '3.8'

services:
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
        condition: service_healthy
      redis-test:
        condition: service_healthy
    networks:
      - test-network

  mysql-test:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: test
      MYSQL_DATABASE: pilates_test
    tmpfs:
      - /var/lib/mysql  # Dados em memória para velocidade
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 5s
      timeout: 3s
      retries: 10
    networks:
      - test-network

  redis-test:
    image: redis:7-alpine
    tmpfs:
      - /data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    networks:
      - test-network

networks:
  test-network:
    driver: bridge
```

### Jest Config para Integração

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
  setupFilesAfterEnv: ['<rootDir>/test/integration/setup.ts'],
  testTimeout: 30000,
  maxWorkers: 1, // Sequencial para evitar conflitos de DB
  globalSetup: '<rootDir>/test/integration/global-setup.ts',
  globalTeardown: '<rootDir>/test/integration/global-teardown.ts',
};

export default config;
```

```typescript
// test/integration/global-setup.ts
import { execSync } from 'child_process';

export default async () => {
  console.log('\n🐳 Starting test containers...');
  
  execSync('docker compose -f docker-compose.test.yml up -d mysql-test redis-test', {
    stdio: 'inherit',
  });

  // Aguardar containers ficarem healthy
  console.log('⏳ Waiting for containers to be ready...');
  await new Promise((resolve) => setTimeout(resolve, 10000));

  // Rodar migrations
  console.log('📦 Running migrations...');
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: 'mysql://root:test@localhost:3307/pilates_test',
    },
  });

  console.log('✅ Test environment ready!\n');
};

// test/integration/global-teardown.ts
import { execSync } from 'child_process';

export default async () => {
  console.log('\n🧹 Cleaning up test containers...');
  execSync('docker compose -f docker-compose.test.yml down -v', {
    stdio: 'inherit',
  });
};

// test/integration/setup.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeEach(async () => {
  // Limpar todas as tabelas antes de cada teste
  const tablenames = await prisma.$queryRaw<Array<{ TABLE_NAME: string }>>`
    SELECT TABLE_NAME 
    FROM information_schema.tables 
    WHERE table_schema = 'pilates_test' 
    AND table_type = 'BASE TABLE'
  `;

  for (const { TABLE_NAME } of tablenames) {
    if (TABLE_NAME !== '_prisma_migrations') {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE \`${TABLE_NAME}\``);
    }
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});
```

### Exemplo de Teste de Integração

```typescript
// test/integration/students.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/shared/infrastructure/database/prisma.service';

describe('Students API (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    prisma = app.get(PrismaService);

    // Criar usuário admin e fazer login
    await prisma.user.create({
      data: {
        email: 'admin@test.com',
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
      .send({ email: 'admin@test.com', password: 'password123' });

    authToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /students', () => {
    it('should create a new student', async () => {
      const studentData = {
        fullName: 'João da Silva',
        cpf: '529.982.247-25',
        email: 'joao@email.com',
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
        fullName: 'João da Silva',
        cpf: '52998224725',
        email: 'joao@email.com',
        status: 'ACTIVE',
      });

      // Verificar no banco
      const studentInDb = await prisma.student.findUnique({
        where: { cpf: '52998224725' },
      });
      expect(studentInDb).not.toBeNull();
      expect(studentInDb?.fullName).toBe('João da Silva');
    });

    it('should return 400 for duplicate CPF', async () => {
      // Criar aluno primeiro
      await prisma.student.create({
        data: {
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

      expect(response.body.message).toContain('CPF já cadastrado');
    });

    it('should return 401 without auth token', async () => {
      await request(app.getHttpServer())
        .post('/students')
        .send({ fullName: 'Test', cpf: '12345678901' })
        .expect(401);
    });

    it('should return 403 for user without permission', async () => {
      // Criar usuário sem permissão
      await prisma.user.create({
        data: {
          email: 'viewer@test.com',
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
        .send({ email: 'viewer@test.com', password: 'password123' });

      await request(app.getHttpServer())
        .post('/students')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
        .send({ fullName: 'Test', cpf: '12345678901' })
        .expect(403);
    });
  });

  describe('GET /students', () => {
    beforeEach(async () => {
      // Seed com alguns alunos
      await prisma.student.createMany({
        data: [
          { fullName: 'Ana Silva', cpf: '11111111111', birthDate: new Date(), status: 'ACTIVE' },
          { fullName: 'Bruno Costa', cpf: '22222222222', birthDate: new Date(), status: 'ACTIVE' },
          { fullName: 'Carlos Dias', cpf: '33333333333', birthDate: new Date(), status: 'INACTIVE' },
        ],
      });
    });

    it('should return paginated students list', async () => {
      const response = await request(app.getHttpServer())
        .get('/students')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body.data).toHaveLength(3);
      expect(response.body.meta).toEqual({
        total: 3,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should filter by status', async () => {
      const response = await request(app.getHttpServer())
        .get('/students')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ status: 'ACTIVE' })
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every((s: any) => s.status === 'ACTIVE')).toBe(true);
    });

    it('should search by name', async () => {
      const response = await request(app.getHttpServer())
        .get('/students')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ search: 'Silva' })
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].fullName).toBe('Ana Silva');
    });
  });

  describe('PUT /students/:id', () => {
    let studentId: string;

    beforeEach(async () => {
      const student = await prisma.student.create({
        data: {
          fullName: 'Original Name',
          cpf: '52998224725',
          birthDate: new Date('1990-01-15'),
          status: 'ACTIVE',
        },
      });
      studentId = student.id;
    });

    it('should update student data', async () => {
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

      // Verificar no banco
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

## 3. Testes E2E

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
  reporter: [
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
    command: 'docker compose up',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

### Exemplo de Teste E2E

```typescript
// e2e/students.e2e.spec.ts
import { test, expect, Page } from '@playwright/test';

test.describe('Student Management', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    
    // Login
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'admin@test.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    await expect(page).toHaveURL('/dashboard');
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should create a new student', async () => {
    // Navegar para cadastro
    await page.click('[data-testid="nav-students"]');
    await page.click('[data-testid="new-student-button"]');
    
    await expect(page).toHaveURL('/students/new');

    // Preencher formulário
    await page.fill('[data-testid="fullName-input"]', 'E2E Test Student');
    await page.fill('[data-testid="cpf-input"]', '529.982.247-25');
    await page.fill('[data-testid="email-input"]', 'e2e@test.com');
    await page.fill('[data-testid="birthDate-input"]', '1990-01-15');
    await page.fill('[data-testid="phone-input"]', '11999999999');

    // Submeter
    await page.click('[data-testid="submit-button"]');

    // Verificar sucesso
    await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();
    await expect(page).toHaveURL(/\/students\/[a-z0-9-]+/);
    
    // Verificar dados na página de detalhes
    await expect(page.locator('[data-testid="student-name"]')).toHaveText('E2E Test Student');
  });

  test('should show validation errors', async () => {
    await page.goto('/students/new');

    // Submeter vazio
    await page.click('[data-testid="submit-button"]');

    // Verificar erros
    await expect(page.locator('[data-testid="error-fullName"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-cpf"]')).toBeVisible();

    // CPF inválido
    await page.fill('[data-testid="cpf-input"]', '111.111.111-11');
    await page.click('[data-testid="submit-button"]');
    
    await expect(page.locator('[data-testid="error-cpf"]')).toContainText('CPF inválido');
  });

  test('should search and filter students', async () => {
    await page.goto('/students');

    // Buscar por nome
    await page.fill('[data-testid="search-input"]', 'E2E Test');
    await page.press('[data-testid="search-input"]', 'Enter');

    await expect(page.locator('[data-testid="student-row"]')).toHaveCount(1);

    // Filtrar por status
    await page.selectOption('[data-testid="status-filter"]', 'ACTIVE');
    
    // Verificar resultados filtrados
    const rows = page.locator('[data-testid="student-row"]');
    for (const row of await rows.all()) {
      await expect(row.locator('[data-testid="status-badge"]')).toHaveText('Ativo');
    }
  });

  test('should edit student', async () => {
    await page.goto('/students');
    
    // Clicar no primeiro aluno
    await page.click('[data-testid="student-row"]:first-child');
    await page.click('[data-testid="edit-button"]');

    // Editar nome
    await page.fill('[data-testid="fullName-input"]', 'Updated Student Name');
    await page.click('[data-testid="submit-button"]');

    // Verificar sucesso
    await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="student-name"]')).toHaveText('Updated Student Name');
  });

  test('should handle enrollment flow', async () => {
    await page.goto('/students');
    await page.click('[data-testid="student-row"]:first-child');
    
    // Iniciar matrícula
    await page.click('[data-testid="new-enrollment-button"]');
    
    // Selecionar plano
    await page.selectOption('[data-testid="plan-select"]', 'pilates-2x');
    
    // Selecionar horários
    await page.click('[data-testid="schedule-mon-08:00"]');
    await page.click('[data-testid="schedule-wed-08:00"]');
    
    // Confirmar
    await page.click('[data-testid="confirm-enrollment-button"]');
    
    // Verificar contrato gerado
    await expect(page.locator('[data-testid="contract-preview"]')).toBeVisible();
    
    // Enviar para assinatura
    await page.click('[data-testid="send-contract-button"]');
    
    await expect(page.locator('[data-testid="toast-success"]')).toContainText('Contrato enviado');
  });
});

// e2e/auth.e2e.spec.ts
test.describe('Authentication', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[data-testid="email-input"]', 'admin@test.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[data-testid="email-input"]', 'wrong@email.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');

    await expect(page.locator('[data-testid="login-error"]')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should logout successfully', async ({ page }) => {
    // Login primeiro
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'admin@test.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    await expect(page).toHaveURL('/dashboard');

    // Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-button"]');

    await expect(page).toHaveURL('/login');
  });
});
```

---

## 4. Testes de Performance

### k6 Config

```javascript
// k6/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Métricas customizadas
const errorRate = new Rate('errors');
const studentCreationTrend = new Trend('student_creation_duration');

export const options = {
  stages: [
    { duration: '1m', target: 10 },   // Ramp up
    { duration: '5m', target: 50 },   // Carga normal
    { duration: '2m', target: 100 },  // Pico
    { duration: '1m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],  // 95% < 500ms, 99% < 1s
    errors: ['rate<0.01'],  // < 1% de erros
    'student_creation_duration': ['p(95)<1000'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

// Setup: fazer login e obter token
export function setup() {
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: 'admin@test.com',
    password: 'password123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  return { token: loginRes.json('accessToken') };
}

export default function (data) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${data.token}`,
  };

  // Cenário 1: Listar alunos (70% das requisições)
  if (Math.random() < 0.7) {
    const listRes = http.get(`${BASE_URL}/students?page=1&limit=20`, { headers });
    
    check(listRes, {
      'list status is 200': (r) => r.status === 200,
      'list returns data': (r) => r.json('data') !== undefined,
    });
    
    errorRate.add(listRes.status !== 200);
  }
  
  // Cenário 2: Buscar aluno específico (20%)
  else if (Math.random() < 0.9) {
    const searchRes = http.get(`${BASE_URL}/students?search=Silva`, { headers });
    
    check(searchRes, {
      'search status is 200': (r) => r.status === 200,
    });
    
    errorRate.add(searchRes.status !== 200);
  }
  
  // Cenário 3: Criar aluno (10%)
  else {
    const startTime = Date.now();
    
    const createRes = http.post(`${BASE_URL}/students`, JSON.stringify({
      fullName: `Load Test User ${Date.now()}`,
      cpf: generateCPF(),
      email: `loadtest${Date.now()}@test.com`,
      birthDate: '1990-01-15',
    }), { headers });

    studentCreationTrend.add(Date.now() - startTime);
    
    check(createRes, {
      'create status is 201': (r) => r.status === 201,
      'create returns id': (r) => r.json('id') !== undefined,
    });
    
    errorRate.add(createRes.status !== 201);
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
  // Teste de stress no endpoint mais crítico
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
    { duration: '10s', target: 100 },   // Ramp up normal
    { duration: '1m', target: 100 },    // Manter
    { duration: '10s', target: 1000 },  // SPIKE!
    { duration: '3m', target: 1000 },   // Manter spike
    { duration: '10s', target: 100 },   // Voltar ao normal
    { duration: '3m', target: 100 },    // Recuperação
    { duration: '10s', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(99)<2000'],  // Mais tolerante durante spike
    http_req_failed: ['rate<0.1'],      // Até 10% de falha aceitável
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

## 5. Pipeline de Testes no CI

```yaml
# .github/workflows/tests.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

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
        run: pnpm --filter ${{ matrix.app }} test:cov
        
      - name: Check Coverage Threshold
        run: |
          COVERAGE=$(cat apps/${{ matrix.app }}/coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "❌ Coverage ($COVERAGE%) is below 80%"
            exit 1
          fi
          echo "✅ Coverage: $COVERAGE%"
          
      - name: Upload Coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./apps/${{ matrix.app }}/coverage/lcov.info
          flags: ${{ matrix.app }}-unit
          fail_ci_if_error: true

  integration-tests:
    name: Integration Tests
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: test
          MYSQL_DATABASE: pilates_test
        ports:
          - 3306:3306
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=10
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
        options: >-
          --health-cmd="redis-cli ping"
          --health-interval=10s
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
        run: pnpm --filter api prisma generate
        
      - name: Run Migrations
        run: pnpm --filter api prisma migrate deploy
        env:
          DATABASE_URL: mysql://root:test@localhost:3306/pilates_test
          
      - name: Run Integration Tests
        run: pnpm --filter api test:integration
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
        run: pnpm --filter web exec playwright install --with-deps
        
      - name: Start Application
        run: docker compose -f docker-compose.test.yml up -d
        
      - name: Wait for Application
        run: |
          timeout 120 bash -c 'until curl -s http://localhost:3000/health; do sleep 2; done'
          
      - name: Run E2E Tests
        run: pnpm --filter web test:e2e
        
      - name: Upload Playwright Report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: apps/web/playwright-report/

  performance-tests:
    name: Performance Tests
    runs-on: ubuntu-latest
    needs: [e2e-tests]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      
      - name: Start Application
        run: docker compose -f docker-compose.test.yml up -d
        
      - name: Wait for Application
        run: |
          timeout 120 bash -c 'until curl -s http://localhost:3001/health; do sleep 2; done'
          
      - name: Run k6 Load Test
        uses: grafana/k6-action@v0.3.1
        with:
          filename: k6/load-test.js
        env:
          BASE_URL: http://localhost:3001
          
      - name: Upload Performance Results
        uses: actions/upload-artifact@v3
        with:
          name: k6-results
          path: k6/results.json
```

---

## Resumo da Estratégia

| Tipo | Ferramenta | Cobertura | Frequência |
|------|------------|-----------|------------|
| Unit (Backend) | Jest | ≥ 80% | Cada PR |
| Unit (Frontend) | Jest + RTL | ≥ 80% | Cada PR |
| Integração | Supertest + MySQL | Endpoints críticos | Cada PR |
| E2E | Playwright | Fluxos críticos | Merge em develop/main |
| Performance | k6 | Load/Stress/Spike | Merge em main |

## Consequências

### Positivas
- ✅ Cobertura garantida de 80%+
- ✅ Bugs encontrados cedo (shift-left)
- ✅ Documentação viva via testes
- ✅ Refactoring seguro
- ✅ Métricas de qualidade objetivas

### Negativas
- ⚠️ Tempo de CI aumentado (~15-20min)
- ⚠️ Manutenção de testes
- ⚠️ Curva de aprendizado TDD

### Mitigações
- Paralelização de testes
- Cache de dependências
- Testes E2E apenas em branches principais

