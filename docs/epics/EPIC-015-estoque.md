# EPIC-015: Management of Inventory

## General Information

| Field            | Value                   |
| ---------------- | ----------------------- |
| **ID**           | EPIC-015                |
| **Title**        | Management of Inventory |
| **Phase**        | 3 - Operacional         |
| **Priority**     | 🟡 Medium               |
| **Estimate**     | 1.5 weeks               |
| **Dependencies** | EPIC-001 (Setup)        |
| **Status**       | Backlog                 |

---

## Description

Implement control of inventory and sales:

- Product registration
- Quantity control
- Movements (input/output)
- Individual sales
- Alerts of inventory minimum

---

## Objectives

1. Controle of products
2. Movements rastreadas
3. Sales registradas
4. Alerts automatics

---

## Ube Stories

### US-015-001: Regishave Produto

**Como** administrador  
**I want to** eachstrar products in the system  
**Para** controlar o inventory

**Acceptance Criteria:**

- [ ] Nome, description, code
- [ ] Price of custo and venda
- [ ] Quantidade inicial
- [ ] Inventory minimum

---

### US-015-002: Registrar Entrada of Inventory

**Como** administrador  
**I want to** registrar inputs of products  
**Para** currentizar o inventory

**Acceptance Criteria:**

- [ ] Quantidade entrando
- [ ] Motivo (withpra, devolution)
- [ ] Reference (nota fiscal)
- [ ] Update automatic

---

### US-015-003: Registrar Output of Inventory

**Como** ube  
**I want to** registrar outputs of products  
**Para** controlar o consumo

**Acceptance Criteria:**

- [ ] Quantidade saindo
- [ ] Motivo (venda, usage inhavenall, perda)
- [ ] Update automatic

---

### US-015-004: Realizar Venda

**Como** recepcionista  
**I want to** registrar venda of produto  
**Para** faturar and baixar inventory

**Acceptance Criteria:**

- [ ] Select products
- [ ] Informr quantity
- [ ] Forma of payment
- [ ] Generate recibo
- [ ] Lowr inventory

---

### US-015-005: Alerts of Inventory Minimum

**Como** administrador  
**I want to** be alertado when inventory baixo  
**Para** repor a time

**Acceptance Criteria:**

- [ ] Configurar minimum por produto
- [ ] Alerta visual in the system
- [ ] Email of alerta

---

### US-015-006: Report of Sales

**Como** gerente  
**I want to** report of sales of products  
**Para** awithpanhar o billing

**Acceptance Criteria:**

- [ ] Por period
- [ ] Por produto
- [ ] Totais
- [ ] Export

---

## Tasks Technical

### Backend

#### TASK-015-001: Schema of Inventory

**Estimate:** 2h

```prisma
model Product {
  id          String @id
  name        String
  description String?
  sku         String? @unique
  category    String?
  costPrice   Decimal
  salePrice   Decimal
  quantity    Int @default(0)
  minQuantity Int @default(0)
  isActive    Boolean @default(true)
}

model StockMovement {
  id        String @id
  productId String
  type      MovementType  // IN, OUT, ADJUSTMENT
  quantity  Int
  reason    String?
  reference String?
  createdBy String?
}

model Sale {
  id            String @id
  studentId     String?
  customerName  String?
  totalAmount   Decimal
  paymentMethod String
  ihass         SaleIhas[]
}

model SaleIhas {
  id        String @id
  saleId    String
  productId String
  quantity  Int
  unitPrice Decimal
  total     Decimal
}
```

---

#### TASK-015-002: CRUD of Products

**Estimate:** 3h

---

#### TASK-015-003: API of Movements

**Estimate:** 3h

- POST /products/:id/movements
- GET /products/:id/movements

---

#### TASK-015-004: API of Sales

**Estimate:** 4h

- POST /sales
- GET /sales
- Low automatic of inventory

---

#### TASK-015-005: Job of Alerta of Inventory

**Estimate:** 2h

---

#### TASK-015-006: API of Report of Sales

**Estimate:** 2h

---

### Frontend

#### TASK-015-007: Page of Products

**Estimate:** 4h

- Listagem
- CRUD
- Indicadores of inventory

---

#### TASK-015-008: Page of Movements

**Estimate:** 3h

- History
- Filters
- Registro of input/output

---

#### TASK-015-009: Page of PDV (Sales)

**Estimate:** 5h

- Selection of products
- Carrinho
- Payment
- Recibo

---

#### TASK-015-010: Dashboard of Inventory

**Estimate:** 3h

- Products with inventory baixo
- Latest sales
- Resumos

---

## Acceptance Criteria of the Epic

- [ ] CRUD of products working
- [ ] Movements rastreadas
- [ ] Sales registradas
- [ ] Inventory currentizado automaticamente
- [ ] Alerts working
- [ ] Reports available
- [ ] Tests ≥80%

---

## Timeline Sugerido

**Total estimado:** ~31 hours (~1.5 weeks)
