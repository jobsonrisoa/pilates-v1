# EPIC-019: Dashboard Analytical

##  General Information

| Field            | Value                           |
| ---------------- | ------------------------------- |
| **ID**           | EPIC-019                        |
| **Title**       | Dashboard Analytical             |
| **Phase**         | 4 - Refinamento                 |
| **Priority**   | 🟡 Medium                        |
| **Estimate**   | 1.5 weeks                     |
| **Dependencies** | EPIC-012, EPIC-016 (Reports) |
| **Status**       | Backlog                      |

---

##  Description

Create dashboard analytical unificado:

- KPIs principais in destaque
- Charts inhaveactives
- Filters global
- Drill-down in metrics
- Customization por ube

---

##  Objectives

1. View executiva of the business
2. Metrics in time real
3. Analysis of trends
4. Tomada of decision fast

---

##  Ube Stories

### US-019-001: Ver KPIs Principais

**Como** gerente  
**I want to** ver KPIs principais in the abertura  
**Para** have view fast of the business

**Acceptance Criteria:**

- [ ] Students actives
- [ ] Receita of the month
- [ ] Occupancy rate
- [ ] Delinquency
- [ ] Comparactive period previous

---

### US-019-002: Analisar Trends

**Como** gerente  
**I want to** ver charts of evolution  
**Para** identificar trends

**Acceptance Criteria:**

- [ ] Chart of receitas (line)
- [ ] Chart of students (line)
- [ ] Chart of occupancy (barras)
- [ ] Period selectable

---

### US-019-003: Drill-down in Metrics

**Como** gerente  
**I want to** clicar in a KPI and ver detalhes  
**Para** investigar numbers

**Acceptance Criteria:**

- [ ] Clique in card abre detalhes
- [ ] Givens filtrados
- [ ] Navegaction intuitiva

---

### US-019-004: Filters Globais

**Como** ube  
**I want to** aplicar filtros in entire o dashboard  
**Para** focar in a period/área

**Acceptance Criteria:**

- [ ] Filtro of period
- [ ] Filtro of modality
- [ ] Filtro of unidade (future)
- [ ] Todos os cards currentizam

---

### US-019-005: Customizar Dashboard

**Como** ube  
**I want to** escolher quais cards ver  
**Para** personalizar minha view

**Acceptance Criteria:**

- [ ] Mostrar/ocultar cards
- [ ] Reordenar cards
- [ ] Salvar preferência

---

### US-019-006: Exportar Dashboard

**Como** gerente  
**I want to** exportar o dashboard  
**Para** apresentar in reuniões

**Acceptance Criteria:**

- [ ] Exportar witho PDF
- [ ] Layout of print
- [ ] Data of generation

---

##  Tasks Technical

### Backend

#### TASK-019-001: API of KPIs Consolidados

**Estimate:** 4h

- Endpoint single with entires os KPIs
- Cache for performance
- Calculations optimizeds

---

#### TASK-019-002: API of Givens for Charts

**Estimate:** 4h

- Séries timerais
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

#### TASK-019-007: Filters Globais

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
- Layout of print

---

##  Acceptance Criteria of the Epic

- [ ] KPIs principais visible
- [ ] Charts working
- [ ] Drill-down navegável
- [ ] Filters global
- [ ] Customization salva
- [ ] Export PDF
- [ ] Performnce <2s load
- [ ] Tests ≥80%

---

##  Timeline Sugerido

**Total estimado:** ~36 hours (~1.5 weeks)
