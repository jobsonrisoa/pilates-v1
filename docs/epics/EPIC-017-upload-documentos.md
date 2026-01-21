# EPIC-017: Upload de Documentos

## 📋 Informações Gerais

| Campo | Valor |
|-------|-------|
| **ID** | EPIC-017 |
| **Título** | Upload de Documentos |
| **Fase** | 3 - Operacional |
| **Prioridade** | 🟡 Média |
| **Estimativa** | 1 semana |
| **Dependências** | EPIC-001 (Setup) |
| **Status** | 📋 Backlog |

---

## 📝 Descrição

Implementar sistema completo de upload e gestão de documentos:
- Upload para MinIO/S3
- Organização por entidade
- Tipos permitidos configuráveis
- Visualização inline
- Download seguro

---

## 🎯 Objetivos

1. Upload seguro e organizado
2. Múltiplos tipos de arquivo
3. Acesso controlado
4. Performance adequada

---

## 👤 User Stories

### US-017-001: Upload de Documento do Aluno
**Como** recepcionista  
**Quero** fazer upload de documentos do aluno  
**Para** manter registros digitais

**Critérios de Aceite:**
- [ ] Upload de RG, CPF, foto
- [ ] Tipos: PDF, JPG, PNG
- [ ] Tamanho máximo: 10MB
- [ ] Preview antes de salvar

---

### US-017-002: Upload de Documento do Professor
**Como** administrador  
**Quero** fazer upload de documentos do professor  
**Para** manter registros

**Critérios de Aceite:**
- [ ] Diplomas, certificados, CREF
- [ ] Mesmas regras de aluno

---

### US-017-003: Visualizar Documentos
**Como** usuário  
**Quero** visualizar documentos salvos  
**Para** consultar quando necessário

**Critérios de Aceite:**
- [ ] Listagem por entidade
- [ ] Preview inline (imagens)
- [ ] Download de qualquer tipo

---

### US-017-004: Excluir Documento
**Como** administrador  
**Quero** excluir documentos desnecessários  
**Para** manter organizado

**Critérios de Aceite:**
- [ ] Confirmação antes de excluir
- [ ] Soft delete (recuperável)
- [ ] Exclusão física após X dias

---

## 🔧 Tasks Técnicas

### Backend

#### TASK-017-001: Configuração MinIO/S3
**Estimativa:** 2h

- Bucket configuration
- Políticas de acesso
- Lifecycle rules

---

#### TASK-017-002: Serviço de Upload
**Estimativa:** 4h

- Multer configuration
- Validação de tipos
- Validação de tamanho
- Upload para S3

---

#### TASK-017-003: Schema de Documentos
**Estimativa:** 2h

```prisma
model Document {
  id          String @id
  entityType  String    // STUDENT, TEACHER
  entityId    String
  type        String    // RG, CPF, DIPLOMA
  filename    String
  mimeType    String
  size        Int
  path        String
  uploadedBy  String
  createdAt   DateTime
  deletedAt   DateTime?
}
```

---

#### TASK-017-004: API de Documentos
**Estimativa:** 3h

- POST /documents/upload
- GET /documents/:id
- DELETE /documents/:id
- GET /:entity/:id/documents

---

#### TASK-017-005: URLs Assinadas para Download
**Estimativa:** 2h

- Presigned URLs
- Expiração configurável
- Segurança

---

### Frontend

#### TASK-017-006: Componente de Upload
**Estimativa:** 4h

- Drag and drop
- Preview
- Progress bar
- Múltiplos arquivos

---

#### TASK-017-007: Galeria de Documentos
**Estimativa:** 3h

- Grid de documentos
- Preview modal
- Download
- Exclusão

---

#### TASK-017-008: Integração nas Páginas
**Estimativa:** 2h

- Página do aluno
- Página do professor

---

## ✅ Critérios de Aceite do Épico

- [ ] Upload funcionando para S3/MinIO
- [ ] Validações de tipo e tamanho
- [ ] Organização por entidade
- [ ] Download seguro
- [ ] Preview de imagens
- [ ] Exclusão com confirmação
- [ ] Testes ≥80%

---

## 📅 Timeline Sugerido

**Total estimado:** ~22 horas (~1 semana)

