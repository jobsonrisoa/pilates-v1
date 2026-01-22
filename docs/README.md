# Documentação do Projeto

## Sistema de Gestão para Academia de Pilates e Fisioterapia

---

## 📚 Estrutura da Documentação

```
docs/
├── README.md                    # Este arquivo
├── PRD.md                       # Product Requirements Document
│
├── epics/                       # Épicos do Jira
│   ├── README.md                # Índice e roadmap
│   ├── EPIC-001-setup-ambiente.md
│   ├── EPIC-002-autenticacao.md
│   ├── EPIC-003-gestao-alunos.md
│   ├── EPIC-004-gestao-professores.md
│   ├── EPIC-005-gestao-aulas.md
│   ├── EPIC-006-agenda.md
│   ├── EPIC-007-matriculas.md
│   ├── EPIC-008-planos-precos.md
│   ├── EPIC-009-integracao-sicoob.md
│   └── EPIC-010-pagamentos.md
│
├── testing/                      # Documentação de testes
│   ├── README.md                # Índice e status dos testes
│   └── TESTING.md               # Documentação completa de testes
│
└── architecture/
    ├── debates/
    │   └── DEBATE-001-arquitetura-geral.md
    │
    └── adrs/
        ├── ADR-001-arquitetura-monolito-modular.md
        ├── ADR-002-stack-tecnologica.md
        ├── ADR-003-banco-de-dados.md
        ├── ADR-004-autenticacao-autorizacao.md
        ├── ADR-005-observabilidade.md
        ├── ADR-006-ci-cd.md
        ├── ADR-007-containerizacao.md
        ├── ADR-008-integracao-sicoob.md
        └── ADR-009-estrategia-testes.md
```

---

## 📋 Documentos

### Testes

| Documento                          | Descrição                       |
| ---------------------------------- | ------------------------------- |
| [README](./testing/README.md)      | Índice e status dos testes      |
| [TESTING.md](./testing/TESTING.md) | Documentação completa de testes |

### PRD (Product Requirements Document)

O [PRD](./PRD.md) é o documento principal que consolida todos os requisitos do sistema:

- Visão geral e objetivos
- Stack tecnológica
- Arquitetura
- Módulos funcionais detalhados
- Requisitos não-funcionais
- Fases de desenvolvimento

---

### Debates Arquiteturais

| Documento                                                            | Descrição                                          |
| -------------------------------------------------------------------- | -------------------------------------------------- |
| [DEBATE-001](./architecture/debates/DEBATE-001-arquitetura-geral.md) | Debate entre especialistas sobre arquitetura geral |

---

### ADRs (Architecture Decision Records)

| ADR                                                                    | Título                                   | Status    |
| ---------------------------------------------------------------------- | ---------------------------------------- | --------- |
| [ADR-001](./architecture/adrs/ADR-001-arquitetura-monolito-modular.md) | Arquitetura Monolito Modular             | ✅ Aceito |
| [ADR-002](./architecture/adrs/ADR-002-stack-tecnologica.md)            | Stack Tecnológica                        | ✅ Aceito |
| [ADR-003](./architecture/adrs/ADR-003-banco-de-dados.md)               | Banco de Dados (MySQL + Prisma)          | ✅ Aceito |
| [ADR-004](./architecture/adrs/ADR-004-autenticacao-autorizacao.md)     | Autenticação e Autorização (JWT + RBAC)  | ✅ Aceito |
| [ADR-005](./architecture/adrs/ADR-005-observabilidade.md)              | Observabilidade (Logs, Métricas, Erros)  | ✅ Aceito |
| [ADR-006](./architecture/adrs/ADR-006-ci-cd.md)                        | CI/CD (GitHub Actions)                   | ✅ Aceito |
| [ADR-007](./architecture/adrs/ADR-007-containerizacao.md)              | Containerização (Docker)                 | ✅ Aceito |
| [ADR-008](./architecture/adrs/ADR-008-integracao-sicoob.md)            | Integração Bancária (Sicoob)             | ✅ Aceito |
| [ADR-009](./architecture/adrs/ADR-009-estrategia-testes.md)            | Estratégia de Testes (TDD, 80% coverage) | ✅ Aceito |

---

## 🎯 Decisões Principais

### Arquitetura

- **Monolito Modular** com DDD (Domain-Driven Design)
- Preparado para evoluir para microserviços
- Comunicação entre módulos via eventos de domínio

### Stack

- **Backend:** NestJS + TypeScript + Prisma + MySQL
- **Frontend:** Next.js 14 (App Router) + React + TailwindCSS
- **Cache:** Redis
- **Storage:** MinIO (dev) / S3 (prod)

### Qualidade

- **TDD** (Red-Green-Refactor)
- **Cobertura mínima:** 80% (unitários)
- **Testes de integração** com containers isolados
- **E2E** com Playwright
- **Performance** com k6

### Infraestrutura

- **100% Docker** (nada instalado localmente)
- **CI/CD:** GitHub Actions
- **Hospedagem:** Hetzner/DigitalOcean (baixo custo)
- **Observabilidade:** Pino + Prometheus + Grafana + Sentry

---

## 🚀 Quick Start

```bash
# 1. Clonar repositório
git clone <repo-url>
cd pilates-system

# 2. Copiar variáveis de ambiente
cp .env.example .env

# 3. Subir ambiente de desenvolvimento
docker compose up

# 4. Acessar
# Frontend: http://localhost:3000
# API: http://localhost:3001
# API Docs: http://localhost:3001/api
```

---

## 📅 Roadmap

| Fase                     | Escopo                         | Duração      |
| ------------------------ | ------------------------------ | ------------ |
| **Fase 1 - MVP**         | Auth, Cadastros, Agenda        | 8-10 semanas |
| **Fase 2 - Financeiro**  | Planos, Sicoob, Pagamentos     | 6-8 semanas  |
| **Fase 3 - Operacional** | Reposições, Contratos, Estoque | 6-8 semanas  |
| **Fase 4 - Refinamento** | Permissões, Performance, Docs  | 4-6 semanas  |

---

## 📝 Convenções

### Commits

```
feat: adiciona cadastro de alunos
fix: corrige validação de CPF
docs: atualiza README
test: adiciona testes para StudentService
refactor: extrai validação para value object
```

### Branches

```
main        → produção
develop     → staging
feature/*   → novas features
bugfix/*    → correções
hotfix/*    → correções urgentes em prod
```

---

## 🤝 Contribuição

1. Criar branch a partir de `develop`
2. Implementar com TDD (testes primeiro!)
3. Garantir coverage ≥ 80%
4. Abrir PR para `develop`
5. Aguardar review e CI passar
