# ADR-003: Estratégia de Banco de Dados

**Status:** Aceito  
**Data:** 21/01/2026  
**Decisores:** Equipe de Arquitetura  
**Contexto do Debate:** [DEBATE-001](../debates/DEBATE-001-arquitetura-geral.md)

## Contexto

O sistema precisa de:

- Persistência relacional para dados estruturados
- Suporte a transações ACID
- Performance adequada para ~1000 alunos/professores
- Conformidade com LGPD
- Backup e recuperação

## Decisão

### MySQL 8.0 como banco principal

**Configuração base:**

```yaml
# docker-compose.yml
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: pilates_db
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./docker/mysql/init:/docker-entrypoint-initdb.d
    command:
      - --default-authentication-plugin=mysql_native_password
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_unicode_ci
      - --innodb-buffer-pool-size=256M
    healthcheck:
      test: ['CMD', 'mysqladmin', 'ping', '-h', 'localhost']
      interval: 10s
      timeout: 5s
      retries: 5
```

### Prisma como ORM

**Schema base:**

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["fullTextSearch", "fullTextIndex"]
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// ============================================
// MÓDULO: AUTH
// ============================================

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String    @map("password_hash")
  isActive      Boolean   @default(true) @map("is_active")
  lastLoginAt   DateTime? @map("last_login_at")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  userRoles     UserRole[]
  auditLogs     AuditLog[]

  @@map("users")
}

model Role {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  createdAt   DateTime @default(now()) @map("created_at")

  userRoles       UserRole[]
  rolePermissions RolePermission[]

  @@map("roles")
}

model Permission {
  id          String   @id @default(uuid())
  resource    String   // ex: "students", "classes"
  action      String   // ex: "create", "read", "update", "delete"
  description String?

  rolePermissions RolePermission[]

  @@unique([resource, action])
  @@map("permissions")
}

model UserRole {
  userId String @map("user_id")
  roleId String @map("role_id")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role Role @relation(fields: [roleId], references: [id], onDelete: Cascade)

  @@id([userId, roleId])
  @@map("user_roles")
}

model RolePermission {
  roleId       String @map("role_id")
  permissionId String @map("permission_id")

  role       Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@id([roleId, permissionId])
  @@map("role_permissions")
}

// ============================================
// MÓDULO: STUDENTS
// ============================================

model Student {
  id                  String    @id @default(uuid())
  fullName            String    @map("full_name")
  cpf                 String    @unique
  rg                  String?
  birthDate           DateTime  @map("birth_date") @db.Date
  phone               String?
  email               String?

  // Endereço
  addressStreet       String?   @map("address_street")
  addressNumber       String?   @map("address_number")
  addressComplement   String?   @map("address_complement")
  addressNeighborhood String?   @map("address_neighborhood")
  addressCity         String?   @map("address_city")
  addressState        String?   @map("address_state") @db.Char(2)
  addressZipCode      String?   @map("address_zip_code")

  // Contato de emergência
  emergencyContactName     String? @map("emergency_contact_name")
  emergencyContactPhone    String? @map("emergency_contact_phone")
  emergencyContactRelation String? @map("emergency_contact_relation")

  // Dados médicos
  healthInsurance     String?   @map("health_insurance")
  healthInsuranceCard String?   @map("health_insurance_card")
  medicalNotes        String?   @map("medical_notes") @db.Text

  status              StudentStatus @default(ACTIVE)
  createdAt           DateTime      @default(now()) @map("created_at")
  updatedAt           DateTime      @updatedAt @map("updated_at")

  exams               StudentExam[]
  enrollments         Enrollment[]
  attendances         Attendance[]

  @@index([fullName])
  @@index([status])
  @@map("students")
}

enum StudentStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

model StudentExam {
  id          String   @id @default(uuid())
  studentId   String   @map("student_id")
  examType    String   @map("exam_type")
  examDate    DateTime @map("exam_date") @db.Date
  results     String?  @db.Text
  notes       String?  @db.Text
  filePath    String?  @map("file_path")
  createdAt   DateTime @default(now()) @map("created_at")

  student Student @relation(fields: [studentId], references: [id], onDelete: Cascade)

  @@index([studentId])
  @@map("student_exams")
}

// ============================================
// MÓDULO: TEACHERS
// ============================================

model Teacher {
  id                String    @id @default(uuid())
  userId            String?   @unique @map("user_id") // Login opcional
  fullName          String    @map("full_name")
  cpf               String    @unique
  rg                String?
  birthDate         DateTime  @map("birth_date") @db.Date
  phone             String?
  email             String?

  // Dados profissionais
  specialties       String?   @db.Text // JSON array
  professionalId    String?   @map("professional_id") // CREF, CREFITO
  professionalIdType String?  @map("professional_id_type")
  hireDate          DateTime? @map("hire_date") @db.Date

  // Dados bancários
  bankName          String?   @map("bank_name")
  bankAgency        String?   @map("bank_agency")
  bankAccount       String?   @map("bank_account")
  bankAccountType   String?   @map("bank_account_type")
  pixKey            String?   @map("pix_key")

  status            TeacherStatus @default(ACTIVE)
  createdAt         DateTime      @default(now()) @map("created_at")
  updatedAt         DateTime      @updatedAt @map("updated_at")

  schedules         Schedule[]
  classes           Class[]
  commissions       TeacherCommission[]

  @@index([fullName])
  @@index([status])
  @@map("teachers")
}

enum TeacherStatus {
  ACTIVE
  INACTIVE
}

// ============================================
// MÓDULO: CLASSES
// ============================================

model Modality {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")

  classTypes  ClassType[]
  plans       Plan[]
  schedules   Schedule[]

  @@map("modalities")
}

model ClassType {
  id             String   @id @default(uuid())
  modalityId     String   @map("modality_id")
  name           String   // Individual, Dupla, Grupo
  maxStudents    Int      @map("max_students")
  durationMinutes Int     @map("duration_minutes")
  isActive       Boolean  @default(true) @map("is_active")

  modality Modality @relation(fields: [modalityId], references: [id])
  schedules Schedule[]
  prices   PriceTable[]

  @@map("class_types")
}

model Schedule {
  id          String   @id @default(uuid())
  modalityId  String   @map("modality_id")
  classTypeId String   @map("class_type_id")
  teacherId   String   @map("teacher_id")
  dayOfWeek   Int      @map("day_of_week") // 0=Dom, 1=Seg, ...
  startTime   String   @map("start_time") @db.VarChar(5) // HH:MM
  endTime     String   @map("end_time") @db.VarChar(5)
  maxStudents Int      @map("max_students")
  isActive    Boolean  @default(true) @map("is_active")

  modality  Modality  @relation(fields: [modalityId], references: [id])
  classType ClassType @relation(fields: [classTypeId], references: [id])
  teacher   Teacher   @relation(fields: [teacherId], references: [id])
  classes   Class[]

  @@index([dayOfWeek, startTime])
  @@map("schedules")
}

model Class {
  id          String      @id @default(uuid())
  scheduleId  String      @map("schedule_id")
  teacherId   String      @map("teacher_id")
  classDate   DateTime    @map("class_date") @db.Date
  startTime   String      @map("start_time") @db.VarChar(5)
  endTime     String      @map("end_time") @db.VarChar(5)
  status      ClassStatus @default(SCHEDULED)
  notes       String?     @db.Text
  createdAt   DateTime    @default(now()) @map("created_at")
  updatedAt   DateTime    @updatedAt @map("updated_at")

  schedule    Schedule     @relation(fields: [scheduleId], references: [id])
  teacher     Teacher      @relation(fields: [teacherId], references: [id])
  attendances Attendance[]

  @@index([classDate])
  @@index([status])
  @@map("classes")
}

enum ClassStatus {
  SCHEDULED
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

model Attendance {
  id           String           @id @default(uuid())
  classId      String           @map("class_id")
  studentId    String           @map("student_id")
  enrollmentId String           @map("enrollment_id")
  status       AttendanceStatus @default(SCHEDULED)
  notes        String?
  createdAt    DateTime         @default(now()) @map("created_at")
  updatedAt    DateTime         @updatedAt @map("updated_at")

  class      Class      @relation(fields: [classId], references: [id])
  student    Student    @relation(fields: [studentId], references: [id])
  enrollment Enrollment @relation(fields: [enrollmentId], references: [id])

  reschedulingFrom Rescheduling[] @relation("OriginalAttendance")
  reschedulingTo   Rescheduling[] @relation("NewAttendance")

  @@unique([classId, studentId])
  @@map("attendances")
}

enum AttendanceStatus {
  SCHEDULED
  PRESENT
  ABSENT_JUSTIFIED
  ABSENT_UNJUSTIFIED
  RESCHEDULED
}

model Rescheduling {
  id                   String   @id @default(uuid())
  originalAttendanceId String   @map("original_attendance_id")
  newAttendanceId      String?  @map("new_attendance_id")
  reason               String?
  expiresAt            DateTime @map("expires_at")
  usedAt               DateTime? @map("used_at")
  createdAt            DateTime @default(now()) @map("created_at")

  originalAttendance Attendance  @relation("OriginalAttendance", fields: [originalAttendanceId], references: [id])
  newAttendance      Attendance? @relation("NewAttendance", fields: [newAttendanceId], references: [id])

  @@map("reschedulings")
}

// ============================================
// MÓDULO: ENROLLMENTS
// ============================================

model Plan {
  id              String   @id @default(uuid())
  modalityId      String   @map("modality_id")
  name            String
  description     String?
  classesPerWeek  Int      @map("classes_per_week") // 0 = avulso
  isActive        Boolean  @default(true) @map("is_active")
  createdAt       DateTime @default(now()) @map("created_at")

  modality    Modality     @relation(fields: [modalityId], references: [id])
  prices      PriceTable[]
  enrollments Enrollment[]

  @@map("plans")
}

model Enrollment {
  id              String           @id @default(uuid())
  studentId       String           @map("student_id")
  planId          String           @map("plan_id")
  startDate       DateTime         @map("start_date") @db.Date
  endDate         DateTime?        @map("end_date") @db.Date
  dueDay          Int              @map("due_day") // Dia de vencimento
  monthlyAmount   Decimal          @map("monthly_amount") @db.Decimal(10, 2)
  status          EnrollmentStatus @default(PENDING_SIGNATURE)
  createdAt       DateTime         @default(now()) @map("created_at")
  updatedAt       DateTime         @updatedAt @map("updated_at")

  student     Student      @relation(fields: [studentId], references: [id])
  plan        Plan         @relation(fields: [planId], references: [id])
  contract    Contract?
  payments    Payment[]
  attendances Attendance[]

  @@index([status])
  @@map("enrollments")
}

enum EnrollmentStatus {
  PENDING_SIGNATURE
  ACTIVE
  SUSPENDED
  CANCELLED
  FINISHED
}

model Contract {
  id            String         @id @default(uuid())
  enrollmentId  String         @unique @map("enrollment_id")
  documentPath  String?        @map("document_path")
  signatureUrl  String?        @map("signature_url")
  signedAt      DateTime?      @map("signed_at")
  signerIp      String?        @map("signer_ip")
  status        ContractStatus @default(DRAFT)
  createdAt     DateTime       @default(now()) @map("created_at")
  updatedAt     DateTime       @updatedAt @map("updated_at")

  enrollment Enrollment @relation(fields: [enrollmentId], references: [id])

  @@map("contracts")
}

enum ContractStatus {
  DRAFT
  SENT
  SIGNED
  CANCELLED
}

// ============================================
// MÓDULO: FINANCIAL
// ============================================

model PriceTable {
  id          String   @id @default(uuid())
  planId      String?  @map("plan_id")
  classTypeId String?  @map("class_type_id")
  price       Decimal  @db.Decimal(10, 2)
  validFrom   DateTime @map("valid_from") @db.Date
  validUntil  DateTime? @map("valid_until") @db.Date
  createdAt   DateTime @default(now()) @map("created_at")

  plan      Plan?      @relation(fields: [planId], references: [id])
  classType ClassType? @relation(fields: [classTypeId], references: [id])

  @@map("price_tables")
}

model Payment {
  id              String        @id @default(uuid())
  enrollmentId    String        @map("enrollment_id")
  amount          Decimal       @db.Decimal(10, 2)
  dueDate         DateTime      @map("due_date") @db.Date
  paidAt          DateTime?     @map("paid_at")
  paidAmount      Decimal?      @map("paid_amount") @db.Decimal(10, 2)
  paymentMethod   String?       @map("payment_method")
  status          PaymentStatus @default(PENDING)

  // Dados bancários
  boletoCode      String?       @map("boleto_code")
  boletoUrl       String?       @map("boleto_url")
  pixCode         String?       @map("pix_code")
  pixQrCode       String?       @map("pix_qr_code")

  createdAt       DateTime      @default(now()) @map("created_at")
  updatedAt       DateTime      @updatedAt @map("updated_at")

  enrollment      Enrollment    @relation(fields: [enrollmentId], references: [id])
  transactions    BankTransaction[]

  @@index([dueDate])
  @@index([status])
  @@map("payments")
}

enum PaymentStatus {
  PENDING
  PAID
  OVERDUE
  CANCELLED
}

model BankTransaction {
  id              String   @id @default(uuid())
  paymentId       String   @map("payment_id")
  externalId      String?  @map("external_id")
  type            String   // BOLETO, PIX
  amount          Decimal  @db.Decimal(10, 2)
  status          String
  webhookPayload  Json?    @map("webhook_payload")
  createdAt       DateTime @default(now()) @map("created_at")

  payment Payment @relation(fields: [paymentId], references: [id])

  @@index([externalId])
  @@map("bank_transactions")
}

model TeacherCommission {
  id          String   @id @default(uuid())
  teacherId   String   @map("teacher_id")
  modalityId  String?  @map("modality_id")
  classType   String?  @map("class_type") // Individual, Grupo
  valueType   String   @map("value_type") // PERCENTAGE, FIXED
  value       Decimal  @db.Decimal(10, 2)
  validFrom   DateTime @map("valid_from") @db.Date
  validUntil  DateTime? @map("valid_until") @db.Date

  teacher Teacher @relation(fields: [teacherId], references: [id])

  @@map("teacher_commissions")
}

// ============================================
// MÓDULO: INVENTORY
// ============================================

model Product {
  id           String   @id @default(uuid())
  name         String
  description  String?
  sku          String?  @unique
  category     String?
  costPrice    Decimal  @map("cost_price") @db.Decimal(10, 2)
  salePrice    Decimal  @map("sale_price") @db.Decimal(10, 2)
  quantity     Int      @default(0)
  minQuantity  Int      @default(0) @map("min_quantity")
  isActive     Boolean  @default(true) @map("is_active")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  movements StockMovement[]
  saleItems SaleItem[]

  @@index([name])
  @@map("products")
}

model StockMovement {
  id          String   @id @default(uuid())
  productId   String   @map("product_id")
  type        String   // IN, OUT, ADJUSTMENT
  quantity    Int
  reason      String?
  reference   String?  // Nota fiscal, venda, etc
  createdAt   DateTime @default(now()) @map("created_at")
  createdBy   String?  @map("created_by")

  product Product @relation(fields: [productId], references: [id])

  @@map("stock_movements")
}

model Sale {
  id            String   @id @default(uuid())
  studentId     String?  @map("student_id")
  customerName  String?  @map("customer_name")
  totalAmount   Decimal  @map("total_amount") @db.Decimal(10, 2)
  paymentMethod String   @map("payment_method")
  notes         String?
  createdAt     DateTime @default(now()) @map("created_at")
  createdBy     String?  @map("created_by")

  items SaleItem[]

  @@map("sales")
}

model SaleItem {
  id        String  @id @default(uuid())
  saleId    String  @map("sale_id")
  productId String  @map("product_id")
  quantity  Int
  unitPrice Decimal @map("unit_price") @db.Decimal(10, 2)
  total     Decimal @db.Decimal(10, 2)

  sale    Sale    @relation(fields: [saleId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id])

  @@map("sale_items")
}

// ============================================
// MÓDULO: AUDIT
// ============================================

model AuditLog {
  id         String   @id @default(uuid())
  userId     String?  @map("user_id")
  action     String   // CREATE, UPDATE, DELETE, LOGIN, etc
  resource   String   // Nome da entidade
  resourceId String?  @map("resource_id")
  oldData    Json?    @map("old_data")
  newData    Json?    @map("new_data")
  ipAddress  String?  @map("ip_address")
  userAgent  String?  @map("user_agent")
  createdAt  DateTime @default(now()) @map("created_at")

  user User? @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([resource, resourceId])
  @@index([createdAt])
  @@map("audit_logs")
}
```

## Estratégia de Migrations

```bash
# Desenvolvimento
pnpm prisma migrate dev --name add_new_feature

# Produção
pnpm prisma migrate deploy

# Reset (apenas dev)
pnpm prisma migrate reset
```

## Índices e Performance

Índices já definidos no schema para:

- Campos de busca frequente (nome, cpf, email)
- Chaves estrangeiras
- Campos de filtro (status, datas)
- Full-text search onde necessário

## Backup Strategy

```yaml
# Backup diário via cron
backup:
  schedule: "0 3 * * *"  # 3h da manhã
  retention: 30 days
  destination: S3/MinIO

# Script de backup
mysqldump -u $DB_USER -p$DB_PASSWORD \
  --single-transaction \
  --routines \
  --triggers \
  pilates_db | gzip > backup_$(date +%Y%m%d).sql.gz
```

## Consequências

### Positivas

- ✅ Schema type-safe com Prisma
- ✅ Migrations versionadas
- ✅ Modelo de dados normalizado
- ✅ Suporte completo a LGPD (audit logs)
- ✅ Performance otimizada com índices

### Negativas

- ⚠️ Prisma tem overhead em queries muito complexas
- ⚠️ Schema grande para manter

## Conformidade LGPD

- Audit logs para todas operações sensíveis
- Campos de dados pessoais identificados
- Possibilidade de anonimização/exclusão
- Exportação de dados do usuário
