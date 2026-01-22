# EPIC-009: Integração Bancária Sicoob

## 📋 Informações Gerais

| Campo            | Valor                      |
| ---------------- | -------------------------- |
| **ID**           | EPIC-009                   |
| **Título**       | Integração Bancária Sicoob |
| **Fase**         | 2 - Financeiro             |
| **Prioridade**   | 🔴 Crítica                 |
| **Estimativa**   | 2 semanas                  |
| **Dependências** | EPIC-008 (Planos e Preços) |
| **Status**       | 📋 Backlog                 |

---

## 📝 Descrição

Implementar integração completa com API do Sicoob para:

- Autenticação OAuth2
- Geração de boletos bancários
- Geração de cobranças PIX
- Webhooks de confirmação de pagamento
- Baixa automática

---

## 🎯 Objetivos

1. Gerar boletos automaticamente
2. Gerar QR Code PIX
3. Receber notificações de pagamento
4. Baixa automática de mensalidades

---

## 👤 User Stories

### US-009-001: Gerar Boleto

**Como** sistema  
**Quero** gerar boleto automaticamente  
**Para** cobrar o aluno

**Critérios de Aceite:**

- [ ] Boleto gerado via API Sicoob
- [ ] Código de barras válido
- [ ] PDF para download/impressão
- [ ] Envio por email

---

### US-009-002: Gerar PIX

**Como** sistema  
**Quero** gerar cobrança PIX  
**Para** oferecer opção de pagamento

**Critérios de Aceite:**

- [ ] QR Code gerado
- [ ] Código copia e cola
- [ ] Expiração configurável
- [ ] Valor correto

---

### US-009-003: Receber Webhook de Pagamento

**Como** sistema  
**Quero** receber notificação quando pagamento for feito  
**Para** dar baixa automática

**Critérios de Aceite:**

- [ ] Endpoint de webhook seguro
- [ ] Validação de assinatura
- [ ] Atualização do status
- [ ] Log da transação

---

### US-009-004: Baixa Automática

**Como** sistema  
**Quero** atualizar status quando pago  
**Para** manter dados corretos

**Critérios de Aceite:**

- [ ] Status atualizado para PAID
- [ ] Data de pagamento registrada
- [ ] Matrícula mantida ativa
- [ ] Notificação ao aluno

---

## 🔧 Tasks Técnicas

### Backend

#### TASK-009-001: Módulo de Integração Sicoob

**Estimativa:** 2h

- Estrutura do módulo
- Configurações
- Interfaces

---

#### TASK-009-002: Autenticação OAuth2 Sicoob

**Estimativa:** 4h

- Obter access token
- Refresh automático
- Armazenamento seguro

---

#### TASK-009-003: Serviço de Geração de Boletos

**Estimativa:** 6h

- Integração com API /cobranca/v2/boletos
- Mapeamento de dados
- Tratamento de erros
- Mock para desenvolvimento

---

#### TASK-009-004: Serviço de Geração de PIX

**Estimativa:** 4h

- Integração com API /pix/v2/cob
- Geração de QR Code
- Mock para desenvolvimento

---

#### TASK-009-005: Webhook Handler

**Estimativa:** 6h

- Endpoint POST /webhooks/sicoob
- Validação de assinatura
- Processamento de eventos
- Idempotência
- Logs de auditoria

---

#### TASK-009-006: Eventos de Domínio

**Estimativa:** 3h

- PaymentConfirmedEvent
- Listeners para atualizar matrícula
- Notificações

---

#### TASK-009-007: Mock Service para Dev

**Estimativa:** 3h

- Simular geração de boleto
- Simular geração de PIX
- Endpoint para simular pagamento

---

### Configuração

#### TASK-009-008: Variáveis de Ambiente

**Estimativa:** 1h

```env
SICOOB_API_URL=
SICOOB_CLIENT_ID=
SICOOB_CLIENT_SECRET=
SICOOB_CONVENIO=
SICOOB_WEBHOOK_SECRET=
```

---

#### TASK-009-009: Documentação de Integração

**Estimativa:** 2h

- Fluxo de integração
- Configuração de webhooks
- Troubleshooting

---

### Testes

#### TASK-009-010: Testes de Integração

**Estimativa:** 4h

- Testes com mock
- Testes de webhook
- Cenários de erro

---

## ✅ Critérios de Aceite do Épico

- [ ] Boletos gerados corretamente
- [ ] PIX funcionando
- [ ] Webhook recebendo pagamentos
- [ ] Baixa automática funcionando
- [ ] Logs de auditoria completos
- [ ] Mock para desenvolvimento
- [ ] Testes ≥80%
- [ ] Documentação completa

---

## 📎 Referências

- [ADR-008: Integração Sicoob](../architecture/adrs/ADR-008-integracao-sicoob.md)
- [Sicoob API Docs](https://developers.sicoob.com.br/)

---

## 📅 Timeline Sugerido

```
Semana 1:
├── TASK-009-001: Módulo (2h)
├── TASK-009-002: OAuth2 (4h)
├── TASK-009-003: Boletos (6h)
├── TASK-009-004: PIX (4h)
├── TASK-009-007: Mock Service (3h)
└── TASK-009-008: Env vars (1h)

Semana 2:
├── TASK-009-005: Webhook (6h)
├── TASK-009-006: Eventos (3h)
├── TASK-009-009: Documentação (2h)
└── TASK-009-010: Testes (4h)
```

**Total estimado:** ~35 horas (~2 semanas)
