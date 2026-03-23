import { formatGuestName, calculateTimeLeft, parseURL } from '../utils';

// =====================================================
// formatGuestName
// =====================================================
describe('formatGuestName', () => {
  test('chuyển underscore thành space và viết hoa chữ đầu', () => {
    expect(formatGuestName('nguyen_van_a')).toBe('Nguyen Van A');
  });

  test('chuyển dấu + thành space', () => {
    expect(formatGuestName('chị+hoa')).toBe('Chị Hoa');
  });

  test('viết hoa chữ đầu mỗi từ', () => {
    expect(formatGuestName('anh_nguyen_tien_dat')).toBe('Anh Nguyen Tien Dat');
  });

  test('chuỗi đã có chữ hoa giữ nguyên', () => {
    expect(formatGuestName('Anh_Bao')).toBe('Anh Bao');
  });

  test('trả về chuỗi rỗng khi input rỗng', () => {
    expect(formatGuestName('')).toBe('');
  });

  test('trả về chuỗi rỗng khi input là null', () => {
    expect(formatGuestName(null)).toBe('');
  });

  test('loại bỏ khoảng trắng thừa', () => {
    expect(formatGuestName('anh__dat')).toBe('Anh Dat');
  });

  test('giữ ký tự tiếng Việt', () => {
    expect(formatGuestName('chị_phương')).toBe('Chị Phương');
  });
});

// =====================================================
// calculateTimeLeft
// =====================================================
describe('calculateTimeLeft', () => {
  test('trả về 0 tất cả khi ngày đã qua', () => {
    const result = calculateTimeLeft('2020-01-01', '10:00');
    expect(result).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });

  test('trả về 0 tất cả khi không có input', () => {
    expect(calculateTimeLeft('', '')).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    expect(calculateTimeLeft(null, null)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });

  test('trả về 0 khi date không hợp lệ', () => {
    expect(calculateTimeLeft('invalid-date', '10:00')).toEqual({
      days: 0, hours: 0, minutes: 0, seconds: 0,
    });
  });

  test('trả về số dương khi ngày còn trong tương lai', () => {
    const futureDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 ngày sau
    const dateStr = futureDate.toISOString().split('T')[0];
    const result = calculateTimeLeft(dateStr, '10:00');
    expect(result.days).toBeGreaterThan(0);
    expect(result.hours).toBeGreaterThanOrEqual(0);
    expect(result.minutes).toBeGreaterThanOrEqual(0);
    expect(result.seconds).toBeGreaterThanOrEqual(0);
  });

  test('days không vượt quá tổng số ngày thực tế', () => {
    const futureDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // 5 ngày sau
    const dateStr = futureDate.toISOString().split('T')[0];
    const result = calculateTimeLeft(dateStr, '10:00');
    expect(result.days).toBeLessThanOrEqual(5);
    expect(result.hours).toBeLessThan(24);
    expect(result.minutes).toBeLessThan(60);
    expect(result.seconds).toBeLessThan(60);
  });
});

// =====================================================
// parseURL
// =====================================================
describe('parseURL', () => {
  test('nhận dạng route /admin', () => {
    const result = parseURL('/admin', '');
    expect(result.page).toBe('admin');
    expect(result.coupleSlug).toBeNull();
    expect(result.guestName).toBe('');
  });

  test('nhận dạng route /admin/:slug', () => {
    const result = parseURL('/admin/bao_&_phuong', '');
    expect(result.page).toBe('admin');
    expect(result.coupleSlug).toBe('bao_&_phuong');
  });

  test('parse coupleSlug từ pathname', () => {
    const result = parseURL('/bao_&_phuong', '');
    expect(result.page).toBe('wedding');
    expect(result.coupleSlug).toBe('bao_&_phuong');
  });

  test('parse tên khách từ query ?to=', () => {
    const result = parseURL('/bao_&_phuong', '?to=anh_dat');
    expect(result.guestName).toBe('Anh Dat');
  });

  test('parse tên khách từ query không có key (/?ten_khach)', () => {
    const result = parseURL('/bao_&_phuong', '?anh_nguyen');
    expect(result.guestName).toBe('Anh Nguyen');
  });

  test('trả về guestName rỗng khi không có query', () => {
    const result = parseURL('/bao_&_phuong', '');
    expect(result.guestName).toBe('');
  });
});
