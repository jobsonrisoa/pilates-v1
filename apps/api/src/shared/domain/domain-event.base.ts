export abstract class DomainEvent<TPayload = unknown> {
  public readonly occurredAt: Date;
  public readonly payload: TPayload;

  protected constructor(payload: TPayload, occurredAt?: Date) {
    this.payload = payload;
    this.occurredAt = occurredAt ?? new Date();
  }
}
