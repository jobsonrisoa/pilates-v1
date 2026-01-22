# US-001-005: Qualidade de Código (Lint, Format, Hooks)

##  Informações

| Campo            | Valor                  |
| ---------------- | ---------------------- |
| **ID**           | US-001-005             |
| **Épico**        | EPIC-001               |
| **Título**       | Qualidade de Código    |
| **Estimativa**   | 3 horas                |
| **Prioridade**   | High                |
| **Dependências** | US-001-002, US-001-003 |
| **Status**       | Backlog             |

---

##  User Story

**Como** desenvolvedor  
**Quero** ferramentas de qualidade de código configuradas  
**Para** manter consistência e evitar erros

---

##  Objetivos

1. Configurar ESLint para TypeScript
2. Configurar Prettier
3. Configurar Husky para git hooks
4. Configurar lint-staged
5. Configurar commitlint (conventional commits)

---

##  Critérios de Aceite

- [ ] ESLint configurado no backend e frontend
- [ ] Prettier formatando código
- [ ] Husky rodando hooks no git
- [ ] lint-staged validando antes do commit
- [ ] commitlint validando mensagens de commit
- [ ] `pnpm lint` funciona em todo projeto
- [ ] `pnpm format` formata código

---

##  Prompt para Implementação

```markdown
## Contexto

Monorepo com pnpm workspaces. Backend NestJS em apps/api, Frontend Next.js em apps/web.
Preciso configurar ferramentas de qualidade de código.

## Tarefa

Configure as ferramentas de qualidade:

### 1. ESLint

- Config compartilhada no root
- Extend para NestJS no backend
- Extend para Next.js no frontend
- TypeScript strict rules
- Import ordering

### 2. Prettier

- Config no root
- Semi: true
- Single quotes
- Tab width: 2
- Trailing comma: all

### 3. Husky + lint-staged

- pre-commit: lint-staged
- commit-msg: commitlint
- lint-staged roda apenas nos arquivos modificados

### 4. Commitlint

- Conventional commits
- Tipos: feat, fix, docs, style, refactor, test, chore
- Scope opcional

### 5. Scripts

- lint: ESLint em todos
- format: Prettier write
- format:check: Prettier check
- typecheck: tsc --noEmit

## Arquivos necessários

- .eslintrc.js (root)
- apps/api/.eslintrc.js
- apps/web/.eslintrc.js
- .prettierrc
- .prettierignore
- .husky/pre-commit
- .husky/commit-msg
- .lintstagedrc.js
- commitlint.config.js
```

---

##  Arquivos de Configuração

### .eslintrc.js (root)

```javascript
module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
  ignorePatterns: ['node_modules/', 'dist/', '.next/', 'coverage/'],
};
```

### .prettierrc

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### .lintstagedrc.js

```javascript
module.exports = {
  '*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
};
```

### commitlint.config.js

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // Nova feature
        'fix', // Correção de bug
        'docs', // Documentação
        'style', // Formatação
        'refactor', // Refatoração
        'test', // Testes
        'chore', // Manutenção
        'perf', // Performance
        'ci', // CI/CD
        'build', // Build
        'revert', // Revert
      ],
    ],
    'subject-case': [0],
  },
};
```

### .husky/pre-commit

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

### .husky/commit-msg

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit ${1}
```

---

##  Checklist de Verificação

- [ ] `pnpm lint` funciona
- [ ] `pnpm format` formata
- [ ] Commit com msg inválida falha
- [ ] Commit com msg válida passa
- [ ] Código não formatado é bloqueado

---

##  Próxima User Story

→ [US-001-006: Configuração de Testes Backend](./US-001-006-testes-backend.md)
