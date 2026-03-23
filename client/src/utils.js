/**
 * Chuyển chuỗi raw từ URL thành tên hiển thị
 * "nguyen_van_a" → "Nguyen Van A"
 * "chị+hoa"      → "Chị Hoa"
 */
export function formatGuestName(raw) {
  if (!raw || typeof raw !== 'string') return '';
  return raw
    .replace(/_/g, ' ')
    .replace(/\+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .trim();
}

/**
 * Tính thời gian còn lại đến ngày cưới
 * @param {string} targetDate  - "2026-06-15"
 * @param {string} targetTime  - "10:00"
 * @returns {{ days, hours, minutes, seconds }}
 */
export function calculateTimeLeft(targetDate, targetTime) {
  if (!targetDate || !targetTime) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const target = new Date(`${targetDate}T${targetTime}:00`);
  if (isNaN(target.getTime())) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const diff = target - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/**
 * Parse URL thành { page, coupleSlug, guestName }
 * /admin              → { page: 'admin', coupleSlug: null, guestName: '' }
 * /admin/bao_&_phuong → { page: 'admin', coupleSlug: 'bao_&_phuong', guestName: '' }
 * /bao_&_phuong?anh_dat → { page: 'wedding', coupleSlug: 'bao_&_phuong', guestName: 'Anh Dat' }
 */
export function parseURL(pathname, search) {
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const coupleSlug = pathname.replace('/admin/', '').replace('/admin', '') || null;
    return { page: 'admin', coupleSlug: coupleSlug || null, guestName: '' };
  }

  const coupleSlug = decodeURIComponent(pathname.substring(1)) || null;

  let guestName = '';
  if (search && search.length > 1) {
    const params = new URLSearchParams(search);
    const toParam = params.get('to');
    if (toParam) {
      guestName = formatGuestName(toParam);
    } else {
      const rawName = decodeURIComponent(search.substring(1).split('&')[0]);
      guestName = formatGuestName(rawName);
    }
  }

  return { page: 'wedding', coupleSlug, guestName };
}
