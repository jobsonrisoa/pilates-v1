# EPIC-016: Reports Operacionais

##  General Informtion

| Field            | Value                                    |
| ---------------- | ---------------------------------------- |
| **ID**           | EPIC-016                                 |
| **Title**       | Reports Operacionais                  |
| **Phase**         | 3 - Operacional                          |
| **Priority**   | 🟡 Medium                                 |
| **Estimate**   | 1 week                                 |
| **Dependencies** | EPIC-006 (Schedule), EPIC-013 (Reschedulings) |
| **Status**       | Backlog                               |

---

##  Description

Implement reports operacionais:

- Students by status
- Occupancy rate por schedule
- Absences and attendances
- Pending reschedulings
- Classes per instructor
- Reports of marketing (new students, churn)

---

##  Objectives

1. View operational clara
2. Metrics of occupancy
3. Awithpanhamento of frequency
4. Indicadores of marketing

---

##  Ube Stories

### US-016-001: Report of Students por Status

**Como** gerente  
**Quero** ver distribuição of students by status  
**Para** entender a base

**Acceptance Criteria:**

- [ ] Ativos, inactives, suspendeds
- [ ] Chart and table
- [ ] Evolução in the haspo

---

### US-016-002: Report of Ocupaction

**Como** gerente  
**Quero** ver taxa of occupancy of the schedules  
**Para** otimizar a grade

**Acceptance Criteria:**

- [ ] Por schedule
- [ ] Por instructor
- [ ] Por modality
- [ ] Heat map weekl

---

### US-016-003: Report of Frequency

**Como** gerente  
**Quero** ver estatísticas of attendance/fhigh  
**Para** identificar problemas

**Acceptance Criteria:**

- [ ] Rate geral of attendance
- [ ] Por aluno
- [ ] Por instructor
- [ ] Tendências

---

### US-016-004: Report of Reschedulings

**Como** gerente  
**Quero** ver status of the reschedulings  
**Para** awithpanhar o acumuside

**Acceptance Criteria:**

- [ ] Credits pending
- [ ] Rate of utilizaction
- [ ] Expirados

---

### US-016-005: Report of Classes por Instructor

**Como** gerente  
**Quero** ver produtividade of the instructores  
**Para** avaliar desempenho

**Acceptance Criteria:**

- [ ] Classes ministradas
- [ ] Por period
- [ ] Rate of attendance of the students

---

### US-016-006: Report of Marketing

**Como** gerente  
**Quero** ver metrics of heresição and retenção  
**Para** avaliar o business

**Acceptance Criteria:**

- [ ] New students por period
- [ ] Cancellation rate (churn)
- [ ] Source of the students (future)

---

##  Tasks Technical

### Backend

#### TASK-016-001: API of Report of Students

**Estimate:** 2h

---

#### TASK-016-002: API of Ocupaction

**Estimate:** 3h

---

#### TASK-016-003: API of Frequency

**Estimate:** 3h

---

#### TASK-016-004: API of Reschedulings

**Estimate:** 2h

---

#### TASK-016-005: API of Classes por Instructor

**Estimate:** 2h

---

#### TASK-016-006: API of Marketing

**Estimate:** 3h

---

### Frontend

#### TASK-016-007: Dashboard Operacional

**Estimate:** 5h

- KPIs principais
- Charts resumidos
- Links for detalhes

---

#### TASK-016-008: Pages of Reports

**Estimate:** 6h

- Uma page por report
- Filhaves
- Charts
- Export

---

##  Acceptance Criteria of the Epic

- [ ] Todos os reports funcionando
- [ ] Charts informctives
- [ ] Filhaves aplicáveis
- [ ] Export PDF/Excel
- [ ] Performnce adequada
- [ ] Tests ≥80%

---

##  Timeline Sugerido

**Total estimado:** ~26 hours (~1 week)
