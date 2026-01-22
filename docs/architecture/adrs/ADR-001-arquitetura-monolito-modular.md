# ADR-001: Arquitetura Monolito Modular

**Status:** Aceito  
**Data:** 21/01/2026  
**Decisores:** Equipe de Arquitetura  
**Contexto do Debate:** [DEBATE-001](../debates/DEBATE-001-arquitetura-geral.md)

## Contexto

O sistema de gestão para academia de Pilates e Fisioterapia precisa suportar múltiplos módulos de negócio (autenticação, alunos, professores, aulas, financeiro, estoque) com requisitos de:

- Custo inicial baixo
- Equipe pequena
- Preparação para escalar no futuro
- Complexidade operacional mínima

## Decisão

**Adotar arquitetura de Monolito Modular seguindo princípios de DDD (Domain-Driven Design).**

### Estrutura de Módulos

```
src/
├── modules/
│   ├── auth/                    # Bounded Context: Identidade
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   ├── value-objects/
│   │   │   ├── events/
│   │   │   └── repositories/
│   │   ├── application/
│   │   │   ├── commands/
│   │   │   ├── queries/
│   │   │   └── services/
│   │   ├── infrastructure/
│   │   │   ├── persistence/
│   │   │   └── http/
│   │   └── auth.module.ts
│   │
│   ├── students/                # Bounded Context: Gestão de Alunos
│   ├── teachers/                # Bounded Context: Gestão de Professores
│   ├── classes/                 # Bounded Context: Agendamento
│   ├── enrollments/             # Bounded Context: Matrículas
│   ├── financial/               # Bounded Context: Financeiro
│   ├── contracts/               # Bounded Context: Contratos
│   ├── inventory/               # Bounded Context: Estoque
│   └── reports/                 # Bounded Context: Relatórios
│
├── shared/
│   ├── domain/
│   │   ├── base-entity.ts
│   │   ├── aggregate-root.ts
│   │   ├── domain-event.ts
│   │   └── value-object.ts
│   ├── infrastructure/
│   │   ├── database/
│   │   ├── events/
│   │   └── http/
│   └── application/
│       └── cqrs/
│
└── main.ts
```

### Princípios de Comunicação

1. **Módulos NÃO importam diretamente outros módulos**
2. **Comunicação via Eventos de Domínio**
3. **Shared Kernel mínimo** (apenas abstrações base)
4. **Contratos explícitos** entre bounded contexts

```typescript
// Exemplo: Comunicação via eventos
// Em financial.service.ts
@Injectable()
export class FinancialService {
  constructor(private eventEmitter: EventEmitter2) {}

  async processPayment(payment: Payment) {
    // Processa pagamento
    await this.paymentRepository.save(payment);

    // Emite evento para outros módulos
    this.eventEmitter.emit('payment.confirmed', new PaymentConfirmedEvent(payment));
  }
}

// Em enrollments.service.ts - escuta o evento
@OnEvent('payment.confirmed')
async handlePaymentConfirmed(event: PaymentConfirmedEvent) {
  await this.activateEnrollment(event.enrollmentId);
}
```

## Alternativas Consideradas

### 1. Microserviços desde o início

**Prós:**

- Escalabilidade independente
- Deploy independente
- Isolamento de falhas

**Contras:**

- Complexidade operacional alta
- Custo de infraestrutura 5-10x maior
- Necessidade de Kubernetes
- Complexidade de transações distribuídas
- Overhead de comunicação de rede

### 2. Monolito tradicional (sem módulos)

**Prós:**

- Mais simples inicialmente
- Menos abstrações

**Contras:**

- Big ball of mud ao crescer
- Difícil extrair serviços depois
- Acoplamento forte

### 3. Serverless (Lambda/Cloud Functions)

**Prós:**

- Escala automática
- Pay-per-use

**Contras:**

- Cold starts problemáticos
- Custo imprevisível
- Vendor lock-in
- Complexidade de debugging

## Consequências

### Positivas

-  **Custo baixo**: Deploy em VPS simples (~$20/mês)
-  **Operação simples**: Um container, um deploy
-  **Debug fácil**: Stack traces unificados
-  **Transações ACID**: Banco único
-  **TDD facilitado**: Menos mocks de rede
-  **Preparado para evoluir**: Módulos extraíveis

### Negativas

-  Deploy único (todo sistema junto)
-  Escala vertical antes de horizontal
-  Disciplina necessária para manter isolamento

### Riscos e Mitigações

| Risco                     | Mitigação                             |
| ------------------------- | ------------------------------------- |
| Acoplamento entre módulos | Code review + regras de lint          |
| Escala limitada           | Redis + read replicas quando precisar |
| Single point of failure   | Health checks + restart automático    |

## Critérios de Migração

Considerar migração para microserviços quando:

- [ ] Equipe > 10 desenvolvedores
- [ ] Deploys > 5x por dia necessários
- [ ] Um módulo precisa escalar 10x mais que outros
- [ ] Requisito de tolerância a falhas por módulo

## Métricas de Sucesso

- Tempo de deploy < 5 minutos
- Tempo de startup < 30 segundos
- Módulos mantêm isolamento (zero imports cruzados diretos)
- Coverage de testes > 80% por módulo

## Referências

- [Martin Fowler - Monolith First](https://martinfowler.com/bliki/MonolithFirst.html)
- [Sam Newman - Building Microservices](https://samnewman.io/books/building_microservices_2nd_edition/)
- [Modular Monolith with DDD](https://github.com/kgrzybek/modular-monolith-with-ddd)
