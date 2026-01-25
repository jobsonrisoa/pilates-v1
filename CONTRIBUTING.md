# Contributing Guide

Thank you for your interest in contributing to the Pilates & Physiotherapy Management System!

## Workflow

### 1. Create a Branch

Always create your branch from `develop`:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/name-of-feature
```

### 2. Development with TDD

Follow the Test-Driven Development (TDD) workflow:

1. **RED** - Write a failing test
2. **GREEN** - Implement the minimum code to make it pass
3. **REFACTOR** - Improve the code while keeping tests green

```bash
# Run tests in watch mode
make test-watch

# Run tests with coverage
make test-cov
```

### 3. Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add student registration"
git commit -m "fix: correct date validation in appointments"
git commit -m "docs: update API documentation"
git commit -m "test: add integration tests for auth"
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no logic changes)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (dependencies, config, etc.)

### 4. Push and Create Pull Request

```bash
git push origin feature/name-of-feature
```

Then open a Pull Request targeting `develop`.

## Code Review

### Requirements

- ✅ Minimum 1 approval required
- ✅ CI pipeline must pass
- ✅ Coverage must be ≥80%
- ✅ All tests must pass
- ✅ Code must be formatted (Prettier)
- ✅ No linting errors

### Review Checklist

- [ ] Code follows project patterns (DDD, TDD)
- [ ] Tests are comprehensive and passing
- [ ] Documentation is updated (if needed)
- [ ] No security vulnerabilities
- [ ] Performance considerations addressed

## TDD Workflow

```
┌─────────┐
│   RED   │ → Write failing test
└────┬────┘
     │
     ▼
┌─────────┐
│  GREEN  │ → Implement minimum code
└────┬────┘
     │
     ▼
┌──────────┐
│  REFACTOR  │ → Improve code
└────────────┘
```

## Code Style

### TypeScript

- Use strict mode
- Prefer interfaces for object shapes
- Use type aliases for unions/intersections
- Avoid `any` type

### NestJS

- Follow DDD structure (domain, application, infrastructure)
- Use dependency injection
- Create DTOs for all API inputs/outputs
- Document with Swagger decorators

### Next.js

- Use App Router
- Separate client/server components
- Use TypeScript for all files
- Follow React best practices

## Testing

### Coverage Requirements

- **Minimum:** 80% for statements, lines, functions
- **Branches:** 75% minimum

### Running Tests

```bash
# All tests
make test

# With coverage
make test-cov

# Watch mode (API)
make test-watch

# Integration tests
make test-int

# E2E tests (Web)
make test-e2e
```

## Environment Variables

Always document new environment variables in:
- `.env.example`
- `apps/api/src/config/env.validation.ts` (for API)
- `apps/web/lib/env.ts` (for Web)

## Documentation

### When to Update Documentation

- New features or modules
- API changes
- Architecture decisions (create ADR)
- Breaking changes
- Setup/installation changes

### Documentation Structure

- **PRD**: Product requirements
- **ADRs**: Architecture Decision Records
- **Epics**: Feature epics and user stories
- **README**: Quick start and overview
- **CONTRIBUTING**: This file

## Questions?

- Open an issue for bugs or feature requests
- Check existing documentation first
- Ask in code review comments

---

Thank you for contributing! 🎉

