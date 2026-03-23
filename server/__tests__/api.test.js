const request = require('supertest');
const path = require('path');
const fs = require('fs');
const os = require('os');

// =====================================================
// Setup: tạo thư mục test tạm, inject qua DATA_DIR env
// =====================================================
let testDataDir;
const TEST_SLUG = 'test_couple';

const mockWeddingData = {
  couple: {
    groom: { firstName: 'Nguyễn', lastName: 'Nam', fullName: 'Nguyễn Nam', parent: 'Bố A & Mẹ B', avatar: '' },
    bride: { firstName: 'Trần', lastName: 'Nữ', fullName: 'Trần Nữ', parent: 'Bố C & Mẹ D', avatar: '' },
    coverPhoto: '',
    photos: [],
  },
  wedding: {
    greetingText: 'Trân trọng kính mời',
    title: 'Chúng mình cưới!',
    description: 'Test description',
    date: '2030-06-15',
    time: '10:00',
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
    fontFamily: 'serif',
    backgroundPattern: 'floral',
  },
};

beforeAll(() => {
  // Tạo thư mục tạm cho test data
  testDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'thiepcuoi-test-'));
  process.env.DATA_DIR = testDataDir;

  // Tạo 1 cặp đôi test
  const coupleDir = path.join(testDataDir, TEST_SLUG);
  fs.mkdirSync(coupleDir, { recursive: true });
  fs.writeFileSync(
    path.join(coupleDir, 'wedding.json'),
    JSON.stringify(mockWeddingData, null, 2)
  );
  fs.writeFileSync(
    path.join(coupleDir, 'wishes.json'),
    JSON.stringify([], null, 2)
  );
});

afterAll(() => {
  // Dọn dẹp thư mục tạm
  fs.rmSync(testDataDir, { recursive: true, force: true });
  delete process.env.DATA_DIR;
});

// Require app SAU khi đã set DATA_DIR
let app;
beforeAll(() => {
  app = require('../index');
});

// =====================================================
// GET /api/couples
// =====================================================
describe('GET /api/couples', () => {
  test('trả về HTTP 200', async () => {
    const res = await request(app).get('/api/couples');
    expect(res.status).toBe(200);
  });

  test('trả về array', async () => {
    const res = await request(app).get('/api/couples');
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('array chứa cặp đôi test', async () => {
    const res = await request(app).get('/api/couples');
    const found = res.body.find((c) => c.slug === TEST_SLUG);
    expect(found).toBeDefined();
    expect(found.groom).toBe('Nguyễn Nam');
    expect(found.bride).toBe('Trần Nữ');
  });
});

// =====================================================
// GET /api/wedding/:slug
// =====================================================
describe('GET /api/wedding/:slug', () => {
  test('trả về HTTP 200 cho slug hợp lệ', async () => {
    const res = await request(app).get(`/api/wedding/${TEST_SLUG}`);
    expect(res.status).toBe(200);
  });

  test('trả về đầy đủ cấu trúc wedding data', async () => {
    const res = await request(app).get(`/api/wedding/${TEST_SLUG}`);
    expect(res.body).toHaveProperty('couple');
    expect(res.body).toHaveProperty('wedding');
    expect(res.body).toHaveProperty('theme');
    expect(res.body).toHaveProperty('bankAccounts');
    expect(res.body).toHaveProperty('loveStory');
  });

  test('trả về đúng tên cô dâu chú rể', async () => {
    const res = await request(app).get(`/api/wedding/${TEST_SLUG}`);
    expect(res.body.couple.groom.fullName).toBe('Nguyễn Nam');
    expect(res.body.couple.bride.fullName).toBe('Trần Nữ');
  });

  test('trả về HTTP 404 cho slug không tồn tại', async () => {
    const res = await request(app).get('/api/wedding/slug_khong_ton_tai');
    expect(res.status).toBe(404);
  });

  test('trả về error message khi 404', async () => {
    const res = await request(app).get('/api/wedding/slug_khong_ton_tai');
    expect(res.body).toHaveProperty('error');
  });
});

// =====================================================
// GET /api/wishes/:slug
// =====================================================
describe('GET /api/wishes/:slug', () => {
  test('trả về HTTP 200', async () => {
    const res = await request(app).get(`/api/wishes/${TEST_SLUG}`);
    expect(res.status).toBe(200);
  });

  test('trả về array (rỗng lúc đầu)', async () => {
    const res = await request(app).get(`/api/wishes/${TEST_SLUG}`);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('trả về array rỗng khi chưa có lời chúc', async () => {
    const res = await request(app).get(`/api/wishes/${TEST_SLUG}`);
    expect(res.body).toHaveLength(0);
  });

  test('trả về array rỗng cho slug không có file wishes', async () => {
    const res = await request(app).get('/api/wishes/slug_khong_co_wishes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// =====================================================
// POST /api/wishes/:slug
// =====================================================
describe('POST /api/wishes/:slug', () => {
  test('tạo lời chúc mới và trả về HTTP 200', async () => {
    const res = await request(app)
      .post(`/api/wishes/${TEST_SLUG}`)
      .send({ name: 'Nguyễn Văn Test', message: 'Chúc mừng hai bạn!' });
    expect(res.status).toBe(200);
  });

  test('response chứa đúng name và message', async () => {
    const res = await request(app)
      .post(`/api/wishes/${TEST_SLUG}`)
      .send({ name: 'Trần Thị Test', message: 'Hạnh phúc mãi mãi!' });
    expect(res.body.name).toBe('Trần Thị Test');
    expect(res.body.message).toBe('Hạnh phúc mãi mãi!');
  });

  test('response chứa trường time (timestamp)', async () => {
    const res = await request(app)
      .post(`/api/wishes/${TEST_SLUG}`)
      .send({ name: 'Test', message: 'Test message' });
    expect(res.body).toHaveProperty('time');
    expect(new Date(res.body.time).getTime()).not.toBeNaN();
  });

  test('lời chúc mới xuất hiện khi GET lại', async () => {
    await request(app)
      .post(`/api/wishes/${TEST_SLUG}`)
      .send({ name: 'Kiểm Tra', message: 'Lời chúc kiểm tra' });

    const res = await request(app).get(`/api/wishes/${TEST_SLUG}`);
    const found = res.body.find((w) => w.name === 'Kiểm Tra');
    expect(found).toBeDefined();
    expect(found.message).toBe('Lời chúc kiểm tra');
  });

  test('trả về HTTP 400 khi thiếu name', async () => {
    const res = await request(app)
      .post(`/api/wishes/${TEST_SLUG}`)
      .send({ message: 'Không có tên' });
    expect(res.status).toBe(400);
  });

  test('trả về HTTP 400 khi thiếu message', async () => {
    const res = await request(app)
      .post(`/api/wishes/${TEST_SLUG}`)
      .send({ name: 'Không có message' });
    expect(res.status).toBe(400);
  });

  test('trả về HTTP 400 khi body rỗng', async () => {
    const res = await request(app)
      .post(`/api/wishes/${TEST_SLUG}`)
      .send({});
    expect(res.status).toBe(400);
  });

  test('lời chúc mới nhất nằm ở đầu mảng (unshift)', async () => {
    const slugForOrder = 'order_test_couple';
    const coupleDir = path.join(testDataDir, slugForOrder);
    fs.mkdirSync(coupleDir, { recursive: true });
    fs.writeFileSync(path.join(coupleDir, 'wedding.json'), JSON.stringify(mockWeddingData));
    fs.writeFileSync(path.join(coupleDir, 'wishes.json'), JSON.stringify([]));

    await request(app).post(`/api/wishes/${slugForOrder}`).send({ name: 'Đầu tiên', message: 'Lời 1' });
    await request(app).post(`/api/wishes/${slugForOrder}`).send({ name: 'Thứ hai', message: 'Lời 2' });

    const res = await request(app).get(`/api/wishes/${slugForOrder}`);
    expect(res.body[0].name).toBe('Thứ hai');
    expect(res.body[1].name).toBe('Đầu tiên');
  });
});

// =====================================================
// PUT /api/admin/theme/:slug
// =====================================================
describe('PUT /api/admin/theme/:slug', () => {
  test('cập nhật templateId thành công', async () => {
    const res = await request(app)
      .put(`/api/admin/theme/${TEST_SLUG}`)
      .send({ templateId: 'modern-white' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('response chứa theme đã cập nhật', async () => {
    const res = await request(app)
      .put(`/api/admin/theme/${TEST_SLUG}`)
      .send({ templateId: 'garden-green' });
    expect(res.body.theme.templateId).toBe('garden-green');
  });

  test('thay đổi được phản ánh khi GET lại wedding data', async () => {
    await request(app)
      .put(`/api/admin/theme/${TEST_SLUG}`)
      .send({ templateId: 'royal-blue' });

    const res = await request(app).get(`/api/wedding/${TEST_SLUG}`);
    expect(res.body.theme.templateId).toBe('royal-blue');
  });

  test('trả về 404 khi slug không tồn tại', async () => {
    const res = await request(app)
      .put('/api/admin/theme/slug_khong_ton_tai')
      .send({ templateId: 'vintage-rose' });
    expect(res.status).toBe(500); // server trả 500 khi không đọc được file
  });
});

// =====================================================
// POST /api/admin/couples — Tạo cặp đôi mới
// =====================================================
describe('POST /api/admin/couples', () => {
  const NEW_SLUG = 'new_test_couple';

  afterEach(() => {
    // Dọn dẹp cặp đôi đã tạo
    const coupleDir = path.join(testDataDir, NEW_SLUG);
    if (fs.existsSync(coupleDir)) fs.rmSync(coupleDir, { recursive: true });
  });

  test('tạo cặp đôi mới thành công', async () => {
    const res = await request(app)
      .post('/api/admin/couples')
      .send({ slug: NEW_SLUG });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.slug).toBe(NEW_SLUG);
  });

  test('tạo file wedding.json với templateId mặc định', async () => {
    await request(app).post('/api/admin/couples').send({ slug: NEW_SLUG });
    const weddingFile = path.join(testDataDir, NEW_SLUG, 'wedding.json');
    expect(fs.existsSync(weddingFile)).toBe(true);
    const data = JSON.parse(fs.readFileSync(weddingFile, 'utf-8'));
    expect(data.theme.templateId).toBe('vintage-rose');
  });

  test('trả về 400 khi thiếu slug', async () => {
    const res = await request(app).post('/api/admin/couples').send({});
    expect(res.status).toBe(400);
  });

  test('trả về 400 khi slug đã tồn tại', async () => {
    await request(app).post('/api/admin/couples').send({ slug: NEW_SLUG });
    const res = await request(app).post('/api/admin/couples').send({ slug: NEW_SLUG });
    expect(res.status).toBe(400);
  });
});
