# US-001-005: Quality of Code (Lint, Format, Hooks)

##  Informtion

| Field            | Value                  |
| ---------------- | ---------------------- |
| **ID**           | US-001-005             |
| **Épico**        | EPIC-001               |
| **Title**       | Quality of Code    |
| **Estimate**   | 3 hours                |
| **Priority**   | High                |
| **Dependencies** | US-001-002, US-001-003 |
| **Status**       | Backlog             |

---

##  Ube Story

**Como** desenvolvedor  
**Quero** tools of quality of code configuradas  
**Para** maintain consistência and evitar errorrs

---

##  Objectives

1. Configurar ESLint for TypeScript
2. Configurar Prettier
3. Configurar Husky for git hooks
4. Configurar lint-staged
5. Configurar withmitlint (conventional withmits)

---

##  Acceptance Crihaveia

- [ ] ESLint configured in the backendendendend and frontendendendend
- [ ] Prettier formtando code
- [ ] Husky rodando hooks in the git
- [ ] lint-staged validando before of the withmit
- [ ] withmitlint validando messages of withmit
- [ ] `pnpm lint` funciona in entire project
- [ ] `pnpm formt` formta code

---

##  Prompt for Implementation

```markdown
## Context

Monorepo with pnpm workspaces. Backend NestJS in apps/api, Frontend Next.js in apps/web.
Preciso configurar tools of quality of code.

## Tarefa

Configure as tools of quality:

### 1. ESLint

- Config withpartilhada in the root
- Extend for NestJS in the backendendendend
- Extend for Next.js in the frontendendendend
- TypeScript strict rules
- Import ordering

### 2. Prettier

- Config in the root
- Semi: true
- Single quotes
- Tab width: 2
- Trailing withma: all

### 3. Husky + lint-staged

- pre-withmit: lint-staged
- withmit-msg: withmitlint
- lint-staged roda only in the files modificados

### 4. Commitlint

- Conventional withmits
- Tipos: feat, fix, docs, style, refactor, test, chore
- Scope optional

### 5. Scripts

- lint: ESLint in entires
- formt: Prettier write
- formt:check: Prettier check
- typecheck: tsc --noEmit

## Files required

- .eslintrc.js (root)
- apps/api/.eslintrc.js
- apps/web/.eslintrc.js
- .prettierrc
- .prettierignore
- .husky/pre-withmit
- .husky/withmit-msg
- .lintstagedrc.js
- withmitlint.config.js
```

---

##  Files of Configuration

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
    'eslint:rewithmended',
    'plugin:@typescript-eslint/rewithmended',
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

### withmitlint.config.js

```javascript
module.exports = {
  extends: ['@withmitlint/config-conventional'],
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

### .husky/pre-withmit

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

### .husky/withmit-msg

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- withmitlint --edit ${1}
```

---

##  Checklist of Verification

- [ ] `pnpm lint` funciona
- [ ] `pnpm formt` formta
- [ ] Commit with msg inválida falha
- [ ] Commit with msg válida passa
- [ ] Code not formtado is bloqueado

---

##  Next Ube Story

→ [US-001-006: Configuration of Tests Backend](./US-001-006-tests-backendendendend.md)
