# EPIC-011: Comissões de Professores

## 📋 Informações Gerais

| Campo | Valor |
|-------|-------|
| **ID** | EPIC-011 |
| **Título** | Comissões de Professores |
| **Fase** | 2 - Financeiro |
| **Prioridade** | 🟡 Média |
| **Estimativa** | 1 semana |
| **Dependências** | EPIC-004 (Professores), EPIC-010 (Pagamentos) |
| **Status** | 📋 Backlog |

---

## 📝 Descrição

Implementar sistema de comissões para professores:
- Configuração de percentual ou valor fixo por aula
- Diferenciação por modalidade e tipo de aula
- Cálculo automático baseado em aulas ministradas
- Relatório mensal de comissões a pagar

---

## 🎯 Objetivos

1. Configurar regras de comissão flexíveis
2. Calcular comissões automaticamente
3. Gerar relatórios para pagamento
4. Histórico de pagamentos de comissões

---

## 👤 User Stories

### US-011-001: Configurar Comissão do Professor
**Como** administrador  
**Quero** definir as regras de comissão de cada professor  
**Para** calcular quanto pagar

**Critérios de Aceite:**
- [ ] Definir por percentual ou valor fixo
- [ ] Diferenciar por modalidade
- [ ] Diferenciar por tipo (individual/grupo)
- [ ] Vigência com data início/fim

---

### US-011-002: Calcular Comissões do Mês
**Como** financeiro  
**Quero** ver quanto devo pagar a cada professor  
**Para** fazer os pagamentos

**Critérios de Aceite:**
- [ ] Listar aulas ministradas no período
- [ ] Aplicar regras de comissão
- [ ] Totalizar por professor
- [ ] Detalhar por aula

---

### US-011-003: Gerar Relatório de Comissões
**Como** financeiro  
**Quero** exportar relatório de comissões  
**Para** documentar e pagar

**Critérios de Aceite:**
- [ ] Filtro por período
- [ ] Filtro por professor
- [ ] Exportar PDF/Excel
- [ ] Incluir detalhamento

---

### US-011-004: Registrar Pagamento de Comissão
**Como** financeiro  
**Quero** registrar que paguei a comissão  
**Para** controlar o que foi pago

**Critérios de Aceite:**
- [ ] Marcar como pago
- [ ] Data e forma de pagamento
- [ ] Gerar comprovante

---

## 🔧 Tasks Técnicas

### Backend

#### TASK-011-001: Schema de Comissões
**Estimativa:** 2h

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

#### TASK-011-002: CRUD de Regras de Comissão
**Estimativa:** 3h

---

#### TASK-011-003: Serviço de Cálculo de Comissões
**Estimativa:** 4h

- Buscar aulas do período
- Aplicar regras por professor
- Calcular totais

---

#### TASK-011-004: API de Relatório de Comissões
**Estimativa:** 3h

- GET /commissions/report
- Filtros de período e professor
- Retorno detalhado

---

#### TASK-011-005: Registro de Pagamento
**Estimativa:** 2h

---

### Frontend

#### TASK-011-006: Página de Configuração de Comissões
**Estimativa:** 4h

- Por professor
- Múltiplas regras
- Vigência

---

#### TASK-011-007: Página de Relatório de Comissões
**Estimativa:** 4h

- Filtros
- Tabela detalhada
- Totais
- Exportação

---

#### TASK-011-008: Modal de Pagamento
**Estimativa:** 2h

---

## ✅ Critérios de Aceite do Épico

- [ ] Regras de comissão configuráveis
- [ ] Cálculo automático correto
- [ ] Relatório detalhado
- [ ] Exportação funcionando
- [ ] Histórico de pagamentos
- [ ] Testes ≥80%

---

## 📅 Timeline Sugerido

**Total estimado:** ~24 horas (~1 semana)

