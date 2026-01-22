# EPIC-002: Autenticação e Autorização

## 📋 Informações Gerais

| Campo            | Valor                      |
| ---------------- | -------------------------- |
| **ID**           | EPIC-002                   |
| **Título**       | Autenticação e Autorização |
| **Fase**         | 1 - MVP                    |
| **Prioridade**   | 🔴 Crítica                 |
| **Estimativa**   | 2 semanas                  |
| **Dependências** | EPIC-001 (Setup Ambiente)  |
| **Status**       | 📋 Backlog                 |

---

## 📝 Descrição

Implementar sistema completo de autenticação e autorização incluindo:

- Login com email/senha
- JWT com refresh tokens
- Sistema RBAC (Role-Based Access Control)
- Perfis pré-definidos (Super Admin, Admin, Gerente, Recepção, Professor, Financeiro)
- Recuperação de senha
- Logs de auditoria de acesso

---

## 🎯 Objetivos

1. Autenticação segura com JWT e refresh tokens
2. Sistema de permissões granulares por perfil
3. Interface de login funcional
4. Proteção de rotas no frontend e backend
5. Logs de auditoria para conformidade LGPD

---

## 👤 User Stories

### US-002-001: Login de Usuário

**Como** usuário do sistema  
**Quero** fazer login com email e senha  
**Para** acessar as funcionalidades do sistema

**Critérios de Aceite:**

- [ ] Formulário de login funcional
- [ ] Validação de campos
- [ ] Mensagens de erro claras
- [ ] Redirecionamento após login
- [ ] Token armazenado de forma segura

---

### US-002-002: Refresh Token

**Como** usuário logado  
**Quero** que minha sessão seja renovada automaticamente  
**Para** não precisar fazer login frequentemente

**Critérios de Aceite:**

- [ ] Access token com expiração curta (15min)
- [ ] Refresh token em cookie httpOnly (7 dias)
- [ ] Renovação automática transparente
- [ ] Logout invalida refresh token

---

### US-002-003: Recuperação de Senha

**Como** usuário  
**Quero** recuperar minha senha via email  
**Para** acessar o sistema caso esqueça

**Critérios de Aceite:**

- [ ] Solicitar reset via email
- [ ] Email com link único e temporário
- [ ] Formulário para nova senha
- [ ] Validação de força de senha

---

### US-002-004: Controle de Acesso por Perfil

**Como** administrador  
**Quero** que cada usuário tenha permissões específicas  
**Para** controlar o que cada um pode acessar

**Critérios de Aceite:**

- [ ] 6 perfis pré-definidos
- [ ] Permissões por recurso e ação
- [ ] Verificação no backend
- [ ] UI adapta-se às permissões

---

### US-002-005: Gestão de Usuários

**Como** administrador  
**Quero** criar, editar e desativar usuários  
**Para** gerenciar quem acessa o sistema

**Critérios de Aceite:**

- [ ] CRUD de usuários
- [ ] Atribuição de perfil
- [ ] Ativação/desativação
- [ ] Listagem com filtros

---

### US-002-006: Logs de Acesso

**Como** administrador  
**Quero** visualizar histórico de acessos  
**Para** auditoria e segurança

**Critérios de Aceite:**

- [ ] Registro de login/logout
- [ ] IP e user agent registrados
- [ ] Listagem com filtros
- [ ] Exportação de dados

---

## 🔧 Tasks Técnicas

### Backend

#### TASK-002-001: Módulo de Auth no NestJS

**Estimativa:** 4h

**Escopo:**

- Criar módulo `auth` com estrutura DDD
- Entidades: User, Role, Permission
- Value Objects: Email, Password
- Serviços: AuthService, PasswordService

**Definition of Done:**

- [ ] Estrutura de módulo criada
- [ ] Entidades com validação
- [ ] Testes unitários (≥80%)

---

#### TASK-002-002: Implementar Login

**Estimativa:** 4h

**Escopo:**

- POST /auth/login
- Validação de credenciais
- Geração de JWT
- Geração de refresh token
- Cookie httpOnly para refresh

**Definition of Done:**

- [ ] Endpoint funcionando
- [ ] Tokens gerados corretamente
- [ ] Testes de integração
- [ ] Documentação Swagger

---

#### TASK-002-003: Implementar Refresh Token

**Estimativa:** 3h

**Escopo:**

- POST /auth/refresh
- Validação do refresh token
- Rotation de tokens
- Invalidação do token antigo

**Definition of Done:**

- [ ] Endpoint funcionando
- [ ] Token rotation implementado
- [ ] Testes de integração

---

#### TASK-002-004: Implementar Logout

**Estimativa:** 2h

**Escopo:**

- POST /auth/logout
- Invalidar refresh token
- Limpar cookie

**Definition of Done:**

- [ ] Endpoint funcionando
- [ ] Token invalidado no Redis
- [ ] Cookie limpo

---

#### TASK-002-005: Implementar Password Reset

**Estimativa:** 4h

**Escopo:**

- POST /auth/forgot-password
- POST /auth/reset-password
- Token de reset temporário
- Envio de email

**Definition of Done:**

- [ ] Endpoints funcionando
- [ ] Email enviado (MailHog em dev)
- [ ] Token expira em 1h
- [ ] Testes de integração

---

#### TASK-002-006: Guards de Autenticação

**Estimativa:** 3h

**Escopo:**

- JwtAuthGuard
- RefreshTokenGuard
- Extração de user do token

**Definition of Done:**

- [ ] Guards implementados
- [ ] Decorators customizados
- [ ] Testes unitários

---

#### TASK-002-007: Sistema RBAC

**Estimativa:** 6h

**Escopo:**

- Schema Prisma: roles, permissions, user_roles
- PermissionsGuard
- @RequirePermissions decorator
- Seed de perfis padrão

**Permissões:**

```typescript
const PERMISSIONS = {
  STUDENTS_CREATE: 'students:create',
  STUDENTS_READ: 'students:read',
  STUDENTS_UPDATE: 'students:update',
  STUDENTS_DELETE: 'students:delete',
  // ... mais permissões
};
```

**Definition of Done:**

- [ ] Schema de permissões no Prisma
- [ ] Guard de permissões
- [ ] 6 perfis no seed
- [ ] Testes unitários

---

#### TASK-002-008: CRUD de Usuários

**Estimativa:** 4h

**Escopo:**

- GET /users (listagem paginada)
- GET /users/:id
- POST /users
- PUT /users/:id
- DELETE /users/:id (soft delete)

**Definition of Done:**

- [ ] Endpoints funcionando
- [ ] Validação de permissões
- [ ] Testes de integração
- [ ] Documentação Swagger

---

#### TASK-002-009: Rate Limiting

**Estimativa:** 2h

**Escopo:**

- ThrottlerModule configurado
- Rate limit em /auth/login (5/min)
- Rate limit global

**Definition of Done:**

- [ ] Throttler configurado
- [ ] Limites por endpoint
- [ ] Testes

---

#### TASK-002-010: Audit Logs

**Estimativa:** 3h

**Escopo:**

- Schema: audit_logs
- AuditInterceptor
- Registro de login/logout
- GET /audit-logs (admin)

**Definition of Done:**

- [ ] Logs registrados no banco
- [ ] IP e user agent capturados
- [ ] Endpoint de consulta
- [ ] Testes

---

### Frontend

#### TASK-002-011: Página de Login

**Estimativa:** 4h

**Escopo:**

- Formulário de login
- Validação com Zod
- Integração com API
- Mensagens de erro
- Loading states

**Definition of Done:**

- [ ] UI implementada
- [ ] Validação funcionando
- [ ] Integração com backend
- [ ] Testes com Testing Library

---

#### TASK-002-012: Página de Recuperação de Senha

**Estimativa:** 3h

**Escopo:**

- Formulário de solicitação
- Formulário de nova senha
- Validação

**Definition of Done:**

- [ ] UI implementada
- [ ] Fluxo completo funcionando
- [ ] Testes

---

#### TASK-002-013: Auth Provider e Hooks

**Estimativa:** 4h

**Escopo:**

- AuthContext
- useAuth hook
- Interceptor para refresh automático
- Storage de tokens

**Definition of Done:**

- [ ] Context implementado
- [ ] Refresh automático
- [ ] Testes

---

#### TASK-002-014: Proteção de Rotas

**Estimativa:** 3h

**Escopo:**

- Middleware de autenticação (Next.js)
- Redirect para login
- Loading states

**Definition of Done:**

- [ ] Rotas protegidas
- [ ] Redirect funcionando
- [ ] Testes

---

#### TASK-002-015: Componente de User Menu

**Estimativa:** 2h

**Escopo:**

- Avatar e nome do usuário
- Dropdown com opções
- Logout
- Link para perfil

**Definition of Done:**

- [ ] Componente implementado
- [ ] Logout funcionando
- [ ] Testes

---

#### TASK-002-016: Página de Gestão de Usuários

**Estimativa:** 6h

**Escopo:**

- Listagem com DataTable
- Filtros e busca
- Modal de criar/editar
- Ativação/desativação

**Definition of Done:**

- [ ] UI implementada
- [ ] CRUD funcionando
- [ ] Permissões verificadas
- [ ] Testes

---

#### TASK-002-017: Hook de Permissões

**Estimativa:** 2h

**Escopo:**

- usePermissions hook
- Componente CanAccess
- Ocultar elementos sem permissão

**Definition of Done:**

- [ ] Hook implementado
- [ ] Componente wrapper
- [ ] Testes

---

## ✅ Critérios de Aceite do Épico

### Autenticação

- [ ] Login funcional com email/senha
- [ ] JWT com expiração de 15min
- [ ] Refresh token em cookie httpOnly
- [ ] Refresh automático transparente
- [ ] Logout invalida sessão

### Recuperação de Senha

- [ ] Email enviado com link de reset
- [ ] Token expira em 1h
- [ ] Senha deve ter 8+ caracteres, maiúscula, minúscula, número, especial

### RBAC

- [ ] 6 perfis pré-definidos funcionando
- [ ] Permissões verificadas no backend
- [ ] UI adapta-se às permissões
- [ ] Super Admin tem acesso total

### Gestão de Usuários

- [ ] CRUD completo
- [ ] Apenas admins podem gerenciar
- [ ] Não pode desativar próprio usuário

### Segurança

- [ ] Senhas com bcrypt (12 rounds)
- [ ] Rate limiting em login
- [ ] Logs de auditoria
- [ ] Headers de segurança

### Qualidade

- [ ] Testes unitários ≥80%
- [ ] Testes de integração para todos endpoints
- [ ] Documentação Swagger completa

---

## 📊 Definition of Done do Épico

- [ ] Todas as tasks concluídas
- [ ] Zero vulnerabilidades conhecidas
- [ ] Testes passando (≥80% coverage)
- [ ] Code review aprovado
- [ ] Documentação atualizada
- [ ] Deploy em staging funcionando

---

## 📎 Referências

- [ADR-004: Autenticação e Autorização](../architecture/adrs/ADR-004-autenticacao-autorizacao.md)
- [OWASP Authentication Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

## 📅 Timeline Sugerido

```
Semana 1 (Backend):
├── TASK-002-001: Módulo Auth (4h)
├── TASK-002-002: Login (4h)
├── TASK-002-003: Refresh Token (3h)
├── TASK-002-004: Logout (2h)
├── TASK-002-005: Password Reset (4h)
├── TASK-002-006: Guards (3h)
└── TASK-002-007: RBAC (6h)

Semana 2 (Backend + Frontend):
├── TASK-002-008: CRUD Usuários (4h)
├── TASK-002-009: Rate Limiting (2h)
├── TASK-002-010: Audit Logs (3h)
├── TASK-002-011: Página Login (4h)
├── TASK-002-012: Recuperação Senha (3h)
├── TASK-002-013: Auth Provider (4h)
├── TASK-002-014: Proteção Rotas (3h)
├── TASK-002-015: User Menu (2h)
├── TASK-002-016: Gestão Usuários (6h)
└── TASK-002-017: Hook Permissões (2h)
```

**Total estimado:** ~54 horas (~2 semanas)
