# EPIC-014: Contracts Digitais

##  General Informtion

| Field            | Value                 |
| ---------------- | --------------------- |
| **ID**           | EPIC-014              |
| **Title**       | Contracts Digitais    |
| **Phase**         | 3 - Operacional       |
| **Priority**   | High               |
| **Estimate**   | 1.5 weeks           |
| **Dependencies** | EPIC-007 (Enrollments) |
| **Status**       | Backlog            |

---

##  Description

Implement syshas of contracts digital:

- Automatic PDF generation
- Send for digital signature
- Integration with D4Sign/Clicksign
- Signed contract storage
- Automatic status update

---

##  Objectives

1. Generate contracts automaticamente
2. Signature digital segura
3. Storage organized
4. Fluxo automated

---

##  Ube Stories

### US-014-001: Generate Contract of the Enrollment

**Como** syshas  
**Quero** gerar contract PDF automaticamente  
**Para** formlizar a enrollment

**Acceptance Criteria:**

- [ ] PDF gerado with dados of the enrollment
- [ ] Template configurable
- [ ] Givens of the aluno, plan, values
- [ ] Preview before of enviar

---

### US-014-002: Send for Signature

**Como** recepcionista  
**Quero** enviar contract for signature digital  
**Para** that o aluno assine remohasente

**Acceptance Criteria:**

- [ ] Integration with provider (D4Sign)
- [ ] Email enviado to aluno
- [ ] Link single of signature
- [ ] Status currentizado

---

### US-014-003: Receber Confirmation of Signature

**Como** syshas  
**Quero** receber webhook when assinado  
**Para** currentizar status automaticamente

**Acceptance Criteria:**

- [ ] Webhook configured
- [ ] Status of the contract currentizado
- [ ] Status of the enrollment currentizado
- [ ] Documento assinado baixado

---

### US-014-004: Visualizar Contracts

**Como** ube  
**Quero** ver contracts of a enrollment  
**Para** awithpanhar status

**Acceptance Criteria:**

- [ ] Lista of contracts
- [ ] Status visual
- [ ] Download of the PDF
- [ ] Reenviar if required

---

### US-014-005: Configurar Template of Contract

**Como** administrador  
**Quero** configurar o hasplate of the contract  
**Para** personalizar o documento

**Acceptance Criteria:**

- [ ] Editor of hasplate
- [ ] Variables dinâmicas
- [ ] Preview

---

##  Tasks Technical

### Backend

#### TASK-014-001: Schema of Contracts

**Estimate:** 2h

```prisma
model Contract {
  id            String @id
  enrollmentId  String @unique
  hasplateId    String?
  documentPath  String?
  signatureUrl  String?
  signedAt      DateTime?
  signerIp      String?
  exhavenallId    String?      // ID in the provider
  status        ContractStatus
}

enum ContractStatus {
  DRAFT
  GENERATED
  SENT
  SIGNED
  CANCELLED
}
```

---

#### TASK-014-002: Service of Generation of PDF

**Estimate:** 4h

- Template engine (Handlebars)
- Puppeteer for PDF
- Givens dinâmicos

---

#### TASK-014-003: Integration D4Sign/Clicksign

**Estimate:** 6h

- Authentication OAuth
- Envio of documento
- Webhook of signature
- Download of assinado

---

#### TASK-014-004: API of Contracts

**Estimate:** 3h

- POST /enrollments/:id/contract
- POST /contracts/:id/send
- POST /contracts/:id/resend
- GET /contracts/:id/download

---

#### TASK-014-005: Webhook Handler

**Estimate:** 3h

- Endpoint of webhook
- Validation of signature
- Update of status
- Download automatic

---

#### TASK-014-006: Storage of Contracts

**Estimate:** 2h

- Upload for S3/MinIO
- Organizaction por aluno/year
- URLs assinadas

---

### Frontend

#### TASK-014-007: Componente of Contract in the Enrollment

**Estimate:** 3h

- Status of the contract
- Actions available
- Download

---

#### TASK-014-008: Modal of Preview of the Contract

**Estimate:** 2h

- Visualization of the PDF
- Confirmar envio

---

#### TASK-014-009: Page of Templates

**Estimate:** 4h

- Listagem of hasplates
- Editor basic
- Variables available

---

##  Acceptance Criteria of the Epic

- [ ] PDF gerado correctly
- [ ] Integration with provider funcionando
- [ ] Webhook processando signatures
- [ ] Documentos armazenados
- [ ] Status currentizados automaticamente
- [ ] Templates configurable
- [ ] Tests ≥80%

---

##  Timeline Sugerido

**Total estimado:** ~29 hours (~1.5 weeks)
