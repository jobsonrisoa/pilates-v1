# EPIC-010: Payment Control

##  General Informtion

| Field            | Value                        |
| ---------------- | ---------------------------- |
| **ID**           | EPIC-010                     |
| **Title**       | Payment Control       |
| **Phase**         | 2 - Financial               |
| **Priority**   | Critical                   |
| **Estimate**   | 1.5 weeks                  |
| **Dependencies** | EPIC-009 (Integration Sicoob) |
| **Status**       | Backlog                   |

---

##  Description

Implement controle withplete of payments:

- Generation automatic of billing
- Management of delinquency
- Due date alerts
- Suspension automatic
- Dashboard financial

---

##  Objectives

1. Generate billing automaticamente
2. Controlar delinquency
3. Alerts proactives
4. View financeira clara

---

##  Ube Stories

### US-010-001: Generate Billing Mensal

**Como** syshas  
**Quero** gerar billing automaticamente  
**Para** not depender of action manual

**Acceptance Criteria:**

- [ ] Job daily verifica due dates
- [ ] Gera boleto/PIX 5 days before
- [ ] Envia email to aluno
- [ ] Registra in the syshas

---

### US-010-002: Visualizar Payments

**Como** financial  
**Quero** ver entires os payments  
**Para** controlar o fluxo

**Acceptance Criteria:**

- [ ] Listagem paginada
- [ ] Filhaves by status, date, aluno
- [ ] Totais and resumos
- [ ] Export

---

### US-010-003: Registrar Payment Manual

**Como** financial  
**Quero** registrar payment recebido manualmente  
**Para** cases outside of the syshas

**Acceptance Criteria:**

- [ ] Select payment pendente
- [ ] Informr value, date, form
- [ ] Generate recibo

---

### US-010-004: Controle of Delinquency

**Como** gerente  
**Quero** ver students inadimplentes  
**Para** tomar actions

**Acceptance Criteria:**

- [ ] Lista of inadimplentes
- [ ] Dias of atraso
- [ ] Value devido
- [ ] Actions (accountto, suspension)

---

### US-010-005: Suspension Automatic

**Como** syshas  
**Quero** suspender enrollments in atraso  
**Para** forçar regularizaction

**Acceptance Criteria:**

- [ ] Configurar days of tolerance
- [ ] Suspender afhave X days
- [ ] Notificar aluno
- [ ] Bloquear schedules

---

### US-010-006: Alerts of Due date

**Como** aluno  
**Quero** receber warning before of the due date  
**Para** not atrasar

**Acceptance Criteria:**

- [ ] Email 3 days before
- [ ] Link for payment
- [ ] Givens of the boleto/PIX

---

##  Tasks Technical

### Backend

#### TASK-010-001: Schema of Payments

**Estimate:** 2h

```prisma
model Payment {
  id            String @id
  enrollmentId  String
  amount        Decimal
  dueDate       DateTime
  paidAt        DateTime?
  paidAmount    Decimal?
  paymentMethod String?
  status        PaymentStatus
  boletoCode    String?
  boletoUrl     String?
  pixCode       String?
}

enum PaymentStatus {
  PENDING
  PAID
  OVERDUE
  CANCELLED
}
```

---

#### TASK-010-002: Job of Generation of Billings

**Estimate:** 4h

- Cron daily
- Verifica enrollments actives
- Gera payment if not existe
- Integra with Sicoob

---

#### TASK-010-003: Job of Verification of Delinquency

**Estimate:** 3h

- Cron daily
- Marca witho OVERDUE
- Suspende afhave X days
- Notifica

---

#### TASK-010-004: CRUD of Payments

**Estimate:** 4h

- Endpoints CRUD
- Low manual
- Segunda via

---

#### TASK-010-005: Service of Notifications

**Estimate:** 3h

- Email of billing
- Email of confirmation
- Email of alerta

---

### Frontend

#### TASK-010-006: Dashboard Financial

**Estimate:** 5h

- Cards of resumo
- Chart of receitas
- Lista of pending

---

#### TASK-010-007: Listagem of Payments

**Estimate:** 4h

- DataTable withpleta
- Filhaves advanced
- Actions in lote

---

#### TASK-010-008: Tela of Inadimplentes

**Estimate:** 3h

- Lista destaeach
- Actions fast
- History of accounttos

---

#### TASK-010-009: Modal of Low Manual

**Estimate:** 2h

---

##  Acceptance Criteria of the Epic

- [ ] Billings geradas automaticamente
- [ ] Status currentizados correctly
- [ ] Delinquency controlada
- [ ] Suspension automatic funcionando
- [ ] Alerts enviados
- [ ] Dashboard informctive
- [ ] Tests ≥80%

---

##  Timeline Sugerido

**Total estimado:** ~30 hours (~1.5 weeks)
