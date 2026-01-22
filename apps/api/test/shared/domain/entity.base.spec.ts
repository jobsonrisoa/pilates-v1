import { Entity, EntityProps } from '@/shared/domain/entity.base';

interface TestProps extends EntityProps {
  name: string;
}

class TestEntity extends Entity<TestProps> {
  get name(): string {
    return this.props.name;
  }
}

describe('Entity Base', () => {
  it('should create entity with auto-generated id', () => {
    const entity = new TestEntity({ name: 'Test' });

    expect(entity.id).toBeDefined();
    expect(entity.id).toHaveLength(36);
  });

  it('should use provided id', () => {
    const entity = new TestEntity({
      id: 'custom-id',
      name: 'Test',
    });

    expect(entity.id).toBe('custom-id');
  });

  it('should set createdAt and updatedAt', () => {
    const entity = new TestEntity({ name: 'Test' });

    expect(entity.createdAt).toBeInstanceOf(Date);
    expect(entity.updatedAt).toBeInstanceOf(Date);
  });

  it('should compare entities by id', () => {
    const entity1 = new TestEntity({ id: 'same-id', name: 'Test 1' });
    const entity2 = new TestEntity({ id: 'same-id', name: 'Test 2' });
    const entity3 = new TestEntity({ id: 'diff-id', name: 'Test 1' });

    expect(entity1.equals(entity2)).toBe(true);
    expect(entity1.equals(entity3)).toBe(false);
  });
});
