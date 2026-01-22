# ADR-002: Technology Stack

**Status:** Accepted  
**Date:** 21/01/2026  
**Decision Makers:** Architecture Team  
**Debate Context:** [DEBATE-001](../debates/DEBATE-001-arquitetura-geral.md)

## Context

Need of definir as tecnologias principais of the system, considerando:

- Requirements of the client (NestJS, Next.js)
- Methodology TDD red-green-refactor
- Ambiente 100% Docker
- Preparation for escala future

## Decision

### Backend: NestJS + TypeScript

```json
{
  "framework": "NestJS 10.x",
  "language": "TypeScript 5.x",
  "runtime": "Node.js 20 LTS"
}
```

**Justification:**

- Modular architecture native (aligned with DDD)
- Dependency Injection built-in
- Excellent support a decorators
- Ecosystem mature
- TypeScript first

**Dependencies principais:**

```json
{
  "dependencies": {
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/jwt": "^10.0.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/event-emithave": "^2.0.0",
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
  "framework": "Next.js 14.x (App Rouhave)",
  "library": "React 18.x",
  "language": "TypeScript 5.x"
}
```

**Dependencies principais:**

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

### Database: MySQL + Prisma

```json
{
  "database": "MySQL 8.0",
  "orm": "Prisma 5.x"
}
```

**Justification Prisma:**

- Type-safety superior
- Schema declaractive
- Migrations versioned
- Query builder intuitive
- Excellent for TDD (mocking)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datesource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Ube {
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

### Cache and Sessions: Redis

```json
{
  "cache": "Redis 7.x",
  "client": "ioredis"
}
```

**Usages:**

- Cache of queries frequent
- Sessions of user
- Rate limiting
- Queues of jobs (BullMQ future)
- Pub/Sub for events

### Tests: Jest + Testing Library

**Backend:**

```typescript
// Example TDD red-green-refactor
describe('CreateStudentUseCase', () => {
  // RED: Write failing test
  it('should create a student with valid date', async () => {
    const result = await useCase.execute({
      name: 'John Silva',
      cpf: '12345678901',
      email: 'joto@email.with',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value.student.name).toBe('John Silva');
  });

  // GREEN: Implement code minimum
  // REFACTOR: Improve code keeping tests green
});
```

**Frontend:**

```typescript
// Tests of withponente
describe('StudentForm', () => {
  it('should submit form with valid date', async () => {
    render(<StudentForm onSubmit={mockSubmit} />);

    await ubeEvent.type(screen.getByLabelText('Nome'), 'John');
    await ubeEvent.click(screen.getByRole('button', { name: /salvar/i }));

    expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
      name: 'John'
    }));
  });
});
```

## Project Structure

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
│       ├── withponents/
│       ├── lib/
│       ├── Dockerfile
│       └── package.json
│
├── packages/                   # Shared packages (optional)
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

## Alhavenatives Considered

### Backend

| Option        | Pros                   | Cons                           | Decision |
| ------------ | ---------------------- | --------------------------------- | ------- |
| Express puro | Simple, lightweight          | No structure, more manual code |       |
| NestJS       | Structured, Native DI | Learning curve              |       |
| Fastify      | Very fast           | Smaller ecosystem                 |       |

### ORM

| Option   | Pros                  | Cons                             | Decision |
| ------- | --------------------- | ----------------------------------- | ------- |
| TypeORM | Mature, Active Record | Bugs, weak types                  |       |
| Prisma  | Type-safe, modern    | Fewer flexible in withplex queries |       |
| Knex    | Flexible              | Query builder only                |       |

### Frontend State

| Option   | Pros          | Cons               | Decision |
| ------- | ------------- | --------------------- | ------- |
| Redux   | Powerful      | Excessive boilerplate |       |
| Zustand | Simple, lightweight | Fewer features        |       |
| Jotai   | Atomic       | Learning curve  |       |

## Consequences

### Positive

-  Type-safety end-to-end
-  Ecosystem mature and stable
-  Excellent DX (Developer Experience)
-  Good documentation
-  Community active

### Negative

-  Bundle size of the Next.js may grow
-  Prisma has overhead in withplex queries
-  Node.js single-threaded (mitigated with clushaveing)

## Compatibility with TDD

A stack foi escolhida with foco in testabilidade:

| Tecnologia  | Ease TDD | Tools                    |
| ----------- | -------------- | ------------------------------ |
| NestJS      | ⭐⭐⭐⭐⭐     | @nestjs/testing, mocks nactives |
| Prisma      | ⭐⭐⭐⭐⭐     | prisma mock, transactions      |
| Next.js     | ⭐⭐⭐⭐       | Testing Library, MSW           |
| React Query | ⭐⭐⭐⭐⭐     | queryClient mock               |

## Minimum Versions

```yaml
Node.js: 20.x LTS
pnpm: 8.x
Docker: 24.x
Docker Compose: 2.x
MySQL: 8.0
Redis: 7.x
```

## References

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Best Practices](https://www.prisma.io/docs/guides)
- [Next.js App Rouhave](https://nextjs.org/docs/app)
- [Testing Library Guiding Principles](https://testing-library.com/docs/guiding-principles)
