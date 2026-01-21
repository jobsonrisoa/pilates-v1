# EPIC-007: Matrículas Básicas

## 📋 Informações Gerais

| Campo | Valor |
|-------|-------|
| **ID** | EPIC-007 |
| **Título** | Matrículas Básicas |
| **Fase** | 1 - MVP |
| **Prioridade** | 🟠 Alta |
| **Estimativa** | 1 semana |
| **Dependências** | EPIC-003 (Alunos), EPIC-005 (Aulas) |
| **Status** | 📋 Backlog |

---

## 📝 Descrição

Implementar sistema básico de matrículas para o MVP:
- Vincular aluno a um plano
- Definir horários da matrícula
- Status de matrícula
- Base para sistema financeiro (Fase 2)

**Nota:** Integração com pagamentos será feita no EPIC-009/010.

---

## 🎯 Objetivos

1. Processo de matrícula funcional
2. Vinculação aluno + plano + horários
3. Gestão de status
4. Base para financeiro

---

## 👤 User Stories

### US-007-001: Criar Matrícula
**Como** recepcionista  
**Quero** matricular um aluno em um plano  
**Para** que ele comece as aulas

**Critérios de Aceite:**
- [ ] Selecionar aluno
- [ ] Selecionar plano (1x, 2x, 3x semana)
- [ ] Definir horários
- [ ] Definir dia de vencimento
- [ ] Calcular valor

---

### US-007-002: Listar Matrículas
**Como** usuário do sistema  
**Quero** ver todas as matrículas  
**Para** ter visão geral

**Critérios de Aceite:**
- [ ] Listagem paginada
- [ ] Filtros por status
- [ ] Busca por aluno

---

### US-007-003: Gerenciar Status
**Como** gerente  
**Quero** alterar status de matrículas  
**Para** controlar situação dos alunos

**Critérios de Aceite:**
- [ ] Ativar matrícula
- [ ] Suspender (inadimplência)
- [ ] Cancelar
- [ ] Histórico de mudanças

---

### US-007-004: Ver Matrículas do Aluno
**Como** recepcionista  
**Quero** ver matrículas de um aluno  
**Para** entender sua situação

**Critérios de Aceite:**
- [ ] Na página do aluno
- [ ] Histórico completo
- [ ] Matrícula atual destacada

---

## 🔧 Tasks Técnicas

### Backend

#### TASK-007-001: Schema de Matrículas
**Estimativa:** 2h

```prisma
model Enrollment {
  id            String @id
  studentId     String
  planId        String
  startDate     DateTime
  endDate       DateTime?
  dueDay        Int
  monthlyAmount Decimal
  status        EnrollmentStatus
}

enum EnrollmentStatus {
  PENDING_SIGNATURE
  ACTIVE
  SUSPENDED
  CANCELLED
  FINISHED
}
```

---

#### TASK-007-002: Schema de Planos (básico)
**Estimativa:** 1h

```prisma
model Plan {
  id             String @id
  modalityId     String
  name           String
  classesPerWeek Int
  isActive       Boolean
}
```

---

#### TASK-007-003: CRUD de Planos
**Estimativa:** 2h

---

#### TASK-007-004: CRUD de Matrículas
**Estimativa:** 4h

- POST /enrollments
- GET /enrollments
- GET /enrollments/:id
- PUT /enrollments/:id
- PUT /enrollments/:id/status

---

#### TASK-007-005: Vinculação com Horários
**Estimativa:** 2h

- Definir horários da matrícula
- Validar disponibilidade

---

### Frontend

#### TASK-007-006: Wizard de Matrícula
**Estimativa:** 5h

- Step 1: Selecionar aluno
- Step 2: Selecionar plano
- Step 3: Escolher horários
- Step 4: Definir pagamento
- Step 5: Confirmação

---

#### TASK-007-007: Listagem de Matrículas
**Estimativa:** 3h

---

#### TASK-007-008: Detalhes da Matrícula
**Estimativa:** 2h

---

#### TASK-007-009: Integração na Página do Aluno
**Estimativa:** 2h

---

## ✅ Critérios de Aceite do Épico

- [ ] Processo de matrícula completo
- [ ] Planos configuráveis
- [ ] Status gerenciável
- [ ] Horários vinculados
- [ ] Histórico preservado
- [ ] Testes ≥80%

---

## 📅 Timeline Sugerido

**Total estimado:** ~23 horas (~1 semana)

---

## 🔗 Próximos Épicos Relacionados

- **EPIC-008:** Sistema de Planos e Preços
- **EPIC-009:** Integração Sicoob
- **EPIC-010:** Controle de Pagamentos
- **EPIC-014:** Contratos Digitais

