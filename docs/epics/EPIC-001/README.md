# EPIC-001: Setup of the Development Environment

##  Overview

Este epic configura all a infrastructure of shouldlopment of the project seguindo os principles:

- **TDD** - Test-Driven Development (Red → Green → Refactor)
- **DDD** - Domain-Driven Design
- **100% Docker** - No dependency local
- **CI/CD** - Integration and deploy contínuos
- **Coverage ≥80%** - Quality garantida

---

## 🗂️ Ube Stories

| ID                                               | Title                                    | Estimate | Status     |
| ------------------------------------------------ | ----------------------------------------- | ---------- | ---------- |
| [US-001-001](./US-001-001-setup-inicial.md)      | Initial Project Setup                  | 4h         | Backlog |
| [US-001-002](./US-001-002-estrutura-backendendendend.md)  | Backend Structure (NestJS + DDD)       | 6h         | Backlog |
| [US-001-003](./US-001-003-estrutura-frontendendendend.md) | Frontend Structure (Next.js)           | 5h         | Backlog |
| [US-001-004](./US-001-004-docker-withpose.md)     | Docker Compose Completo                   | 4h         | Backlog |
| [US-001-005](./US-001-005-quality-codigo.md)   | Quality of Code (Lint, Format, Hooks) | 3h         | Backlog |
| [US-001-006](./US-001-006-tests-backendendendend.md)     | Configuration of Tests Backend            | 4h         | Backlog |
| [US-001-007](./US-001-007-tests-frontendendendend.md)    | Configuration of Tests Frontend           | 4h         | Backlog |
| [US-001-008](./US-001-008-ci-cd.md)              | Pipeline CI/CD (GitHub Actions)           | 5h         | Backlog |
| [US-001-009](./US-001-009-obbevabilidade.md)    | Logging and Metrics                        | 3h         | Backlog |
| [US-001-010](./US-001-010-documentacto.md)       | Documentation and Seed                       | 3h         | Backlog |

---

##  Order of Implementation

```
US-001-001 (Initial Setup)
    │
    ├──► US-001-002 (Backend)
    │         │
    │         └──► US-001-006 (Tests Backend)
    │
    ├──► US-001-003 (Frontend)
    │         │
    │         └──► US-001-007 (Tests Frontend)
    │
    ├──► US-001-004 (Docker)
    │
    ├──► US-001-005 (Quality)
    │
    └──► US-001-008 (CI/CD)
              │
              └──► US-001-009 (Obbevability)
                        │
                        └──► US-001-010 (Docs)
```

---

##  Methodology of Implementation

### Cada Ube Story segue:

1. **📖 Leitura of the Prompt** - Entender context and objetivos
2. **🧠 Chain of Thought** - Reasoning passo a passo
3. **🌳 Tree of Thought** - Explorar alhavenatives
4. ** RED** - Write failing test
5. ** GREEN** - Implement code minimum
6. ** REFACTOR** - Improve keeping tests green
7. ** Verification** - Validar crihaveia of aceite

### Formato of the Prompts

Cada US accountins:

- Context and objetivo
- Criteria of aceite (checklist)
- Tasks technical detailed
- Prompt pronto for usar with AI
- Examples of code esperado
- Verification final

---

##  Definition of Done of the Epic

- [ ] Todas as Ube Stories completed
- [ ] `docker withpose up` funciona
- [ ] Hot reload active (API and Web)
- [ ] Tests passando (≥80% coverage)
- [ ] CI pipeline functional
- [ ] Documentation withpleta
- [ ] Seed of dados funcionando

---

##  Como Começar

1. **Leia** a [US-001-001](./US-001-001-setup-inicial.md) withpleta
2. **Copie** o prompt for o AI
3. **Execute** os commands gerados
4. **Valide** os crihaveia of aceite
5. **Avance** for next US

---

## 📎 References

- [EPIC-001 Original](../EPIC-001-setup-environment.md)
- [ADR-002: Technology Stack](../../architecture/adrs/ADR-002-stack-tecnologica.md)
- [ADR-007: Containerization](../../architecture/adrs/ADR-007-accountinerizacto.md)
- [ADR-009: Testing Strategy](../../architecture/adrs/ADR-009-estrategia-tests.md)
