import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

// Mock fetch and sessionStorage
beforeEach(() => {
  global.fetch = jest.fn();
  sessionStorage.clear();
});
afterEach(() => {
  jest.restoreAllMocks();
  sessionStorage.clear();
});

const mockWeddingData = {
  couple: {
    groom: { firstName: 'Tiến', lastName: 'Đạt', fullName: 'Nguyễn Tiến Đạt', parent: 'Bố Hùng & Mẹ Uyên', avatar: '' },
    bride: { firstName: 'Phượng', lastName: 'Phượng', fullName: 'Phượng', parent: 'Bố Nam & Mẹ Lan', avatar: '' },
    coverPhoto: '',
    photos: ['/images/test1.jpg', '/images/test2.jpg'],
  },
  wedding: { date: '2025-12-12', time: '09:00', lunarDate: '', greetingText: 'Trân trọng kính mời', title: '', description: '', events: [] },
  loveStory: [],
  music: { embedUrl: '' },
  bankAccounts: [{ name: 'Nguyễn Tiến Đạt', bank: 'Vietcombank', accountNumber: '1234567890', branch: '', qrCode: '' }],
  theme: { templateId: 'vintage-rose', primaryColor: '#d4a373', secondaryColor: '#faedcd', accentColor: '#e63946', fontFamily: 'serif', backgroundPattern: 'floral' },
};

// Helper: mock a successful fetch returning wedding data
function mockFetchSuccess(data = mockWeddingData) {
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => data,
  });
}

// Lazy import inside each test to avoid module caching issues
let Admin;
beforeAll(async () => {
  Admin = (await import('../components/Admin')).default;
});

describe('CoupleAdmin – tab persistence', () => {
  test('tab "Ảnh cưới" stays active after upload completes', async () => {
    let resolveUpload;
    global.fetch
      // Initial load
      .mockResolvedValueOnce({ ok: true, json: async () => mockWeddingData })
      // Upload
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveUpload = () =>
              resolve({ ok: true, json: async () => ({ success: true, imageUrl: '/images/new.jpg' }) });
          })
      )
      // fetchData after upload
      .mockResolvedValueOnce({ ok: true, json: async () => mockWeddingData });

    await act(async () => {
      render(<Admin coupleSlug="dat_&_phuong" />);
    });

    // Switch to photos tab
    await act(async () => {
      fireEvent.click(screen.getByText('Ảnh cưới'));
    });
    expect(screen.getByText(/Album ảnh cưới/)).toBeInTheDocument();

    // Complete the upload
    await act(async () => {
      resolveUpload && resolveUpload();
    });
    await waitFor(() => {
      // Still on photos tab — not redirected back to couple tab
      expect(screen.getByText(/Album ảnh cưới/)).toBeInTheDocument();
    });
  });

  test('tab "Mừng cưới" stays active after saving bank info', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockWeddingData })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }); // PUT response

    await act(async () => {
      render(<Admin coupleSlug="dat_&_phuong" />);
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Mừng cưới'));
    });
    expect(screen.getByText('Tài khoản 1')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText('Lưu thông tin ngân hàng'));
    });

    await waitFor(() => {
      // Still on bank tab
      expect(screen.getByText('Tài khoản 1')).toBeInTheDocument();
    });
  });

  test('tab "Giao diện" stays active after selecting a template', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockWeddingData })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }); // PUT theme response

    await act(async () => {
      render(<Admin coupleSlug="dat_&_phuong" />);
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Giao diện'));
    });
    expect(screen.getByText('Chọn giao diện thiệp cưới')).toBeInTheDocument();

    // Click on modern-white template card
    await act(async () => {
      fireEvent.click(screen.getByText('Trắng Hiện Đại'));
    });

    await waitFor(() => {
      // Still on template tab
      expect(screen.getByText('Chọn giao diện thiệp cưới')).toBeInTheDocument();
    });
  });

  test('tab "Thông tin cặp đôi" stays active after saving couple info', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockWeddingData })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }); // PUT couple response

    await act(async () => {
      render(<Admin coupleSlug="dat_&_phuong" />);
    });

    // Couple tab is active by default
    expect(screen.getByText('Lưu thông tin')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText('Lưu thông tin'));
    });

    await waitFor(() => {
      expect(screen.getByText('Lưu thông tin')).toBeInTheDocument();
    });
  });

  test('switching tabs does not lose tab state', async () => {
    mockFetchSuccess();

    await act(async () => {
      render(<Admin coupleSlug="dat_&_phuong" />);
    });

    // Switch to photos
    await act(async () => {
      fireEvent.click(screen.getByText('Ảnh cưới'));
    });
    expect(screen.getByText(/Album ảnh cưới/)).toBeInTheDocument();

    // Switch to bank
    await act(async () => {
      fireEvent.click(screen.getByText('Mừng cưới'));
    });
    expect(screen.getByText('Tài khoản 1')).toBeInTheDocument();

    // Switch to template
    await act(async () => {
      fireEvent.click(screen.getByText('Giao diện'));
    });
    expect(screen.getByText('Chọn giao diện thiệp cưới')).toBeInTheDocument();

    // Switch back to couple
    await act(async () => {
      fireEvent.click(screen.getByText('Thông tin cặp đôi'));
    });
    expect(screen.getByText('Lưu thông tin')).toBeInTheDocument();
  });
});

describe('CoupleAdmin – initial load', () => {
  test('shows loading then renders data', async () => {
    let resolveLoad;
    global.fetch.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveLoad = () => resolve({ ok: true, json: async () => mockWeddingData });
      })
    );

    await act(async () => {
      render(<Admin coupleSlug="dat_&_phuong" />);
    });

    expect(screen.getByText('Đang tải...')).toBeInTheDocument();

    await act(async () => {
      resolveLoad();
    });

    await waitFor(() => {
      expect(screen.queryByText('Đang tải...')).not.toBeInTheDocument();
    });
  });

  test('shows error message on fetch failure', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      render(<Admin coupleSlug="dat_&_phuong" />);
    });

    await waitFor(() => {
      expect(screen.queryByText('Đang tải...')).not.toBeInTheDocument();
    });
  });
});

describe('CoupleAdmin – sessionStorage tab persistence', () => {
  test('tab is saved to sessionStorage when changed', async () => {
    mockFetchSuccess();

    await act(async () => {
      render(<Admin coupleSlug="dat_&_phuong" />);
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Ảnh cưới'));
    });

    expect(sessionStorage.getItem('admin_tab_dat_&_phuong')).toBe('photos');
  });

  test('tab is restored from sessionStorage on remount', async () => {
    // Pre-set tab in sessionStorage
    sessionStorage.setItem('admin_tab_dat_&_phuong', 'template');
    mockFetchSuccess();

    await act(async () => {
      render(<Admin coupleSlug="dat_&_phuong" />);
    });

    await waitFor(() => {
      expect(screen.getByText('Chọn giao diện thiệp cưới')).toBeInTheDocument();
    });
  });

  test('different couples have independent tab state', async () => {
    sessionStorage.setItem('admin_tab_bao_&_phuong', 'bank');
    mockFetchSuccess();

    await act(async () => {
      render(<Admin coupleSlug="bao_&_phuong" />);
    });

    await waitFor(() => {
      expect(screen.getByText('Tài khoản 1')).toBeInTheDocument();
    });
  });
});
