# EPIC-013: Sistema de Reposições

## 📋 Informações Gerais

| Campo            | Valor                 |
| ---------------- | --------------------- |
| **ID**           | EPIC-013              |
| **Título**       | Sistema de Reposições |
| **Fase**         | 3 - Operacional       |
| **Prioridade**   | 🟠 Alta               |
| **Estimativa**   | 1.5 semanas           |
| **Dependências** | EPIC-006 (Agenda)     |
| **Status**       | 📋 Backlog            |

---

## 📝 Descrição

Implementar sistema completo de reposições de aulas:

- Créditos gerados por faltas justificadas
- Validade de 90 dias
- Agendamento de reposição
- Controle de expiração

---

## 🎯 Objetivos

1. Gerar créditos automaticamente
2. Controlar validade
3. Facilitar agendamento de reposição
4. Histórico completo

---

## 👤 User Stories

### US-013-001: Gerar Crédito de Reposição

**Como** sistema  
**Quero** gerar crédito quando aluno falta com aviso  
**Para** permitir reposição

**Critérios de Aceite:**

- [ ] Falta com aviso ≥24h gera crédito
- [ ] Validade de 90 dias
- [ ] Vinculado à aula original
- [ ] Notifica aluno

---

### US-013-002: Ver Créditos Disponíveis

**Como** aluno ou recepcionista  
**Quero** ver créditos de reposição disponíveis  
**Para** saber o que posso usar

**Critérios de Aceite:**

- [ ] Lista de créditos
- [ ] Data de expiração
- [ ] Status (disponível, usado, expirado)

---

### US-013-003: Agendar Reposição

**Como** recepcionista  
**Quero** agendar uma aula de reposição  
**Para** usar o crédito do aluno

**Critérios de Aceite:**

- [ ] Selecionar crédito disponível
- [ ] Escolher horário com vaga
- [ ] Confirmar agendamento
- [ ] Marcar crédito como usado

---

### US-013-004: Alertar Créditos Expirando

**Como** sistema  
**Quero** alertar sobre créditos próximos do vencimento  
**Para** evitar perda

**Critérios de Aceite:**

- [ ] Email 7 dias antes
- [ ] Lista na recepção
- [ ] Destaque na ficha do aluno

---

### US-013-005: Relatório de Reposições

**Como** gerente  
**Quero** relatório de reposições  
**Para** acompanhar o volume

**Critérios de Aceite:**

- [ ] Créditos gerados
- [ ] Créditos usados
- [ ] Créditos expirados
- [ ] Por período

---

## 🔧 Tasks Técnicas

### Backend

#### TASK-013-001: Schema de Reposições

**Estimativa:** 2h

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

#### TASK-013-002: Geração Automática de Crédito

**Estimativa:** 3h

- Listener de evento de falta justificada
- Criar registro de reposição
- Calcular data de expiração

---

#### TASK-013-003: API de Créditos

**Estimativa:** 3h

- GET /students/:id/reschedulings
- GET /reschedulings (admin)

---

#### TASK-013-004: API de Agendamento de Reposição

**Estimativa:** 3h

- POST /reschedulings/:id/schedule
- Validações de vaga e validade

---

#### TASK-013-005: Job de Expiração de Créditos

**Estimativa:** 2h

- Cron diário
- Marcar como expirado
- Notificar

---

#### TASK-013-006: Job de Alerta de Expiração

**Estimativa:** 2h

- 7 dias antes
- Email ao aluno

---

### Frontend

#### TASK-013-007: Painel de Reposições do Aluno

**Estimativa:** 4h

- Na página do aluno
- Lista de créditos
- Botão de agendar

---

#### TASK-013-008: Modal de Agendamento de Reposição

**Estimativa:** 3h

- Selecionar horário
- Verificar vaga
- Confirmar

---

#### TASK-013-009: Listagem Geral de Reposições

**Estimativa:** 3h

- Para administração
- Filtros
- Exportação

---

#### TASK-013-010: Indicadores na Agenda

**Estimativa:** 2h

- Marcar aulas de reposição
- Cor diferenciada

---

## ✅ Critérios de Aceite do Épico

- [ ] Créditos gerados automaticamente
- [ ] Validade de 90 dias
- [ ] Agendamento funcional
- [ ] Expiração automática
- [ ] Alertas enviados
- [ ] Relatórios disponíveis
- [ ] Testes ≥80%

---

## 📅 Timeline Sugerido

**Total estimado:** ~27 horas (~1.5 semanas)
