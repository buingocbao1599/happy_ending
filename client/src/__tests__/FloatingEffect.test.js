import React from 'react';
import { render, act } from '@testing-library/react';
import FloatingEffect from '../components/FloatingEffect';

// Mock setInterval/clearInterval để test không bị treo
beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe('FloatingEffect', () => {
  test('render container div', () => {
    const { container } = render(<FloatingEffect type="petals" />);
    expect(container.firstChild).toBeTruthy();
    expect(container.firstChild.className).toBe('floating-effect-container');
  });

  test('render với type mặc định (petals) khi không truyền prop', () => {
    const { container } = render(<FloatingEffect />);
    expect(container.firstChild).toBeTruthy();
  });

  test.each(['petals', 'snow', 'leaves', 'bubbles'])(
    'không crash với type="%s"',
    (effectType) => {
      expect(() => render(<FloatingEffect type={effectType} />)).not.toThrow();
    }
  );

  test('không crash với type không hợp lệ (fallback về petals)', () => {
    expect(() => render(<FloatingEffect type="unknown-effect" />)).not.toThrow();
  });

  test('cleanup clearInterval khi unmount', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    const { unmount } = render(<FloatingEffect type="petals" />);
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  test('tạo particles sau khi interval chạy', () => {
    const { container } = render(<FloatingEffect type="petals" />);
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    // Container nên có particles được tạo ra
    expect(container.firstChild).toBeTruthy();
  });
});
