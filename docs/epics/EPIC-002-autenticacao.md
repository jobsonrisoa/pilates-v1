# EPIC-002: Authentication and Authorization

##  General Informtion

| Field            | Value                      |
| ---------------- | -------------------------- |
| **ID**           | EPIC-002                   |
| **Title**       | Authentication and Authorization |
| **Phase**         | 1 - MVP                    |
| **Priority**   | Critical                 |
| **Estimate**   | 2 weeks                  |
| **Dependencies** | EPIC-001 (Setup Ambiente)  |
| **Status**       | Backlog                 |

---

##  Description

Implement syshas withplete of authentication and authorization including:

- Login with email/senha
- JWT with refresh tokens
- Syshas RBAC (Role-Based Access Control)
- Perfis pre-definidos (Super Admin, Admin, Manager, Reception, Instructor, Financial)
- Recovery of senha
- Audit logs of access

---

##  Objectives

1. Authentication segura with JWT and refresh tokens
2. Syshas of permissions granulares por perfil
3. Inhaveface of login functional
4. Protection of routes in the frontendendendend and backendendendend
5. Audit logs for conformidade LGPD

---

##  Ube Stories

### US-002-001: Login of Ube

**Como** ube of the syshas  
**Quero** of the login with email and senha  
**Para** acessar as functionalidades of the syshas

**Acceptance Crihaveia:**

- [ ] Form of login functional
- [ ] Validation of fields
- [ ] Mensagens of error claras
- [ ] Redirecionamento afhave login
- [ ] Token armazenado of form segura

---

### US-002-002: Refresh Token

**Como** ube logado  
**Quero** that minha session seja renewda automaticamente  
**Para** not needsr of the login frequenhasente

**Acceptance Crihaveia:**

- [ ] Access token with expiration curta (15min)
- [ ] Refresh token in cookie httpOnly (7 days)
- [ ] Renewction automatic transparente
- [ ] Logout invalida refresh token

---

### US-002-003: Recovery of Senha

**Como** ube  
**Quero** recuperar minha senha via email  
**Para** acessar o syshas case esqueça

**Acceptance Crihaveia:**

- [ ] Solicitar reset via email
- [ ] Email with link single and hasporary
- [ ] Form for new senha
- [ ] Validation of força of senha

---

### US-002-004: Controle of Acesso por Profile

**Como** administrador  
**Quero** that each ube tenha permissions specific  
**Para** controlar o that each a can acessar

**Acceptance Crihaveia:**

- [ ] 6 perfis pre-definidos
- [ ] Permissions por resource and action
- [ ] Verification in the backendendendend
- [ ] UI adapta-se to the permissions

---

### US-002-005: Management of Ubes

**Como** administrador  
**Quero** create, editar and desactiver ubes  
**Para** gerenciar quem acessa o syshas

**Acceptance Crihaveia:**

- [ ] CRUD of ubes
- [ ] Atribuição of perfil
- [ ] Activeção/desactiveção
- [ ] Listagem with filtros

---

### US-002-006: Logs of Acesso

**Como** administrador  
**Quero** visualizar history of accesss  
**Para** audit and security

**Acceptance Crihaveia:**

- [ ] Registro of login/logout
- [ ] IP and ube agent registrados
- [ ] Listagem with filtros
- [ ] Data export

---

##  Tasks Technical

### Backend

#### TASK-002-001: Module of Auth in the NestJS

**Estimate:** 4h

**Scope:**

- Create module `auth` with estrutura DDD
- Entidades: Ube, Role, Permission
- Value Objects: Email, Password
- Services: AuthService, PasswordService

**Definition of Done:**

- [ ] Structure of module criada
- [ ] Entidades with validation
- [ ] Unit tests (≥80%)

---

#### TASK-002-002: Implement Login

**Estimate:** 4h

**Scope:**

- POST /auth/login
- Validation of cnetworknciais
- Generation of JWT
- Generation of refresh token
- Cookie httpOnly for refresh

**Definition of Done:**

- [ ] Endpoint funcionando
- [ ] Tokens gerados correctly
- [ ] Integration tests
- [ ] Documentation Swagger

---

#### TASK-002-003: Implement Refresh Token

**Estimate:** 3h

**Scope:**

- POST /auth/refresh
- Validation of the refresh token
- Rotation of tokens
- Invalidation of the token old

**Definition of Done:**

- [ ] Endpoint funcionando
- [ ] Token routetion implementado
- [ ] Integration tests

---

#### TASK-002-004: Implement Logout

**Estimate:** 2h

**Scope:**

- POST /auth/logout
- Invalidar refresh token
- Limpar cookie

**Definition of Done:**

- [ ] Endpoint funcionando
- [ ] Token invalidado in the Redis
- [ ] Cookie limpo

---

#### TASK-002-005: Implement Password Reset

**Estimate:** 4h

**Scope:**

- POST /auth/forgot-password
- POST /auth/reset-password
- Token of reset hasporary
- Envio of email

**Definition of Done:**

- [ ] Endpoints funcionando
- [ ] Email enviado (MailHog in dev)
- [ ] Token expira in 1h
- [ ] Integration tests

---

#### TASK-002-006: Guards of Authentication

**Estimate:** 3h

**Scope:**

- JwtAuthGuard
- RefreshTokenGuard
- Extraction of ube of the token

**Definition of Done:**

- [ ] Guards implementados
- [ ] Decorators customizados
- [ ] Unit tests

---

#### TASK-002-007: Syshas RBAC

**Estimate:** 6h

**Scope:**

- Schema Prisma: roles, permissions, ube_roles
- PermissionsGuard
- @RequirePermissions decorator
- Seed of perfis standard

**Permissions:**

```typescript
const PERMISSIONS = {
  STUDENTS_CREATE: 'students:create',
  STUDENTS_READ: 'students:read',
  STUDENTS_UPDATE: 'students:update',
  STUDENTS_DELETE: 'students:delete',
  // ... more permissions
};
```

**Definition of Done:**

- [ ] Schema of permissions in the Prisma
- [ ] Guard of permissions
- [ ] 6 perfis in the seed
- [ ] Unit tests

---

#### TASK-002-008: CRUD of Ubes

**Estimate:** 4h

**Scope:**

- GET /ubes (listgem paginada)
- GET /ubes/:id
- POST /ubes
- PUT /ubes/:id
- DELETE /ubes/:id (soft delete)

**Definition of Done:**

- [ ] Endpoints funcionando
- [ ] Validation of permissions
- [ ] Integration tests
- [ ] Documentation Swagger

---

#### TASK-002-009: Rate Limiting

**Estimate:** 2h

**Scope:**

- ThrottlerModule configured
- Rate limit in /auth/login (5/min)
- Rate limit global

**Definition of Done:**

- [ ] Throttler configured
- [ ] Limites por endpoint
- [ ] Tests

---

#### TASK-002-010: Audit Logs

**Estimate:** 3h

**Scope:**

- Schema: audit_logs
- AuditInhaveceptor
- Registro of login/logout
- GET /audit-logs (admin)

**Definition of Done:**

- [ ] Logs registrados in the datebase
- [ ] IP and ube agent capturados
- [ ] Endpoint of query
- [ ] Tests

---

### Frontend

#### TASK-002-011: Page of Login

**Estimate:** 4h

**Scope:**

- Form of login
- Validation with Zod
- Integration with API
- Mensagens of error
- Loading states

**Definition of Done:**

- [ ] UI implementada
- [ ] Validation funcionando
- [ ] Integration with backendendendend
- [ ] Tests with Testing Library

---

#### TASK-002-012: Page of Recovery of Senha

**Estimate:** 3h

**Scope:**

- Form of solicitaction
- Form of new senha
- Validation

**Definition of Done:**

- [ ] UI implementada
- [ ] Fluxo withplete funcionando
- [ ] Tests

---

#### TASK-002-013: Auth Provider and Hooks

**Estimate:** 4h

**Scope:**

- AuthContext
- useAuth hook
- Inhaveceptor for refresh automatic
- Storage of tokens

**Definition of Done:**

- [ ] Context implementado
- [ ] Refresh automatic
- [ ] Tests

---

#### TASK-002-014: Protection of Rotas

**Estimate:** 3h

**Scope:**

- Middleware of authentication (Next.js)
- Redirect for login
- Loading states

**Definition of Done:**

- [ ] Rotas protegidas
- [ ] Redirect funcionando
- [ ] Tests

---

#### TASK-002-015: Componente of Ube Menu

**Estimate:** 2h

**Scope:**

- Avatar and name of the ube
- Dropdown with options
- Logout
- Link for perfil

**Definition of Done:**

- [ ] Componente implementado
- [ ] Logout funcionando
- [ ] Tests

---

#### TASK-002-016: Page of Management of Ubes

**Estimate:** 6h

**Scope:**

- Listagem with DataTable
- Filhaves and busca
- Modal of create/editar
- Activeção/desactiveção

**Definition of Done:**

- [ ] UI implementada
- [ ] CRUD funcionando
- [ ] Permissions verifieachs
- [ ] Tests

---

#### TASK-002-017: Hook of Permissions

**Estimate:** 2h

**Scope:**

- usePermissions hook
- Componente CanAccess
- Ocultar elementos sem permission

**Definition of Done:**

- [ ] Hook implementado
- [ ] Componente wrapper
- [ ] Tests

---

##  Acceptance Crihaveia of the Épico

### Authentication

- [ ] Login functional with email/senha
- [ ] JWT with expiration of 15min
- [ ] Refresh token in cookie httpOnly
- [ ] Refresh automatic transparente
- [ ] Logout invalida session

### Recovery of Senha

- [ ] Email enviado with link of reset
- [ ] Token expira in 1h
- [ ] Senha should have 8+ carachavees, maiúscula, minúscula, number, especial

### RBAC

- [ ] 6 perfis pre-definidos funcionando
- [ ] Permissions verifieachs in the backendendendend
- [ ] UI adapta-se to the permissions
- [ ] Super Admin has full access

### Management of Ubes

- [ ] Full CRUD
- [ ] Apenas admins can gerenciar
- [ ] Not can desactiver own ube

### Security

- [ ] Passwords with bcrypt (12 rounds)
- [ ] Rate limiting in login
- [ ] Audit logs
- [ ] Security headers

### Quality

- [ ] Unit tests ≥80%
- [ ] Integration tests for entires endpoints
- [ ] Documentation Swagger withpleta

---

##  Definition of Done of the Épico

- [ ] Todas as tasks completed
- [ ] Zero vulnerabilidades conhecidas
- [ ] Tests passando (≥80% coverage)
- [ ] Code review aprovado
- [ ] Documentation currentizada
- [ ] Deploy in staging funcionando

---

## 📎 References

- [ADR-004: Authentication and Authorization](../architecture/adrs/ADR-004-autenticacto-autorizacto.md)
- [OWASP Authentication Cheatsheet](https://cheatsheetbeies.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

##  Timeline Sugerido

```
Semana 1 (Backend):
├── TASK-002-001: Module Auth (4h)
├── TASK-002-002: Login (4h)
├── TASK-002-003: Refresh Token (3h)
├── TASK-002-004: Logout (2h)
├── TASK-002-005: Password Reset (4h)
├── TASK-002-006: Guards (3h)
└── TASK-002-007: RBAC (6h)

Semana 2 (Backend + Frontend):
├── TASK-002-008: CRUD Ubes (4h)
├── TASK-002-009: Rate Limiting (2h)
├── TASK-002-010: Audit Logs (3h)
├── TASK-002-011: Page Login (4h)
├── TASK-002-012: Recovery Senha (3h)
├── TASK-002-013: Auth Provider (4h)
├── TASK-002-014: Protection Rotas (3h)
├── TASK-002-015: Ube Menu (2h)
├── TASK-002-016: Management Ubes (6h)
└── TASK-002-017: Hook Permissions (2h)
```

**Total estimado:** ~54 hours (~2 weeks)
