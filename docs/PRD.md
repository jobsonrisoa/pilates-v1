# PRD - Product Requirements Document

## Sistema de Gestão para Academia de Pilates e Fisioterapia

**Versão:** 1.0  
**Data:** 21/01/2026  
**Status:** Em Desenvolvimento

---

##  Índice

1. [Visão Geral](#1-visão-geral)
2. [Objetivos](#2-objetivos)
3. [Stack Tecnológica](#3-stack-tecnológica)
4. [Arquitetura](#4-arquitetura)
5. [Módulos Funcionais](#5-módulos-funcionais)
6. [Requisitos Não-Funcionais](#6-requisitos-não-funcionais)
7. [Integrações](#7-integrações)
8. [Infraestrutura](#8-infraestrutura)
9. [Qualidade e Testes](#9-qualidade-e-testes)
10. [Fases de Desenvolvimento](#10-fases-de-desenvolvimento)
11. [Decisões Arquiteturais](#11-decisões-arquiteturais)

---

## 1. Visão Geral

### 1.1 Descrição

Sistema completo de gestão para centro de atividades físicas, abrangendo Pilates, Fisioterapia e outras modalidades. O sistema oferece controle administrativo, operacional e financeiro, permitindo gestão completa do negócio.

### 1.2 Público-Alvo

| Perfil            | Descrição                     | Funcionalidades Principais        |
| ----------------- | ----------------------------- | --------------------------------- |
| **Super Admin**   | Proprietário/Gestor principal | Acesso total ao sistema           |
| **Admin**         | Administrador                 | Gestão de usuários, configurações |
| **Gerente**       | Coordenador operacional       | Relatórios, gestão de aulas       |
| **Recepcionista** | Atendimento                   | Cadastros, agendamentos           |
| **Professor**     | Instrutor                     | Agenda, presença, alunos          |
| **Financeiro**    | Controle financeiro           | Pagamentos, relatórios            |

### 1.3 Escopo

**Incluso:**

- Gestão de alunos e professores
- Agendamento de aulas
- Controle de matrículas e planos
- Sistema financeiro com integração bancária
- Geração de contratos digitais
- Relatórios gerenciais
- Controle de estoque

**Não incluso (v1.0):**

- Aplicativo mobile nativo
- Portal do aluno
- Integração com redes sociais
- Sistema de marketing automatizado

---

## 2. Objetivos

### 2.1 Objetivos de Negócio

| Objetivo              | Métrica                      | Meta     |
| --------------------- | ---------------------------- | -------- |
| Reduzir inadimplência | Taxa de inadimplência        | < 5%     |
| Otimizar ocupação     | Taxa de ocupação de horários | > 85%    |
| Agilizar cadastros    | Tempo médio de matrícula     | < 10 min |
| Automatizar cobranças | % de cobranças automáticas   | 100%     |
| Reduzir faltas        | Taxa de no-show              | < 10%    |

### 2.2 Objetivos Técnicos

| Objetivo         | Métrica                   | Meta    |
| ---------------- | ------------------------- | ------- |
| Disponibilidade  | Uptime                    | ≥ 99.5% |
| Performance      | Tempo de resposta P95     | < 500ms |
| Qualidade        | Cobertura de testes       | ≥ 80%   |
| Segurança        | Vulnerabilidades críticas | 0       |
| Manutenibilidade | Débito técnico            | Baixo   |

---

## 3. Stack Tecnológica

### 3.1 Backend

| Tecnologia     | Versão | Propósito         |
| -------------- | ------ | ----------------- |
| **Node.js**    | 20 LTS | Runtime           |
| **NestJS**     | 10.x   | Framework backend |
| **TypeScript** | 5.x    | Linguagem         |
| **Prisma**     | 5.x    | ORM               |
| **MySQL**      | 8.0    | Banco de dados    |
| **Redis**      | 7.x    | Cache e sessions  |
| **Jest**       | 29.x   | Testes            |

### 3.2 Frontend

| Tecnologia          | Versão | Propósito          |
| ------------------- | ------ | ------------------ |
| **Next.js**         | 14.x   | Framework frontend |
| **React**           | 18.x   | UI Library         |
| **TypeScript**      | 5.x    | Linguagem          |
| **TailwindCSS**     | 3.x    | Estilização        |
| **shadcn/ui**       | Latest | Componentes        |
| **React Query**     | 5.x    | Data fetching      |
| **Zustand**         | 4.x    | Estado global      |
| **React Hook Form** | 7.x    | Formulários        |
| **Zod**             | 3.x    | Validação          |

### 3.3 Infraestrutura

| Tecnologia               | Propósito           |
| ------------------------ | ------------------- |
| **Docker**               | Containerização     |
| **Docker Compose**       | Orquestração local  |
| **Traefik**              | Reverse proxy       |
| **GitHub Actions**       | CI/CD               |
| **Hetzner/DigitalOcean** | Hospedagem produção |
| **Railway**              | Hospedagem staging  |

### 3.4 Observabilidade

| Tecnologia     | Propósito           |
| -------------- | ------------------- |
| **Pino**       | Logging estruturado |
| **Prometheus** | Métricas            |
| **Grafana**    | Dashboards          |
| **Sentry**     | Error tracking      |

> **📖 Referência:** [ADR-002: Stack Tecnológica](./architecture/adrs/ADR-002-stack-tecnologica.md)

---

## 4. Arquitetura

### 4.1 Visão Geral

```
┌─────────────────────────────────────────────────────────────────────┐
│                           ARQUITETURA                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│    ┌──────────────────────────────────────────────────────────┐     │
│    │                      FRONTEND                             │     │
│    │                    Next.js 14                             │     │
│    │                   (App Router)                            │     │
│    └──────────────────────────┬───────────────────────────────┘     │
│                               │                                     │
│                               │ REST API                            │
│                               ▼                                     │
│    ┌──────────────────────────────────────────────────────────┐     │
│    │                      BACKEND                              │     │
│    │               NestJS (Monolito Modular)                   │     │
│    │  ┌─────────┬─────────┬─────────┬─────────┬─────────┐    │     │
│    │  │  Auth   │Students │Teachers │ Classes │Financial│    │     │
│    │  ├─────────┼─────────┼─────────┼─────────┼─────────┤    │     │
│    │  │Enrollmt │Contracts│Inventory│ Reports │  Audit  │    │     │
│    │  └─────────┴─────────┴─────────┴─────────┴─────────┘    │     │
│    │                                                          │     │
│    │                    Shared Kernel                         │     │
│    └──────────────────────────┬───────────────────────────────┘     │
│                               │                                     │
│              ┌────────────────┼────────────────┐                    │
│              ▼                ▼                ▼                    │
│    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│    │    MySQL     │  │    Redis     │  │    MinIO     │            │
│    │   (Dados)    │  │   (Cache)    │  │  (Arquivos)  │            │
│    └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Padrões Arquiteturais

| Padrão           | Aplicação                             |
| ---------------- | ------------------------------------- |
| **DDD**          | Domain-Driven Design para modelagem   |
| **CQRS Light**   | Separação de comandos e queries       |
| **Event-Driven** | Comunicação entre módulos via eventos |
| **Repository**   | Abstração de persistência             |
| **Use Cases**    | Lógica de aplicação isolada           |

### 4.3 Estrutura de Módulos

```
src/
├── modules/
│   ├── auth/                    # Autenticação e autorização
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   ├── value-objects/
│   │   │   └── events/
│   │   ├── application/
│   │   │   ├── commands/
│   │   │   ├── queries/
│   │   │   └── use-cases/
│   │   ├── infrastructure/
│   │   │   ├── persistence/
│   │   │   └── http/
│   │   └── auth.module.ts
│   │
│   ├── students/                # Gestão de alunos
│   ├── teachers/                # Gestão de professores
│   ├── classes/                 # Aulas e agendamento
│   ├── enrollments/             # Matrículas
│   ├── contracts/               # Contratos digitais
│   ├── financial/               # Financeiro
│   ├── inventory/               # Estoque
│   └── reports/                 # Relatórios
│
└── shared/
    ├── domain/                  # Base entities, value objects
    ├── infrastructure/          # Database, events, http
    └── application/             # CQRS base classes
```

> **📖 Referência:** [ADR-001: Arquitetura Monolito Modular](./architecture/adrs/ADR-001-arquitetura-monolito-modular.md)

---

## 5. Módulos Funcionais

### 5.1 Autenticação e Autorização

#### Funcionalidades

- [x] Login com email/senha
- [x] JWT com refresh tokens
- [x] Sistema RBAC (Role-Based Access Control)
- [x] Recuperação de senha
- [x] Logs de acesso

#### Perfis e Permissões

| Recurso     | Super Admin | Admin | Gerente | Recepção | Professor | Financeiro |
| ----------- | :---------: | :---: | :-----: | :------: | :-------: | :--------: |
| Usuários    |    CRUD     |  CRU  |    R    |    -     |     -     |     -      |
| Alunos      |    CRUD     | CRUD  |  CRUD   |   CRU    |     R     |     R      |
| Professores |    CRUD     | CRUD  |   CRU   |    R     |     R     |     R      |
| Aulas       |    CRUD     | CRUD  |  CRUD   |    RU    |    RU     |     R      |
| Financeiro  |    CRUD     | CRUD  |    R    |    -     |     -     |    CRUD    |
| Relatórios  |      ✓      |   ✓   |    ✓    |    -     |     -     |     ✓      |
| Config      |      ✓      |   ✓   |    -    |    -     |     -     |     -      |

> **📖 Referência:** [ADR-004: Autenticação e Autorização](./architecture/adrs/ADR-004-autenticacao-autorizacao.md)

---

### 5.2 Gestão de Alunos

#### Dados Cadastrais

- Dados pessoais (nome, CPF, RG, data nascimento)
- Contato (telefone, email)
- Endereço completo
- Contato de emergência
- Dados médicos (convênio, observações)
- Status (ativo, inativo, suspenso)

#### Funcionalidades

- [x] CRUD completo de alunos
- [x] Upload de documentos
- [x] Histórico de exames
- [x] Busca e filtros avançados
- [x] Exportação de dados (LGPD)

#### Exames

- Tipos: Avaliação física, anamnese, exames médicos
- Upload de arquivos (PDF, imagens)
- Histórico completo

---

### 5.3 Gestão de Professores

#### Dados Cadastrais

- Dados pessoais
- Registro profissional (CREF, CREFITO)
- Especialidades
- Horários de disponibilidade
- Dados bancários

#### Funcionalidades

- [x] CRUD completo
- [x] Gestão de especialidades
- [x] Grade de horários
- [x] Upload de documentos
- [x] Vinculação com usuário do sistema

---

### 5.4 Gestão de Aulas e Agendamento

#### Modalidades

- Pilates
- Fisioterapia
- Outras (configuráveis)

#### Tipos de Aula

| Tipo       | Capacidade   | Duração |
| ---------- | ------------ | ------- |
| Individual | 1 aluno      | 50 min  |
| Dupla      | 2 alunos     | 50 min  |
| Grupo      | até 6 alunos | 50 min  |

#### Funcionalidades

- [x] Grade de horários por dia/semana
- [x] Agenda visual (dia, semana, mês)
- [x] Controle de presença/falta
- [x] Sistema de reposição (créditos 90 dias)
- [x] Lista de espera
- [x] Cancelamento com regras

#### Regras de Negócio

```
Cancelamento:
├── Com aviso (≥24h antes)
│   └── Gera crédito de reposição (válido 90 dias)
│
└── Sem aviso (<24h ou no-show)
    └── Registra falta (sem direito a reposição)
```

---

### 5.5 Matrículas e Planos

#### Planos Disponíveis

| Plano     | Frequência | Descrição    |
| --------- | ---------- | ------------ |
| Avulso    | -          | Aula única   |
| 1x/semana | Semanal    | 4 aulas/mês  |
| 2x/semana | Semanal    | 8 aulas/mês  |
| 3x/semana | Semanal    | 12 aulas/mês |
| 4x/semana | Semanal    | 16 aulas/mês |

#### Processo de Matrícula

```
┌─────────────────────────────────────────────────────────────┐
│                   FLUXO DE MATRÍCULA                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [1. Cadastrar/    [2. Selecionar   [3. Escolher          │
│     Selecionar  →     Plano]      →    Horários]          │
│     Aluno]                                                 │
│         │                                                   │
│         ▼                                                   │
│  [4. Definir      [5. Gerar        [6. Enviar p/          │
│     Vencimento  →    Contrato]   →    Assinatura]         │
│         │                                                   │
│         ▼                                                   │
│  [7. Aguardar     [8. Gerar        [9. Matrícula          │
│     Assinatura  →    Cobrança]   →    Ativa]              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Status de Matrícula

- `PENDING_SIGNATURE` - Aguardando assinatura do contrato
- `ACTIVE` - Matrícula ativa
- `SUSPENDED` - Suspensa (inadimplência)
- `CANCELLED` - Cancelada
- `FINISHED` - Encerrada

---

### 5.6 Contratos Digitais

#### Funcionalidades

- [x] Geração automática de PDF
- [x] Envio para assinatura digital
- [x] Validação com IP e timestamp
- [x] Armazenamento do contrato assinado
- [x] Atualização automática de status

#### Integrações Sugeridas

- D4Sign
- Clicksign
- DocuSign

---

### 5.7 Módulo Financeiro

#### Tabela de Preços

- Preço por modalidade
- Preço por tipo de plano
- Descontos especiais
- Histórico de alterações

#### Comissões de Professores

- Percentual ou valor fixo
- Por modalidade/tipo de aula
- Relatório mensal

#### Controle de Pagamentos

- Geração de boletos (Sicoob)
- QR Code PIX (Sicoob)
- Baixa automática via webhook
- Controle de inadimplência
- Alertas de vencimento

#### Fluxo de Pagamento

```
┌─────────────────────────────────────────────────────────────┐
│                   FLUXO DE PAGAMENTO                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Vencimento  →  [Gerar Boleto/PIX]  →  [Enviar ao        │
│   Próximo]          (Sicoob API)         Aluno]            │
│                                                             │
│         │                    │                              │
│         ▼                    ▼                              │
│  [Webhook        [Atualizar     [Ativar/Manter             │
│   Sicoob]    →   Pagamento]  →  Matrícula]                 │
│                                                             │
│         │                                                   │
│         ▼                                                   │
│  [Vencido?]  →  [Alertas]  →  [Suspensão                   │
│                                Automática]                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

> **📖 Referência:** [ADR-008: Integração Sicoob](./architecture/adrs/ADR-008-integracao-sicoob.md)

---

### 5.8 Relatórios

#### Relatórios Financeiros

- Receitas por período
- Receitas por modalidade
- Receitas por forma de pagamento
- Inadimplência
- Comissões a pagar
- Fluxo de caixa

#### Relatórios Operacionais

- Alunos por status
- Taxa de ocupação
- Faltas e presenças
- Reposições pendentes
- Aulas por professor

#### Relatórios de Marketing

- Novos alunos por período
- Taxa de cancelamento (churn)
- Origem dos alunos

#### Funcionalidades

- Filtros (data, professor, modalidade, status)
- Exportação PDF e Excel
- Gráficos interativos

---

### 5.9 Estoque

#### Funcionalidades

- [x] Cadastro de produtos
- [x] Controle de quantidade
- [x] Alertas de estoque mínimo
- [x] Movimentações (entrada/saída)
- [x] Vendas avulsas
- [x] Relatório de vendas

---

## 6. Requisitos Não-Funcionais

### 6.1 Performance

| Métrica               | Requisito   |
| --------------------- | ----------- |
| Tempo de resposta P95 | < 500ms     |
| Tempo de resposta P99 | < 1000ms    |
| Throughput            | > 100 req/s |
| Tempo de startup      | < 30s       |

### 6.2 Disponibilidade

| Métrica                        | Requisito  |
| ------------------------------ | ---------- |
| Uptime                         | ≥ 99.5%    |
| RTO (Recovery Time Objective)  | < 1 hora   |
| RPO (Recovery Point Objective) | < 24 horas |

### 6.3 Segurança

- [x] HTTPS obrigatório
- [x] Senhas com bcrypt (12 rounds)
- [x] JWT com refresh tokens
- [x] Rate limiting
- [x] Headers de segurança (Helmet)
- [x] CORS configurado
- [x] Proteção CSRF
- [x] Validação de input
- [x] Logs de auditoria

### 6.4 Conformidade LGPD

- [x] Termo de consentimento
- [x] Política de privacidade
- [x] Exportação de dados pessoais
- [x] Direito ao esquecimento
- [x] Logs de acesso a dados sensíveis

### 6.5 Escalabilidade

- Arquitetura stateless
- Sessions em Redis
- Arquivos em S3/MinIO
- Preparado para load balancer
- Módulos extraíveis para microserviços

---

## 7. Integrações

### 7.1 Sicoob (Bancária)

| Funcionalidade       | Endpoint                      |
| -------------------- | ----------------------------- |
| Geração de boletos   | POST /cobranca/v2/boletos     |
| Geração de PIX       | PUT /pix/v2/cob/{txid}        |
| Consulta de status   | GET /cobranca/v2/boletos/{id} |
| Webhook de pagamento | POST /webhooks/sicoob         |

### 7.2 Assinatura Digital

| Provider           | Funcionalidade                 |
| ------------------ | ------------------------------ |
| D4Sign / Clicksign | Envio de documento             |
|                    | Webhook de assinatura          |
|                    | Download de documento assinado |

### 7.3 Email (Opcional)

| Provider | Uso              |
| -------- | ---------------- |
| SendGrid | Envio de boletos |
| AWS SES  | Contratos        |
| Mailgun  | Notificações     |

---

## 8. Infraestrutura

### 8.1 Ambiente de Desenvolvimento

```yaml
# docker-compose.yml
services:
  api: # NestJS API
  web: # Next.js Frontend
  mysql: # Banco de dados
  redis: # Cache/Sessions
  mailhog: # Email testing
  minio: # Storage local
```

**Requisitos:**

- Docker 24+
- Docker Compose 2+
- 8GB RAM mínimo

### 8.2 Ambiente de Produção

```
┌─────────────────────────────────────────────────────────────┐
│                      PRODUÇÃO                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    Internet                                                 │
│        │                                                    │
│        ▼                                                    │
│  ┌──────────┐                                               │
│  │ Traefik  │  (SSL, Load Balancing)                        │
│  └────┬─────┘                                               │
│       │                                                     │
│       ├────────────────────────────┐                        │
│       ▼                            ▼                        │
│  ┌──────────┐                ┌──────────┐                   │
│  │   API    │                │   Web    │                   │
│  │ (NestJS) │                │(Next.js) │                   │
│  └────┬─────┘                └──────────┘                   │
│       │                                                     │
│       ├──────────────┬──────────────┐                       │
│       ▼              ▼              ▼                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │  MySQL   │  │  Redis   │  │   S3     │                   │
│  │(Managed) │  │          │  │ (Files)  │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 8.3 Custos Estimados

| Item               | Dev/Staging | Produção |
| ------------------ | ----------- | -------- |
| VPS (Hetzner CX21) | €5/mês      | €10/mês  |
| MySQL (Managed)    | -           | €15/mês  |
| Backup Storage     | -           | €5/mês   |
| Domain + SSL       | -           | €10/ano  |
| **Total**          | ~€5/mês     | ~€30/mês |

> **📖 Referência:** [ADR-007: Containerização](./architecture/adrs/ADR-007-containerizacao.md)

---

## 9. Qualidade e Testes

### 9.1 Metodologia

**TDD - Test-Driven Development**

```
RED → GREEN → REFACTOR
 │       │         │
 │       │         └── Melhorar código mantendo testes verdes
 │       └── Implementar código mínimo para passar
 └── Escrever teste que falha
```

### 9.2 Pirâmide de Testes

```
                    ┌───────────┐
                    │    E2E    │  ~5%
                    │ Playwright│
                    ├───────────┤
                    │   Perf    │  ~5%
                    │    k6     │
                ┌───┴───────────┴───┐
                │    Integração     │  ~15%
                │  Supertest + DB   │
            ┌───┴───────────────────┴───┐
            │        Unitários          │  ~75%
            │   Jest + Testing Library  │
            └───────────────────────────┘
```

### 9.3 Métricas de Qualidade

| Métrica                | Backend   | Frontend  | Bloqueante |
| ---------------------- | --------- | --------- | ---------- |
| **Coverage Linhas**    | ≥ 80%     | ≥ 80%     |  Sim     |
| **Coverage Branches**  | ≥ 75%     | ≥ 75%     |  Sim     |
| **Coverage Functions** | ≥ 80%     | ≥ 80%     |  Sim     |
| **Testes E2E**         | 100% pass | 100% pass |  Sim     |
| **Performance P95**    | < 500ms   | -         |  Warning |

### 9.4 Ferramentas

| Tipo            | Backend                     | Frontend               |
| --------------- | --------------------------- | ---------------------- |
| **Unit**        | Jest                        | Jest + Testing Library |
| **Integração**  | Supertest + MySQL container | MSW                    |
| **E2E**         | -                           | Playwright             |
| **Performance** | k6                          | k6                     |
| **Coverage**    | Istanbul/c8                 | Istanbul/c8            |

### 9.5 CI Pipeline

```yaml
PR: ├── Lint + Type Check
  ├── Unit Tests (paralelo)
  │   ├── Backend (coverage ≥ 80%)
  │   └── Frontend (coverage ≥ 80%)
  └── Integration Tests

develop: ├── ... (todos acima)
  ├── E2E Tests
  └── Deploy Staging

main: ├── ... (todos acima)
  ├── Performance Tests
  └── Deploy Production
```

> **📖 Referência:** [ADR-009: Estratégia de Testes](./architecture/adrs/ADR-009-estrategia-testes.md)

---

## 10. Fases de Desenvolvimento

### Fase 1 - MVP (8-10 semanas)

**Escopo:**

- [ ] Setup do projeto (Docker, CI/CD)
- [ ] Autenticação e RBAC básico
- [ ] CRUD de alunos
- [ ] CRUD de professores
- [ ] Cadastro de aulas/horários
- [ ] Agenda básica
- [ ] Matrícula simples

**Entregáveis:**

- Sistema funcional para cadastros básicos
- Agenda de aulas operacional
- Testes unitários ≥ 80%

---

### Fase 2 - Financeiro (6-8 semanas)

**Escopo:**

- [ ] Sistema de planos completo
- [ ] Tabela de preços
- [ ] Integração Sicoob (boletos e PIX)
- [ ] Webhooks de pagamento
- [ ] Controle de inadimplência
- [ ] Relatórios financeiros básicos

**Entregáveis:**

- Geração automática de cobranças
- Baixa automática de pagamentos
- Dashboard financeiro

---

### Fase 3 - Operacional (6-8 semanas)

**Escopo:**

- [ ] Sistema de reposições
- [ ] Contratos digitais (integração D4Sign)
- [ ] Controle de estoque
- [ ] Relatórios completos
- [ ] Gestão de exames
- [ ] Upload de documentos (S3)

**Entregáveis:**

- Fluxo completo de matrícula com contrato
- Gestão de estoque operacional
- Todos os relatórios

---

### Fase 4 - Refinamento (4-6 semanas)

**Escopo:**

- [ ] Sistema de permissões granular
- [ ] Dashboard analítico
- [ ] Otimizações de performance
- [ ] Testes E2E completos
- [ ] Testes de performance
- [ ] Documentação final

**Entregáveis:**

- Sistema completo e otimizado
- Documentação técnica
- Manual do usuário

---

## 11. Decisões Arquiteturais

### Índice de ADRs

| ADR                                                                    | Título                       | Status    |
| ---------------------------------------------------------------------- | ---------------------------- | --------- |
| [ADR-001](./architecture/adrs/ADR-001-arquitetura-monolito-modular.md) | Arquitetura Monolito Modular | Accepted |
| [ADR-002](./architecture/adrs/ADR-002-stack-tecnologica.md)            | Stack Tecnológica            | Accepted |
| [ADR-003](./architecture/adrs/ADR-003-banco-de-dados.md)               | Banco de Dados               | Accepted |
| [ADR-004](./architecture/adrs/ADR-004-autenticacao-autorizacao.md)     | Autenticação e Autorização   | Accepted |
| [ADR-005](./architecture/adrs/ADR-005-observabilidade.md)              | Observabilidade              | Accepted |
| [ADR-006](./architecture/adrs/ADR-006-ci-cd.md)                        | CI/CD                        | Accepted |
| [ADR-007](./architecture/adrs/ADR-007-containerizacao.md)              | Containerização              | Accepted |
| [ADR-008](./architecture/adrs/ADR-008-integracao-sicoob.md)            | Integração Sicoob            | Accepted |
| [ADR-009](./architecture/adrs/ADR-009-estrategia-testes.md)            | Estratégia de Testes         | Accepted |

### Debate Arquitetural

- [DEBATE-001: Arquitetura Geral](./architecture/debates/DEBATE-001-arquitetura-geral.md)

---

## Apêndices

### A. Glossário

| Termo    | Definição                                                        |
| -------- | ---------------------------------------------------------------- |
| **ADR**  | Architecture Decision Record - registro de decisão arquitetural  |
| **DDD**  | Domain-Driven Design - design orientado ao domínio               |
| **TDD**  | Test-Driven Development - desenvolvimento guiado por testes      |
| **RBAC** | Role-Based Access Control - controle de acesso baseado em papéis |
| **CQRS** | Command Query Responsibility Segregation                         |
| **JWT**  | JSON Web Token                                                   |
| **PIX**  | Sistema de pagamento instantâneo brasileiro                      |

### B. Referências

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Sicoob API](https://developers.sicoob.com.br/)
- [LGPD](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)

---

**Documento gerado em:** 21/01/2026  
**Última atualização:** 21/01/2026  
**Versão:** 1.0
