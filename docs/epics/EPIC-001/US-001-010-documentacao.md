# US-001-010: Documentação e Seed

## 📋 Informações

| Campo | Valor |
|-------|-------|
| **ID** | US-001-010 |
| **Épico** | EPIC-001 |
| **Título** | Documentação e Seed |
| **Estimativa** | 3 horas |
| **Prioridade** | 🟡 Média |
| **Dependências** | Todas anteriores |
| **Status** | 📋 Backlog |

---

## 📝 User Story

**Como** desenvolvedor  
**Quero** documentação e dados de teste  
**Para** começar a desenvolver rapidamente

---

## 🎯 Objetivos

1. Atualizar README principal
2. Criar seed de dados de desenvolvimento
3. Documentar variáveis de ambiente
4. Criar guia de contribuição

---

## ✅ Critérios de Aceite

- [ ] README com quick start
- [ ] Seed funcionando (admin user)
- [ ] Variáveis documentadas
- [ ] CONTRIBUTING.md criado

---

## 🤖 Prompt para Implementação

```markdown
## Contexto
Finalizando setup do ambiente. Preciso de documentação
e dados de teste para facilitar o desenvolvimento.

## Tarefa

### 1. Seed (prisma/seed.ts)
Criar:
- Usuário admin (admin@pilates.com / Admin@123)
- Roles: Super Admin, Admin, Gerente, Recepção, Professor, Financeiro
- Permissões básicas

### 2. README.md
- Quick start em 3 passos
- Tabela de acessos
- Comandos make
- Estrutura do projeto
- Tech stack

### 3. CONTRIBUTING.md
- Fluxo de trabalho
- Conventional commits
- Code review
- TDD workflow

### 4. .env.example
- Todas variáveis documentadas
- Valores de exemplo
```

---

## 📝 Seed de Dados

### prisma/seed.ts

```typescript
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Criar roles
  const roles = [
    { name: 'SUPER_ADMIN', description: 'Acesso total ao sistema' },
    { name: 'ADMIN', description: 'Administrador' },
    { name: 'MANAGER', description: 'Gerente' },
    { name: 'RECEPTIONIST', description: 'Recepcionista' },
    { name: 'TEACHER', description: 'Professor' },
    { name: 'FINANCIAL', description: 'Financeiro' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }
  console.log('✅ Roles created');

  // Criar admin user
  const passwordHash = await bcrypt.hash('Admin@123', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@pilates.com' },
    update: {},
    create: {
      email: 'admin@pilates.com',
      passwordHash,
      isActive: true,
    },
  });

  // Vincular role Super Admin
  const superAdminRole = await prisma.role.findUnique({
    where: { name: 'SUPER_ADMIN' },
  });

  if (superAdminRole) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: adminUser.id,
          roleId: superAdminRole.id,
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        roleId: superAdminRole.id,
      },
    });
  }
  console.log('✅ Admin user created');
  console.log('   Email: admin@pilates.com');
  console.log('   Password: Admin@123');

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 📝 CONTRIBUTING.md

```markdown
# Guia de Contribuição

## Fluxo de Trabalho

1. Crie uma branch a partir de `develop`
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/nome-da-feature
   ```

2. Desenvolva com TDD
   - RED: Escreva o teste
   - GREEN: Implemente o código
   - REFACTOR: Melhore

3. Commit seguindo Conventional Commits
   ```bash
   git commit -m "feat: adiciona cadastro de alunos"
   ```

4. Push e abra PR para `develop`

## Conventional Commits

- `feat`: Nova feature
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Manutenção

## Code Review

- Mínimo 1 aprovação
- CI deve passar
- Coverage ≥80%

## TDD Workflow

```
1. RED    → Escreva teste que falha
2. GREEN  → Implemente código mínimo
3. REFACTOR → Melhore mantendo verde
```
```

---

## ✅ Checklist Final do EPIC-001

- [ ] Monorepo configurado
- [ ] Backend NestJS com DDD
- [ ] Frontend Next.js configurado
- [ ] Docker Compose funcionando
- [ ] Hot reload ativo
- [ ] Lint e format configurados
- [ ] Testes configurados (≥80%)
- [ ] CI/CD funcionando
- [ ] Logging e métricas
- [ ] Seed e documentação

---

## 🎉 EPIC-001 Concluído!

Próximo épico: [EPIC-002: Autenticação e Autorização](../EPIC-002-autenticacao.md)

