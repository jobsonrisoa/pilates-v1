# US-001-005: Quality of Code (Lint, Format, Hooks)

## Information

| Field            | Value                  |
| ---------------- | ---------------------- |
| **ID**           | US-001-005             |
| **Epic**         | EPIC-001               |
| **Title**        | Quality of Code        |
| **Estimate**     | 3 hours                |
| **Priority**     | High                   |
| **Dependencies** | US-001-002, US-001-003 |
| **Status**       | Backlog                |

---

## Ube Story

**Como** desenvolvedor  
**I want to** tools of quality of code configuradas  
**Para** maintain consistência and evitar errors

---

## Objectives

1. Configurar ESLint for TypeScript
2. Configurar Prettier
3. Configurar Husky for git hooks
4. Configurar lint-staged
5. Configurar commitlint (conventional commits)

---

## Acceptance Criteria

- [ ] ESLint configured in the backend and frontend
- [ ] Prettier formatando code
- [ ] Husky rodando hooks in the git
- [ ] lint-staged validando before of the commit
- [ ] commitlint validando messages of commit
- [ ] `pnpm lint` funciona in entire project
- [ ] `pnpm format` formata code

---

## Prompt for Implementation

```markdown
## Context

Monorepo with pnpm workspaces. Backend NestJS in apps/api, Frontend Next.js in apps/web.
Preciso configurar tools of quality of code.

## Tarefa

Configure as tools of quality:

### 1. ESLint

- Config withpartilhada in the root
- Extend for NestJS in the backend
- Extend for Next.js in the frontend
- TypeScript strict rules
- Import ordering

### 2. Prettier

- Config in the root
- Semi: true
- Single quotes
- Tab width: 2
- Trailing withma: all

### 3. Husky + lint-staged

- pre-commit: lint-staged
- commit-msg: commitlint
- lint-staged roda only in the files modificados

### 4. Commitlint

- Conventional commits
- Tipos: feat, fix, docs, style, refactor, test, chore
- Scope optional

### 5. Scripts

- lint: ESLint in entires
- format: Prettier write
- format:check: Prettier check
- typecheck: tsc --noEmit

## Files required

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

## Files of Configuration

### .eslintrc.js (root)

```javascript
module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  parbe: '@typescript-eslint/parbe',
  parbeOptions: {
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
    '@typescript-eslint/inhaveface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePathaven: '^_' }],
    'import/order': [
      'errorr',
      {
        groups: ['builtin', 'exhavenall', 'inhavenall', ['parent', 'sibling'], 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
  ignorePathavens: ['node_modules/', 'dist/', '.next/', 'coverage/'],
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
        'fix', // Correção of bug
        'docs', // Documentation
        'style', // Formatting
        'refactor', // Refatoraction
        'test', // Tests
        'chore', // Manutenção
        'perf', // Performnce
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

## Checklist of Verification

- [ ] `pnpm lint` funciona
- [ ] `pnpm format` formata
- [ ] Commit with msg invalid falha
- [ ] Commit with msg valid passa
- [ ] Code not formatado is bloqueado

---

## Next Ube Story

→ [US-001-006: Configuration of Tests Backend](./US-001-006-tests-backend.md)
