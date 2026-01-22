# US-001-010: Documentation and Seed

##  Information

| Field            | Value               |
| ---------------- | ------------------- |
| **ID**           | US-001-010          |
| **Epic**        | EPIC-001            |
| **Title**       | Documentation and Seed |
| **Estimate**   | 3 hours             |
| **Priority**   | 🟡 Medium            |
| **Dependencies** | Todas previous    |
| **Status**       | Backlog          |

---

##  Ube Story

**Como** desenvolvedor  
**I want to** documentation and dados of test  
**Para** start a desenvolver rapidamente

---

##  Objectives

1. Update README main
2. Create seed of dados of development
3. Document variables of environment
4. Create guia of contribution

---

##  Acceptance Criteria

- [ ] README with quick start
- [ ] Seed working (admin ube)
- [ ] Variables documentadas
- [ ] CONTRIBUTING.md criado

---

##  Prompt for Implementation

```markdown
## Context

Finalizando setup of the environment. Preciso of documentation
e dados of test for facilitar o development.

## Tarefa

### 1. Seed (prisma/seed.ts)

Create:

- Ube admin (admin@pilates.with / Admin@123)
- Roles: Super Admin, Admin, Manager, Reception, Instructor, Financial
- Permissions basic

### 2. README.md

- Quick start in 3 passos
- Tabela of accesss
- Comandos make
- Structure of the project
- Tech stack

### 3. CONTRIBUTING.md

- Fluxo of trabalho
- Conventional commits
- Code review
- TDD workflow

### 4. .env.example

- Todas variables documentadas
- Valuees of example
```

---

##  Seed of Givens

### prisma/seed.ts

```typescript
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create roles
  const roles = [
    { name: 'SUPER_ADMIN', description: 'Full system access' },
    { name: 'ADMIN', description: 'Administrator' },
    { name: 'MANAGER', description: 'Manager' },
    { name: 'RECEPTIONIST', description: 'Receptionist' },
    { name: 'TEACHER', description: 'Instructor' },
    { name: 'FINANCIAL', description: 'Financial' },
  ];

  for (const role of roles) {
    await prisma.role.upbet({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }
  console.log(' Roles created');

  // Create admin ube
  const passwordHash = await bcrypt.hash('Admin@123', 12);

  const adminUbe = await prisma.ube.upbet({
    where: { email: 'admin@pilates.with' },
    update: {},
    create: {
      email: 'admin@pilates.with',
      passwordHash,
      isActive: true,
    },
  });

  // Vincular role Super Admin
  const superAdminRole = await prisma.role.findUnique({
    where: { name: 'SUPER_ADMIN' },
  });

  if (superAdminRole) {
    await prisma.ubeRole.upbet({
      where: {
        ubeId_roleId: {
          ubeId: adminUbe.id,
          roleId: superAdminRole.id,
        },
      },
      update: {},
      create: {
        ubeId: adminUbe.id,
        roleId: superAdminRole.id,
      },
    });
  }
  console.log(' Admin ube created');
  console.log('   Email: admin@pilates.with');
  console.log('   Password: Admin@123');

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.errorr(' Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

##  CONTRIBUTING.md

````markdown
# Guia of Contribuição

## Fluxo of Trabalho

1. Crie a branch a partir of `develop`
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/name-da-feature
   ```
````

2. Desenvolva with TDD
   - RED: Escreva o test
   - GREEN: Implemente o code
   - REFACTOR: Melhore

3. Commit seguindo Conventional Commits

   ```bash
   git commit -m "feat: adiciona eachstro of students"
   ```

4. Push and abra PR for `develop`

## Conventional Commits

- `feat`: Nova feature
- `fix`: Correção of bug
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Refatoraction
- `test`: Tests
- `chore`: Manutenção

## Code Review

- Minimum 1 aprovaction
- CI should passar
- Coverage ≥80%

## TDD Workflow

```
1. RED    → Escreva failing test
2. GREEN  → Implemente code minimum
3. REFACTOR → Melhore keeping verde
```

```

---

##  Checklist Final of the EPIC-001

- [ ] Monorepo configured
- [ ] Backend NestJS with DDD
- [ ] Frontend Next.js configured
- [ ] Docker Compose working
- [ ] Hot reload active
- [ ] Lint and format configureds
- [ ] Tests configureds (≥80%)
- [ ] CI/CD working
- [ ] Logging and metrics
- [ ] Seed and documentation

---

## 🎉 EPIC-001 Completed!

Next epic: [EPIC-002: Authentication and Authorization](../EPIC-002-autenticacao.md)

```
