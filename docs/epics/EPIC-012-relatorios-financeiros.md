# EPIC-012: Reports Financials

##  General Information

| Field            | Value                                       |
| ---------------- | ------------------------------------------- |
| **ID**           | EPIC-012                                    |
| **Title**       | Reports Financials                      |
| **Phase**         | 2 - Financial                              |
| **Priority**   | High                                     |
| **Estimate**   | 1 week                                    |
| **Dependencies** | EPIC-010 (Payments), EPIC-011 (Commissions) |
| **Status**       | Backlog                                  |

---

##  Description

Implement reports financial completes:

- Revenue by period, modality, payment method
- Delinquency
- Cash flow
- Export in PDF and Excel

---

##  Objectives

1. View clara of the receitas
2. Controle of delinquency
3. Analysis by different dimensions
4. Export for accountbilidade

---

##  Ube Stories

### US-012-001: Report of Revenue por Period

**Como** gerente  
**I want to** ver receitas per day/week/month/year  
**Para** awithpanhar o billing

**Acceptance Criteria:**

- [ ] Selection of period
- [ ] Agrupamento per day/week/month
- [ ] Chart of evolution
- [ ] Comparactive with period previous

---

### US-012-002: Report of Revenue por Modalidade

**Como** gerente  
**I want to** ver receitas por modality  
**Para** saber o that more fatura

**Acceptance Criteria:**

- [ ] Receita por Pilates, Fisio, etc
- [ ] Chart of pizza/barras
- [ ] Percentage of each

---

### US-012-003: Report of Revenue por Forma of Payment

**Como** financial  
**I want to** ver receitas por payment method  
**Para** entender witho recebemos

**Acceptance Criteria:**

- [ ] Boleto, PIX, Card, Cash
- [ ] Totais por form
- [ ] Rates aplieachs (se houver)

---

### US-012-004: Report of Delinquency

**Como** gerente  
**I want to** report detalhado of delinquency  
**Para** tomar actions

**Acceptance Criteria:**

- [ ] Total in aberto
- [ ] Por faixa of atraso (30, 60, 90+ days)
- [ ] Lista of shoulddores
- [ ] History of delinquency

---

### US-012-005: Fluxo of Caixa

**Como** financial  
**I want to** ver o fluxo of caixa  
**Para** planejar financeiramente

**Acceptance Criteria:**

- [ ] Entradas (receitas)
- [ ] Outputs (withmissions)
- [ ] Saldo por period
- [ ] Projection future

---

### US-012-006: Exportar Reports

**Como** financial  
**I want to** exportar reports  
**Para** enviar to the accountbilidade

**Acceptance Criteria:**

- [ ] Exportar in PDF
- [ ] Exportar in Excel
- [ ] Layout profissional
- [ ] Givens completes

---

##  Tasks Technical

### Backend

#### TASK-012-001: API of Revenue por Period

**Estimate:** 3h

---

#### TASK-012-002: API of Revenue por Modalidade

**Estimate:** 2h

---

#### TASK-012-003: API of Revenue por Forma of Payment

**Estimate:** 2h

---

#### TASK-012-004: API of Delinquency

**Estimate:** 3h

---

#### TASK-012-005: API of Fluxo of Caixa

**Estimate:** 3h

---

#### TASK-012-006: Service of Export PDF

**Estimate:** 3h

- Puppeteer or PDFKit
- Templates of report

---

#### TASK-012-007: Service of Export Excel

**Estimate:** 2h

- ExcelJS
- Formatting profissional

---

### Frontend

#### TASK-012-008: Dashboard Financial Completo

**Estimate:** 5h

- Cards of resumo
- Charts principais
- Period selectable

---

#### TASK-012-009: Page of Report of Revenue

**Estimate:** 4h

- Filters
- Tabelas
- Charts
- Export

---

#### TASK-012-010: Page of Delinquency

**Estimate:** 3h

---

#### TASK-012-011: Page of Fluxo of Caixa

**Estimate:** 3h

---

##  Acceptance Criteria of the Epic

- [ ] All reports working
- [ ] Charts informctives
- [ ] Export PDF/Excel
- [ ] Performnce adequada
- [ ] Filters funcionais
- [ ] Tests ≥80%

---

##  Timeline Sugerido

**Total estimado:** ~33 hours (~1 week)
