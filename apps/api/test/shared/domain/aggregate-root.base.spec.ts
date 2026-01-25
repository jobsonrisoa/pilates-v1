import { AggregateRoot } from '@/shared/domain/aggregate-root.base';
import { DomainEvent } from '@/shared/domain/domain-event.base';
import { EntityProps } from '@/shared/domain/entity.base';

type TestPayload = { id: string };

class TestEvent extends DomainEvent<TestPayload> {
  constructor(payload: TestPayload) {
    super(payload);
  }
}

class TestAggregate extends AggregateRoot<EntityProps> {
  public record(event: DomainEvent) {
    this.addDomainEvent(event);
  }
}

describe('AggregateRoot Base', () => {
  it('should collect and pull domain events, then clear them', () => {
    const aggregate = new TestAggregate({});
    const event1 = new TestEvent({ id: '1' });
    const event2 = new TestEvent({ id: '2' });

    aggregate.record(event1);
    aggregate.record(event2);

    const eventsFirstPull = aggregate.pullDomainEvents();

    expect(eventsFirstPull).toHaveLength(2);
    expect(eventsFirstPull[0]).toBe(event1);
    expect(eventsFirstPull[1]).toBe(event2);

    const eventsSecondPull = aggregate.pullDomainEvents();
    expect(eventsSecondPull).toHaveLength(0);
  });
});



