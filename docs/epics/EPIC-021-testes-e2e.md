# EPIC-021: Testes E2E e Performance

##  Informações Gerais

| Campo            | Valor                      |
| ---------------- | -------------------------- |
| **ID**           | EPIC-021                   |
| **Título**       | Testes E2E e Performance   |
| **Fase**         | 4 - Refinamento            |
| **Prioridade**   | High                    |
| **Estimativa**   | 1 semana                   |
| **Dependências** | Todos os épicos funcionais |
| **Status**       | Backlog                 |

---

##  Descrição

Implementar suite completa de testes:

- Testes E2E dos fluxos críticos
- Testes de carga e stress
- Testes de segurança básicos
- Relatórios de cobertura

---

##  Objetivos

1. E2E para fluxos principais
2. Garantir performance sob carga
3. Identificar vulnerabilidades
4. Cobertura documentada

---

##  User Stories

### US-021-001: Testes E2E de Autenticação

**Como** QA  
**Quero** testes automatizados de login  
**Para** garantir que funciona

**Critérios de Aceite:**

- [ ] Login válido
- [ ] Login inválido
- [ ] Refresh token
- [ ] Logout
- [ ] Recuperação de senha

---

### US-021-002: Testes E2E de Cadastros

**Como** QA  
**Quero** testes de CRUD  
**Para** garantir integridade

**Critérios de Aceite:**

- [ ] Criar aluno
- [ ] Editar aluno
- [ ] Criar professor
- [ ] Validações

---

### US-021-003: Testes E2E de Fluxo de Matrícula

**Como** QA  
**Quero** testar o fluxo completo  
**Para** garantir funcionamento

**Critérios de Aceite:**

- [ ] Cadastrar aluno
- [ ] Criar matrícula
- [ ] Gerar contrato
- [ ] Gerar cobrança

---

### US-021-004: Testes de Carga

**Como** DevOps  
**Quero** testar sob carga  
**Para** garantir escalabilidade

**Critérios de Aceite:**

- [ ] 100 usuários simultâneos
- [ ] P95 < 500ms
- [ ] Zero erros

---

### US-021-005: Testes de Stress

**Como** DevOps  
**Quero** encontrar o limite  
**Para** conhecer a capacidade

**Critérios de Aceite:**

- [ ] Identificar breaking point
- [ ] Documentar limites
- [ ] Plano de escala

---

##  Tasks Técnicas

### E2E Tests

#### TASK-021-001: Setup Playwright

**Estimativa:** 2h

- Configuração final
- Page objects
- Fixtures

---

#### TASK-021-002: Testes de Auth

**Estimativa:** 3h

- Login/logout
- Refresh
- Permissões

---

#### TASK-021-003: Testes de Alunos

**Estimativa:** 3h

- CRUD completo
- Busca/filtros
- Exames

---

#### TASK-021-004: Testes de Agenda

**Estimativa:** 3h

- Visualização
- Agendamento
- Presença

---

#### TASK-021-005: Testes de Matrícula

**Estimativa:** 4h

- Fluxo completo
- Pagamento (mock)
- Contrato

---

### Performance Tests

#### TASK-021-006: Scripts k6 de Load Test

**Estimativa:** 3h

- Cenários de uso
- Ramp up/down
- Métricas

---

#### TASK-021-007: Scripts k6 de Stress Test

**Estimativa:** 2h

- Encontrar limites
- Spike test

---

#### TASK-021-008: Scripts k6 de Soak Test

**Estimativa:** 2h

- Teste de longa duração
- Memory leaks

---

### Security Tests

#### TASK-021-009: Scan de Vulnerabilidades

**Estimativa:** 2h

- OWASP ZAP básico
- Dependências (npm audit)
- Trivy para containers

---

### Reports

#### TASK-021-010: Relatórios e CI Integration

**Estimativa:** 2h

- Relatórios HTML
- Integração no CI
- Alertas de falha

---

##  Critérios de Aceite do Épico

- [ ] E2E cobrindo fluxos críticos
- [ ] Todos os testes passando
- [ ] Load test: 100 users OK
- [ ] Stress test documentado
- [ ] Zero vulnerabilidades críticas
- [ ] CI executando testes

---

##  Timeline Sugerido

**Total estimado:** ~26 horas (~1 semana)
