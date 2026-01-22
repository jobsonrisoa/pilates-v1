# EPIC-014: Contratos Digitais

## 📋 Informações Gerais

| Campo            | Valor                 |
| ---------------- | --------------------- |
| **ID**           | EPIC-014              |
| **Título**       | Contratos Digitais    |
| **Fase**         | 3 - Operacional       |
| **Prioridade**   | 🟠 Alta               |
| **Estimativa**   | 1.5 semanas           |
| **Dependências** | EPIC-007 (Matrículas) |
| **Status**       | 📋 Backlog            |

---

## 📝 Descrição

Implementar sistema de contratos digitais:

- Geração automática de PDF
- Envio para assinatura digital
- Integração com D4Sign/Clicksign
- Armazenamento do contrato assinado
- Atualização automática de status

---

## 🎯 Objetivos

1. Gerar contratos automaticamente
2. Assinatura digital segura
3. Armazenamento organizado
4. Fluxo automatizado

---

## 👤 User Stories

### US-014-001: Gerar Contrato da Matrícula

**Como** sistema  
**Quero** gerar contrato PDF automaticamente  
**Para** formalizar a matrícula

**Critérios de Aceite:**

- [ ] PDF gerado com dados da matrícula
- [ ] Template configurável
- [ ] Dados do aluno, plano, valores
- [ ] Preview antes de enviar

---

### US-014-002: Enviar para Assinatura

**Como** recepcionista  
**Quero** enviar contrato para assinatura digital  
**Para** que o aluno assine remotamente

**Critérios de Aceite:**

- [ ] Integração com provider (D4Sign)
- [ ] Email enviado ao aluno
- [ ] Link único de assinatura
- [ ] Status atualizado

---

### US-014-003: Receber Confirmação de Assinatura

**Como** sistema  
**Quero** receber webhook quando assinado  
**Para** atualizar status automaticamente

**Critérios de Aceite:**

- [ ] Webhook configurado
- [ ] Status do contrato atualizado
- [ ] Status da matrícula atualizado
- [ ] Documento assinado baixado

---

### US-014-004: Visualizar Contratos

**Como** usuário  
**Quero** ver contratos de uma matrícula  
**Para** acompanhar status

**Critérios de Aceite:**

- [ ] Lista de contratos
- [ ] Status visual
- [ ] Download do PDF
- [ ] Reenviar se necessário

---

### US-014-005: Configurar Template de Contrato

**Como** administrador  
**Quero** configurar o template do contrato  
**Para** personalizar o documento

**Critérios de Aceite:**

- [ ] Editor de template
- [ ] Variáveis dinâmicas
- [ ] Preview

---

## 🔧 Tasks Técnicas

### Backend

#### TASK-014-001: Schema de Contratos

**Estimativa:** 2h

```prisma
model Contract {
  id            String @id
  enrollmentId  String @unique
  templateId    String?
  documentPath  String?
  signatureUrl  String?
  signedAt      DateTime?
  signerIp      String?
  externalId    String?      // ID no provider
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

#### TASK-014-002: Serviço de Geração de PDF

**Estimativa:** 4h

- Template engine (Handlebars)
- Puppeteer para PDF
- Dados dinâmicos

---

#### TASK-014-003: Integração D4Sign/Clicksign

**Estimativa:** 6h

- Autenticação OAuth
- Envio de documento
- Webhook de assinatura
- Download de assinado

---

#### TASK-014-004: API de Contratos

**Estimativa:** 3h

- POST /enrollments/:id/contract
- POST /contracts/:id/send
- POST /contracts/:id/resend
- GET /contracts/:id/download

---

#### TASK-014-005: Webhook Handler

**Estimativa:** 3h

- Endpoint de webhook
- Validação de assinatura
- Atualização de status
- Download automático

---

#### TASK-014-006: Storage de Contratos

**Estimativa:** 2h

- Upload para S3/MinIO
- Organização por aluno/ano
- URLs assinadas

---

### Frontend

#### TASK-014-007: Componente de Contrato na Matrícula

**Estimativa:** 3h

- Status do contrato
- Ações disponíveis
- Download

---

#### TASK-014-008: Modal de Preview do Contrato

**Estimativa:** 2h

- Visualização do PDF
- Confirmar envio

---

#### TASK-014-009: Página de Templates

**Estimativa:** 4h

- Listagem de templates
- Editor básico
- Variáveis disponíveis

---

## ✅ Critérios de Aceite do Épico

- [ ] PDF gerado corretamente
- [ ] Integração com provider funcionando
- [ ] Webhook processando assinaturas
- [ ] Documentos armazenados
- [ ] Status atualizados automaticamente
- [ ] Templates configuráveis
- [ ] Testes ≥80%

---

## 📅 Timeline Sugerido

**Total estimado:** ~29 horas (~1.5 semanas)
