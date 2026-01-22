# EPIC-001: Setup do Ambiente de Desenvolvimento

## 📋 Visão Geral

Este épico configura toda a infraestrutura de desenvolvimento do projeto seguindo os princípios:

- **TDD** - Test-Driven Development (Red → Green → Refactor)
- **DDD** - Domain-Driven Design
- **100% Docker** - Nenhuma dependência local
- **CI/CD** - Integração e deploy contínuos
- **Coverage ≥80%** - Qualidade garantida

---

## 🗂️ User Stories

| ID                                               | Título                                    | Estimativa | Status     |
| ------------------------------------------------ | ----------------------------------------- | ---------- | ---------- |
| [US-001-001](./US-001-001-setup-inicial.md)      | Setup Inicial do Projeto                  | 4h         | 📋 Backlog |
| [US-001-002](./US-001-002-estrutura-backend.md)  | Estrutura do Backend (NestJS + DDD)       | 6h         | 📋 Backlog |
| [US-001-003](./US-001-003-estrutura-frontend.md) | Estrutura do Frontend (Next.js)           | 5h         | 📋 Backlog |
| [US-001-004](./US-001-004-docker-compose.md)     | Docker Compose Completo                   | 4h         | 📋 Backlog |
| [US-001-005](./US-001-005-qualidade-codigo.md)   | Qualidade de Código (Lint, Format, Hooks) | 3h         | 📋 Backlog |
| [US-001-006](./US-001-006-testes-backend.md)     | Configuração de Testes Backend            | 4h         | 📋 Backlog |
| [US-001-007](./US-001-007-testes-frontend.md)    | Configuração de Testes Frontend           | 4h         | 📋 Backlog |
| [US-001-008](./US-001-008-ci-cd.md)              | Pipeline CI/CD (GitHub Actions)           | 5h         | 📋 Backlog |
| [US-001-009](./US-001-009-observabilidade.md)    | Logging e Métricas                        | 3h         | 📋 Backlog |
| [US-001-010](./US-001-010-documentacao.md)       | Documentação e Seed                       | 3h         | 📋 Backlog |

---

## 🔄 Ordem de Implementação

```
US-001-001 (Setup Inicial)
    │
    ├──► US-001-002 (Backend)
    │         │
    │         └──► US-001-006 (Testes Backend)
    │
    ├──► US-001-003 (Frontend)
    │         │
    │         └──► US-001-007 (Testes Frontend)
    │
    ├──► US-001-004 (Docker)
    │
    ├──► US-001-005 (Qualidade)
    │
    └──► US-001-008 (CI/CD)
              │
              └──► US-001-009 (Observabilidade)
                        │
                        └──► US-001-010 (Docs)
```

---

## 🎯 Metodologia de Implementação

### Cada User Story segue:

1. **📖 Leitura do Prompt** - Entender contexto e objetivos
2. **🧠 Chain of Thought** - Raciocínio passo a passo
3. **🌳 Tree of Thought** - Explorar alternativas
4. **🔴 RED** - Escrever teste que falha
5. **🟢 GREEN** - Implementar código mínimo
6. **🔵 REFACTOR** - Melhorar mantendo testes verdes
7. **✅ Verificação** - Validar critérios de aceite

### Formato dos Prompts

Cada US contém:

- Contexto e objetivo
- Critérios de aceite (checklist)
- Tasks técnicas detalhadas
- Prompt pronto para usar com AI
- Exemplos de código esperado
- Verificação final

---

## 📊 Definition of Done do Épico

- [ ] Todas as User Stories concluídas
- [ ] `docker compose up` funciona
- [ ] Hot reload ativo (API e Web)
- [ ] Testes passando (≥80% coverage)
- [ ] CI pipeline funcional
- [ ] Documentação completa
- [ ] Seed de dados funcionando

---

## 🚀 Como Começar

1. **Leia** a [US-001-001](./US-001-001-setup-inicial.md) completa
2. **Copie** o prompt para o AI
3. **Execute** os comandos gerados
4. **Valide** os critérios de aceite
5. **Avance** para próxima US

---

## 📎 Referências

- [EPIC-001 Original](../EPIC-001-setup-ambiente.md)
- [ADR-002: Stack Tecnológica](../../architecture/adrs/ADR-002-stack-tecnologica.md)
- [ADR-007: Containerização](../../architecture/adrs/ADR-007-containerizacao.md)
- [ADR-009: Estratégia de Testes](../../architecture/adrs/ADR-009-estrategia-testes.md)
