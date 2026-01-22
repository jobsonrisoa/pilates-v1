# EPIC-010: Controle de Pagamentos

##  Informações Gerais

| Campo            | Valor                        |
| ---------------- | ---------------------------- |
| **ID**           | EPIC-010                     |
| **Título**       | Controle de Pagamentos       |
| **Fase**         | 2 - Financeiro               |
| **Prioridade**   | Critical                   |
| **Estimativa**   | 1.5 semanas                  |
| **Dependências** | EPIC-009 (Integração Sicoob) |
| **Status**       | Backlog                   |

---

##  Descrição

Implementar controle completo de pagamentos:

- Geração automática de cobranças
- Gestão de inadimplência
- Alertas de vencimento
- Suspensão automática
- Dashboard financeiro

---

##  Objetivos

1. Gerar cobranças automaticamente
2. Controlar inadimplência
3. Alertas proativos
4. Visão financeira clara

---

##  User Stories

### US-010-001: Gerar Cobrança Mensal

**Como** sistema  
**Quero** gerar cobranças automaticamente  
**Para** não depender de ação manual

**Critérios de Aceite:**

- [ ] Job diário verifica vencimentos
- [ ] Gera boleto/PIX 5 dias antes
- [ ] Envia email ao aluno
- [ ] Registra no sistema

---

### US-010-002: Visualizar Pagamentos

**Como** financeiro  
**Quero** ver todos os pagamentos  
**Para** controlar o fluxo

**Critérios de Aceite:**

- [ ] Listagem paginada
- [ ] Filtros por status, data, aluno
- [ ] Totais e resumos
- [ ] Exportação

---

### US-010-003: Registrar Pagamento Manual

**Como** financeiro  
**Quero** registrar pagamento recebido manualmente  
**Para** casos fora do sistema

**Critérios de Aceite:**

- [ ] Selecionar pagamento pendente
- [ ] Informar valor, data, forma
- [ ] Gerar recibo

---

### US-010-004: Controle de Inadimplência

**Como** gerente  
**Quero** ver alunos inadimplentes  
**Para** tomar ações

**Critérios de Aceite:**

- [ ] Lista de inadimplentes
- [ ] Dias de atraso
- [ ] Valor devido
- [ ] Ações (contato, suspensão)

---

### US-010-005: Suspensão Automática

**Como** sistema  
**Quero** suspender matrículas em atraso  
**Para** forçar regularização

**Critérios de Aceite:**

- [ ] Configurar dias de tolerância
- [ ] Suspender após X dias
- [ ] Notificar aluno
- [ ] Bloquear agendamentos

---

### US-010-006: Alertas de Vencimento

**Como** aluno  
**Quero** receber aviso antes do vencimento  
**Para** não atrasar

**Critérios de Aceite:**

- [ ] Email 3 dias antes
- [ ] Link para pagamento
- [ ] Dados do boleto/PIX

---

##  Tasks Técnicas

### Backend

#### TASK-010-001: Schema de Pagamentos

**Estimativa:** 2h

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

#### TASK-010-002: Job de Geração de Cobranças

**Estimativa:** 4h

- Cron diário
- Verifica matrículas ativas
- Gera pagamento se não existe
- Integra com Sicoob

---

#### TASK-010-003: Job de Verificação de Inadimplência

**Estimativa:** 3h

- Cron diário
- Marca como OVERDUE
- Suspende após X dias
- Notifica

---

#### TASK-010-004: CRUD de Pagamentos

**Estimativa:** 4h

- Endpoints CRUD
- Baixa manual
- Segunda via

---

#### TASK-010-005: Serviço de Notificações

**Estimativa:** 3h

- Email de cobrança
- Email de confirmação
- Email de alerta

---

### Frontend

#### TASK-010-006: Dashboard Financeiro

**Estimativa:** 5h

- Cards de resumo
- Gráfico de receitas
- Lista de pendentes

---

#### TASK-010-007: Listagem de Pagamentos

**Estimativa:** 4h

- DataTable completa
- Filtros avançados
- Ações em lote

---

#### TASK-010-008: Tela de Inadimplentes

**Estimativa:** 3h

- Lista destacada
- Ações rápidas
- Histórico de contatos

---

#### TASK-010-009: Modal de Baixa Manual

**Estimativa:** 2h

---

##  Critérios de Aceite do Épico

- [ ] Cobranças geradas automaticamente
- [ ] Status atualizados corretamente
- [ ] Inadimplência controlada
- [ ] Suspensão automática funcionando
- [ ] Alertas enviados
- [ ] Dashboard informativo
- [ ] Testes ≥80%

---

##  Timeline Sugerido

**Total estimado:** ~30 horas (~1.5 semanas)
