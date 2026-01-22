# ADR-002: Stack Tecnológica

**Status:** Aceito  
**Data:** 21/01/2026  
**Decisores:** Equipe de Arquitetura  
**Contexto do Debate:** [DEBATE-001](../debates/DEBATE-001-arquitetura-geral.md)

## Contexto

Necessidade de definir as tecnologias principais do sistema, considerando:

- Requisitos do cliente (NestJS, Next.js)
- Metodologia TDD red-green-refactor
- Ambiente 100% Docker
- Preparação para escala futura

## Decisão

### Backend: NestJS + TypeScript

```json
{
  "framework": "NestJS 10.x",
  "language": "TypeScript 5.x",
  "runtime": "Node.js 20 LTS"
}
```

**Justificativa:**

- Arquitetura modular nativa (alinhada com DDD)
- Dependency Injection built-in
- Suporte excelente a decorators
- Ecossistema maduro
- TypeScript first

**Dependências principais:**

```json
{
  "dependencies": {
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/jwt": "^10.0.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/event-emitter": "^2.0.0",
    "@nestjs/schedule": "^4.0.0",
    "@nestjs/swagger": "^7.0.0",
    "@prisma/client": "^5.0.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.0",
    "bcrypt": "^5.1.0",
    "ioredis": "^5.0.0",
    "pino": "^8.0.0",
    "pino-pretty": "^10.0.0"
  },
  "devDependencies": {
    "@nestjs/testing": "^10.0.0",
    "jest": "^29.0.0",
    "supertest": "^6.0.0",
    "prisma": "^5.0.0"
  }
}
```

### Frontend: Next.js + React

```json
{
  "framework": "Next.js 14.x (App Router)",
  "library": "React 18.x",
  "language": "TypeScript 5.x"
}
```

**Dependências principais:**

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.0.0",
    "react-hook-form": "^7.0.0",
    "zod": "^3.0.0",
    "@hookform/resolvers": "^3.0.0",
    "tailwindcss": "^3.0.0",
    "shadcn/ui": "latest",
    "lucide-react": "^0.300.0",
    "date-fns": "^3.0.0",
    "recharts": "^2.0.0"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "jest": "^29.0.0",
    "playwright": "^1.40.0"
  }
}
```

### Banco de Dados: MySQL + Prisma

```json
{
  "database": "MySQL 8.0",
  "orm": "Prisma 5.x"
}
```

**Justificativa Prisma:**

- Type-safety superior
- Schema declarativo
- Migrations versionadas
- Query builder intuitivo
- Excelente para TDD (mocking)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  role      Role     @relation(fields: [roleId], references: [id])
  roleId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

### Cache e Sessions: Redis

```json
{
  "cache": "Redis 7.x",
  "client": "ioredis"
}
```

**Usos:**

- Cache de queries frequentes
- Sessions de usuário
- Rate limiting
- Filas de jobs (BullMQ futuro)
- Pub/Sub para eventos

### Testes: Jest + Testing Library

**Backend:**

```typescript
// Exemplo TDD red-green-refactor
describe('CreateStudentUseCase', () => {
  // RED: Escrever teste que falha
  it('should create a student with valid data', async () => {
    const result = await useCase.execute({
      name: 'João Silva',
      cpf: '12345678901',
      email: 'joao@email.com',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value.student.name).toBe('João Silva');
  });

  // GREEN: Implementar código mínimo
  // REFACTOR: Melhorar código mantendo testes verdes
});
```

**Frontend:**

```typescript
// Testes de componente
describe('StudentForm', () => {
  it('should submit form with valid data', async () => {
    render(<StudentForm onSubmit={mockSubmit} />);

    await userEvent.type(screen.getByLabelText('Nome'), 'João');
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }));

    expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
      name: 'João'
    }));
  });
});
```

## Estrutura do Projeto

```
/
├── apps/
│   ├── api/                    # NestJS Backend
│   │   ├── src/
│   │   ├── test/
│   │   ├── prisma/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── web/                    # Next.js Frontend
│       ├── app/
│       ├── components/
│       ├── lib/
│       ├── Dockerfile
│       └── package.json
│
├── packages/                   # Shared packages (opcional)
│   └── shared-types/
│
├── docker/
│   ├── docker-compose.yml
│   ├── docker-compose.dev.yml
│   └── docker-compose.prod.yml
│
├── .github/
│   └── workflows/
│
└── package.json               # Workspace root (pnpm)
```

## Alternativas Consideradas

### Backend

| Opção        | Prós                   | Contras                           | Decisão |
| ------------ | ---------------------- | --------------------------------- | ------- |
| Express puro | Simples, leve          | Sem estrutura, mais código manual | ❌      |
| NestJS       | Estruturado, DI nativa | Curva de aprendizado              | ✅      |
| Fastify      | Muito rápido           | Menos ecossistema                 | ❌      |

### ORM

| Opção   | Prós                  | Contras                             | Decisão |
| ------- | --------------------- | ----------------------------------- | ------- |
| TypeORM | Maduro, Active Record | Bugs, tipos fracos                  | ❌      |
| Prisma  | Type-safe, moderno    | Menos flexível em queries complexas | ✅      |
| Knex    | Flexível              | Query builder apenas                | ❌      |

### Frontend State

| Opção   | Prós          | Contras               | Decisão |
| ------- | ------------- | --------------------- | ------- |
| Redux   | Poderoso      | Boilerplate excessivo | ❌      |
| Zustand | Simples, leve | Menos features        | ✅      |
| Jotai   | Atômico       | Curva de aprendizado  | ❌      |

## Consequências

### Positivas

- ✅ Type-safety end-to-end
- ✅ Ecossistema maduro e estável
- ✅ Excelente DX (Developer Experience)
- ✅ Boa documentação
- ✅ Comunidade ativa

### Negativas

- ⚠️ Bundle size do Next.js pode crescer
- ⚠️ Prisma tem overhead em queries complexas
- ⚠️ Node.js single-threaded (mitigado com clustering)

## Compatibilidade com TDD

A stack foi escolhida com foco em testabilidade:

| Tecnologia  | Facilidade TDD | Ferramentas                    |
| ----------- | -------------- | ------------------------------ |
| NestJS      | ⭐⭐⭐⭐⭐     | @nestjs/testing, mocks nativos |
| Prisma      | ⭐⭐⭐⭐⭐     | prisma mock, transactions      |
| Next.js     | ⭐⭐⭐⭐       | Testing Library, MSW           |
| React Query | ⭐⭐⭐⭐⭐     | queryClient mock               |

## Versões Mínimas

```yaml
Node.js: 20.x LTS
pnpm: 8.x
Docker: 24.x
Docker Compose: 2.x
MySQL: 8.0
Redis: 7.x
```

## Referências

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Best Practices](https://www.prisma.io/docs/guides)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Testing Library Guiding Principles](https://testing-library.com/docs/guiding-principles)
