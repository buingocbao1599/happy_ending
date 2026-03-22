# Tính năng Website Thiệp Cưới Online

Danh sách tính năng đã được thống nhất cho dự án.

> ✅ = Đã hoàn thành | ⬜ = Chưa làm

## 1. Trang chủ / Landing Page ✅
- ✅ Màn hình "Mở Thiệp" với tên cặp đôi + tên khách mời
- ✅ Hiệu ứng hoa cánh rơi (FloatingPetals) - GPU-accelerated
- ✅ Ảnh bìa cô dâu & chú rể (tùy chỉnh từ JSON)
- ✅ Bộ đếm ngược đến ngày cưới (realtime)
- ✅ Hiển thị tên cá nhân hóa cho từng khách mời từ URL
- ✅ Nhạc nền tự động phát khi mở thiệp (SoundCloud embed)
- ✅ Bottom navigation bar điều hướng mượt
- ✅ Responsive: 3 breakpoint (desktop > 768px > 480px)

### User Stories

#### Khách mời (Guest)
- **US-1.1: Xem thiệp cưới đẹp mắt** — Là khách mời, tôi muốn mở link thiệp và thấy ngay một trang thiệp cưới đẹp, chuyên nghiệp để cảm nhận được sự trân trọng từ cô dâu chú rể.
- **US-1.2: Biết ngay còn bao lâu đến ngày cưới** — Là khách mời, tôi muốn thấy bộ đếm ngược (ngày - giờ - phút - giây) để biết còn bao lâu nữa đến ngày cưới và sắp xếp lịch.
- **US-1.3: Thấy tên mình trên thiệp** — Là khách mời, tôi muốn thấy tên mình được hiển thị trên thiệp (ví dụ: "Trân trọng kính mời Anh/Chị Nguyễn Văn A") để cảm thấy được mời một cách cá nhân.
- **US-1.4: Xem ảnh cô dâu chú rể** — Là khách mời, tôi muốn thấy ảnh bìa đẹp của cô dâu & chú rể ngay khi mở thiệp để nhận diện đúng đám cưới.
- **US-1.5: Xem tốt trên điện thoại** — Là khách mời, tôi muốn thiệp hiển thị đẹp trên điện thoại vì tôi thường mở link từ Zalo/Messenger.
- **US-1.6: Trải nghiệm hiệu ứng sinh động** — Là khách mời, tôi muốn thấy hiệu ứng đẹp (hoa rơi, animation mở thiệp...) để có cảm giác thú vị khi mở thiệp.
- **US-1.7: Nghe nhạc nền lãng mạn** — Là khách mời, tôi muốn nghe nhạc nền nhẹ nhàng khi xem thiệp để tạo không khí lãng mạn. Tôi cũng muốn có nút tắt/bật nhạc.
- **US-1.8: Điều hướng nhanh** — Là khách mời, tôi muốn dễ dàng chuyển đến phần xác nhận tham dự, bản đồ, hoặc lời chúc mà không cần cuộn nhiều.

#### Cô dâu / Chú rể (Owner)
- **US-1.9: Chọn mẫu thiệp phù hợp** — Là chủ thiệp, tôi muốn xem trước và chọn một mẫu thiệp phù hợp phong cách đám cưới của mình.
- **US-1.10: Tùy chỉnh nội dung trang chủ** — Là chủ thiệp, tôi muốn thay đổi ảnh bìa, tên, ngày cưới, và lời chào để thiệp mang dấu ấn cá nhân.
- **US-1.11: Tải trang nhanh** — Là chủ thiệp, tôi muốn thiệp tải nhanh dù khách mời dùng 4G yếu, để không ai bỏ qua vì chờ lâu.

## 2. Thông tin đám cưới ✅
- ✅ Thông tin cặp đôi (CoupleInfo): ảnh, tên, thông tin cha mẹ
- ✅ Ngày, giờ tổ chức
- ✅ Địa điểm kèm link Google Maps
- ✅ Lịch trình 3 sự kiện: Lễ Vu Quy, Lễ Thành Hôn, Tiệc Cưới

## 3. Quản lý mẫu thiệp ✅ (một phần)
- ✅ Tùy chỉnh màu sắc qua theme config (primaryColor, secondaryColor, accentColor)
- ✅ Hiệu ứng animation (hoa rơi, fadeIn, heartbeat, heroZoom...)
- ✅ Nhạc nền SoundCloud embed (bật/tắt)
- ⬜ Nhiều template thiệp cưới để lựa chọn
- ⬜ Tùy chỉnh font chữ, hình nền từ admin

## 4. Gallery ảnh cưới ✅
- ✅ Album ảnh pre-wedding (6 ảnh)
- ✅ Lightbox xem ảnh phóng to
- ⬜ Slideshow ảnh tự động

## 5. Câu chuyện tình yêu (Love Story) ✅
- ✅ Timeline câu chuyện tình yêu theo mốc thời gian
- ✅ Icon & mô tả cho từng giai đoạn
- ⬜ Hình ảnh cho từng giai đoạn

## 6. Xác nhận tham dự (RSVP) ✅
- ✅ Form xác nhận tham dự
- ⬜ Chọn số lượng khách đi cùng
- ⬜ Ghi chú (dị ứng thức ăn, yêu cầu đặc biệt...)
- ⬜ Gửi email/SMS xác nhận tự động

## 7. Sổ lưu bút (Guestbook) ✅
- ✅ Khách mời gửi lời chúc
- ✅ Hiển thị lời chúc dạng đẹp mắt (avatar, thời gian)
- ✅ Lưu lời chúc vào file JSON theo từng cặp đôi
- ⬜ Kiểm duyệt lời chúc trước khi hiển thị

## 8. Mừng cưới online ✅
- ✅ Hiển thị QR code chuyển khoản ngân hàng
- ✅ Hiển thị số tài khoản cô dâu & chú rể
- ✅ Hỗ trợ nhiều ngân hàng (Vietcombank, VietinBank)
- ✅ Click QR để phóng to cho dễ quét

## 9. Chia sẻ & Mời khách ✅ (một phần)
- ✅ Tạo link thiệp riêng cho từng khách mời: `/{coupleSlug}?{tên_khách}`
- ✅ Hỗ trợ nhiều cặp đôi dùng chung hệ thống
- ⬜ Chia sẻ qua Facebook, Zalo, Messenger
- ⬜ Tạo QR code cho thiệp
- ⬜ Gửi thiệp qua SMS/Email hàng loạt

## 10. Quản lý (Admin) ✅
- ✅ Trang admin quản lý nhiều cặp đôi (`/admin`)
- ✅ Tạo / xóa cặp đôi mới
- ✅ Tab "Thông tin cặp đôi": chỉnh sửa tên, ảnh, cha mẹ cô dâu & chú rể
- ✅ Tab "Ảnh cưới": upload / đổi ảnh đại diện, ảnh bìa, quản lý album (thêm/xóa)
- ✅ Tab "Mừng cưới": quản lý tài khoản ngân hàng + upload QR code
  - Upload / đổi ảnh QR chuyển khoản
  - Sửa tên chủ TK, ngân hàng, số TK, chi nhánh
  - Thêm / xóa tài khoản
- ✅ Xem trước thiệp từ admin
- ⬜ Quản lý danh sách khách mời
- ⬜ Thống kê số lượng khách xác nhận
- ⬜ Xuất danh sách ra Excel

## 11. Tính năng kỹ thuật ✅ (một phần)
- ✅ Responsive (hiển thị tốt trên điện thoại, 3 breakpoint)
- ✅ CSS animations mượt mà (GPU-accelerated)
- ✅ Config bằng JSON — dễ thay đổi thông tin
- ✅ Multi-couple: nhiều cặp đôi dùng chung 1 hệ thống
- ✅ API RESTful (NodeJS/Express)
- ⬜ SEO friendly
- ⬜ Hỗ trợ đa ngôn ngữ (Việt/Anh)
- ⬜ PWA (có thể cài như app trên điện thoại)

## 12. Tính năng bổ sung (nâng cao) ⬜
- ⬜ Livestream đám cưới
- ⬜ Mini game cho khách mời
- ⬜ Dress code gợi ý trang phục
- ⬜ Danh sách quà mong muốn (Gift Registry)
- ⬜ Thông tin khách sạn/nhà nghỉ gần địa điểm

---

## URL Convention

### Thiệp cưới
```
/{coupleSlug}?{tên_khách_mời}

Ví dụ:
/bao_&_phuong?quynh_ia_chay      → Thiệp Bảo & Phương, mời Quỳnh Ia Chảy
/bao_&_phuong?anh_đạt            → Thiệp Bảo & Phương, mời Anh Đạt
/minh_&_trang?to=chị_hoa         → Thiệp Minh & Trang, mời Chị Hoa
```

### Admin
```
/admin                            → Danh sách tất cả cặp đôi
/admin/{coupleSlug}               → Quản lý 1 cặp đôi cụ thể
```

## Cấu trúc data (Multi-couple)
```
data/couples/
  bao_&_phuong/
    wedding.json                  → Config thiệp cưới
    wishes.json                   → Lời chúc từ khách mời
  minh_&_trang/
    wedding.json
    wishes.json
```
