import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RSVPForm from '../components/RSVPForm';

describe('RSVPForm', () => {
  test('render form với input họ tên', () => {
    render(<RSVPForm coupleSlug="bao_&_phuong" />);
    expect(screen.getByLabelText(/Họ và tên/i)).toBeInTheDocument();
  });

  test('render tiêu đề section', () => {
    render(<RSVPForm coupleSlug="bao_&_phuong" />);
    expect(screen.getByText('Xác Nhận Tham Dự')).toBeInTheDocument();
  });

  test('hiển thị 2 lựa chọn tham dự', () => {
    render(<RSVPForm coupleSlug="bao_&_phuong" />);
    expect(screen.getByText(/Sẽ tham dự/i)).toBeInTheDocument();
    expect(screen.getByText(/Rất tiếc không thể/i)).toBeInTheDocument();
  });

  test('mặc định chọn "Sẽ tham dự"', () => {
    render(<RSVPForm coupleSlug="bao_&_phuong" />);
    const yesRadio = screen.getByDisplayValue('yes');
    expect(yesRadio).toBeChecked();
  });

  test('hiển thị dropdown "Số khách đi cùng" khi chọn tham dự', () => {
    render(<RSVPForm coupleSlug="bao_&_phuong" />);
    expect(screen.getByLabelText(/Số khách đi cùng/i)).toBeInTheDocument();
  });

  test('ẩn dropdown "Số khách đi cùng" khi chọn không tham dự', () => {
    render(<RSVPForm coupleSlug="bao_&_phuong" />);
    const noRadio = screen.getByDisplayValue('no');
    fireEvent.click(noRadio);
    expect(screen.queryByLabelText(/Số khách đi cùng/i)).not.toBeInTheDocument();
  });

  test('dropdown số khách có đúng 5 option (1-5)', () => {
    render(<RSVPForm coupleSlug="bao_&_phuong" />);
    const select = screen.getByLabelText(/Số khách đi cùng/i);
    expect(select.options).toHaveLength(5);
    expect(select.options[0].value).toBe('1');
    expect(select.options[4].value).toBe('5');
  });

  test('cập nhật giá trị input khi người dùng gõ', async () => {
    render(<RSVPForm coupleSlug="bao_&_phuong" />);
    const nameInput = screen.getByLabelText(/Họ và tên/i);
    await userEvent.type(nameInput, 'Nguyễn Văn A');
    expect(nameInput.value).toBe('Nguyễn Văn A');
  });

  test('hiển thị màn hình thành công sau khi submit', () => {
    render(<RSVPForm coupleSlug="bao_&_phuong" />);
    const nameInput = screen.getByLabelText(/Họ và tên/i);
    fireEvent.change(nameInput, { target: { value: 'Nguyễn Văn A' } });

    const submitBtn = screen.getByRole('button', { name: /Gửi xác nhận/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Cảm ơn bạn/i)).toBeInTheDocument();
  });

  test('ẩn form sau khi submit thành công', () => {
    render(<RSVPForm coupleSlug="bao_&_phuong" />);
    const nameInput = screen.getByLabelText(/Họ và tên/i);
    fireEvent.change(nameInput, { target: { value: 'Test' } });
    fireEvent.click(screen.getByRole('button', { name: /Gửi xác nhận/i }));

    expect(screen.queryByLabelText(/Họ và tên/i)).not.toBeInTheDocument();
  });
});
