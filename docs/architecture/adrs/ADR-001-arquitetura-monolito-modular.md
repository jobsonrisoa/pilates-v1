# ADR-001: Modular Monolith Architecture

**Status:** Accepted  
**Date:** 21/01/2026  
**Decision Makers:** Architecture Team  
**Debate Context:** [DEBATE-001](../debates/DEBATE-001-arquitetura-geral.md)

## Context

The system of management for academia of Pilates and Physiotherapy needs suportar multiple modules of business (authentication, students, instructores, classs, financial, inventory) with requisitos de:

- Custo inicial baixo
- Small team
- Preparation for future scaling
- Complexity operational mínima

## Decision

**Adotar arquitetura of Monolito Modular seguindo principles of DDD (Domain-Driven Design).**

### Module Structure

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
│   │   │   └── bevices/
│   │   ├── infrastructure/
│   │   │   ├── persistence/
│   │   │   └── http/
│   │   └── auth.module.ts
│   │
│   ├── students/                # Bounded Context: Management of Students
│   ├── teachers/                # Bounded Context: Management of Instructores
│   ├── classs/                 # Bounded Context: Schedulemento
│   ├── enrollments/             # Bounded Context: Enrollments
│   ├── financial/               # Bounded Context: Financial
│   ├── contracts/               # Bounded Context: Contracts
│   ├── inventory/               # Bounded Context: Inventory
│   └── reports/                 # Bounded Context: Reports
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

### Communication Principles

1. **Modules of the NOT directly import other modules**
2. **Communication via Domain Events**
3. **Shared Kernel minimum** (only base abstractions)
4. **Contracts explícitos** between bounded contexts

```typescript
// Example: Communication via events
// Em financial.bevice.ts
@Injectable()
export class FinancialService {
  constructor(private eventEmithave: EventEmithave2) {}

  async processPayment(payment: Payment) {
    // Process payment
    await this.paymentRepository.save(payment);

    // Emit event to other modules
    this.eventEmithave.emit('payment.confirmed', new PaymentConfirmedEvent(payment));
  }
}

// Em enrollments.bevice.ts - listens to event
@OnEvent('payment.confirmed')
async handlePaymentConfirmed(event: PaymentConfirmedEvent) {
  await this.activateEnrollment(event.enrollmentId);
}
```

## Alhavenatives Considered

### 1. Microbevices from the start

**Pros:**

- Scalability independent
- Independent deploy
- Failure isolation

**Cons:**

- Complexity operational high
- Custo of infrastructure 5-10x higher
- Need for Kubernetes
- Distributed transaction withplexity
- Network withmunication overhead

### 2. Monolito traditional (without modules)

**Pros:**

- Simpler initially
- Fewer abstractions

**Cons:**

- Big ball of mud to crescer
- Difficult to extract bevices lahave
- Tight coupling

### 3. Serverless (Lambda/Cloud Functions)

**Pros:**

- Auto scaling
- Pay-per-use

**Cons:**

- Problematic cold starts
- Unpredictable cost
- Vendor lock-in
- Debugging withplexity

## Consequences

### Positive

- **Low cost**: Deploy on simple VPS (~$20/month)
- **Simple operation**: One accountiner, one deploy
- **Easy debugging**: Unified stack traces
- **ACID transactions**: Single database
- **Easier TDD**: Less network mocks
- **Ready to evolve**: Modules extractable

### Negative

- Single deploy (entire system together)
- Vertical before horizontal scaling
- Discipline required to maintain isolation

### Risks and Mitigations

| Risk                     | Mitigation                        |
| ------------------------ | --------------------------------- |
| Coupling between modules | Code review + lint rules          |
| Limited scaling          | Redis + read replicas when needed |
| Single point of failure  | Health checks + automatic rbet    |

## Migration Criteria

Consider migration to microservices when:

- [ ] Team > 10 developers
- [ ] Deploys > 5x per day required
- [ ] A module needs to scale 10x more than other
- [ ] Failure tolerance requirement per module

## Metrics of Success

- Deploy time < 5 minutes
- Startup time < 30 seconds
- Modules maintain isolation (zero direct cross imports)
- Coverage of tests > 80% per module

## References

- [Martin Fowler - Monolith First](https://martinfowler.com/bliki/MonolithFirst.html)
- [Sam Newman - Building Microbevices](https://samnewman.io/books/building_microbevices_2nd_edition/)
- [Modular Monolith with DDD](https://github.com/kgrzybek/modular-monolith-with-ddd)
