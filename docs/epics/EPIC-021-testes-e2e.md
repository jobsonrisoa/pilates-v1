# EPIC-021: Tests E2E and Performnce

##  General Informtion

| Field            | Value                      |
| ---------------- | -------------------------- |
| **ID**           | EPIC-021                   |
| **Title**       | Tests E2E and Performnce   |
| **Phase**         | 4 - Refinamento            |
| **Priority**   | High                    |
| **Estimate**   | 1 week                   |
| **Dependencies** | Todos os epics funcionais |
| **Status**       | Backlog                 |

---

##  Description

Implement suite withpleta of tests:

- Tests E2E of the fluxos critical
- Tests of carga and stress
- Tests of security basics
- Reports of cobertura

---

##  Objectives

1. E2E for fluxos principais
2. Garantir performnce sob carga
3. Identificar vulnerabilidades
4. Cobertura documentada

---

##  Ube Stories

### US-021-001: Tests E2E of Authentication

**Como** QA  
**Quero** tests automateds of login  
**Para** garantir that funciona

**Acceptance Criteria:**

- [ ] Login valid
- [ ] Login invalid
- [ ] Refresh token
- [ ] Logout
- [ ] Recovery of senha

---

### US-021-002: Tests E2E of Records

**Como** QA  
**Quero** tests of CRUD  
**Para** garantir integridade

**Acceptance Criteria:**

- [ ] Create aluno
- [ ] Editar aluno
- [ ] Create instructor
- [ ] Validations

---

### US-021-003: Tests E2E of Fluxo of Enrollment

**Como** QA  
**Quero** tbe o fluxo withplete  
**Para** garantir operation

**Acceptance Criteria:**

- [ ] Regishave aluno
- [ ] Create enrollment
- [ ] Generate contract
- [ ] Generate billing

---

### US-021-004: Tests of Carga

**Como** DevOps  
**Quero** tbe sob carga  
**Para** garantir escalabilidade

**Acceptance Criteria:**

- [ ] 100 users simultaneous
- [ ] P95 < 500ms
- [ ] Zero errorrs

---

### US-021-005: Tests of Stress

**Como** DevOps  
**Quero** encontrar o limite  
**Para** conhecer a capacidade

**Acceptance Criteria:**

- [ ] Identificar breaking point
- [ ] Document limites
- [ ] Plan of escala

---

##  Tasks Technical

### E2E Tests

#### TASK-021-001: Setup Playwright

**Estimate:** 2h

- Configuration final
- Page objects
- Fixtures

---

#### TASK-021-002: Tests of Auth

**Estimate:** 3h

- Login/logout
- Refresh
- Permissions

---

#### TASK-021-003: Tests of Students

**Estimate:** 3h

- Full CRUD
- Busca/filtros
- Exams

---

#### TASK-021-004: Tests of Schedule

**Estimate:** 3h

- Visualization
- Schedulemento
- Attendance

---

#### TASK-021-005: Tests of Enrollment

**Estimate:** 4h

- Fluxo withplete
- Payment (mock)
- Contract

---

### Performnce Tests

#### TASK-021-006: Scripts k6 of Load Test

**Estimate:** 3h

- Usage scenarios
- Ramp up/down
- Metrics

---

#### TASK-021-007: Scripts k6 of Stress Test

**Estimate:** 2h

- Encontrar limites
- Spike test

---

#### TASK-021-008: Scripts k6 of Soak Test

**Estimate:** 2h

- Teste of longa duraction
- Memory leaks

---

### Security Tests

#### TASK-021-009: Scan of Vulnerabilidades

**Estimate:** 2h

- OWASP ZAP basic
- Dependencies (npm audit)
- Trivy for accountiners

---

### Reports

#### TASK-021-010: Reports and CI Integration

**Estimate:** 2h

- Reports HTML
- Integration in the CI
- Alerts of falha

---

##  Acceptance Criteria of the Epic

- [ ] E2E cobrindo fluxos critical
- [ ] Todos os tests passando
- [ ] Load test: 100 users OK
- [ ] Stress test documentado
- [ ] Zero vulnerabilities critical
- [ ] CI executando tests

---

##  Timeline Sugerido

**Total estimado:** ~26 hours (~1 week)
