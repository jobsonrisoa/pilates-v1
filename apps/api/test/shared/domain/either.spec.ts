import { Left, Right, left, right } from '@/shared/domain/either';

describe('Either', () => {
  it('left() should create a Left', () => {
    const result = left<string, number>('error');

    expect(result).toBeInstanceOf(Left);
    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBe('error');
  });

  it('right() should create a Right', () => {
    const result = right<string, number>(123);

    expect(result).toBeInstanceOf(Right);
    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(123);
  });
});
