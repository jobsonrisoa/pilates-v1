# EPIC-012: Relatórios Financeiros

##  Informações Gerais

| Campo            | Valor                                       |
| ---------------- | ------------------------------------------- |
| **ID**           | EPIC-012                                    |
| **Título**       | Relatórios Financeiros                      |
| **Fase**         | 2 - Financeiro                              |
| **Prioridade**   | High                                     |
| **Estimativa**   | 1 semana                                    |
| **Dependências** | EPIC-010 (Pagamentos), EPIC-011 (Comissões) |
| **Status**       | Backlog                                  |

---

##  Descrição

Implementar relatórios financeiros completos:

- Receitas por período, modalidade, forma de pagamento
- Inadimplência
- Fluxo de caixa
- Exportação em PDF e Excel

---

##  Objetivos

1. Visão clara das receitas
2. Controle de inadimplência
3. Análise por diferentes dimensões
4. Exportação para contabilidade

---

##  User Stories

### US-012-001: Relatório de Receitas por Período

**Como** gerente  
**Quero** ver receitas por dia/semana/mês/ano  
**Para** acompanhar o faturamento

**Critérios de Aceite:**

- [ ] Seleção de período
- [ ] Agrupamento por dia/semana/mês
- [ ] Gráfico de evolução
- [ ] Comparativo com período anterior

---

### US-012-002: Relatório de Receitas por Modalidade

**Como** gerente  
**Quero** ver receitas por modalidade  
**Para** saber o que mais fatura

**Critérios de Aceite:**

- [ ] Receita por Pilates, Fisio, etc
- [ ] Gráfico de pizza/barras
- [ ] Percentual de cada

---

### US-012-003: Relatório de Receitas por Forma de Pagamento

**Como** financeiro  
**Quero** ver receitas por forma de pagamento  
**Para** entender como recebemos

**Critérios de Aceite:**

- [ ] Boleto, PIX, Cartão, Dinheiro
- [ ] Totais por forma
- [ ] Taxas aplicadas (se houver)

---

### US-012-004: Relatório de Inadimplência

**Como** gerente  
**Quero** relatório detalhado de inadimplência  
**Para** tomar ações

**Critérios de Aceite:**

- [ ] Total em aberto
- [ ] Por faixa de atraso (30, 60, 90+ dias)
- [ ] Lista de devedores
- [ ] Histórico de inadimplência

---

### US-012-005: Fluxo de Caixa

**Como** financeiro  
**Quero** ver o fluxo de caixa  
**Para** planejar financeiramente

**Critérios de Aceite:**

- [ ] Entradas (receitas)
- [ ] Saídas (comissões)
- [ ] Saldo por período
- [ ] Projeção futura

---

### US-012-006: Exportar Relatórios

**Como** financeiro  
**Quero** exportar relatórios  
**Para** enviar à contabilidade

**Critérios de Aceite:**

- [ ] Exportar em PDF
- [ ] Exportar em Excel
- [ ] Layout profissional
- [ ] Dados completos

---

##  Tasks Técnicas

### Backend

#### TASK-012-001: API de Receitas por Período

**Estimativa:** 3h

---

#### TASK-012-002: API de Receitas por Modalidade

**Estimativa:** 2h

---

#### TASK-012-003: API de Receitas por Forma de Pagamento

**Estimativa:** 2h

---

#### TASK-012-004: API de Inadimplência

**Estimativa:** 3h

---

#### TASK-012-005: API de Fluxo de Caixa

**Estimativa:** 3h

---

#### TASK-012-006: Serviço de Exportação PDF

**Estimativa:** 3h

- Puppeteer ou PDFKit
- Templates de relatório

---

#### TASK-012-007: Serviço de Exportação Excel

**Estimativa:** 2h

- ExcelJS
- Formatação profissional

---

### Frontend

#### TASK-012-008: Dashboard Financeiro Completo

**Estimativa:** 5h

- Cards de resumo
- Gráficos principais
- Período selecionável

---

#### TASK-012-009: Página de Relatório de Receitas

**Estimativa:** 4h

- Filtros
- Tabelas
- Gráficos
- Exportação

---

#### TASK-012-010: Página de Inadimplência

**Estimativa:** 3h

---

#### TASK-012-011: Página de Fluxo de Caixa

**Estimativa:** 3h

---

##  Critérios de Aceite do Épico

- [ ] Todos os relatórios funcionando
- [ ] Gráficos informativos
- [ ] Exportação PDF/Excel
- [ ] Performance adequada
- [ ] Filtros funcionais
- [ ] Testes ≥80%

---

##  Timeline Sugerido

**Total estimado:** ~33 horas (~1 semana)
