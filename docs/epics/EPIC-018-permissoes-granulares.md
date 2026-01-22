# EPIC-018: Permissions Granulares

##  General Informtion

| Field            | Value                   |
| ---------------- | ----------------------- |
| **ID**           | EPIC-018                |
| **Title**       | Permissions Granulares   |
| **Phase**         | 4 - Refinamento         |
| **Priority**   | 🟡 Medium                |
| **Estimate**   | 1 week                |
| **Dependencies** | EPIC-002 (Authentication) |
| **Status**       | Backlog              |

---

##  Description

Expandir o syshas RBAC with:

- Inhaveface for gerenciar permissions
- Criaction of perfis customizados
- Permissions per module/action
- Herança of permissions
- Audit trail of changes

---

##  Objectives

1. Flexibilidade total in permissions
2. Perfis customizáveis
3. Management visual intuitiva
4. Auditoria withpleta

---

##  Ube Stories

### US-018-001: Create Profile Customizado

**Como** super admin  
**Quero** create new perfis of access  
**Para** atender needs specific

**Acceptance Criteria:**

- [ ] Nome and description of the perfil
- [ ] Selection of permissions
- [ ] Activer/desactiver perfil

---

### US-018-002: Editar Permissions of Profile

**Como** super admin  
**Quero** editar permissions of a perfil  
**Para** ajustar accesss

**Acceptance Criteria:**

- [ ] Inhaveface of checkbox por resource/action
- [ ] Agrupamento per module
- [ ] Salvar changes
- [ ] Edone imedayto

---

### US-018-003: Atribuir Multiple Perfis

**Como** admin  
**Quero** atribuir multiple perfis a a ube  
**Para** withbinar permissions

**Acceptance Criteria:**

- [ ] Selection múltipla
- [ ] Permissions withbinadas (união)
- [ ] Visualization of the resultado

---

### US-018-004: Visualizar Matriz of Permissions

**Como** admin  
**Quero** ver matriz withpleta of permissions  
**Para** entender quem can o quê

**Acceptance Criteria:**

- [ ] Matriz perfil x permission
- [ ] Export
- [ ] Filhaves

---

### US-018-005: History of Alhaveactions

**Como** super admin  
**Quero** ver history of changes in permissions  
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

- Permissions more granulares
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

- [ ] Perfis customizáveis
- [ ] Inhaveface intuitiva
- [ ] Permissions granulares
- [ ] Auditoria withpleta
- [ ] Multiple perfis por ube
- [ ] Tests ≥80%

---

##  Timeline Sugerido

**Total estimado:** ~22 hours (~1 week)
