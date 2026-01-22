import { DomainEvent } from '@/shared/domain/domain-event.base';
import { Entity, EntityProps } from '@/shared/domain/entity.base';

export abstract class AggregateRoot<T extends EntityProps> extends Entity<T> {
  private domainEvents: DomainEvent[] = [];

  protected addDomainEvent(event: DomainEvent) {
    this.domainEvents.push(event);
  }

  public pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }
}
