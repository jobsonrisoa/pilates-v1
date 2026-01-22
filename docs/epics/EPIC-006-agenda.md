# EPIC-006: Agenda e Agendamento

##  Informações Gerais

| Campo            | Valor                       |
| ---------------- | --------------------------- |
| **ID**           | EPIC-006                    |
| **Título**       | Agenda e Agendamento        |
| **Fase**         | 1 - MVP                     |
| **Prioridade**   | High                     |
| **Estimativa**   | 1.5 semanas                 |
| **Dependências** | EPIC-005 (Aulas e Horários) |
| **Status**       | Backlog                  |

---

##  Descrição

Implementar sistema de agenda visual e agendamento de aulas:

- Calendário visual (dia, semana, mês)
- Agendamento de alunos em horários
- Controle de presença/falta
- Visualização de ocupação
- Lista de espera

---

##  Objetivos

1. Agenda visual intuitiva
2. Agendamento rápido de alunos
3. Registro de presença/falta
4. Controle de capacidade e espera

---

##  User Stories

### US-006-001: Visualizar Agenda

**Como** recepcionista  
**Quero** ver a agenda de aulas  
**Para** saber o que está acontecendo

**Critérios de Aceite:**

- [ ] Visualização por dia
- [ ] Visualização por semana
- [ ] Visualização por mês
- [ ] Filtros por professor/modalidade
- [ ] Cores por status

---

### US-006-002: Agendar Aluno em Aula

**Como** recepcionista  
**Quero** agendar um aluno em uma aula  
**Para** reservar sua vaga

**Critérios de Aceite:**

- [ ] Selecionar aula na agenda
- [ ] Buscar e selecionar aluno
- [ ] Verificar disponibilidade
- [ ] Confirmar agendamento

---

### US-006-003: Marcar Presença/Falta

**Como** professor ou recepcionista  
**Quero** registrar presença ou falta  
**Para** controlar a frequência

**Critérios de Aceite:**

- [ ] Marcar presente
- [ ] Marcar falta (com/sem aviso)
- [ ] Observações opcionais
- [ ] Atualização em tempo real

---

### US-006-004: Lista de Espera

**Como** recepcionista  
**Quero** adicionar aluno na lista de espera  
**Para** caso surja vaga

**Critérios de Aceite:**

- [ ] Adicionar à espera quando lotado
- [ ] Notificação quando vaga abrir
- [ ] Ordem por chegada

---

### US-006-005: Cancelar Agendamento

**Como** recepcionista  
**Quero** cancelar um agendamento  
**Para** liberar a vaga

**Critérios de Aceite:**

- [ ] Cancelar com motivo
- [ ] Regra de aviso prévio (24h)
- [ ] Gerar crédito se aplicável

---

##  Tasks Técnicas

### Backend

#### TASK-006-001: Schema de Aulas (Classes)

**Estimativa:** 2h

```prisma
model Class {
  id         String      @id
  scheduleId String
  classDate  DateTime
  status     ClassStatus
  attendances Attendance[]
}

model Attendance {
  id           String @id
  classId      String
  studentId    String
  enrollmentId String
  status       AttendanceStatus
}
```

---

#### TASK-006-002: Geração de Aulas a partir da Grade

**Estimativa:** 3h

- Job para gerar aulas futuras
- Baseado nos Schedules ativos
- Gerar X semanas à frente

---

#### TASK-006-003: API de Agenda

**Estimativa:** 4h

- GET /classes?date=&view=day|week|month
- GET /classes/:id
- GET /classes/:id/attendances

---

#### TASK-006-004: API de Agendamento

**Estimativa:** 4h

- POST /classes/:id/attendances
- PUT /attendances/:id
- DELETE /attendances/:id

---

#### TASK-006-005: Controle de Presença

**Estimativa:** 3h

- PUT /attendances/:id/check-in
- Marcar presente/falta
- Regras de aviso prévio

---

#### TASK-006-006: Lista de Espera

**Estimativa:** 2h

- POST /classes/:id/waitlist
- Promoção automática

---

### Frontend

#### TASK-006-007: Componente de Calendário

**Estimativa:** 6h

- Visualização dia/semana/mês
- Integração com react-big-calendar ou similar
- Customização visual

---

#### TASK-006-008: Modal de Detalhes da Aula

**Estimativa:** 3h

- Lista de alunos agendados
- Botões de presença
- Adicionar aluno

---

#### TASK-006-009: Agendamento Rápido

**Estimativa:** 3h

- Busca de aluno
- Seleção de horário
- Confirmação

---

#### TASK-006-010: Painel de Presença

**Estimativa:** 3h

- Lista da aula atual
- Check-in rápido
- Status visual

---

##  Critérios de Aceite do Épico

- [ ] Calendário visual funcionando
- [ ] Três visualizações (dia, semana, mês)
- [ ] Agendamento de alunos
- [ ] Registro de presença/falta
- [ ] Lista de espera
- [ ] Performance adequada
- [ ] Testes ≥80%

---

##  Timeline Sugerido

**Total estimado:** ~33 horas (~1.5 semanas)
