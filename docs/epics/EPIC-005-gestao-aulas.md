# EPIC-005: Management of Classes and Schedules

## General Information

| Field            | Value                               |
| ---------------- | ----------------------------------- |
| **ID**           | EPIC-005                            |
| **Title**        | Management of Classes and Schedules |
| **Phase**        | 1 - MVP                             |
| **Priority**     | High                                |
| **Estimate**     | 1.5 weeks                           |
| **Dependencies** | EPIC-004 (Instructores)             |
| **Status**       | Backlog                             |

---

## Description

Implement management of modalities, types of class and grade of schedules:

- Registration of modalities (Pilates, Physiotherapy)
- Tipos of class (Individual, Duo, Group)
- Schedule grid weekl
- Linking instructor + modality + schedule

---

## Objectives

1. Configurar modalities available
2. Set types of class and capacidades
3. Create grade of schedules recorrente
4. Base for system of schedulemento

---

## Ube Stories

### US-005-001: Gerenciar Modalities

**Como** administrador  
**I want to** eachstrar modalities of class  
**Para** definir o that a academia offers

**Acceptance Criteria:**

- [ ] CRUD of modalities
- [ ] Nome and description
- [ ] Activer/desactiver

---

### US-005-002: Gerenciar Class Types

**Como** administrador  
**I want to** definir types of class por modality  
**Para** configurar capacidades and duractions

**Acceptance Criteria:**

- [ ] Tipos: Individual, Duo, Group
- [ ] Maximum capacity
- [ ] Duration in minutes
- [ ] Vincuside a modality

---

### US-005-003: Create Grade of Schedules

**Como** gerente  
**I want to** definir a grade weekl of classs  
**Para** organizar os schedules available

**Acceptance Criteria:**

- [ ] Select day of the week
- [ ] Schedule start/end
- [ ] Responsible instructor
- [ ] Modalidade and type
- [ ] Capacity

---

### US-005-004: Visualizar Grade Weekly

**Como** ube of the system  
**I want to** ver a grade of schedules of the week  
**Para** entender a disponibilidade

**Acceptance Criteria:**

- [ ] Visualization in grade (table)
- [ ] Filtro por instructor
- [ ] Filtro por modality
- [ ] Information fast

---

## Tasks Technical

### Backend

#### TASK-005-001: Schema of Modalities and Tipos

**Estimate:** 2h

```prisma
model Modality {
  id          String @id
  name        String
  description String?
  isActive    Boolean
  classTypes  ClassType[]
}

model ClassType {
  id              String @id
  modalityId      String
  name            String
  maxStudents     Int
  durationMinutes Int
}
```

---

#### TASK-005-002: CRUD Modalities

**Estimate:** 2h

---

#### TASK-005-003: CRUD Class Types

**Estimate:** 2h

---

#### TASK-005-004: Schema of Grade (Schedules)

**Estimate:** 2h

```prisma
model Schedule {
  id          String @id
  modalityId  String
  classTypeId String
  teacherId   String
  dayOfWeek   Int      // 0-6
  startTime   String   // HH:mm
  endTime     String
  maxStudents Int
  isActive    Boolean
}
```

---

#### TASK-005-005: CRUD Grade of Schedules

**Estimate:** 4h

---

#### TASK-005-006: Validations of Conflito

**Estimate:** 2h

- Instructor not can have dois schedules aboutpostos
- Sala not can have conflito (future)

---

### Frontend

#### TASK-005-007: Page of Modalities

**Estimate:** 3h

---

#### TASK-005-008: Page of Class Types

**Estimate:** 3h

---

#### TASK-005-009: Page of Grade of Schedules

**Estimate:** 5h

- Visualization in table weekl
- Modal for adicionar schedule
- Drag and drop (optional)

---

#### TASK-005-010: Filters and Visualizactions

**Estimate:** 2h

---

## Acceptance Criteria of the Epic

- [ ] Modalities configurable
- [ ] Tipos of class with capacidade
- [ ] Grade weekl functional
- [ ] Validation of conflitos
- [ ] Inhaveface visual of grade
- [ ] Tests ≥80%

---

## Timeline Sugerido

**Total estimado:** ~27 hours (~1.5 weeks)
