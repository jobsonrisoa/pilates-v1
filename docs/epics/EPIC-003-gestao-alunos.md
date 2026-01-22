# EPIC-003: Gestão de Alunos

## 📋 Informações Gerais

| Campo            | Valor                   |
| ---------------- | ----------------------- |
| **ID**           | EPIC-003                |
| **Título**       | Gestão de Alunos        |
| **Fase**         | 1 - MVP                 |
| **Prioridade**   | 🔴 Crítica              |
| **Estimativa**   | 1.5 semanas             |
| **Dependências** | EPIC-002 (Autenticação) |
| **Status**       | 📋 Backlog              |

---

## 📝 Descrição

Implementar módulo completo de gestão de alunos incluindo:

- Cadastro com dados pessoais, contato e emergência
- Dados médicos e observações
- Histórico de exames
- Busca e filtros avançados
- Exportação de dados (LGPD)

---

## 🎯 Objetivos

1. CRUD completo de alunos com validações
2. Interface intuitiva de cadastro e edição
3. Busca rápida e filtros avançados
4. Conformidade com LGPD (exportação/exclusão)
5. Histórico de exames vinculado

---

## 👤 User Stories

### US-003-001: Cadastrar Aluno

**Como** recepcionista  
**Quero** cadastrar um novo aluno no sistema  
**Para** que ele possa ser matriculado em aulas

**Critérios de Aceite:**

- [ ] Formulário com todos os campos necessários
- [ ] Validação de CPF único
- [ ] Campos obrigatórios: nome, CPF, data nascimento
- [ ] Contato de emergência obrigatório
- [ ] Salvamento com feedback de sucesso

---

### US-003-002: Listar Alunos

**Como** usuário do sistema  
**Quero** ver a lista de alunos cadastrados  
**Para** encontrar rapidamente quem preciso

**Critérios de Aceite:**

- [ ] Listagem paginada
- [ ] Busca por nome, CPF, email
- [ ] Filtros por status (ativo, inativo, suspenso)
- [ ] Ordenação por nome, data cadastro
- [ ] Informações resumidas visíveis

---

### US-003-003: Editar Aluno

**Como** recepcionista  
**Quero** editar dados de um aluno  
**Para** manter as informações atualizadas

**Critérios de Aceite:**

- [ ] Todos os campos editáveis
- [ ] Validações mantidas
- [ ] Histórico de alterações (audit)
- [ ] Não permite alterar CPF

---

### US-003-004: Visualizar Detalhes do Aluno

**Como** usuário do sistema  
**Quero** ver todos os dados de um aluno  
**Para** ter visão completa do cadastro

**Critérios de Aceite:**

- [ ] Página de detalhes completa
- [ ] Abas: Dados, Exames, Matrículas, Histórico
- [ ] Ações rápidas (editar, matricular)

---

### US-003-005: Gerenciar Status do Aluno

**Como** gerente  
**Quero** ativar, inativar ou suspender alunos  
**Para** controlar quem está ativo no sistema

**Critérios de Aceite:**

- [ ] Botões de ação para mudar status
- [ ] Confirmação antes de alterar
- [ ] Motivo obrigatório para suspensão
- [ ] Histórico de mudanças

---

### US-003-006: Cadastrar Exames do Aluno

**Como** professor ou recepcionista  
**Quero** registrar exames e avaliações do aluno  
**Para** manter histórico médico/físico

**Critérios de Aceite:**

- [ ] Tipos: avaliação física, anamnese, exame médico
- [ ] Data e observações
- [ ] Upload de arquivos (PDF, imagens)
- [ ] Listagem histórica

---

### US-003-007: Exportar Dados do Aluno (LGPD)

**Como** aluno  
**Quero** exportar todos os meus dados  
**Para** exercer meu direito pela LGPD

**Critérios de Aceite:**

- [ ] Botão de exportar dados
- [ ] Gera arquivo com todos os dados
- [ ] Formato legível (PDF ou JSON)

---

## 🔧 Tasks Técnicas

### Backend

#### TASK-003-001: Módulo Students no NestJS

**Estimativa:** 3h

**Escopo:**

- Estrutura DDD do módulo
- Entidade Student
- Value Objects: CPF, Email, Phone
- Repository interface

**Definition of Done:**

- [ ] Estrutura criada
- [ ] Entidades com validação
- [ ] Testes unitários

---

#### TASK-003-002: Schema Prisma de Alunos

**Estimativa:** 2h

**Escopo:**

- Model Student
- Model StudentExam
- Índices de busca
- Migration

**Definition of Done:**

- [ ] Schema criado
- [ ] Migration aplicada
- [ ] Índices otimizados

---

#### TASK-003-003: CRUD de Alunos (API)

**Estimativa:** 4h

**Escopo:**

- GET /students (listagem paginada)
- GET /students/:id
- POST /students
- PUT /students/:id
- DELETE /students/:id (soft delete)

**Definition of Done:**

- [ ] Endpoints funcionando
- [ ] Validações implementadas
- [ ] Permissões verificadas
- [ ] Testes de integração
- [ ] Documentação Swagger

---

#### TASK-003-004: Busca e Filtros

**Estimativa:** 3h

**Escopo:**

- Busca por nome (LIKE)
- Busca por CPF (exato)
- Filtro por status
- Ordenação
- Paginação

**Definition of Done:**

- [ ] Query params implementados
- [ ] Performance otimizada
- [ ] Testes

---

#### TASK-003-005: CRUD de Exames

**Estimativa:** 3h

**Escopo:**

- GET /students/:id/exams
- POST /students/:id/exams
- PUT /exams/:id
- DELETE /exams/:id

**Definition of Done:**

- [ ] Endpoints funcionando
- [ ] Validações
- [ ] Testes

---

#### TASK-003-006: Upload de Arquivos de Exames

**Estimativa:** 3h

**Escopo:**

- POST /exams/:id/files
- Integração com MinIO/S3
- Validação de tipos (PDF, JPG, PNG)
- Limite de tamanho

**Definition of Done:**

- [ ] Upload funcionando
- [ ] Arquivos salvos no storage
- [ ] URL de acesso gerada
- [ ] Testes

---

#### TASK-003-007: Exportação de Dados (LGPD)

**Estimativa:** 2h

**Escopo:**

- GET /students/:id/export
- Coleta todos os dados do aluno
- Gera PDF ou JSON

**Definition of Done:**

- [ ] Endpoint funcionando
- [ ] Todos os dados incluídos
- [ ] Formato legível

---

### Frontend

#### TASK-003-008: Listagem de Alunos

**Estimativa:** 4h

**Escopo:**

- DataTable com shadcn
- Colunas: nome, CPF, email, status, ações
- Busca e filtros
- Paginação

**Definition of Done:**

- [ ] UI implementada
- [ ] Integração com API
- [ ] Responsivo
- [ ] Testes

---

#### TASK-003-009: Formulário de Cadastro/Edição

**Estimativa:** 5h

**Escopo:**

- Formulário multi-step ou abas
- Dados pessoais
- Contato
- Emergência
- Dados médicos
- Validação com Zod

**Definition of Done:**

- [ ] Formulário completo
- [ ] Validações funcionando
- [ ] Máscara de CPF, telefone
- [ ] Testes

---

#### TASK-003-010: Página de Detalhes do Aluno

**Estimativa:** 4h

**Escopo:**

- Layout com abas
- Aba: Dados gerais
- Aba: Exames
- Aba: Matrículas (placeholder)
- Aba: Histórico

**Definition of Done:**

- [ ] UI implementada
- [ ] Navegação entre abas
- [ ] Ações funcionando
- [ ] Testes

---

#### TASK-003-011: Modal de Exames

**Estimativa:** 3h

**Escopo:**

- Modal para cadastrar exame
- Campos: tipo, data, observações
- Upload de arquivo
- Listagem de exames existentes

**Definition of Done:**

- [ ] Modal implementado
- [ ] Upload funcionando
- [ ] Testes

---

#### TASK-003-012: Hooks e Services

**Estimativa:** 2h

**Escopo:**

- useStudents hook
- useStudent hook
- useCreateStudent mutation
- useUpdateStudent mutation

**Definition of Done:**

- [ ] Hooks implementados
- [ ] Cache configurado
- [ ] Testes

---

## ✅ Critérios de Aceite do Épico

### Cadastro

- [ ] Formulário com todos os campos
- [ ] CPF único validado
- [ ] Campos obrigatórios enforçados
- [ ] Máscaras de input funcionando

### Listagem

- [ ] Paginação funcionando
- [ ] Busca por nome/CPF/email
- [ ] Filtros por status
- [ ] Performance adequada (< 500ms)

### Detalhes

- [ ] Todas as informações visíveis
- [ ] Abas organizadas
- [ ] Ações de edição acessíveis

### Exames

- [ ] CRUD de exames funcionando
- [ ] Upload de arquivos até 10MB
- [ ] Visualização de arquivos

### LGPD

- [ ] Exportação de dados funcional
- [ ] Soft delete implementado

### Qualidade

- [ ] Testes unitários ≥80%
- [ ] Testes de integração
- [ ] Documentação Swagger

---

## 📊 Definition of Done do Épico

- [ ] Todas as tasks concluídas
- [ ] Testes passando (≥80% coverage)
- [ ] Code review aprovado
- [ ] Documentação atualizada
- [ ] Deploy em staging

---

## 📎 Referências

- [ADR-003: Banco de Dados](../architecture/adrs/ADR-003-banco-de-dados.md)
- [PRD - Seção 5.2](../PRD.md#52-gestão-de-alunos)

---

## 📅 Timeline Sugerido

```
Semana 1:
├── TASK-003-001: Módulo Students (3h)
├── TASK-003-002: Schema Prisma (2h)
├── TASK-003-003: CRUD API (4h)
├── TASK-003-004: Busca/Filtros (3h)
├── TASK-003-005: CRUD Exames (3h)
├── TASK-003-006: Upload Arquivos (3h)
├── TASK-003-007: Exportação LGPD (2h)
├── TASK-003-008: Listagem UI (4h)
├── TASK-003-009: Formulário (5h)
├── TASK-003-010: Página Detalhes (4h)
├── TASK-003-011: Modal Exames (3h)
└── TASK-003-012: Hooks (2h)
```

**Total estimado:** ~38 horas (~1.5 semanas)
