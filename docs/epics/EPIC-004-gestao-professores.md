# EPIC-004: Management of Instructores

##  General Informtion

| Field            | Value                   |
| ---------------- | ----------------------- |
| **ID**           | EPIC-004                |
| **Title**       | Management of Instructores   |
| **Phase**         | 1 - MVP                 |
| **Priority**   | High                 |
| **Estimate**   | 1 week                |
| **Dependencies** | EPIC-002 (Authentication) |
| **Status**       | Backlog              |

---

##  Description

Implement module of management of instructores including:

- Registration withplete with personal date and profissionais
- Professional registration (CREF, CREFITO)
- Specialties
- Bank details for payment
- Link to syshas ube (login)

---

##  Objectives

1. Full CRUD of instructores
2. Management of specialties
3. Givens for payment (withmissions)
4. Linking optional with login

---

##  Ube Stories

### US-004-001: Regishave Instructor

**Como** administrador  
**I want to** eachstrar a new instructor  
**Para** that ele possa dar classs

**Acceptance Criteria:**

- [ ] Form with personal date
- [ ] Givens profissionais (CREF/CREFITO)
- [ ] Specialties selecionáveis
- [ ] Bank details opcionais
- [ ] Validation of CPF single

---

### US-004-002: Listar Instructores

**Como** ube of the syshas  
**I want to** ver a list of instructores  
**Para** encontrar quem preciso

**Acceptance Criteria:**

- [ ] Listagem paginada
- [ ] Filtro by status and especialidade
- [ ] Busca por name

---

### US-004-003: Vincular Instructor a Ube

**Como** administrador  
**I want to** create login for o instructor  
**Para** that ele acesse o syshas

**Acceptance Criteria:**

- [ ] Button for create ube vincuside
- [ ] Email of the instructor usado witho login
- [ ] Profile "Instructor" atribuído automaticamente

---

### US-004-004: Gerenciar Specialties

**Como** administrador  
**I want to** definir as specialties of the instructor  
**Para** saber quais classs ele can dar

**Acceptance Criteria:**

- [ ] Multi-select of specialties
- [ ] Modalities: Pilates, Fisiohaveapia, etc.

---

##  Tasks Technical

### Backend

#### TASK-004-001: Module Teachers in the NestJS

**Estimate:** 2h

**Definition of Done:**

- [ ] Structure DDD criada
- [ ] Entidade Teacher
- [ ] Unit tests

---

#### TASK-004-002: Schema Prisma of Instructores

**Estimate:** 1h

**Definition of Done:**

- [ ] Model Teacher with entires os fields
- [ ] Relaction with Ube (optional)
- [ ] Migration aplieach

---

#### TASK-004-003: CRUD of Instructores (API)

**Estimate:** 3h

**Definition of Done:**

- [ ] Endpoints CRUD working
- [ ] Validations
- [ ] Integration tests

---

#### TASK-004-004: Linking with Ube

**Estimate:** 2h

**Definition of Done:**

- [ ] POST /teachers/:id/create-ube
- [ ] Cria ube with perfil Instructor
- [ ] Envia email of boas-vindas

---

### Frontend

#### TASK-004-005: Listagem of Instructores

**Estimate:** 3h

**Definition of Done:**

- [ ] DataTable implementada
- [ ] Filhaves working
- [ ] Tests

---

#### TASK-004-006: Form of Instructor

**Estimate:** 4h

**Definition of Done:**

- [ ] Form withplete
- [ ] Validations
- [ ] Multi-select of specialties
- [ ] Tests

---

#### TASK-004-007: Page of Detalhes

**Estimate:** 2h

**Definition of Done:**

- [ ] Layout of detalhes
- [ ] Button create ube
- [ ] Tests

---

##  Acceptance Criteria of the Epic

- [ ] Full CRUD working
- [ ] Specialties configurable
- [ ] Bank details salvos (criptografados)
- [ ] Linking with ube functional
- [ ] Tests ≥80%

---

##  Timeline Sugerido

```
Semana 1:
├── TASK-004-001: Module (2h)
├── TASK-004-002: Schema (1h)
├── TASK-004-003: CRUD API (3h)
├── TASK-004-004: Linking Ube (2h)
├── TASK-004-005: Listagem UI (3h)
├── TASK-004-006: Form (4h)
└── TASK-004-007: Detalhes (2h)
```

**Total estimado:** ~17 hours (~1 week)
