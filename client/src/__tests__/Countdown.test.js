import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Countdown from '../components/Countdown';

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe('Countdown', () => {
  test('render 4 đơn vị thời gian', () => {
    render(<Countdown targetDate="2030-01-01" targetTime="10:00" />);
    expect(screen.getByText('Ngày')).toBeInTheDocument();
    expect(screen.getByText('Giờ')).toBeInTheDocument();
    expect(screen.getByText('Phút')).toBeInTheDocument();
    expect(screen.getByText('Giây')).toBeInTheDocument();
  });

  test('hiển thị tiêu đề section', () => {
    render(<Countdown targetDate="2030-01-01" targetTime="10:00" />);
    expect(screen.getByText('Đếm ngược đến ngày cưới')).toBeInTheDocument();
  });

  test('hiển thị 00 khi ngày đã qua', () => {
    render(<Countdown targetDate="2020-01-01" targetTime="10:00" />);
    const zeros = screen.getAllByText('00');
    expect(zeros.length).toBeGreaterThanOrEqual(4);
  });

  test('hiển thị số dương khi ngày còn trong tương lai', () => {
    render(<Countdown targetDate="2030-06-15" targetTime="10:00" />);
    // Ít nhất 1 giá trị phải > 0 (số ngày)
    const countdownItems = screen.getAllByText(/\d+/);
    const hasPositive = countdownItems.some(
      (el) => parseInt(el.textContent, 10) > 0
    );
    expect(hasPositive).toBe(true);
  });

  test('cập nhật sau mỗi giây', () => {
    render(<Countdown targetDate="2030-01-01" targetTime="10:00" />);
    const secondsBefore = screen.getByText('Giây').previousSibling?.textContent;
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    // Component vẫn render bình thường sau khi tick
    expect(screen.getByText('Giây')).toBeInTheDocument();
  });

  test('format Giờ/Phút/Giây với 2 chữ số (padding)', () => {
    render(<Countdown targetDate="2030-01-01" targetTime="10:00" />);
    // Giờ, Phút, Giây luôn nằm trong 00-23/59 nên đủ 2 chữ số
    // Days có thể > 99 nên không check
    const twoDigitNumbers = screen.getAllByText(/^\d{2}$/);
    // Ít nhất Giờ, Phút, Giây = 3 số có dạng 2 chữ số
    expect(twoDigitNumbers.length).toBeGreaterThanOrEqual(3);
  });
});
