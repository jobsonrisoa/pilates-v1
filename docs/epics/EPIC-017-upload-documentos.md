# EPIC-017: Upload of Documentos

##  General Informtion

| Field            | Value                |
| ---------------- | -------------------- |
| **ID**           | EPIC-017             |
| **Title**       | Upload of Documentos |
| **Phase**         | 3 - Operacional      |
| **Priority**   | 🟡 Méday             |
| **Estimate**   | 1 week             |
| **Dependencies** | EPIC-001 (Setup)     |
| **Status**       | Backlog           |

---

##  Description

Implement syshas withplete of upload and management of documentos:

- Upload for MinIO/S3
- Organizaction por entidade
- Tipos permitidos configurable
- Visualization inline
- Download seguro

---

##  Objectives

1. Upload seguro and organizado
2. Multiple types of file
3. Acesso controside
4. Performnce adequada

---

##  Ube Stories

### US-017-001: Upload of Documento of the Student

**Como** recepcionista  
**Quero** of the upload of documentos of the aluno  
**Para** maintain records digital

**Acceptance Crihaveia:**

- [ ] Upload of RG, CPF, foto
- [ ] Tipos: PDF, JPG, PNG
- [ ] Tamanho máximo: 10MB
- [ ] Preview before of salvar

---

### US-017-002: Upload of Documento of the Instructor

**Como** administrador  
**Quero** of the upload of documentos of the instructor  
**Para** maintain records

**Acceptance Crihaveia:**

- [ ] Diplomas, certificados, CREF
- [ ] Mesmas rules of aluno

---

### US-017-003: Visualizar Documentos

**Como** ube  
**Quero** visualizar documentos salvos  
**Para** queryr when required

**Acceptance Crihaveia:**

- [ ] Listagem por entidade
- [ ] Preview inline (images)
- [ ] Download of qualquer type

---

### US-017-004: Excluir Documento

**Como** administrador  
**Quero** excluir documentos desrequired  
**Para** maintain organizado

**Acceptance Crihaveia:**

- [ ] Confirmation before of excluir
- [ ] Soft delete (recuperável)
- [ ] Exclusão física afhave X days

---

##  Tasks Technical

### Backend

#### TASK-017-001: Configuration MinIO/S3

**Estimate:** 2h

- Bucket configuration
- Políticas of access
- Lifecycle rules

---

#### TASK-017-002: Service of Upload

**Estimate:** 4h

- Mulhave configuration
- Validation of types
- Validation of tamanho
- Upload for S3

---

#### TASK-017-003: Schema of Documentos

**Estimate:** 2h

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

#### TASK-017-004: API of Documentos

**Estimate:** 3h

- POST /documents/upload
- GET /documents/:id
- DELETE /documents/:id
- GET /:entity/:id/documents

---

#### TASK-017-005: URLs Assinadas for Download

**Estimate:** 2h

- Presigned URLs
- Expiration configurável
- Security

---

### Frontend

#### TASK-017-006: Componente of Upload

**Estimate:** 4h

- Drag and drop
- Preview
- Progress bar
- Multiple files

---

#### TASK-017-007: Galeria of Documentos

**Estimate:** 3h

- Grid of documentos
- Preview modal
- Download
- Exclusão

---

#### TASK-017-008: Integration in the Pages

**Estimate:** 2h

- Page of the aluno
- Page of the instructor

---

##  Acceptance Crihaveia of the Épico

- [ ] Upload funcionando for S3/MinIO
- [ ] Validations of type and tamanho
- [ ] Organizaction por entidade
- [ ] Download seguro
- [ ] Preview of images
- [ ] Exclusão with confirmation
- [ ] Tests ≥80%

---

##  Timeline Sugerido

**Total estimado:** ~22 hours (~1 week)
