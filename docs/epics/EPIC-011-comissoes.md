# EPIC-011: Commissions of Instructores

##  General Informtion

| Field            | Value                                         |
| ---------------- | --------------------------------------------- |
| **ID**           | EPIC-011                                      |
| **Title**       | Commissions of Instructores                      |
| **Phase**         | 2 - Financial                                |
| **Priority**   | 🟡 Medium                                      |
| **Estimate**   | 1 week                                      |
| **Dependencies** | EPIC-004 (Instructores), EPIC-010 (Payments) |
| **Status**       | Backlog                                    |

---

##  Description

Implement syshas of withmissions for instructores:

- Configuration of percentual or fixed value por class
- Diferenciaction por modality and type of class
- Calculation automatic baseado in classs ministradas
- Monthly report of withmissions a pay

---

##  Objectives

1. Configurar commission rules flexible
2. Calculate withmissions automaticamente
3. Generate reports for payment
4. History of payments of withmissions

---

##  Ube Stories

### US-011-001: Configurar Comisare of the Instructor

**Como** administrador  
**I want to** definir as commission rules of each instructor  
**Para** calculate quanto pay

**Acceptance Criteria:**

- [ ] Set por percentual or fixed value
- [ ] Diferenciar por modality
- [ ] Diferenciar por type (individual/group)
- [ ] Validity with start/end date

---

### US-011-002: Calculate Commissions of the Month

**Como** financial  
**I want to** ver quanto devo pay a each instructor  
**Para** of the os payments

**Acceptance Criteria:**

- [ ] Listar classs ministradas in the period
- [ ] Aplicar commission rules
- [ ] Totalizar por instructor
- [ ] Detalhar por class

---

### US-011-003: Generate Report of Commissions

**Como** financial  
**I want to** exportar report of withmissions  
**Para** documentar and pay

**Acceptance Criteria:**

- [ ] Filtro por period
- [ ] Filtro por instructor
- [ ] Exportar PDF/Excel
- [ ] Incluir detailing

---

### US-011-004: Registrar Payment of Comisare

**Como** financial  
**I want to** registrar that paguei a commission  
**Para** controlar o that foi pago

**Acceptance Criteria:**

- [ ] Marcar witho pago
- [ ] Data and payment method
- [ ] Generate withprovante

---

##  Tasks Technical

### Backend

#### TASK-011-001: Schema of Commissions

**Estimate:** 2h

```prisma
model TeacherCommission {
  id          String @id
  teacherId   String
  modalityId  String?
  classType   String?       // INDIVIDUAL, GROUP
  valueType   CommissionType // PERCENTAGE, FIXED
  value       Decimal
  validFrom   DateTime
  validUntil  DateTime?
}

model CommissionPayment {
  id          String @id
  teacherId   String
  periodStart DateTime
  periodEnd   DateTime
  totalAmount Decimal
  paidAt      DateTime?
  paidBy      String?
  status      PaymentStatus
}
```

---

#### TASK-011-002: CRUD of Regras of Comisare

**Estimate:** 3h

---

#### TASK-011-003: Service of Calculation of Commissions

**Estimate:** 4h

- Buscar classs of the period
- Aplicar rules por instructor
- Calculate totais

---

#### TASK-011-004: API of Report of Commissions

**Estimate:** 3h

- GET /withmissions/report
- Filhaves of period and instructor
- Retorno detalhado

---

#### TASK-011-005: Registro of Payment

**Estimate:** 2h

---

### Frontend

#### TASK-011-006: Page of Configuration of Commissions

**Estimate:** 4h

- Por instructor
- Multiple rules
- Validity

---

#### TASK-011-007: Page of Report of Commissions

**Estimate:** 4h

- Filhaves
- Tabela detalhada
- Totais
- Export

---

#### TASK-011-008: Modal of Payment

**Estimate:** 2h

---

##  Acceptance Criteria of the Epic

- [ ] Regras of commission configurable
- [ ] Calculation automatic correto
- [ ] Report detalhado
- [ ] Export working
- [ ] History of payments
- [ ] Tests ≥80%

---

##  Timeline Sugerido

**Total estimado:** ~24 hours (~1 week)
