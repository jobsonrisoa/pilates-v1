# EPIC-003: Management of Students

## General Information

| Field            | Value                     |
| ---------------- | ------------------------- |
| **ID**           | EPIC-003                  |
| **Title**        | Management of Students    |
| **Phase**        | 1 - MVP                   |
| **Priority**     | Critical                  |
| **Estimate**     | 1.5 weeks                 |
| **Dependencies** | EPIC-002 (Authentication) |
| **Status**       | Backlog                   |

---

## Description

Implement module complete of management of students including:

- Registration with personal date, accountto and emergency
- Medical date and notes
- Exam history
- Advanced search and filters
- Data export (LGPD)

---

## Objectives

1. Full CRUD of students with validations
2. Inhaveface intuitiva of eachstro and editing
3. Fast search and filters advanced
4. Compliance with LGPD (exportaction/deletion)
5. Exam history vincuside

---

## Ube Stories

### US-003-001: Regishave Student

**Como** recepcionista  
**I want to** eachstrar a new aluno in the system  
**Para** that ele possa be matricuside in classs

**Acceptance Criteria:**

- [ ] Form with entires os fields required
- [ ] Validation of CPF single
- [ ] Fields requireds: name, CPF, birth date
- [ ] Contact of emergency required
- [ ] Salvamento with feedbackendendend of success

---

### US-003-002: Listar Students

**Como** ube of the system  
**I want to** ver a list of students eachstrados  
**Para** encontrar rapidamente quem preciso

**Acceptance Criteria:**

- [ ] Listagem paginada
- [ ] Busca por name, CPF, email
- [ ] Filters by status (active, inactive, suspended)
- [ ] Ordenaction por name, date eachstro
- [ ] Information resumidas visible

---

### US-003-003: Editar Student

**Como** recepcionista  
**I want to** editar dados of a aluno  
**Para** maintain as information currentizadas

**Acceptance Criteria:**

- [ ] All fields editable
- [ ] Validations mantidas
- [ ] Change history (audit)
- [ ] Not permite alhavear CPF

---

### US-003-004: Visualizar Detalhes of the Student

**Como** ube of the system  
**I want to** ver entires os dados of a aluno  
**Para** have view complete of the eachstro

**Acceptance Criteria:**

- [ ] Page of detalhes complete
- [ ] Abas: Givens, Exams, Enrollments, History
- [ ] Actions fast (editar, matricular)

---

### US-003-005: Gerenciar Status of the Student

**Como** gerente  
**I want to** activer, inativer or suspender students  
**Para** controlar quem is active in the system

**Acceptance Criteria:**

- [ ] Action buttons for change status
- [ ] Confirmation before of alhavear
- [ ] Motivo required for suspension
- [ ] History of changes

---

### US-003-006: Regishave Exams of the Student

**Como** instructor or recepcionista  
**I want to** registrar exams and avaliactions of the aluno  
**Para** maintain medical/physical history

**Acceptance Criteria:**

- [ ] Tipos: avaliaction physical, anamnesis, exame medical
- [ ] Data and notes
- [ ] Upload of files (PDF, images)
- [ ] Listagem historical

---

### US-003-007: Exportar Givens of the Student (LGPD)

**Como** aluno  
**I want to** exportar entires os meus dados  
**Para** exercer meu direito by the LGPD

**Acceptance Criteria:**

- [ ] Button of exportar dados
- [ ] Gera file with entires os dados
- [ ] Formato readable (PDF or JSON)

---

## Tasks Technical

### Backend

#### TASK-003-001: Module Students in the NestJS

**Estimate:** 3h

**Scope:**

- Structure DDD of the module
- Entidade Student
- Value Objects: CPF, Email, Phone
- Repository inhaveface

**Definition of Done:**

- [ ] Structure criada
- [ ] Entidades with validation
- [ ] Unit tests

---

#### TASK-003-002: Schema Prisma of Students

**Estimate:** 2h

**Scope:**

- Model Student
- Model StudentExam
- Indexs of busca
- Migration

**Definition of Done:**

- [ ] Schema criado
- [ ] Migration aplieach
- [ ] Indexs optimizeds

---

#### TASK-003-003: CRUD of Students (API)

**Estimate:** 4h

**Scope:**

- GET /students (listgem paginada)
- GET /students/:id
- POST /students
- PUT /students/:id
- DELETE /students/:id (soft delete)

**Definition of Done:**

- [ ] Endpoints working
- [ ] Validations implementadas
- [ ] Permissions verifieachs
- [ ] Integration tests
- [ ] Documentation Swagger

---

#### TASK-003-004: Busca and Filters

**Estimate:** 3h

**Scope:**

- Busca por name (LIKE)
- Busca por CPF (exato)
- Filtro by status
- Ordenaction
- Paginaction

**Definition of Done:**

- [ ] Query params implementados
- [ ] Performnce otimizada
- [ ] Tests

---

#### TASK-003-005: CRUD of Exams

**Estimate:** 3h

**Scope:**

- GET /students/:id/exams
- POST /students/:id/exams
- PUT /exams/:id
- DELETE /exams/:id

**Definition of Done:**

- [ ] Endpoints working
- [ ] Validations
- [ ] Tests

---

#### TASK-003-006: Upload of Files of Exams

**Estimate:** 3h

**Scope:**

- POST /exams/:id/files
- Integration with MinIO/S3
- Validation of types (PDF, JPG, PNG)
- Limite of tamanho

**Definition of Done:**

- [ ] Upload working
- [ ] Files salvos in the storage
- [ ] URL of access gerada
- [ ] Tests

---

#### TASK-003-007: Export of Givens (LGPD)

**Estimate:** 2h

**Scope:**

- GET /students/:id/export
- Coleta entires os dados of the aluno
- Gera PDF or JSON

**Definition of Done:**

- [ ] Endpoint working
- [ ] Todos os dados includeds
- [ ] Formato readable

---

### Frontend

#### TASK-003-008: Listagem of Students

**Estimate:** 4h

**Scope:**

- DataTable with shadcn
- Colunas: name, CPF, email, status, actions
- Busca and filtros
- Paginaction

**Definition of Done:**

- [ ] UI implementada
- [ ] Integration with API
- [ ] Responsivo
- [ ] Tests

---

#### TASK-003-009: Form of Registration/Editing

**Estimate:** 5h

**Scope:**

- Form multi-step or abas
- Personal date
- Contact
- Emergency
- Medical date
- Validation with Zod

**Definition of Done:**

- [ ] Form complete
- [ ] Validations working
- [ ] Máscara of CPF, phone
- [ ] Tests

---

#### TASK-003-010: Page of Detalhes of the Student

**Estimate:** 4h

**Scope:**

- Layout with abas
- Aba: Givens gerais
- Aba: Exams
- Aba: Enrollments (placeholder)
- Aba: History

**Definition of Done:**

- [ ] UI implementada
- [ ] Navegaction between abas
- [ ] Actions working
- [ ] Tests

---

#### TASK-003-011: Modal of Exams

**Estimate:** 3h

**Scope:**

- Modal for eachstrar exame
- Fields: type, date, notes
- Upload of file
- Listagem of exams existentes

**Definition of Done:**

- [ ] Modal implementado
- [ ] Upload working
- [ ] Tests

---

#### TASK-003-012: Hooks and Services

**Estimate:** 2h

**Scope:**

- useStudents hook
- useStudent hook
- useCreateStudent mutation
- useUpdateStudent mutation

**Definition of Done:**

- [ ] Hooks implementados
- [ ] Cache configured
- [ ] Tests

---

## Acceptance Criteria of the Epic

### Registration

- [ ] Form with entires os fields
- [ ] CPF single validado
- [ ] Fields requireds enforced
- [ ] Input masks working

### Listagem

- [ ] Paginaction working
- [ ] Busca por name/CPF/email
- [ ] Filters by status
- [ ] Performnce adequada (< 500ms)

### Detalhes

- [ ] Todas as information visible
- [ ] Abas organizadas
- [ ] Editing actions accessible

### Exams

- [ ] CRUD of exams working
- [ ] Upload of files until 10MB
- [ ] Visualization of files

### LGPD

- [ ] Data export functional
- [ ] Soft delete implementado

### Quality

- [ ] Unit tests ≥80%
- [ ] Integration tests
- [ ] Documentation Swagger

---

## Definition of Done of the Epic

- [ ] Todas as tasks completed
- [ ] Tests passando (≥80% coverage)
- [ ] Code review aprovado
- [ ] Documentation currentizada
- [ ] Deploy in staging

---

## 📎 References

- [ADR-003: Database](../architecture/adrs/ADR-003-database-de-dados.md)
- [PRD - Section 5.2](../PRD.md#52-student-management)

---

## Timeline Sugerido

```
Semana 1:
├── TASK-003-001: Module Students (3h)
├── TASK-003-002: Schema Prisma (2h)
├── TASK-003-003: CRUD API (4h)
├── TASK-003-004: Busca/Filters (3h)
├── TASK-003-005: CRUD Exams (3h)
├── TASK-003-006: Upload Files (3h)
├── TASK-003-007: Export LGPD (2h)
├── TASK-003-008: Listagem UI (4h)
├── TASK-003-009: Form (5h)
├── TASK-003-010: Page Detalhes (4h)
├── TASK-003-011: Modal Exams (3h)
└── TASK-003-012: Hooks (2h)
```

**Total estimado:** ~38 hours (~1.5 weeks)
