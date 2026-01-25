import { DomainEvent } from '@/shared/domain/domain-event.base';

type TestPayload = { name: string };

class TestEvent extends DomainEvent<TestPayload> {
  constructor(payload: TestPayload, occurredAt?: Date) {
    super(payload, occurredAt);
  }
}

describe('DomainEvent Base', () => {
  it('should set payload and default occurredAt', () => {
    const event = new TestEvent({ name: 'test' });

    expect(event.payload).toEqual({ name: 'test' });
    expect(event.occurredAt).toBeInstanceOf(Date);
  });

  it('should allow passing a custom occurredAt', () => {
    const occurredAt = new Date('2020-01-01T00:00:00.000Z');
    const event = new TestEvent({ name: 'custom' }, occurredAt);

    expect(event.occurredAt).toBe(occurredAt);
  });
});



