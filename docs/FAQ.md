# ❓ FAQ - Perguntas Frequentes

## 📦 Por que temos múltiplas pastas `node_modules`?

Em um **monorepo com pnpm workspaces**, é normal ter múltiplas pastas `node_modules`:

```
pilates/
├── node_modules/          # Dependências do root (husky, prettier, etc)
├── apps/
│   ├── api/
│   │   └── node_modules/  # Dependências específicas do backend
│   └── web/
│       └── node_modules/  # Dependências específicas do frontend
```

### Por que isso acontece?

1. **Isolamento**: Cada workspace pode ter suas próprias dependências
2. **pnpm workspaces**: O pnpm cria links simbólicos entre workspaces
3. **Otimização**: Dependências compartilhadas são linkadas, não duplicadas

### Está correto?

✅ **Sim!** Isso é esperado e está correto. As pastas `node_modules` estão no `.gitignore` e **não são versionadas**.

### Como funciona?

- **Root `node_modules/`**: Ferramentas de desenvolvimento (husky, prettier, eslint)
- **`apps/api/node_modules/`**: Dependências do NestJS (prisma, @nestjs/\*)
- **`apps/web/node_modules/`**: Dependências do Next.js (next, react, tailwindcss)

O pnpm usa **links simbólicos** para compartilhar dependências comuns entre workspaces, evitando duplicação desnecessária.

---

## 🧪 Como pular testes no pre-commit?

Se você precisar fazer um commit rápido sem rodar testes:

```bash
SKIP_TESTS=1 git commit -m "fix: correção urgente"
```

Ou use `--no-verify` (não recomendado, pula todos os hooks):

```bash
git commit --no-verify -m "fix: correção urgente"
```

**⚠️ Atenção**: Use apenas em casos excepcionais. Testes devem passar antes de fazer merge.

---

## 🐳 Por que usar Docker para tudo?

O projeto segue uma abordagem **Docker-first**:

- ✅ **Consistência**: Mesmo ambiente em dev, CI e produção
- ✅ **Isolamento**: Não polui o sistema local
- ✅ **Reprodutibilidade**: Qualquer desenvolvedor pode rodar o projeto
- ✅ **Zero setup**: Não precisa instalar Node.js, pnpm, MySQL, etc localmente

### Como funciona?

Todos os comandos rodam via `docker compose run --rm tools`:

```bash
# Ao invés de:
pnpm test

# Usamos:
docker compose run --rm tools pnpm test
```

---

## 🔄 Como funciona o CI/CD?

O GitHub Actions roda automaticamente em:

- **Push para `main` ou `develop`**: Roda todos os testes e builds
- **Pull Requests**: Valida código antes de merge

### Jobs do CI

1. **lint**: ESLint + Prettier + TypeScript check
2. **test-api**: Testes unitários do backend (com coverage)
3. **test-web**: Testes unitários do frontend (com coverage)
4. **test-integration**: Testes de integração (com MySQL/Redis)
5. **build**: Build das imagens Docker

### Coverage mínimo

- **Requisito**: ≥80% de cobertura
- **Validação**: Automática no CI
- **Relatórios**: Disponíveis como artifacts

---

## 🚀 Como rodar testes localmente?

### Todos os testes

```bash
# Via Docker (recomendado)
docker compose run --rm tools pnpm test

# Ou use o script
./scripts/test-all.sh
```

### Testes específicos

```bash
# Apenas backend
docker compose run --rm tools pnpm --filter @pilates/api test

# Apenas frontend
docker compose run --rm tools pnpm --filter @pilates/web test

# Com coverage
docker compose run --rm tools pnpm test:cov
```

### Modo watch (desenvolvimento)

```bash
docker compose run --rm tools pnpm --filter @pilates/api test:watch
```

---

## 📝 Como funciona o pre-commit hook?

O hook do Husky executa automaticamente antes de cada commit:

1. **lint-staged**: Formata e valida apenas arquivos staged
2. **Testes unitários**: Roda todos os testes (rápido)

### O que acontece se falhar?

- ❌ Commit é bloqueado
- ✅ Você precisa corrigir os erros antes de commitar

### Como pular?

```bash
SKIP_TESTS=1 git commit -m "fix: correção"
```

---

## 🔧 Como adicionar novas dependências?

### Backend

```bash
docker compose run --rm tools pnpm --filter @pilates/api add <package>
```

### Frontend

```bash
docker compose run --rm tools pnpm --filter @pilates/web add <package>
```

### Root (dev dependencies)

```bash
docker compose run --rm tools pnpm add -D -w <package>
```

---

## 🐛 Troubleshooting

### Testes falhando no CI mas passam localmente

1. Verificar versões do Node.js/pnpm
2. Verificar variáveis de ambiente
3. Verificar se containers estão prontos

### Pre-commit muito lento

- Testes unitários devem ser rápidos (< 30s)
- Se estiver lento, verificar se há testes desnecessários
- Considere usar `SKIP_TESTS=1` temporariamente

### Docker não encontrado

- Instalar Docker e Docker Compose
- Verificar se `docker compose ps` funciona
- Verificar permissões do usuário

---

**Última atualização**: 2026-01-22
