import { TEMPLATES, DEFAULT_TEMPLATE_ID } from '../templates';

const VALID_EFFECTS = ['petals', 'snow', 'leaves', 'bubbles'];
const REQUIRED_FIELDS = ['id', 'name', 'description', 'primaryColor', 'secondaryColor', 'accentColor', 'effect'];

// =====================================================
// Cấu trúc TEMPLATES
// =====================================================
describe('TEMPLATES', () => {
  test('có đúng 4 template', () => {
    expect(Object.keys(TEMPLATES)).toHaveLength(4);
  });

  test('chứa các template ID đúng', () => {
    expect(TEMPLATES).toHaveProperty('vintage-rose');
    expect(TEMPLATES).toHaveProperty('modern-white');
    expect(TEMPLATES).toHaveProperty('garden-green');
    expect(TEMPLATES).toHaveProperty('royal-blue');
  });

  test('DEFAULT_TEMPLATE_ID phải là vintage-rose', () => {
    expect(DEFAULT_TEMPLATE_ID).toBe('vintage-rose');
  });

  test('DEFAULT_TEMPLATE_ID phải tồn tại trong TEMPLATES', () => {
    expect(TEMPLATES[DEFAULT_TEMPLATE_ID]).toBeDefined();
  });
});

// =====================================================
// Mỗi template phải có đủ fields bắt buộc
// =====================================================
describe.each(Object.values(TEMPLATES))('Template: $name', (template) => {
  test.each(REQUIRED_FIELDS)('có field "%s"', (field) => {
    expect(template).toHaveProperty(field);
    expect(template[field]).toBeTruthy();
  });

  test('id khớp với key trong TEMPLATES', () => {
    expect(TEMPLATES[template.id]).toBe(template);
  });

  test('effect phải là một trong các loại hợp lệ', () => {
    expect(VALID_EFFECTS).toContain(template.effect);
  });

  test('màu sắc phải là hex color hợp lệ', () => {
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    expect(template.primaryColor).toMatch(hexRegex);
    expect(template.secondaryColor).toMatch(hexRegex);
    expect(template.accentColor).toMatch(hexRegex);
  });

  test('primaryColor và secondaryColor phải khác nhau', () => {
    expect(template.primaryColor).not.toBe(template.secondaryColor);
  });
});

// =====================================================
// Mỗi effect chỉ được dùng bởi đúng 1 template
// =====================================================
describe('Effect uniqueness', () => {
  test('mỗi effect chỉ được assign cho 1 template', () => {
    const effectCounts = {};
    Object.values(TEMPLATES).forEach(({ effect }) => {
      effectCounts[effect] = (effectCounts[effect] || 0) + 1;
    });
    Object.entries(effectCounts).forEach(([effect, count]) => {
      expect(count).toBe(1);
    });
  });
});
