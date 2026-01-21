# EPIC-008: Sistema de Planos e Preços

## 📋 Informações Gerais

| Campo | Valor |
|-------|-------|
| **ID** | EPIC-008 |
| **Título** | Sistema de Planos e Preços |
| **Fase** | 2 - Financeiro |
| **Prioridade** | 🔴 Crítica |
| **Estimativa** | 1 semana |
| **Dependências** | EPIC-007 (Matrículas) |
| **Status** | 📋 Backlog |

---

## 📝 Descrição

Expandir o sistema de planos com:
- Tabela de preços por modalidade/tipo
- Descontos especiais
- Histórico de alterações de preço
- Configuração de vigência

---

## 🎯 Objetivos

1. Tabela de preços flexível
2. Regras de desconto
3. Histórico de preços
4. Cálculo automático de valores

---

## 👤 User Stories

### US-008-001: Configurar Tabela de Preços
**Como** administrador  
**Quero** definir preços por plano e modalidade  
**Para** precificar os serviços

**Critérios de Aceite:**
- [ ] Preço por plano
- [ ] Preço por tipo de aula (individual/grupo)
- [ ] Data de vigência
- [ ] Histórico preservado

---

### US-008-002: Configurar Descontos
**Como** administrador  
**Quero** criar regras de desconto  
**Para** oferecer condições especiais

**Critérios de Aceite:**
- [ ] Desconto por categoria (estudante, idoso)
- [ ] Desconto percentual ou valor fixo
- [ ] Aplicação automática ou manual

---

### US-008-003: Calcular Valor da Matrícula
**Como** sistema  
**Quero** calcular automaticamente o valor  
**Para** facilitar o processo de matrícula

**Critérios de Aceite:**
- [ ] Busca preço vigente
- [ ] Aplica descontos
- [ ] Exibe valor final

---

## 🔧 Tasks Técnicas

### TASK-008-001: Schema de Preços
**Estimativa:** 2h

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

### TASK-008-002: CRUD Tabela de Preços
**Estimativa:** 3h

---

### TASK-008-003: CRUD Descontos
**Estimativa:** 2h

---

### TASK-008-004: Serviço de Cálculo de Preço
**Estimativa:** 3h

- Buscar preço vigente
- Aplicar descontos
- Retornar breakdown

---

### TASK-008-005: UI de Configuração de Preços
**Estimativa:** 4h

---

### TASK-008-006: UI de Descontos
**Estimativa:** 3h

---

### TASK-008-007: Integração no Wizard de Matrícula
**Estimativa:** 2h

---

## ✅ Critérios de Aceite do Épico

- [ ] Tabela de preços funcional
- [ ] Descontos configuráveis
- [ ] Histórico preservado
- [ ] Cálculo automático
- [ ] Testes ≥80%

---

## 📅 Timeline Sugerido

**Total estimado:** ~19 horas (~1 semana)

