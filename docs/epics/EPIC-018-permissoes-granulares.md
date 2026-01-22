# EPIC-018: Granular Permissions

##  General Information

| Field            | Value                   |
| ---------------- | ----------------------- |
| **ID**           | EPIC-018                |
| **Title**       | Granular Permissions   |
| **Phase**         | 4 - Refinamento         |
| **Priority**   | 🟡 Medium                |
| **Estimate**   | 1 week                |
| **Dependencies** | EPIC-002 (Authentication) |
| **Status**       | Backlog              |

---

##  Description

Expandir o system RBAC with:

- Inhaveface for gerenciar permissions
- Criaction of perfis customizados
- Permissions per module/action
- Herança of permissions
- Audit trail of changes

---

##  Objectives

1. Flexibilidade total in permissions
2. Perfis customizable
3. Management visual intuitiva
4. Auditoria complete

---

##  Ube Stories

### US-018-001: Create Profile Customizado

**Como** super admin  
**I want to** create new perfis of access  
**Para** atender needs specific

**Acceptance Criteria:**

- [ ] Nome and description of the perfil
- [ ] Selection of permissions
- [ ] Activer/desactiver perfil

---

### US-018-002: Editar Permissions of Profile

**Como** super admin  
**I want to** editar permissions of a perfil  
**Para** ajustar accesss

**Acceptance Criteria:**

- [ ] Inhaveface of checkbox por resource/action
- [ ] Agrupamento per module
- [ ] Salvar changes
- [ ] Edone imedayto

---

### US-018-003: Atribuir Multiple Perfis

**Como** admin  
**I want to** atribuir multiple perfis a a ube  
**Para** withbinar permissions

**Acceptance Criteria:**

- [ ] Selection múltipla
- [ ] Permissions withbinadas (union)
- [ ] Visualization of the resultado

---

### US-018-004: Visualizar Matriz of Permissions

**Como** admin  
**I want to** ver matriz complete of permissions  
**Para** entender quem can o quê

**Acceptance Criteria:**

- [ ] Matriz perfil x permission
- [ ] Export
- [ ] Filters

---

### US-018-005: History of Alhaveactions

**Como** super admin  
**I want to** ver history of changes in permissions  
**Para** audit

**Acceptance Criteria:**

- [ ] Quem alhaveou
- [ ] O that mudou
- [ ] When

---

##  Tasks Technical

### Backend

#### TASK-018-001: Expandir Schema of Permissions

**Estimate:** 2h

- Permissions more granular
- Targetdate of permissions

---

#### TASK-018-002: CRUD of Perfis

**Estimate:** 3h

- Criaction of perfis customizados
- Validations

---

#### TASK-018-003: API of Management of Permissions

**Estimate:** 3h

- GET /permissions (all available)
- PUT /roles/:id/permissions
- GET /users/:id/effective-permissions

---

#### TASK-018-004: Auditoria of Permissions

**Estimate:** 2h

- Log of all changes
- Endpoint of history

---

### Frontend

#### TASK-018-005: Page of Management of Perfis

**Estimate:** 5h

- Lista of perfis
- Create/editar perfil
- Matriz of permissions

---

#### TASK-018-006: Componente of Selection of Permissions

**Estimate:** 4h

- Árvore of permissions
- Checkboxes per module
- Select all/none

---

#### TASK-018-007: Page of Matriz

**Estimate:** 3h

- Visualization matricial
- Export

---

##  Acceptance Criteria of the Epic

- [ ] Perfis customizable
- [ ] Inhaveface intuitiva
- [ ] Permissions granular
- [ ] Auditoria complete
- [ ] Multiple perfis por ube
- [ ] Tests ≥80%

---

##  Timeline Sugerido

**Total estimado:** ~22 hours (~1 week)
