# EPIC-005: Gestão de Aulas e Horários

## 📋 Informações Gerais

| Campo            | Valor                      |
| ---------------- | -------------------------- |
| **ID**           | EPIC-005                   |
| **Título**       | Gestão de Aulas e Horários |
| **Fase**         | 1 - MVP                    |
| **Prioridade**   | 🟠 Alta                    |
| **Estimativa**   | 1.5 semanas                |
| **Dependências** | EPIC-004 (Professores)     |
| **Status**       | 📋 Backlog                 |

---

## 📝 Descrição

Implementar gestão de modalidades, tipos de aula e grade de horários:

- Cadastro de modalidades (Pilates, Fisioterapia)
- Tipos de aula (Individual, Dupla, Grupo)
- Grade de horários semanal
- Vinculação professor + modalidade + horário

---

## 🎯 Objetivos

1. Configurar modalidades disponíveis
2. Definir tipos de aula e capacidades
3. Criar grade de horários recorrente
4. Base para sistema de agendamento

---

## 👤 User Stories

### US-005-001: Gerenciar Modalidades

**Como** administrador  
**Quero** cadastrar modalidades de aula  
**Para** definir o que a academia oferece

**Critérios de Aceite:**

- [ ] CRUD de modalidades
- [ ] Nome e descrição
- [ ] Ativar/desativar

---

### US-005-002: Gerenciar Tipos de Aula

**Como** administrador  
**Quero** definir tipos de aula por modalidade  
**Para** configurar capacidades e durações

**Critérios de Aceite:**

- [ ] Tipos: Individual, Dupla, Grupo
- [ ] Capacidade máxima
- [ ] Duração em minutos
- [ ] Vinculado a modalidade

---

### US-005-003: Criar Grade de Horários

**Como** gerente  
**Quero** definir a grade semanal de aulas  
**Para** organizar os horários disponíveis

**Critérios de Aceite:**

- [ ] Selecionar dia da semana
- [ ] Horário início/fim
- [ ] Professor responsável
- [ ] Modalidade e tipo
- [ ] Capacidade

---

### US-005-004: Visualizar Grade Semanal

**Como** usuário do sistema  
**Quero** ver a grade de horários da semana  
**Para** entender a disponibilidade

**Critérios de Aceite:**

- [ ] Visualização em grade (tabela)
- [ ] Filtro por professor
- [ ] Filtro por modalidade
- [ ] Informações rápidas

---

## 🔧 Tasks Técnicas

### Backend

#### TASK-005-001: Schema de Modalidades e Tipos

**Estimativa:** 2h

```prisma
model Modality {
  id          String @id
  name        String
  description String?
  isActive    Boolean
  classTypes  ClassType[]
}

model ClassType {
  id              String @id
  modalityId      String
  name            String
  maxStudents     Int
  durationMinutes Int
}
```

---

#### TASK-005-002: CRUD Modalidades

**Estimativa:** 2h

---

#### TASK-005-003: CRUD Tipos de Aula

**Estimativa:** 2h

---

#### TASK-005-004: Schema de Grade (Schedules)

**Estimativa:** 2h

```prisma
model Schedule {
  id          String @id
  modalityId  String
  classTypeId String
  teacherId   String
  dayOfWeek   Int      // 0-6
  startTime   String   // HH:mm
  endTime     String
  maxStudents Int
  isActive    Boolean
}
```

---

#### TASK-005-005: CRUD Grade de Horários

**Estimativa:** 4h

---

#### TASK-005-006: Validações de Conflito

**Estimativa:** 2h

- Professor não pode ter dois horários sobrepostos
- Sala não pode ter conflito (futuro)

---

### Frontend

#### TASK-005-007: Página de Modalidades

**Estimativa:** 3h

---

#### TASK-005-008: Página de Tipos de Aula

**Estimativa:** 3h

---

#### TASK-005-009: Página de Grade de Horários

**Estimativa:** 5h

- Visualização em tabela semanal
- Modal para adicionar horário
- Drag and drop (opcional)

---

#### TASK-005-010: Filtros e Visualizações

**Estimativa:** 2h

---

## ✅ Critérios de Aceite do Épico

- [ ] Modalidades configuráveis
- [ ] Tipos de aula com capacidade
- [ ] Grade semanal funcional
- [ ] Validação de conflitos
- [ ] Interface visual de grade
- [ ] Testes ≥80%

---

## 📅 Timeline Sugerido

**Total estimado:** ~27 horas (~1.5 semanas)
