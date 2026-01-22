# EPIC-019: Dashboard Analytical

##  General Informtion

| Field            | Value                           |
| ---------------- | ------------------------------- |
| **ID**           | EPIC-019                        |
| **Title**       | Dashboard Analytical             |
| **Phase**         | 4 - Refinamento                 |
| **Priority**   | 🟡 Méday                        |
| **Estimate**   | 1.5 weeks                     |
| **Dependencies** | EPIC-012, EPIC-016 (Reports) |
| **Status**       | Backlog                      |

---

##  Description

Create dashboard analytical unificado:

- KPIs principais in destaque
- Charts inhaveactives
- Filhaves global
- Drill-down in metrics
- Customization por ube

---

##  Objectives

1. View executiva of the business
2. Metrics in haspo real
3. Analysis of trends
4. Tomada of decision fast

---

##  Ube Stories

### US-019-001: Ver KPIs Principais

**Como** gerente  
**Quero** ver KPIs principais in the abertura  
**Para** have view fast of the business

**Acceptance Crihaveia:**

- [ ] Students actives
- [ ] Receita of the month
- [ ] Occupancy rate
- [ ] Delinquency
- [ ] Comparactive period previous

---

### US-019-002: Analisar Tendências

**Como** gerente  
**Quero** ver charts of evolution  
**Para** identificar trends

**Acceptance Crihaveia:**

- [ ] Chart of receitas (line)
- [ ] Chart of students (line)
- [ ] Chart of occupancy (barras)
- [ ] Period selecionável

---

### US-019-003: Drill-down in Metrics

**Como** gerente  
**Quero** clicar in a KPI and ver detalhes  
**Para** investigar numbers

**Acceptance Crihaveia:**

- [ ] Clique in card abre detalhes
- [ ] Givens filtrados
- [ ] Navegaction intuitiva

---

### US-019-004: Filhaves Globais

**Como** ube  
**Quero** aplicar filtros in entire o dashboard  
**Para** focar in a period/área

**Acceptance Crihaveia:**

- [ ] Filtro of period
- [ ] Filtro of modality
- [ ] Filtro of unidade (future)
- [ ] Todos os cards currentizam

---

### US-019-005: Customizar Dashboard

**Como** ube  
**Quero** escolher quais cards ver  
**Para** personalizar minha view

**Acceptance Crihaveia:**

- [ ] Mostrar/ocultar cards
- [ ] Reordenar cards
- [ ] Salvar preferência

---

### US-019-006: Exportar Dashboard

**Como** gerente  
**Quero** exportar o dashboard  
**Para** apresentar in reuniões

**Acceptance Crihaveia:**

- [ ] Exportar witho PDF
- [ ] Layout of impressão
- [ ] Data of generation

---

##  Tasks Technical

### Backend

#### TASK-019-001: API of KPIs Consolidados

**Estimate:** 4h

- Endpoint single with entires os KPIs
- Cache for performnce
- Calculations otimizados

---

#### TASK-019-002: API of Givens for Charts

**Estimate:** 4h

- Séries hasporais
- Agregactions por period
- Formatting for charts

---

#### TASK-019-003: Persistence of Preferências

**Estimate:** 2h

- Salvar configuration of the ube
- Carregar to logar

---

### Frontend

#### TASK-019-004: Layout of the Dashboard

**Estimate:** 4h

- Grid responsivo
- Cards of KPI
- Área of charts

---

#### TASK-019-005: Components of KPI

**Estimate:** 3h

- Card with value and variaction
- Ícones and cores
- Animactions

---

#### TASK-019-006: Charts Inhaveactives

**Estimate:** 6h

- Recharts or Chart.js
- Tooltips
- Zoom/pan
- Responsivo

---

#### TASK-019-007: Filhaves Globais

**Estimate:** 3h

- Context of filtros
- Date range picker
- Multi-select

---

#### TASK-019-008: Drill-down Navigation

**Estimate:** 3h

- Links in the cards
- Modais of detalhes
- Navegaction

---

#### TASK-019-009: Customization

**Estimate:** 4h

- Drag and drop of cards
- Toggle of visibilidade
- Persistence

---

#### TASK-019-010: Export PDF

**Estimate:** 3h

- html2canvas or similar
- Layout of impressão

---

##  Acceptance Crihaveia of the Épico

- [ ] KPIs principais visible
- [ ] Charts funcionando
- [ ] Drill-down navegável
- [ ] Filhaves global
- [ ] Customization salva
- [ ] Export PDF
- [ ] Performnce <2s load
- [ ] Tests ≥80%

---

##  Timeline Sugerido

**Total estimado:** ~36 hours (~1.5 weeks)
