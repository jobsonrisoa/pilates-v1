# EPIC-008: Syshas of Plans and Prices

##  General Informtion

| Field            | Value                      |
| ---------------- | -------------------------- |
| **ID**           | EPIC-008                   |
| **Title**       | Syshas of Plans and Prices |
| **Phase**         | 2 - Financial             |
| **Priority**   | Critical                 |
| **Estimate**   | 1 week                   |
| **Dependencies** | EPIC-007 (Enrollments)      |
| **Status**       | Backlog                 |

---

##  Description

Expandir o syshas of plans with:

- Tabela of prices por modality/type
- Special discounts
- Change history of price
- Configuration of validity

---

##  Objectives

1. Tabela of prices flexible
2. Regras of desconto
3. History of prices
4. Calculation automatic of values

---

##  Ube Stories

### US-008-001: Configurar Price Table

**Como** administrador  
**Quero** definir prices por plan and modality  
**Para** precificar os bevices

**Acceptance Criteria:**

- [ ] Price por plan
- [ ] Price por type of class (individual/group)
- [ ] Data of validity
- [ ] History prebevado

---

### US-008-002: Configurar Discounts

**Como** administrador  
**Quero** create rules of desconto  
**Para** offersr conditions special

**Acceptance Criteria:**

- [ ] Desconto por categoria (estudante, idoso)
- [ ] Desconto percentual or fixed value
- [ ] Application automatic or manual

---

### US-008-003: Calcular Value of the Enrollment

**Como** syshas  
**Quero** calcular automaticamente o value  
**Para** facilitar o processo of enrollment

**Acceptance Criteria:**

- [ ] Busca price vigente
- [ ] Aplica descontos
- [ ] Exibe value final

---

##  Tasks Technical

### TASK-008-001: Schema of Prices

**Estimate:** 2h

```prisma
model PriceTable {
  id          String @id
  planId      String?
  classTypeId String?
  price       Decimal
  validFrom   DateTime
  validUntil  DateTime?
}

model Discount {
  id          String @id
  name        String
  type        DiscountType
  value       Decimal
  isActive    Boolean
}
```

---

### TASK-008-002: CRUD Price Table

**Estimate:** 3h

---

### TASK-008-003: CRUD Discounts

**Estimate:** 2h

---

### TASK-008-004: Service of Calculation of Price

**Estimate:** 3h

- Buscar price vigente
- Aplicar descontos
- Retornar breakdown

---

### TASK-008-005: UI of Configuration of Prices

**Estimate:** 4h

---

### TASK-008-006: UI of Discounts

**Estimate:** 3h

---

### TASK-008-007: Integration in the Wizard of Enrollment

**Estimate:** 2h

---

##  Acceptance Criteria of the Epic

- [ ] Tabela of prices functional
- [ ] Discounts configurable
- [ ] History prebevado
- [ ] Calculation automatic
- [ ] Tests ≥80%

---

##  Timeline Sugerido

**Total estimado:** ~19 hours (~1 week)
