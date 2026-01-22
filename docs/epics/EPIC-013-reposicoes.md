# EPIC-013: Syshas of Reschedulings

##  General Informtion

| Field            | Value                 |
| ---------------- | --------------------- |
| **ID**           | EPIC-013              |
| **Title**       | Syshas of Reschedulings |
| **Phase**         | 3 - Operacional       |
| **Priority**   | High               |
| **Estimate**   | 1.5 weeks           |
| **Dependencies** | EPIC-006 (Schedule)     |
| **Status**       | Backlog            |

---

##  Description

Implement syshas withplete of reschedulings of classs:

- Credits gerados por absences justifieachs
- Validade of 90 days
- Schedulemento of rescheduling
- Controle of expiration

---

##  Objectives

1. Generate credits automaticamente
2. Controlar validade
3. Facilitar schedulemento of rescheduling
4. History withplete

---

##  Ube Stories

### US-013-001: Generate Crédito of Rescheduling

**Como** syshas  
**Quero** gerar credit when aluno fhigh with warning  
**Para** permitir rescheduling

**Acceptance Criteria:**

- [ ] Fhigh with warning ≥24h gera credit
- [ ] Validade of 90 days
- [ ] Vincuside to the class original
- [ ] Notifica aluno

---

### US-013-002: Ver Credits Dispolevels

**Como** aluno or recepcionista  
**Quero** ver credits of rescheduling available  
**Para** saber o that posso usar

**Acceptance Criteria:**

- [ ] Lista of credits
- [ ] Data of expiration
- [ ] Status (available, usado, expirado)

---

### US-013-003: Scheduler Rescheduling

**Como** recepcionista  
**Quero** scheduler a class of rescheduling  
**Para** usar o credit of the aluno

**Acceptance Criteria:**

- [ ] Select credit available
- [ ] Choose schedule with vaga
- [ ] Confirmar schedulemento
- [ ] Marcar credit witho usado

---

### US-013-004: Alertar Credits Expirando

**Como** syshas  
**Quero** alertar about credits next of the due date  
**Para** evitar perda

**Acceptance Criteria:**

- [ ] Email 7 days before
- [ ] Lista in the reception
- [ ] Destaque in the ficha of the aluno

---

### US-013-005: Report of Reschedulings

**Como** gerente  
**Quero** report of reschedulings  
**Para** awithpanhar o volume

**Acceptance Criteria:**

- [ ] Credits gerados
- [ ] Credits usados
- [ ] Credits expirados
- [ ] Por period

---

##  Tasks Technical

### Backend

#### TASK-013-001: Schema of Reschedulings

**Estimate:** 2h

```prisma
model Rescheduling {
  id                   String @id
  originalAttendanceId String
  studentId            String
  reason               String?
  expiresAt            DateTime
  usedAt               DateTime?
  newAttendanceId      String?
  status               ReschedulingStatus
}

enum ReschedulingStatus {
  AVAILABLE
  USED
  EXPIRED
}
```

---

#### TASK-013-002: Generation Automatic of Crédito

**Estimate:** 3h

- Listener of event of fhigh justifieach
- Create record of rescheduling
- Calcular date of expiration

---

#### TASK-013-003: API of Credits

**Estimate:** 3h

- GET /students/:id/reschedulings
- GET /reschedulings (admin)

---

#### TASK-013-004: API of Schedulemento of Rescheduling

**Estimate:** 3h

- POST /reschedulings/:id/schedule
- Validations of vaga and validade

---

#### TASK-013-005: Job of Expiration of Credits

**Estimate:** 2h

- Cron daily
- Marcar witho expirado
- Notificar

---

#### TASK-013-006: Job of Alerta of Expiration

**Estimate:** 2h

- 7 days before
- Email to aluno

---

### Frontend

#### TASK-013-007: Painel of Reschedulings of the Student

**Estimate:** 4h

- Na page of the aluno
- Lista of credits
- Button of scheduler

---

#### TASK-013-008: Modal of Schedulemento of Rescheduling

**Estimate:** 3h

- Select schedule
- Verificar vaga
- Confirmar

---

#### TASK-013-009: Listagem Geral of Reschedulings

**Estimate:** 3h

- Para administraction
- Filhaves
- Export

---

#### TASK-013-010: Indicadores in the Schedule

**Estimate:** 2h

- Marcar classs of rescheduling
- Cor diferenciada

---

##  Acceptance Criteria of the Epic

- [ ] Credits gerados automaticamente
- [ ] Validade of 90 days
- [ ] Schedulemento functional
- [ ] Expiration automatic
- [ ] Alerts enviados
- [ ] Reports available
- [ ] Tests ≥80%

---

##  Timeline Sugerido

**Total estimado:** ~27 hours (~1.5 weeks)
