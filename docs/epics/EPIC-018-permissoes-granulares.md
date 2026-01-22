# EPIC-018: Permissões Granulares

##  Informações Gerais

| Campo            | Valor                   |
| ---------------- | ----------------------- |
| **ID**           | EPIC-018                |
| **Título**       | Permissões Granulares   |
| **Fase**         | 4 - Refinamento         |
| **Prioridade**   | 🟡 Média                |
| **Estimativa**   | 1 semana                |
| **Dependências** | EPIC-002 (Autenticação) |
| **Status**       | Backlog              |

---

##  Descrição

Expandir o sistema RBAC com:

- Interface para gerenciar permissões
- Criação de perfis customizados
- Permissões por módulo/ação
- Herança de permissões
- Audit trail de mudanças

---

##  Objetivos

1. Flexibilidade total em permissões
2. Perfis customizáveis
3. Gestão visual intuitiva
4. Auditoria completa

---

##  User Stories

### US-018-001: Criar Perfil Customizado

**Como** super admin  
**Quero** criar novos perfis de acesso  
**Para** atender necessidades específicas

**Critérios de Aceite:**

- [ ] Nome e descrição do perfil
- [ ] Seleção de permissões
- [ ] Ativar/desativar perfil

---

### US-018-002: Editar Permissões de Perfil

**Como** super admin  
**Quero** editar permissões de um perfil  
**Para** ajustar acessos

**Critérios de Aceite:**

- [ ] Interface de checkbox por recurso/ação
- [ ] Agrupamento por módulo
- [ ] Salvar alterações
- [ ] Efeito imediato

---

### US-018-003: Atribuir Múltiplos Perfis

**Como** admin  
**Quero** atribuir múltiplos perfis a um usuário  
**Para** combinar permissões

**Critérios de Aceite:**

- [ ] Seleção múltipla
- [ ] Permissões combinadas (união)
- [ ] Visualização do resultado

---

### US-018-004: Visualizar Matriz de Permissões

**Como** admin  
**Quero** ver matriz completa de permissões  
**Para** entender quem pode o quê

**Critérios de Aceite:**

- [ ] Matriz perfil x permissão
- [ ] Exportação
- [ ] Filtros

---

### US-018-005: Histórico de Alterações

**Como** super admin  
**Quero** ver histórico de mudanças em permissões  
**Para** auditoria

**Critérios de Aceite:**

- [ ] Quem alterou
- [ ] O que mudou
- [ ] Quando

---

##  Tasks Técnicas

### Backend

#### TASK-018-001: Expandir Schema de Permissões

**Estimativa:** 2h

- Permissões mais granulares
- Metadata de permissões

---

#### TASK-018-002: CRUD de Perfis

**Estimativa:** 3h

- Criação de perfis customizados
- Validações

---

#### TASK-018-003: API de Gestão de Permissões

**Estimativa:** 3h

- GET /permissions (todas disponíveis)
- PUT /roles/:id/permissions
- GET /users/:id/effective-permissions

---

#### TASK-018-004: Auditoria de Permissões

**Estimativa:** 2h

- Log de todas alterações
- Endpoint de histórico

---

### Frontend

#### TASK-018-005: Página de Gestão de Perfis

**Estimativa:** 5h

- Lista de perfis
- Criar/editar perfil
- Matriz de permissões

---

#### TASK-018-006: Componente de Seleção de Permissões

**Estimativa:** 4h

- Árvore de permissões
- Checkboxes por módulo
- Select all/none

---

#### TASK-018-007: Página de Matriz

**Estimativa:** 3h

- Visualização matricial
- Exportação

---

##  Critérios de Aceite do Épico

- [ ] Perfis customizáveis
- [ ] Interface intuitiva
- [ ] Permissões granulares
- [ ] Auditoria completa
- [ ] Múltiplos perfis por usuário
- [ ] Testes ≥80%

---

##  Timeline Sugerido

**Total estimado:** ~22 horas (~1 semana)
