# Thiệp Cưới Online - Cấu trúc dự án

## Tổng quan

Website thiệp cưới online được xây dựng với **React** (Frontend) và **NodeJS/Express** (Backend). Toàn bộ thông tin cô dâu, chú rể và đám cưới được quản lý qua 1 file JSON duy nhất.

## Cấu trúc thư mục

```
ThiepCuoiOnline/
│
├── data/                              # Dữ liệu cấu hình
│   └── wedding.json                   # ★ File config chính - chỉnh sửa thông tin đám cưới tại đây
│
├── client/                            # Frontend - ReactJS
│   ├── public/
│   │   └── index.html                 # HTML gốc, load Google Fonts
│   │
│   ├── src/
│   │   ├── index.js                   # Entry point, render App vào #root
│   │   ├── App.js                     # Component chính, fetch data từ API, quản lý routing
│   │   │
│   │   ├── components/                # Các component React
│   │   │   ├── Hero.js                # Ảnh bìa, tên cô dâu chú rể, lời chào khách mời
│   │   │   ├── Countdown.js           # Bộ đếm ngược: Ngày - Giờ - Phút - Giây
│   │   │   ├── EventInfo.js           # Lịch trình sự kiện (Vu Quy, Thành Hôn, Tiệc Cưới) + link Maps
│   │   │   ├── Navigation.js          # Thanh điều hướng cố định ở dưới màn hình
│   │   │   ├── FloatingPetals.js      # Hiệu ứng hoa cánh rơi
│   │   │   └── MusicPlayer.js         # Nút bật/tắt nhạc nền (góc trên phải)
│   │   │
│   │   └── assets/
│   │       └── css/
│   │           ├── index.css          # CSS global: reset, loading screen
│   │           └── App.css            # CSS chính: animations, responsive, layout
│   │
│   └── package.json                   # Dependencies: react, react-dom, react-scripts
│
├── server/                            # Backend - NodeJS
│   ├── index.js                       # Express server: API /api/wedding, serve static build
│   └── package.json                   # Dependencies: express, cors
│
├── package.json                       # Root scripts: dev, build, start
├── FEATURES.md                        # Danh sách tính năng + User Stories
└── Structure.md                       # File này
```

## Mô tả các file quan trọng

### `data/wedding.json`

File cấu hình trung tâm. Chỉ cần sửa file này để thay đổi toàn bộ nội dung thiệp:

| Trường | Mô tả |
|---|---|
| `couple.groom` / `couple.bride` | Tên, ảnh đại diện, thông tin cha mẹ |
| `couple.coverPhoto` | Ảnh bìa nền trang chủ |
| `couple.photos` | Danh sách ảnh gallery |
| `wedding.date` / `wedding.time` | Ngày giờ cưới (dùng cho đếm ngược) |
| `wedding.events[]` | Danh sách sự kiện: tên, giờ, địa điểm, link Google Maps |
| `music.embedUrl` | Link embed nhạc nền (Zing MP3) |
| `theme` | Màu chủ đạo, font chữ, kiểu nền |
| `bankAccounts[]` | Thông tin tài khoản mừng cưới online |

### `client/src/App.js`

- Fetch dữ liệu từ `/api/wedding`
- Đọc tên khách mời từ URL query `?to=Tên Khách`
- Render các section: Hero → Countdown → Events

### `server/index.js`

- `GET /api/wedding` — Trả về nội dung `wedding.json`
- Production: serve static build của React

## Cách chạy dự án

### Yêu cầu

- **Node.js** >= 16
- **npm** >= 8

### Cài đặt

```bash
# Cài dependencies cho root (concurrently)
npm install

# Cài dependencies cho client (React)
cd client && npm install && cd ..

# Cài dependencies cho server (Express)
cd server && npm install && cd ..
```

### Chạy development

```bash
# Chạy cả Frontend + Backend cùng lúc
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Chạy riêng lẻ

```bash
# Chỉ chạy Frontend
npm run client

# Chỉ chạy Backend
npm run server
```

### Build production

```bash
# Build React thành static files
npm run build

# Chạy server production (serve static build)
NODE_ENV=production npm start
```

## Link cá nhân hóa cho khách mời

Thêm query `?to=` vào URL để hiển thị tên khách trên thiệp:

```
http://localhost:3000?to=Anh Nguyễn Văn A
http://localhost:3000?to=Chị Trần Thị B
```

## Thêm ảnh và nhạc

Đặt các file media vào `client/public/`:

```
client/public/
├── images/
│   ├── cover.jpg          # Ảnh bìa (khuyến nghị: 1920x1080)
│   ├── groom.jpg          # Ảnh chú rể (vuông, 500x500)
│   ├── bride.jpg          # Ảnh cô dâu (vuông, 500x500)
│   ├── qr-groom.jpg       # QR chuyển khoản chú rể
│   ├── qr-bride.jpg       # QR chuyển khoản cô dâu
│   └── gallery/
│       ├── photo1.jpg     # Ảnh pre-wedding
│       ├── photo2.jpg
│       └── ...
└── data/
    └── wedding.json   # Bản copy JSON cho static hosting (Vercel/Netlify)
```

## Deploy lên Vercel (Hosting miễn phí)

### Bước 1: Chuẩn bị

Đảm bảo file `wedding.json` đã được copy vào `client/public/data/` để React có thể đọc trực tiếp mà không cần backend:

```bash
mkdir -p client/public/data
cp data/wedding.json client/public/data/wedding.json
```

> **Lưu ý:** Mỗi khi sửa `data/wedding.json`, nhớ copy lại vào `client/public/data/` trước khi deploy.

### Bước 2: Tạo tài khoản Vercel

1. Truy cập https://vercel.com
2. Click **Sign Up** → Đăng ký bằng **GitHub** (khuyên dùng) hoặc Email
3. Xác nhận email nếu cần

### Bước 3: Cài Vercel CLI

```bash
npm install -g vercel
```

### Bước 4: Đăng nhập Vercel từ terminal

```bash
vercel login
```

- Chọn phương thức đăng nhập (GitHub / Email)
- Trình duyệt sẽ tự mở để xác thực
- Quay lại terminal khi thấy "Congratulations! You are now signed in."

### Bước 5: Deploy

```bash
cd client
vercel --prod --yes
```

Vercel sẽ tự động:
- Nhận diện project React (Create React App)
- Chạy `npm install` + `npm run build`
- Deploy lên production

Sau khi xong sẽ nhận được link dạng: `https://ten-project.vercel.app`

### Bước 6: Đổi tên domain (tùy chọn)

1. Truy cập https://vercel.com/dashboard
2. Chọn project vừa deploy
3. Vào **Settings** → **Domains**
4. Thêm domain mới, ví dụ: `happy-ending.vercel.app`
5. Hoặc thêm domain riêng nếu có (ví dụ: `thiepcuoi.com`)

### Deploy lại sau khi sửa code

```bash
# Sửa code xong, copy lại JSON nếu có thay đổi
cp data/wedding.json client/public/data/wedding.json

# Deploy lại
cd client
vercel --prod --yes
```

### Link cá nhân hóa trên production

```
https://ten-project.vercel.app?to=Anh Nguyễn Văn A
https://ten-project.vercel.app?to=Chị Trần Thị B
```
