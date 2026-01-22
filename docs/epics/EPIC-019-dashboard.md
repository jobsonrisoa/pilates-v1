# EPIC-019: Dashboard Analítico

## 📋 Informações Gerais

| Campo            | Valor                           |
| ---------------- | ------------------------------- |
| **ID**           | EPIC-019                        |
| **Título**       | Dashboard Analítico             |
| **Fase**         | 4 - Refinamento                 |
| **Prioridade**   | 🟡 Média                        |
| **Estimativa**   | 1.5 semanas                     |
| **Dependências** | EPIC-012, EPIC-016 (Relatórios) |
| **Status**       | 📋 Backlog                      |

---

## 📝 Descrição

Criar dashboard analítico unificado:

- KPIs principais em destaque
- Gráficos interativos
- Filtros globais
- Drill-down em métricas
- Customização por usuário

---

## 🎯 Objetivos

1. Visão executiva do negócio
2. Métricas em tempo real
3. Análise de tendências
4. Tomada de decisão rápida

---

## 👤 User Stories

### US-019-001: Ver KPIs Principais

**Como** gerente  
**Quero** ver KPIs principais na abertura  
**Para** ter visão rápida do negócio

**Critérios de Aceite:**

- [ ] Alunos ativos
- [ ] Receita do mês
- [ ] Taxa de ocupação
- [ ] Inadimplência
- [ ] Comparativo período anterior

---

### US-019-002: Analisar Tendências

**Como** gerente  
**Quero** ver gráficos de evolução  
**Para** identificar tendências

**Critérios de Aceite:**

- [ ] Gráfico de receitas (linha)
- [ ] Gráfico de alunos (linha)
- [ ] Gráfico de ocupação (barras)
- [ ] Período selecionável

---

### US-019-003: Drill-down em Métricas

**Como** gerente  
**Quero** clicar em um KPI e ver detalhes  
**Para** investigar números

**Critérios de Aceite:**

- [ ] Clique em card abre detalhes
- [ ] Dados filtrados
- [ ] Navegação intuitiva

---

### US-019-004: Filtros Globais

**Como** usuário  
**Quero** aplicar filtros em todo o dashboard  
**Para** focar em um período/área

**Critérios de Aceite:**

- [ ] Filtro de período
- [ ] Filtro de modalidade
- [ ] Filtro de unidade (futuro)
- [ ] Todos os cards atualizam

---

### US-019-005: Customizar Dashboard

**Como** usuário  
**Quero** escolher quais cards ver  
**Para** personalizar minha visão

**Critérios de Aceite:**

- [ ] Mostrar/ocultar cards
- [ ] Reordenar cards
- [ ] Salvar preferência

---

### US-019-006: Exportar Dashboard

**Como** gerente  
**Quero** exportar o dashboard  
**Para** apresentar em reuniões

**Critérios de Aceite:**

- [ ] Exportar como PDF
- [ ] Layout de impressão
- [ ] Data de geração

---

## 🔧 Tasks Técnicas

### Backend

#### TASK-019-001: API de KPIs Consolidados

**Estimativa:** 4h

- Endpoint único com todos os KPIs
- Cache para performance
- Cálculos otimizados

---

#### TASK-019-002: API de Dados para Gráficos

**Estimativa:** 4h

- Séries temporais
- Agregações por período
- Formatação para charts

---

#### TASK-019-003: Persistência de Preferências

**Estimativa:** 2h

- Salvar configuração do usuário
- Carregar ao logar

---

### Frontend

#### TASK-019-004: Layout do Dashboard

**Estimativa:** 4h

- Grid responsivo
- Cards de KPI
- Área de gráficos

---

#### TASK-019-005: Componentes de KPI

**Estimativa:** 3h

- Card com valor e variação
- Ícones e cores
- Animações

---

#### TASK-019-006: Gráficos Interativos

**Estimativa:** 6h

- Recharts ou Chart.js
- Tooltips
- Zoom/pan
- Responsivo

---

#### TASK-019-007: Filtros Globais

**Estimativa:** 3h

- Context de filtros
- Date range picker
- Multi-select

---

#### TASK-019-008: Drill-down Navigation

**Estimativa:** 3h

- Links nos cards
- Modais de detalhes
- Navegação

---

#### TASK-019-009: Customização

**Estimativa:** 4h

- Drag and drop de cards
- Toggle de visibilidade
- Persistência

---

#### TASK-019-010: Exportação PDF

**Estimativa:** 3h

- html2canvas ou similar
- Layout de impressão

---

## ✅ Critérios de Aceite do Épico

- [ ] KPIs principais visíveis
- [ ] Gráficos funcionando
- [ ] Drill-down navegável
- [ ] Filtros globais
- [ ] Customização salva
- [ ] Exportação PDF
- [ ] Performance <2s load
- [ ] Testes ≥80%

---

## 📅 Timeline Sugerido

**Total estimado:** ~36 horas (~1.5 semanas)
