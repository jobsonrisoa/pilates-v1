# EPIC-016: Relatórios Operacionais

## 📋 Informações Gerais

| Campo | Valor |
|-------|-------|
| **ID** | EPIC-016 |
| **Título** | Relatórios Operacionais |
| **Fase** | 3 - Operacional |
| **Prioridade** | 🟡 Média |
| **Estimativa** | 1 semana |
| **Dependências** | EPIC-006 (Agenda), EPIC-013 (Reposições) |
| **Status** | 📋 Backlog |

---

## 📝 Descrição

Implementar relatórios operacionais:
- Alunos por status
- Taxa de ocupação por horário
- Faltas e presenças
- Reposições pendentes
- Aulas por professor
- Relatórios de marketing (novos alunos, churn)

---

## 🎯 Objetivos

1. Visão operacional clara
2. Métricas de ocupação
3. Acompanhamento de frequência
4. Indicadores de marketing

---

## 👤 User Stories

### US-016-001: Relatório de Alunos por Status
**Como** gerente  
**Quero** ver distribuição de alunos por status  
**Para** entender a base

**Critérios de Aceite:**
- [ ] Ativos, inativos, suspensos
- [ ] Gráfico e tabela
- [ ] Evolução no tempo

---

### US-016-002: Relatório de Ocupação
**Como** gerente  
**Quero** ver taxa de ocupação dos horários  
**Para** otimizar a grade

**Critérios de Aceite:**
- [ ] Por horário
- [ ] Por professor
- [ ] Por modalidade
- [ ] Heat map semanal

---

### US-016-003: Relatório de Frequência
**Como** gerente  
**Quero** ver estatísticas de presença/falta  
**Para** identificar problemas

**Critérios de Aceite:**
- [ ] Taxa geral de presença
- [ ] Por aluno
- [ ] Por professor
- [ ] Tendências

---

### US-016-004: Relatório de Reposições
**Como** gerente  
**Quero** ver status das reposições  
**Para** acompanhar o acumulado

**Critérios de Aceite:**
- [ ] Créditos pendentes
- [ ] Taxa de utilização
- [ ] Expirados

---

### US-016-005: Relatório de Aulas por Professor
**Como** gerente  
**Quero** ver produtividade dos professores  
**Para** avaliar desempenho

**Critérios de Aceite:**
- [ ] Aulas ministradas
- [ ] Por período
- [ ] Taxa de presença dos alunos

---

### US-016-006: Relatório de Marketing
**Como** gerente  
**Quero** ver métricas de aquisição e retenção  
**Para** avaliar o negócio

**Critérios de Aceite:**
- [ ] Novos alunos por período
- [ ] Taxa de cancelamento (churn)
- [ ] Origem dos alunos (futuro)

---

## 🔧 Tasks Técnicas

### Backend

#### TASK-016-001: API de Relatório de Alunos
**Estimativa:** 2h

---

#### TASK-016-002: API de Ocupação
**Estimativa:** 3h

---

#### TASK-016-003: API de Frequência
**Estimativa:** 3h

---

#### TASK-016-004: API de Reposições
**Estimativa:** 2h

---

#### TASK-016-005: API de Aulas por Professor
**Estimativa:** 2h

---

#### TASK-016-006: API de Marketing
**Estimativa:** 3h

---

### Frontend

#### TASK-016-007: Dashboard Operacional
**Estimativa:** 5h

- KPIs principais
- Gráficos resumidos
- Links para detalhes

---

#### TASK-016-008: Páginas de Relatórios
**Estimativa:** 6h

- Uma página por relatório
- Filtros
- Gráficos
- Exportação

---

## ✅ Critérios de Aceite do Épico

- [ ] Todos os relatórios funcionando
- [ ] Gráficos informativos
- [ ] Filtros aplicáveis
- [ ] Exportação PDF/Excel
- [ ] Performance adequada
- [ ] Testes ≥80%

---

## 📅 Timeline Sugerido

**Total estimado:** ~26 horas (~1 semana)

