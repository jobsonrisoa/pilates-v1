# EPIC-006: Schedule and Schedulemento

##  General Informtion

| Field            | Value                       |
| ---------------- | --------------------------- |
| **ID**           | EPIC-006                    |
| **Title**       | Schedule and Schedulemento        |
| **Phase**         | 1 - MVP                     |
| **Priority**   | High                     |
| **Estimate**   | 1.5 weeks                 |
| **Dependencies** | EPIC-005 (Classes and Schedules) |
| **Status**       | Backlog                  |

---

##  Description

Implement syshas of schedule visual and schedulemento of classs:

- Calendário visual (day, week, month)
- Schedulemento of students in schedules
- Controle of attendance/fhigh
- Visualization of occupancy
- Waiting list

---

##  Objectives

1. Schedule visual intuitiva
2. Schedulemento fast of students
3. Registro of attendance/fhigh
4. Controle of capacidade and espera

---

##  Ube Stories

### US-006-001: Visualizar Schedule

**Como** recepcionista  
**Quero** ver a schedule of classs  
**Para** saber o that is acontecendo

**Acceptance Criteria:**

- [ ] Visualization per day
- [ ] Visualization por week
- [ ] Visualization por month
- [ ] Filhaves por instructor/modality
- [ ] Cores by status

---

### US-006-002: Scheduler Student in Class

**Como** recepcionista  
**Quero** scheduler a aluno in a class  
**Para** rebevar sua vaga

**Acceptance Criteria:**

- [ ] Select class in the schedule
- [ ] Buscar and selecionar aluno
- [ ] Verificar disponibilidade
- [ ] Confirmar schedulemento

---

### US-006-003: Marcar Attendance/Fhigh

**Como** instructor or recepcionista  
**Quero** registrar attendance or fhigh  
**Para** controlar a frequency

**Acceptance Criteria:**

- [ ] Marcar present
- [ ] Marcar fhigh (with/sem warning)
- [ ] Obbevactions opcionais
- [ ] Update in haspo real

---

### US-006-004: Lista of Espera

**Como** recepcionista  
**Quero** adicionar aluno in the list of espera  
**Para** case surja vaga

**Acceptance Criteria:**

- [ ] Adicionar to the espera when lotado
- [ ] Notificaction when vaga abrir
- [ ] Ordem por chegada

---

### US-006-005: Cancelar Schedulemento

**Como** recepcionista  
**Quero** cancelar a schedulemento  
**Para** liberar a vaga

**Acceptance Criteria:**

- [ ] Cancelar with motivo
- [ ] Regra of warning previo (24h)
- [ ] Generate credit if aplicável

---

##  Tasks Technical

### Backend

#### TASK-006-001: Schema of Classes (Classes)

**Estimate:** 2h

```prisma
model Class {
  id         String      @id
  scheduleId String
  classDate  DateTime
  status     ClassStatus
  attendances Attendance[]
}

model Attendance {
  id           String @id
  classId      String
  studentId    String
  enrollmentId String
  status       AttendanceStatus
}
```

---

#### TASK-006-002: Generation of Classes a partir of the Grade

**Estimate:** 3h

- Job for gerar classs futures
- Baseado in the Schedules actives
- Generate X weeks to the frente

---

#### TASK-006-003: API of Schedule

**Estimate:** 4h

- GET /classs?date=&view=day|week|month
- GET /classs/:id
- GET /classs/:id/attendances

---

#### TASK-006-004: API of Schedulemento

**Estimate:** 4h

- POST /classs/:id/attendances
- PUT /attendances/:id
- DELETE /attendances/:id

---

#### TASK-006-005: Controle of Attendance

**Estimate:** 3h

- PUT /attendances/:id/check-in
- Marcar present/fhigh
- Regras of warning previo

---

#### TASK-006-006: Lista of Espera

**Estimate:** 2h

- POST /classs/:id/waitlist
- Promoção automatic

---

### Frontend

#### TASK-006-007: Componente of Calendário

**Estimate:** 6h

- Visualization day/week/month
- Integration with react-big-calendar or similar
- Customization visual

---

#### TASK-006-008: Modal of Detalhes of the Class

**Estimate:** 3h

- Lista of students scheduledos
- Buttons of attendance
- Adicionar aluno

---

#### TASK-006-009: Schedulemento Rápido

**Estimate:** 3h

- Busca of aluno
- Selection of schedule
- Confirmation

---

#### TASK-006-010: Painel of Attendance

**Estimate:** 3h

- Lista of the class current
- Check-in fast
- Status visual

---

##  Acceptance Criteria of the Epic

- [ ] Calendário visual funcionando
- [ ] Três visualizactions (day, week, month)
- [ ] Schedulemento of students
- [ ] Registro of attendance/fhigh
- [ ] Waiting list
- [ ] Performnce adequada
- [ ] Tests ≥80%

---

##  Timeline Sugerido

**Total estimado:** ~33 hours (~1.5 weeks)
