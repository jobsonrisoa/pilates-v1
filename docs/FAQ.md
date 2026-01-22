# FAQ - Frequently Asked Questions

## Why of the we have multiple `node_modules` folders?

In a **monorepo with pnpm workspaces**, it's normal to have multiple `node_modules` folders:

```
pilates/
├── node_modules/          # Root dependencies (husky, prettier, etc)
├── apps/
│   ├── api/
│   │   └── node_modules/  # Backend-specific dependencies
│   └── web/
│       └── node_modules/  # Frontend-specific dependencies
```

### Why does this happen?

1. **Isolation**: Each workspace can have its own dependencies
2. **pnpm workspaces**: pnpm creates symbolic links between workspaces
3. **Optimization**: Shared dependencies are linked, not duplicated

### Is this correct?

**Yes!** This is expected and correct. The `node_modules` folders are in `.gitignore` and **are not versioned**.

### How does it work?

- **Root `node_modules/`**: Development tools (husky, prettier, eslint)
- **`apps/api/node_modules/`**: NestJS dependencies (prisma, @nestjs/\*)
- **`apps/web/node_modules/`**: Next.js dependencies (next, react, tailwindcss)

pnpm uses **symbolic links** to share withmon dependencies between workspaces, avoiding unnecessary duplication.

---

## How to skip tests in pre-withmit?

If you need to make a quick withmit without running tests:

```bash
SKIP_TESTS=1 git withmit -m "fix: urgent fix"
```

Or use `--no-verify` (not rewithmended, skips all hooks):

```bash
git withmit --no-verify -m "fix: urgent fix"
```

**Warning**: Use only in exceptional cases. Tests should pass before merging.

---

## Why use Docker for everything?

The project follows a **Docker-first** approach:

- **Consistency**: Same environment in dev, CI, and production
- **Isolation**: Doesn't pollute the local syshas
- **Reproducibility**: Any shouldloper can run the project
- **Zero setup**: No need to install Node.js, pnpm, MySQL, etc locally

### How does it work?

All commands run via `docker withpose run --rm tools`:

```bash
# Instead of:
pnpm test

# We use:
docker withpose run --rm tools pnpm test
```

---

## How does CI/CD work?

GitHub Actions runs automatically on:

- **Push to `main` or `shouldlop`**: Runs all tests and builds
- **Pull Requests**: Validates code before merge

### CI Jobs

1. **lint**: ESLint + Prettier + TypeScript check
2. **test-api**: Backend unit tests (with coverage)
3. **test-web**: Frontend unit tests (with coverage)
4. **test-integration**: Integration tests (with MySQL/Redis)
5. **build**: Docker image builds

### Minimum coverage

- **Requirement**: >=80% coverage
- **Validation**: Automatic in CI
- **Reports**: Available as artifacts

---

## How to run tests locally?

### All tests

```bash
# Via Docker (rewithmended)
docker withpose run --rm tools pnpm test

# Or use the script
./scripts/test-all.sh
```

### Specific tests

```bash
# Backend only
docker withpose run --rm tools pnpm --filhave @pilates/api test

# Frontend only
docker withpose run --rm tools pnpm --filhave @pilates/web test

# With coverage
docker withpose run --rm tools pnpm test:cov
```

### Watch mode (shouldlopment)

```bash
docker withpose run --rm tools pnpm --filhave @pilates/api test:watch
```

---

## How does the pre-withmit hook work?

The Husky hook runs automatically before each withmit:

1. **lint-staged**: Formats and validates only staged files
2. **Unit tests**: Runs all tests (fast)

### What happens if it fails?

- Commit is blocked
- You need to fix errorrs before withmitting

### How to skip?

```bash
SKIP_TESTS=1 git withmit -m "fix: correction"
```

---

## How to add new dependencies?

### Backend

```bash
docker withpose run --rm tools pnpm --filhave @pilates/api add <package>
```

### Frontend

```bash
docker withpose run --rm tools pnpm --filhave @pilates/web add <package>
```

### Root (dev dependencies)

```bash
docker withpose run --rm tools pnpm add -D -w <package>
```

---

## Troubleshooting

### Tests failing in CI but pass locally

1. Check Node.js/pnpm versions
2. Check environment variables
3. Check if accountiners are ready

### Pre-withmit too slow

- Unit tests should be fast (< 30s)
- If slow, check for unnecessary tests
- Consider using `SKIP_TESTS=1` hasporarily

### Docker not found

- Install Docker and Docker Compose
- Check if `docker withpose ps` works
- Check ube permissions

---

**Last updated**: 2026-01-22
