import { renderHook, act } from '@testing-library/react';
import { useToggle } from '../use-toggle';

describe('useToggle', () => {
  it('should initialize with default value (false)', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current[0]).toBe(false);
  });

  it('should initialize with provided initial value', () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current[0]).toBe(true);
  });

  it('should toggle value', () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => {
      result.current[1].toggle();
    });

    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1].toggle();
    });

    expect(result.current[0]).toBe(false);
  });

  it('should set value to true', () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => {
      result.current[1].setTrue();
    });

    expect(result.current[0]).toBe(true);
  });

  it('should set value to false', () => {
    const { result } = renderHook(() => useToggle(true));

    act(() => {
      result.current[1].setFalse();
    });

    expect(result.current[0]).toBe(false);
  });
});
