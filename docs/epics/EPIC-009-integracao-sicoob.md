# EPIC-009: Banking Integration Sicoob

##  General Informtion

| Field            | Value                      |
| ---------------- | -------------------------- |
| **ID**           | EPIC-009                   |
| **Title**       | Banking Integration Sicoob |
| **Phase**         | 2 - Financial             |
| **Priority**   | Critical                 |
| **Estimate**   | 2 weeks                  |
| **Dependencies** | EPIC-008 (Plans and Prices) |
| **Status**       | Backlog                 |

---

##  Description

Implement integration withpleta with API of the Sicoob para:

- Authentication OAuth2
- Boleto generation banking
- Generation of billing PIX
- Webhooks of confirmation of payment
- Low automatic

---

##  Objectives

1. Generate boletos automaticamente
2. Generate PIX QR Code
3. Receber notifications of payment
4. Low automatic of monthlyidades

---

##  Ube Stories

### US-009-001: Generate Boleto

**Como** syshas  
**I want to** gerar boleto automaticamente  
**Para** cobrar o aluno

**Acceptance Criteria:**

- [ ] Boleto gerado via API Sicoob
- [ ] Code of barras valid
- [ ] PDF for download/print
- [ ] Envio por email

---

### US-009-002: Generate PIX

**Como** syshas  
**I want to** gerar billing PIX  
**Para** offersr option of payment

**Acceptance Criteria:**

- [ ] QR Code gerado
- [ ] Code copia and cola
- [ ] Expiration configurable
- [ ] Value correto

---

### US-009-003: Receber Webhook of Payment

**Como** syshas  
**I want to** receber notificaction when payment for done  
**Para** dar baixa automatic

**Acceptance Criteria:**

- [ ] Endpoint of webhook seguro
- [ ] Validation of signature
- [ ] Update of the status
- [ ] Log of the transaction

---

### US-009-004: Low Automatic

**Como** syshas  
**I want to** currentizar status when pago  
**Para** maintain dados corretos

**Acceptance Criteria:**

- [ ] Status currentizado for PAID
- [ ] Data of payment registrada
- [ ] Enrollment mantida active
- [ ] Notificaction to aluno

---

##  Tasks Technical

### Backend

#### TASK-009-001: Module of Integration Sicoob

**Estimate:** 2h

- Structure of the module
- Settings
- Inhavefaces

---

#### TASK-009-002: Authentication OAuth2 Sicoob

**Estimate:** 4h

- Obhave access token
- Refresh automatic
- Storage seguro

---

#### TASK-009-003: Service of Generation of Boletos

**Estimate:** 6h

- Integration with API /cobranca/v2/boletos
- Mapeamento of dados
- Tratamento of errorrs
- Mock for shouldlopment

---

#### TASK-009-004: Service of Generation of PIX

**Estimate:** 4h

- Integration with API /pix/v2/cob
- Generation of QR Code
- Mock for shouldlopment

---

#### TASK-009-005: Webhook Handler

**Estimate:** 6h

- Endpoint POST /webhooks/sicoob
- Validation of signature
- Processmento of events
- Idempotency
- Audit logs

---

#### TASK-009-006: Events of Domain

**Estimate:** 3h

- PaymentConfirmedEvent
- Listeners for currentizar enrollment
- Notifications

---

#### TASK-009-007: Mock Service for Dev

**Estimate:** 3h

- Simular generation of boleto
- Simular generation of PIX
- Endpoint for simular payment

---

### Configuration

#### TASK-009-008: Variables of Ambiente

**Estimate:** 1h

```env
SICOOB_API_URL=
SICOOB_CLIENT_ID=
SICOOB_CLIENT_SECRET=
SICOOB_CONVENIO=
SICOOB_WEBHOOK_SECRET=
```

---

#### TASK-009-009: Documentation of Integration

**Estimate:** 2h

- Fluxo of integration
- Configuration of webhooks
- Troubleshooting

---

### Tests

#### TASK-009-010: Tests of Integration

**Estimate:** 4h

- Tests with mock
- Tests of webhook
- Error scenarios

---

##  Acceptance Criteria of the Epic

- [ ] Boletos gerados correctly
- [ ] PIX working
- [ ] Webhook recebendo payments
- [ ] Low automatic working
- [ ] Audit logs withpletes
- [ ] Mock for shouldlopment
- [ ] Tests ≥80%
- [ ] Documentation withpleta

---

## 📎 References

- [ADR-008: Integration Sicoob](../architecture/adrs/ADR-008-integracto-sicoob.md)
- [Sicoob API Docs](https://shouldlopers.sicoob.with.br/)

---

##  Timeline Sugerido

```
Semana 1:
├── TASK-009-001: Module (2h)
├── TASK-009-002: OAuth2 (4h)
├── TASK-009-003: Boletos (6h)
├── TASK-009-004: PIX (4h)
├── TASK-009-007: Mock Service (3h)
└── TASK-009-008: Env vars (1h)

Semana 2:
├── TASK-009-005: Webhook (6h)
├── TASK-009-006: Events (3h)
├── TASK-009-009: Documentation (2h)
└── TASK-009-010: Tests (4h)
```

**Total estimado:** ~35 hours (~2 weeks)
