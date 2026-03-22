# Session Log - Thiệp Cưới Online

> Ngày: 2026-03-19

## Tóm tắt

Xây dựng website thiệp cưới online từ đầu, từ lên ý tưởng đến deploy production.

---

## 1. Lên danh sách tính năng

Đã thống nhất 12 nhóm tính năng chính:

1. Trang chủ / Landing Page
2. Thông tin đám cưới
3. Quản lý mẫu thiệp
4. Gallery ảnh cưới
5. Câu chuyện tình yêu (Love Story)
6. Xác nhận tham dự (RSVP)
7. Sổ lưu bút (Guestbook)
8. Mừng cưới online (QR chuyển khoản)
9. Chia sẻ & Mời khách
10. Quản lý khách mời (Admin)
11. Tính năng kỹ thuật (Responsive, PWA, SEO)
12. Tính năng bổ sung (Livestream, Mini game, Gift Registry)

→ Lưu tại: `FEATURES.md`

## 2. Viết User Stories cho Landing Page

Tạo 11 user stories chia làm 2 nhóm:
- **Khách mời (Guest):** US-1.1 → US-1.8 (xem thiệp đẹp, đếm ngược, tên cá nhân, responsive, animation, nhạc nền, điều hướng)
- **Cô dâu/Chú rể (Owner):** US-1.9 → US-1.11 (chọn mẫu, tùy chỉnh, tốc độ tải)

→ Bổ sung vào: `FEATURES.md`

## 3. Xây dựng Landing Page

### Tech stack
- **Frontend:** React (react-scripts / CRA)
- **Backend:** NodeJS + Express
- **Config:** JSON file (`data/wedding.json`)

### Cấu trúc project

```
ThiepCuoiOnline/
├── data/wedding.json              # Config trung tâm
├── client/                        # React frontend
│   ├── public/
│   │   ├── index.html
│   │   ├── images/                # Ảnh cô dâu, chú rể, cover
│   │   └── data/wedding.json      # Copy cho static hosting
│   └── src/
│       ├── index.js
│       ├── App.js
│       ├── components/
│       │   ├── Hero.js            # Ảnh bìa + tên + lời chào khách
│       │   ├── Countdown.js       # Đếm ngược ngày cưới
│       │   ├── EventInfo.js       # Lịch trình sự kiện + Google Maps
│       │   ├── Navigation.js      # Bottom nav bar
│       │   ├── FloatingPetals.js  # Hiệu ứng hoa rơi
│       │   └── MusicPlayer.js     # Nhạc Zing MP3 embed
│       └── assets/css/
│           ├── index.css
│           └── App.css
├── server/
│   └── index.js                   # Express API
└── package.json
```

### Các tính năng đã hoàn thành
- Hero section với ảnh bìa, tên cô dâu chú rể, lời chào khách mời cá nhân hóa
- Bộ đếm ngược (Ngày - Giờ - Phút - Giây) realtime
- Lịch trình 3 sự kiện: Lễ Vu Quy, Lễ Thành Hôn, Tiệc Cưới
- Hiệu ứng hoa cánh rơi (FloatingPetals) - GPU-accelerated
- Nhạc nền Zing MP3 embed (bật/tắt)
- Bottom navigation bar (điều hướng mượt)
- CSS animations: heroZoom, fadeInUp/Down, heartbeat, bounceDown, petalFall, rotateStar, musicPulse
- Responsive: 3 breakpoint (desktop > 768px > 480px)
- Link cá nhân hóa: `?to=Tên Khách`

### Yêu cầu đặc biệt đã đáp ứng
1. Animation mượt mà → dùng `transform`, `will-change`, GPU-accelerated
2. Responsive mobile → 3 breakpoint, mobile-first nav
3. Config bằng JSON → `data/wedding.json` dễ thay đổi

## 4. Thông tin cô dâu chú rể

Đã cập nhật vào `wedding.json`:
- **Chú rể:** Bùi Ngọc Bảo (cha: Bùi Văn Bích, mẹ: Tạ Thị Vĩnh)
- **Cô dâu:** Trần Thị Lan Phương (cha: Trần Tuấn Anh, mẹ: Tạ Thị Vân)
- **Ngày cưới:** 15/06/2026
- **Địa điểm:** Đinh Xá, Nguyệt Đức, Phú Thọ
- **Ảnh:** bride.jpg, groom.jpg, picture music.jpg (cover)
- **Nhạc:** Zing MP3 embed (ZW79ZBE8)
- **Google Maps:** Đã cập nhật link thật cho cả 3 sự kiện

## 5. Push lên GitHub

- **Repo:** https://github.com/buingocbao1599/happy_ending
- **Branch:** main
- **2 commits:**
  1. `Initial commit: Thiệp Cưới Online - Landing Page`
  2. `Add Vercel deploy guide and static JSON for hosting`

## 6. Deploy lên Vercel

- **URL Production:** https://client-navy-six-18.vercel.app
- **Alias:** https://client-navy-six-18.vercel.app
- **Phương pháp:** Vercel CLI (`vercel --prod --yes`)
- **Cách deploy:** Static React build (không cần backend)
- **Fallback:** `client/public/data/wedding.json` cho static hosting

## 7. Tài liệu đã tạo

| File | Nội dung |
|---|---|
| `FEATURES.md` | Danh sách tính năng + User Stories |
| `Structure.md` | Cấu trúc code + Hướng dẫn chạy + Deploy Vercel |
| `SESSION_LOG.md` | File này - Tóm tắt toàn bộ session |

---

## Việc cần làm tiếp (backlog)

- [ ] Thêm ảnh cover chung 2 người (thay thế `picture music.jpg`)
- [ ] Hoàn thiện Gallery ảnh cưới (Feature 4)
- [ ] Love Story timeline (Feature 5)
- [ ] Form RSVP xác nhận tham dự (Feature 6)
- [ ] Sổ lưu bút / Guestbook (Feature 7)
- [ ] Mừng cưới online - QR chuyển khoản (Feature 8)
- [ ] Chia sẻ qua Zalo/Facebook + QR code (Feature 9)
- [ ] Admin quản lý khách mời (Feature 10)
- [ ] Đổi domain Vercel cho đẹp hơn
- [ ] Cập nhật thông tin ngân hàng thật vào wedding.json
