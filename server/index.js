const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;
// DATA_DIR có thể override qua env để test dùng thư mục tạm
const COUPLES_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data', 'couples');
const IMAGES_DIR = path.join(__dirname, '..', 'client', 'public', 'images');

app.use(cors());
app.use(express.json());

// ===== HELPERS =====

function getCoupleDir(slug) {
  return path.join(COUPLES_DIR, slug);
}

function getWeddingPath(slug) {
  return path.join(getCoupleDir(slug), 'wedding.json');
}

function getWishesPath(slug) {
  return path.join(getCoupleDir(slug), 'wishes.json');
}

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJSON(filePath, data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function syncToPublic(slug, data) {
  const publicDir = path.join(__dirname, '..', 'client', 'public', 'data', 'couples', slug);
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  writeJSON(path.join(publicDir, 'wedding.json'), data);
}

function listCouples() {
  if (!fs.existsSync(COUPLES_DIR)) return [];
  return fs.readdirSync(COUPLES_DIR).filter((name) => {
    const dir = path.join(COUPLES_DIR, name);
    return fs.statSync(dir).isDirectory() && fs.existsSync(path.join(dir, 'wedding.json'));
  });
}

// ===== PUBLIC API =====

// GET: Danh sách tất cả cặp đôi
app.get('/api/couples', (req, res) => {
  try {
    const couples = listCouples().map((slug) => {
      const data = readJSON(getWeddingPath(slug));
      return {
        slug,
        groom: data.couple.groom.fullName,
        bride: data.couple.bride.fullName,
        date: data.wedding.date,
      };
    });
    res.json(couples);
  } catch (err) {
    res.status(500).json({ error: 'Không thể đọc danh sách' });
  }
});

// GET: Lấy wedding data theo coupleSlug
app.get('/api/wedding/:slug', (req, res) => {
  try {
    const filePath = getWeddingPath(req.params.slug);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Không tìm thấy cặp đôi' });
    }
    const data = readJSON(filePath);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Không thể đọc dữ liệu' });
  }
});

// Backward compatible: /api/wedding (lấy cặp đôi đầu tiên)
app.get('/api/wedding', (req, res) => {
  try {
    const couples = listCouples();
    if (couples.length === 0) {
      return res.status(404).json({ error: 'Chưa có cặp đôi nào' });
    }
    const data = readJSON(getWeddingPath(couples[0]));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Không thể đọc dữ liệu' });
  }
});

// ===== WISHES API =====

app.get('/api/wishes/:slug', (req, res) => {
  try {
    const filePath = getWishesPath(req.params.slug);
    if (!fs.existsSync(filePath)) return res.json([]);
    res.json(readJSON(filePath));
  } catch {
    res.json([]);
  }
});

app.post('/api/wishes/:slug', (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }

  try {
    const filePath = getWishesPath(req.params.slug);
    const wishes = fs.existsSync(filePath) ? readJSON(filePath) : [];
    const newWish = {
      name: name.trim(),
      message: message.trim(),
      time: new Date().toISOString(),
    };
    wishes.unshift(newWish);
    writeJSON(filePath, wishes);
    res.json(newWish);
  } catch {
    res.status(500).json({ error: 'Không thể lưu lời chúc' });
  }
});

// ===== ADMIN API =====

const AUDIO_DIR = path.join(__dirname, '..', 'client', 'public', 'audio');

// Multer config: lưu ảnh vào client/public/images/{coupleSlug}/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const slug = req.params.slug || 'default';
    const dir = path.join(IMAGES_DIR, slug);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = req.body.fieldName || Date.now().toString();
    cb(null, name + ext);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Chỉ chấp nhận file ảnh'));
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Multer config: lưu audio vào client/public/audio/{coupleSlug}/
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const slug = req.params.slug || 'default';
    const dir = path.join(AUDIO_DIR, slug);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `music_${Date.now()}${ext}`);
  },
});
const uploadAudio = multer({
  storage: audioStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) cb(null, true);
    else cb(new Error('Chỉ chấp nhận file âm thanh'));
  },
  limits: { fileSize: 20 * 1024 * 1024 },
});

// GET: Danh sách cặp đôi cho admin
app.get('/api/admin/couples', (req, res) => {
  try {
    const couples = listCouples().map((slug) => {
      const data = readJSON(getWeddingPath(slug));
      return {
        slug,
        groom: data.couple.groom.fullName,
        bride: data.couple.bride.fullName,
        date: data.wedding.date,
        coverPhoto: data.couple.coverPhoto,
      };
    });
    res.json(couples);
  } catch (err) {
    res.status(500).json({ error: 'Không thể đọc danh sách' });
  }
});

// POST: Tạo cặp đôi mới
app.post('/api/admin/couples', (req, res) => {
  try {
    const { slug } = req.body;
    if (!slug) return res.status(400).json({ error: 'Thiếu slug' });

    const coupleDir = getCoupleDir(slug);
    if (fs.existsSync(coupleDir)) {
      return res.status(400).json({ error: 'Cặp đôi đã tồn tại' });
    }

    fs.mkdirSync(coupleDir, { recursive: true });

    // Tạo wedding.json mặc định
    const defaultData = {
      couple: {
        groom: { firstName: '', lastName: '', fullName: 'Chú Rể', parent: '', avatar: '' },
        bride: { firstName: '', lastName: '', fullName: 'Cô Dâu', parent: '', avatar: '' },
        coverPhoto: '',
        photos: [],
      },
      wedding: {
        greetingText: 'Trân trọng kính mời',
        title: 'Chúng mình cưới!',
        description: 'Chúng tôi vui mừng thông báo và kính mời bạn đến chung vui trong ngày trọng đại của chúng tôi.',
        date: '',
        time: '',
        lunarDate: '',
        events: [],
      },
      loveStory: [],
      music: { embedUrl: '' },
      bankAccounts: [],
      theme: {
        templateId: 'vintage-rose',
        primaryColor: '#d4a373',
        secondaryColor: '#faedcd',
        accentColor: '#e63946',
        fontFamily: "'Playfair Display', 'Dancing Script', serif",
        backgroundPattern: 'floral',
      },
    };

    writeJSON(getWeddingPath(slug), defaultData);
    writeJSON(getWishesPath(slug), []);
    syncToPublic(slug, defaultData);

    res.json({ success: true, slug });
  } catch (err) {
    res.status(500).json({ error: 'Không thể tạo cặp đôi' });
  }
});

// GET: Lấy data 1 cặp đôi cho admin
app.get('/api/admin/wedding/:slug', (req, res) => {
  try {
    const filePath = getWeddingPath(req.params.slug);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Không tìm thấy' });
    }
    res.json(readJSON(filePath));
  } catch (err) {
    res.status(500).json({ error: 'Không thể đọc dữ liệu' });
  }
});

// PUT: Cập nhật thông tin couple
app.put('/api/admin/couple/:slug', (req, res) => {
  try {
    const data = readJSON(getWeddingPath(req.params.slug));
    const { groom, bride } = req.body;
    if (groom) data.couple.groom = { ...data.couple.groom, ...groom };
    if (bride) data.couple.bride = { ...data.couple.bride, ...bride };
    writeJSON(getWeddingPath(req.params.slug), data);
    syncToPublic(req.params.slug, data);
    res.json({ success: true, couple: data.couple });
  } catch (err) {
    res.status(500).json({ error: 'Không thể lưu' });
  }
});

// PUT: Cập nhật thông tin đám cưới (wedding info + bankAccounts)
app.put('/api/admin/wedding/:slug', (req, res) => {
  try {
    const data = readJSON(getWeddingPath(req.params.slug));
    const { bankAccounts, ...weddingUpdates } = req.body;

    if (Object.keys(weddingUpdates).length > 0) {
      data.wedding = { ...data.wedding, ...weddingUpdates };
    }
    if (bankAccounts !== undefined) {
      data.bankAccounts = bankAccounts;
    }

    writeJSON(getWeddingPath(req.params.slug), data);
    syncToPublic(req.params.slug, data);
    res.json({ success: true, wedding: data.wedding, bankAccounts: data.bankAccounts });
  } catch (err) {
    res.status(500).json({ error: 'Không thể lưu' });
  }
});

// POST: Upload ảnh cho cặp đôi
app.post('/api/admin/upload/:slug', upload.single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Không có file' });

    const slug = req.params.slug;
    const imageUrl = `/images/${slug}/${req.file.filename}`;
    const { target } = req.body;
    const data = readJSON(getWeddingPath(slug));

    if (target === 'groom-avatar') data.couple.groom.avatar = imageUrl;
    else if (target === 'bride-avatar') data.couple.bride.avatar = imageUrl;
    else if (target === 'cover') data.couple.coverPhoto = imageUrl;
    else if (target === 'gallery') {
      if (!data.couple.photos) data.couple.photos = [];
      data.couple.photos.push(imageUrl);
    }

    writeJSON(getWeddingPath(slug), data);
    syncToPublic(slug, data);
    res.json({ success: true, imageUrl });
  } catch (err) {
    res.status(500).json({ error: 'Upload thất bại' });
  }
});

// DELETE: Xóa ảnh gallery
app.delete('/api/admin/gallery/:slug', (req, res) => {
  try {
    const slug = req.params.slug;
    const { imageUrl } = req.body;
    const data = readJSON(getWeddingPath(slug));
    data.couple.photos = data.couple.photos.filter((p) => p !== imageUrl);

    const filePath = path.join(__dirname, '..', 'client', 'public', imageUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    writeJSON(getWeddingPath(slug), data);
    syncToPublic(slug, data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Không thể xóa' });
  }
});

// POST: Upload nhạc nền (mp3) — dùng <audio> để phát được trên iOS
app.post('/api/admin/audio/:slug', uploadAudio.single('audio'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Không có file audio' });
    const slug = req.params.slug;
    const audioUrl = `/audio/${slug}/${req.file.filename}`;
    const data = readJSON(getWeddingPath(slug));
    if (!data.music) data.music = {};
    data.music.audioUrl = audioUrl;
    writeJSON(getWeddingPath(slug), data);
    syncToPublic(slug, data);
    res.json({ success: true, audioUrl });
  } catch (err) {
    res.status(500).json({ error: 'Upload audio thất bại' });
  }
});

// PUT: Cập nhật theme / template
app.put('/api/admin/theme/:slug', (req, res) => {
  try {
    const data = readJSON(getWeddingPath(req.params.slug));
    data.theme = { ...data.theme, ...req.body };
    writeJSON(getWeddingPath(req.params.slug), data);
    syncToPublic(req.params.slug, data);
    res.json({ success: true, theme: data.theme });
  } catch (err) {
    res.status(500).json({ error: 'Không thể lưu theme' });
  }
});

// DELETE: Xóa cặp đôi
app.delete('/api/admin/couples/:slug', (req, res) => {
  try {
    const coupleDir = getCoupleDir(req.params.slug);
    if (fs.existsSync(coupleDir)) {
      fs.rmSync(coupleDir, { recursive: true });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Không thể xóa' });
  }
});

// Serve static React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
  });
}

// Chỉ listen khi chạy trực tiếp (không phải khi được require trong test)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
