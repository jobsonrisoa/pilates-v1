# EPIC-004: Gestão de Professores

## 📋 Informações Gerais

| Campo            | Valor                   |
| ---------------- | ----------------------- |
| **ID**           | EPIC-004                |
| **Título**       | Gestão de Professores   |
| **Fase**         | 1 - MVP                 |
| **Prioridade**   | 🟠 Alta                 |
| **Estimativa**   | 1 semana                |
| **Dependências** | EPIC-002 (Autenticação) |
| **Status**       | 📋 Backlog              |

---

## 📝 Descrição

Implementar módulo de gestão de professores incluindo:

- Cadastro completo com dados pessoais e profissionais
- Registro profissional (CREF, CREFITO)
- Especialidades
- Dados bancários para pagamento
- Vinculação com usuário do sistema (login)

---

## 🎯 Objetivos

1. CRUD completo de professores
2. Gestão de especialidades
3. Dados para pagamento (comissões)
4. Vinculação opcional com login

---

## 👤 User Stories

### US-004-001: Cadastrar Professor

**Como** administrador  
**Quero** cadastrar um novo professor  
**Para** que ele possa dar aulas

**Critérios de Aceite:**

- [ ] Formulário com dados pessoais
- [ ] Dados profissionais (CREF/CREFITO)
- [ ] Especialidades selecionáveis
- [ ] Dados bancários opcionais
- [ ] Validação de CPF único

---

### US-004-002: Listar Professores

**Como** usuário do sistema  
**Quero** ver a lista de professores  
**Para** encontrar quem preciso

**Critérios de Aceite:**

- [ ] Listagem paginada
- [ ] Filtro por status e especialidade
- [ ] Busca por nome

---

### US-004-003: Vincular Professor a Usuário

**Como** administrador  
**Quero** criar login para o professor  
**Para** que ele acesse o sistema

**Critérios de Aceite:**

- [ ] Botão para criar usuário vinculado
- [ ] Email do professor usado como login
- [ ] Perfil "Professor" atribuído automaticamente

---

### US-004-004: Gerenciar Especialidades

**Como** administrador  
**Quero** definir as especialidades do professor  
**Para** saber quais aulas ele pode dar

**Critérios de Aceite:**

- [ ] Multi-select de especialidades
- [ ] Modalidades: Pilates, Fisioterapia, etc.

---

## 🔧 Tasks Técnicas

### Backend

#### TASK-004-001: Módulo Teachers no NestJS

**Estimativa:** 2h

**Definition of Done:**

- [ ] Estrutura DDD criada
- [ ] Entidade Teacher
- [ ] Testes unitários

---

#### TASK-004-002: Schema Prisma de Professores

**Estimativa:** 1h

**Definition of Done:**

- [ ] Model Teacher com todos os campos
- [ ] Relação com User (opcional)
- [ ] Migration aplicada

---

#### TASK-004-003: CRUD de Professores (API)

**Estimativa:** 3h

**Definition of Done:**

- [ ] Endpoints CRUD funcionando
- [ ] Validações
- [ ] Testes de integração

---

#### TASK-004-004: Vinculação com Usuário

**Estimativa:** 2h

**Definition of Done:**

- [ ] POST /teachers/:id/create-user
- [ ] Cria usuário com perfil Professor
- [ ] Envia email de boas-vindas

---

### Frontend

#### TASK-004-005: Listagem de Professores

**Estimativa:** 3h

**Definition of Done:**

- [ ] DataTable implementada
- [ ] Filtros funcionando
- [ ] Testes

---

#### TASK-004-006: Formulário de Professor

**Estimativa:** 4h

**Definition of Done:**

- [ ] Formulário completo
- [ ] Validações
- [ ] Multi-select de especialidades
- [ ] Testes

---

#### TASK-004-007: Página de Detalhes

**Estimativa:** 2h

**Definition of Done:**

- [ ] Layout de detalhes
- [ ] Botão criar usuário
- [ ] Testes

---

## ✅ Critérios de Aceite do Épico

- [ ] CRUD completo funcionando
- [ ] Especialidades configuráveis
- [ ] Dados bancários salvos (criptografados)
- [ ] Vinculação com usuário funcional
- [ ] Testes ≥80%

---

## 📅 Timeline Sugerido

```
Semana 1:
├── TASK-004-001: Módulo (2h)
├── TASK-004-002: Schema (1h)
├── TASK-004-003: CRUD API (3h)
├── TASK-004-004: Vinculação User (2h)
├── TASK-004-005: Listagem UI (3h)
├── TASK-004-006: Formulário (4h)
└── TASK-004-007: Detalhes (2h)
```

**Total estimado:** ~17 horas (~1 semana)
