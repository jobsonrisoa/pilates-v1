# EPIC-015: Gestão de Estoque

##  Informações Gerais

| Campo            | Valor             |
| ---------------- | ----------------- |
| **ID**           | EPIC-015          |
| **Título**       | Gestão de Estoque |
| **Fase**         | 3 - Operacional   |
| **Prioridade**   | 🟡 Média          |
| **Estimativa**   | 1.5 semanas       |
| **Dependências** | EPIC-001 (Setup)  |
| **Status**       | Backlog        |

---

##  Descrição

Implementar controle de estoque e vendas:

- Cadastro de produtos
- Controle de quantidade
- Movimentações (entrada/saída)
- Vendas avulsas
- Alertas de estoque mínimo

---

##  Objetivos

1. Controle de produtos
2. Movimentações rastreadas
3. Vendas registradas
4. Alertas automáticos

---

##  User Stories

### US-015-001: Cadastrar Produto

**Como** administrador  
**Quero** cadastrar produtos no sistema  
**Para** controlar o estoque

**Critérios de Aceite:**

- [ ] Nome, descrição, código
- [ ] Preço de custo e venda
- [ ] Quantidade inicial
- [ ] Estoque mínimo

---

### US-015-002: Registrar Entrada de Estoque

**Como** administrador  
**Quero** registrar entradas de produtos  
**Para** atualizar o estoque

**Critérios de Aceite:**

- [ ] Quantidade entrando
- [ ] Motivo (compra, devolução)
- [ ] Referência (nota fiscal)
- [ ] Atualização automática

---

### US-015-003: Registrar Saída de Estoque

**Como** usuário  
**Quero** registrar saídas de produtos  
**Para** controlar o consumo

**Critérios de Aceite:**

- [ ] Quantidade saindo
- [ ] Motivo (venda, uso interno, perda)
- [ ] Atualização automática

---

### US-015-004: Realizar Venda

**Como** recepcionista  
**Quero** registrar venda de produto  
**Para** faturar e baixar estoque

**Critérios de Aceite:**

- [ ] Selecionar produtos
- [ ] Informar quantidade
- [ ] Forma de pagamento
- [ ] Gerar recibo
- [ ] Baixar estoque

---

### US-015-005: Alertas de Estoque Mínimo

**Como** administrador  
**Quero** ser alertado quando estoque baixo  
**Para** repor a tempo

**Critérios de Aceite:**

- [ ] Configurar mínimo por produto
- [ ] Alerta visual no sistema
- [ ] Email de alerta

---

### US-015-006: Relatório de Vendas

**Como** gerente  
**Quero** relatório de vendas de produtos  
**Para** acompanhar o faturamento

**Critérios de Aceite:**

- [ ] Por período
- [ ] Por produto
- [ ] Totais
- [ ] Exportação

---

##  Tasks Técnicas

### Backend

#### TASK-015-001: Schema de Estoque

**Estimativa:** 2h

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
  items         SaleItem[]
}

model SaleItem {
  id        String @id
  saleId    String
  productId String
  quantity  Int
  unitPrice Decimal
  total     Decimal
}
```

---

#### TASK-015-002: CRUD de Produtos

**Estimativa:** 3h

---

#### TASK-015-003: API de Movimentações

**Estimativa:** 3h

- POST /products/:id/movements
- GET /products/:id/movements

---

#### TASK-015-004: API de Vendas

**Estimativa:** 4h

- POST /sales
- GET /sales
- Baixa automática de estoque

---

#### TASK-015-005: Job de Alerta de Estoque

**Estimativa:** 2h

---

#### TASK-015-006: API de Relatório de Vendas

**Estimativa:** 2h

---

### Frontend

#### TASK-015-007: Página de Produtos

**Estimativa:** 4h

- Listagem
- CRUD
- Indicadores de estoque

---

#### TASK-015-008: Página de Movimentações

**Estimativa:** 3h

- Histórico
- Filtros
- Registro de entrada/saída

---

#### TASK-015-009: Página de PDV (Vendas)

**Estimativa:** 5h

- Seleção de produtos
- Carrinho
- Pagamento
- Recibo

---

#### TASK-015-010: Dashboard de Estoque

**Estimativa:** 3h

- Produtos com estoque baixo
- Últimas vendas
- Resumos

---

##  Critérios de Aceite do Épico

- [ ] CRUD de produtos funcionando
- [ ] Movimentações rastreadas
- [ ] Vendas registradas
- [ ] Estoque atualizado automaticamente
- [ ] Alertas funcionando
- [ ] Relatórios disponíveis
- [ ] Testes ≥80%

---

##  Timeline Sugerido

**Total estimado:** ~31 horas (~1.5 semanas)
