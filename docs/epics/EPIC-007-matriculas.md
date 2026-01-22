# EPIC-007: Enrollments Basic

## General Information

| Field            | Value                                   |
| ---------------- | --------------------------------------- |
| **ID**           | EPIC-007                                |
| **Title**        | Enrollments Basic                       |
| **Phase**        | 1 - MVP                                 |
| **Priority**     | High                                    |
| **Estimate**     | 1 week                                  |
| **Dependencies** | EPIC-003 (Students), EPIC-005 (Classes) |
| **Status**       | Backlog                                 |

---

## Description

Implement system basic of enrollments for o MVP:

- Vincular aluno a a plan
- Set schedules of the enrollment
- Status of enrollment
- Base for system financial (Phase 2)

**Nota:** Integration with payments beá done in the EPIC-009/010.

---

## Objectives

1. Processo of enrollment functional
2. Linking aluno + plan + schedules
3. Management of status
4. Base for financial

---

## Ube Stories

### US-007-001: Create Enrollment

**Como** recepcionista  
**I want to** matricular a aluno in a plan  
**Para** that ele withece as classs

**Acceptance Criteria:**

- [ ] Select aluno
- [ ] Select plan (1x, 2x, 3x week)
- [ ] Set schedules
- [ ] Set day of due date
- [ ] Calculate value

---

### US-007-002: Listar Enrollments

**Como** ube of the system  
**I want to** ver all as enrollments  
**Para** have view geral

**Acceptance Criteria:**

- [ ] Listagem paginada
- [ ] Filters by status
- [ ] Busca por aluno

---

### US-007-003: Gerenciar Status

**Como** gerente  
**I want to** alhavear status of enrollments  
**Para** controlar situaction of the students

**Acceptance Criteria:**

- [ ] Activer enrollment
- [ ] Suspender (delinquency)
- [ ] Cancelar
- [ ] History of changes

---

### US-007-004: Ver Enrollments of the Student

**Como** recepcionista  
**I want to** ver enrollments of a aluno  
**Para** entender sua situaction

**Acceptance Criteria:**

- [ ] Na page of the aluno
- [ ] History complete
- [ ] Enrollment current destaeach

---

## Tasks Technical

### Backend

#### TASK-007-001: Schema of Enrollments

**Estimate:** 2h

```prisma
model Enrollment {
  id            String @id
  studentId     String
  planId        String
  startDate     DateTime
  endDate       DateTime?
  dueDay        Int
  monthlyAmount Decimal
  status        EnrollmentStatus
}

enum EnrollmentStatus {
  PENDING_SIGNATURE
  ACTIVE
  SUSPENDED
  CANCELLED
  FINISHED
}
```

---

#### TASK-007-002: Schema of Plans (basic)

**Estimate:** 1h

```prisma
model Plan {
  id             String @id
  modalityId     String
  name           String
  classsPerWeek Int
  isActive       Boolean
}
```

---

#### TASK-007-003: CRUD of Plans

**Estimate:** 2h

---

#### TASK-007-004: CRUD of Enrollments

**Estimate:** 4h

- POST /enrollments
- GET /enrollments
- GET /enrollments/:id
- PUT /enrollments/:id
- PUT /enrollments/:id/status

---

#### TASK-007-005: Linking with Schedules

**Estimate:** 2h

- Set schedules of the enrollment
- Validar disponibilidade

---

### Frontend

#### TASK-007-006: Wizard of Enrollment

**Estimate:** 5h

- Step 1: Select aluno
- Step 2: Select plan
- Step 3: Choose schedules
- Step 4: Set payment
- Step 5: Confirmation

---

#### TASK-007-007: Listagem of Enrollments

**Estimate:** 3h

---

#### TASK-007-008: Detalhes of the Enrollment

**Estimate:** 2h

---

#### TASK-007-009: Integration in the Page of the Student

**Estimate:** 2h

---

## Acceptance Criteria of the Epic

- [ ] Processo of enrollment complete
- [ ] Plans configurable
- [ ] Status gerenciável
- [ ] Schedules vincusides
- [ ] History prebevado
- [ ] Tests ≥80%

---

## Timeline Sugerido

**Total estimado:** ~23 hours (~1 week)

---

## Nexts Epics Relacionados

- **EPIC-008:** System of Plans and Prices
- **EPIC-009:** Integration Sicoob
- **EPIC-010:** Payment Control
- **EPIC-014:** Contracts Digitais
