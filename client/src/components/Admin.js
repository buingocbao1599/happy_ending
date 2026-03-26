import React, { useState, useEffect } from 'react';
import { TEMPLATES } from '../templates';

const API = 'http://localhost:5000/api/admin';

function Admin({ coupleSlug }) {
  // Nếu có coupleSlug → quản lý 1 cặp đôi, không → danh sách
  if (coupleSlug) {
    return <CoupleAdmin slug={coupleSlug} />;
  }
  return <CoupleList />;
}

// ===== DANH SÁCH CẶP ĐÔI =====
function CoupleList() {
  const [couples, setCouples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSlug, setNewSlug] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchCouples();
  }, []);

  const fetchCouples = () => {
    fetch(`${API}/couples`)
      .then((res) => res.json())
      .then((data) => { setCouples(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const handleCreate = async () => {
    if (!newSlug.trim()) return;
    setCreating(true);
    try {
      const res = await fetch(`${API}/couples`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: newSlug.trim() }),
      });
      const result = await res.json();
      if (result.success) {
        setNewSlug('');
        fetchCouples();
      } else {
        alert(result.error || 'Lỗi tạo cặp đôi');
      }
    } catch {
      alert('Không thể kết nối server');
    }
    setCreating(false);
  };

  const handleDelete = async (slug) => {
    if (!window.confirm(`Xóa cặp đôi "${slug}"? Không thể hoàn tác!`)) return;
    try {
      await fetch(`${API}/couples/${encodeURIComponent(slug)}`, { method: 'DELETE' });
      fetchCouples();
    } catch {
      alert('Không thể xóa');
    }
  };

  if (loading) return <div className="admin-loading">Đang tải...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Quản lý Thiệp Cưới</h1>
      </div>

      {/* Tạo cặp đôi mới */}
      <div className="admin-card">
        <h2>Tạo thiệp mới</h2>
        <div className="admin-create-form">
          <input
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
            placeholder="Nhập slug, vd: minh_&_trang"
            className="admin-create-input"
          />
          <button
            className="admin-save-btn"
            onClick={handleCreate}
            disabled={creating || !newSlug.trim()}
          >
            {creating ? 'Đang tạo...' : 'Tạo mới'}
          </button>
        </div>
        <p className="admin-hint">
          Slug sẽ là đường dẫn: <strong>domain.com/{newSlug || 'ten_&_ten'}</strong>
        </p>
      </div>

      {/* Danh sách cặp đôi */}
      <div className="admin-card">
        <h2>Danh sách cặp đôi ({couples.length})</h2>
        {couples.length === 0 ? (
          <p className="admin-hint">Chưa có cặp đôi nào. Hãy tạo mới!</p>
        ) : (
          <div className="admin-couple-list">
            {couples.map((c) => (
              <div key={c.slug} className="admin-couple-card">
                <div className="admin-couple-info">
                  <h3>{c.groom} & {c.bride}</h3>
                  <p className="admin-couple-slug">/{c.slug}</p>
                  {c.date && <p className="admin-couple-date">Ngày cưới: {c.date}</p>}
                </div>
                <div className="admin-couple-actions">
                  <a
                    href={`/admin/${c.slug}`}
                    className="admin-edit-btn"
                  >
                    Chỉnh sửa
                  </a>
                  <a
                    href={`/${c.slug}`}
                    className="admin-preview-btn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Xem thiệp
                  </a>
                  <button
                    className="admin-delete-couple-btn"
                    onClick={() => handleDelete(c.slug)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== QUẢN LÝ 1 CẶP ĐÔI =====
function CoupleAdmin({ slug }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState(
    () => sessionStorage.getItem(`admin_tab_${slug}`) || 'couple'
  );

  const changeTab = (tab) => {
    sessionStorage.setItem(`admin_tab_${slug}`, tab);
    setActiveTab(tab);
  };

  useEffect(() => {
    fetch(`${API}/wedding/${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setMessage('Không thể kết nối server'); setLoading(false); });
  }, [slug]);

  const fetchData = () => {
    fetch(`${API}/wedding/${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => setMessage('Không thể kết nối server'));
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSaveCouple = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/couple/${encodeURIComponent(slug)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groom: data.couple.groom, bride: data.couple.bride }),
      });
      if (res.ok) showMessage('Lưu thành công!');
    } catch {
      showMessage('Lỗi khi lưu');
    }
    setSaving(false);
  };

  const handleUpload = async (target, fieldName) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('image', file);
      formData.append('target', target);
      formData.append('fieldName', fieldName);

      try {
        const res = await fetch(`${API}/upload/${encodeURIComponent(slug)}`, {
          method: 'POST',
          body: formData,
        });
        const result = await res.json();
        if (result.success) {
          showMessage('Upload thành công!');
          fetchData();
        }
      } catch {
        showMessage('Upload thất bại');
      }
    };
    input.click();
  };

  const handleDeleteGallery = async (imageUrl) => {
    if (!window.confirm('Xóa ảnh này?')) return;
    try {
      const res = await fetch(`${API}/gallery/${encodeURIComponent(slug)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      });
      if (res.ok) {
        showMessage('Đã xóa ảnh');
        fetchData();
      }
    } catch {
      showMessage('Không thể xóa');
    }
  };

  const updateField = (person, field, value) => {
    setData((prev) => ({
      ...prev,
      couple: {
        ...prev.couple,
        [person]: { ...prev.couple[person], [field]: value },
      },
    }));
  };

  const updateBankField = (index, field, value) => {
    setData((prev) => {
      const banks = [...(prev.bankAccounts || [])];
      banks[index] = { ...banks[index], [field]: value };
      return { ...prev, bankAccounts: banks };
    });
  };

  const handleSaveBank = async () => {
    setSaving(true);
    try {
      const fullData = { ...data };
      const filePath = `${API}/wedding/${encodeURIComponent(slug)}`;
      const res = await fetch(filePath, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bankAccounts: data.bankAccounts }),
      });
      if (res.ok) showMessage('Lưu thông tin ngân hàng thành công!');
    } catch {
      showMessage('Lỗi khi lưu');
    }
    setSaving(false);
  };

  const handleUploadQR = async (index) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('image', file);
      formData.append('target', 'qr');
      formData.append('fieldName', `qr_${index}_${Date.now()}`);

      try {
        const res = await fetch(`${API}/upload/${encodeURIComponent(slug)}`, {
          method: 'POST',
          body: formData,
        });
        const result = await res.json();
        if (result.success) {
          updateBankField(index, 'qrCode', result.imageUrl);
          showMessage('Upload QR thành công!');
        }
      } catch {
        showMessage('Upload QR thất bại');
      }
    };
    input.click();
  };

  const handleUploadAudio = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('audio', file);
      try {
        const res = await fetch(`${API}/audio/${encodeURIComponent(slug)}`, {
          method: 'POST',
          body: formData,
        });
        const result = await res.json();
        if (result.success) {
          setData((prev) => ({ ...prev, music: { ...prev.music, audioUrl: result.audioUrl } }));
          showMessage('Upload nhạc thành công! Nhạc sẽ phát được trên mọi thiết bị.');
        } else {
          showMessage(result.error || 'Upload thất bại');
        }
      } catch {
        showMessage('Không thể kết nối server');
      }
    };
    input.click();
  };

  const handleSaveTemplate = async (templateId) => {
    // Optimistic update: cập nhật UI ngay lập tức
    setData((prev) => ({
      ...prev,
      theme: { ...prev.theme, templateId },
    }));

    try {
      const res = await fetch(`${API}/theme/${encodeURIComponent(slug)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
      });
      if (res.ok) {
        showMessage('Đã áp dụng template!');
      } else {
        fetchData(); // rollback
        let errMsg = `Lỗi ${res.status}: không thể lưu template`;
        try { const r = await res.json(); errMsg = r.error || errMsg; } catch {}
        showMessage(errMsg);
      }
    } catch {
      fetchData(); // rollback
      showMessage('Không thể kết nối server — hãy kiểm tra server đang chạy');
    }
  };

  const addBankAccount = () => {
    setData((prev) => ({
      ...prev,
      bankAccounts: [...(prev.bankAccounts || []), { name: '', bank: '', accountNumber: '', branch: '', qrCode: '' }],
    }));
  };

  const removeBankAccount = (index) => {
    if (!window.confirm('Xóa tài khoản này?')) return;
    setData((prev) => ({
      ...prev,
      bankAccounts: prev.bankAccounts.filter((_, i) => i !== index),
    }));
  };

  if (loading) return <div className="admin-loading">Đang tải...</div>;
  if (!data) return <div className="admin-loading">{message || 'Không có dữ liệu'}</div>;

  const { couple } = data;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <a href="/admin" className="admin-back-link">&larr; Danh sách</a>
          <h1>{couple.groom.fullName} & {couple.bride.fullName}</h1>
        </div>
        <a
          href={`/${slug}`}
          className="admin-preview-btn"
          target="_blank"
          rel="noreferrer"
        >
          Xem thiệp
        </a>
      </div>

      {message && <div className="admin-message">{message}</div>}

      <div className="admin-tabs">
        <button
          className={activeTab === 'couple' ? 'active' : ''}
          onClick={() => changeTab('couple')}
        >
          Thông tin cặp đôi
        </button>
        <button
          className={activeTab === 'photos' ? 'active' : ''}
          onClick={() => changeTab('photos')}
        >
          Ảnh cưới
        </button>
        <button
          className={activeTab === 'bank' ? 'active' : ''}
          onClick={() => changeTab('bank')}
        >
          Mừng cưới
        </button>
        <button
          className={activeTab === 'template' ? 'active' : ''}
          onClick={() => changeTab('template')}
        >
          Giao diện
        </button>
      </div>

      {activeTab === 'couple' && (
        <div className="admin-section">
          {/* Chú rể */}
          <div className="admin-card">
            <h2>Chú rể</h2>
            <div className="admin-avatar-group">
              <img
                src={couple.groom.avatar || '/images/default-avatar.png'}
                alt="Chú rể"
                className="admin-avatar"
                onClick={() => handleUpload('groom-avatar', 'groom')}
              />
              <button className="admin-upload-btn" onClick={() => handleUpload('groom-avatar', 'groom')}>
                Đổi ảnh
              </button>
            </div>
            <div className="admin-form">
              <label>Họ<input value={couple.groom.firstName} onChange={(e) => updateField('groom', 'firstName', e.target.value)} /></label>
              <label>Tên<input value={couple.groom.lastName} onChange={(e) => updateField('groom', 'lastName', e.target.value)} /></label>
              <label>Họ tên đầy đủ<input value={couple.groom.fullName} onChange={(e) => updateField('groom', 'fullName', e.target.value)} /></label>
              <label>Thông tin cha mẹ<input value={couple.groom.parent} onChange={(e) => updateField('groom', 'parent', e.target.value)} /></label>
            </div>
          </div>

          {/* Cô dâu */}
          <div className="admin-card">
            <h2>Cô dâu</h2>
            <div className="admin-avatar-group">
              <img
                src={couple.bride.avatar || '/images/default-avatar.png'}
                alt="Cô dâu"
                className="admin-avatar"
                onClick={() => handleUpload('bride-avatar', 'bride')}
              />
              <button className="admin-upload-btn" onClick={() => handleUpload('bride-avatar', 'bride')}>
                Đổi ảnh
              </button>
            </div>
            <div className="admin-form">
              <label>Họ<input value={couple.bride.firstName} onChange={(e) => updateField('bride', 'firstName', e.target.value)} /></label>
              <label>Tên<input value={couple.bride.lastName} onChange={(e) => updateField('bride', 'lastName', e.target.value)} /></label>
              <label>Họ tên đầy đủ<input value={couple.bride.fullName} onChange={(e) => updateField('bride', 'fullName', e.target.value)} /></label>
              <label>Thông tin cha mẹ<input value={couple.bride.parent} onChange={(e) => updateField('bride', 'parent', e.target.value)} /></label>
            </div>
          </div>

          {/* Ảnh bìa */}
          <div className="admin-card">
            <h2>Ảnh bìa</h2>
            <div className="admin-cover-preview">
              {couple.coverPhoto && <img src={couple.coverPhoto} alt="Ảnh bìa" />}
              <button className="admin-upload-btn" onClick={() => handleUpload('cover', 'cover')}>
                Đổi ảnh bìa
              </button>
            </div>
          </div>

          <button className="admin-save-btn" onClick={handleSaveCouple} disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu thông tin'}
          </button>
        </div>
      )}

      {activeTab === 'photos' && (
        <div className="admin-section">
          <div className="admin-card">
            <h2>Album ảnh cưới ({couple.photos?.length || 0} ảnh)</h2>
            <button
              className="admin-upload-btn gallery-add-btn"
              onClick={() => handleUpload('gallery', `gallery_${Date.now()}`)}
            >
              + Thêm ảnh
            </button>
            <div className="admin-gallery-grid">
              {couple.photos?.map((photo, i) => (
                <div key={i} className="admin-gallery-item">
                  <img src={photo} alt={`Ảnh ${i + 1}`} />
                  <button className="admin-delete-btn" onClick={() => handleDeleteGallery(photo)}>
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bank' && (
        <div className="admin-section">
          {(data.bankAccounts || []).map((account, index) => (
            <div key={index} className="admin-card">
              <div className="admin-bank-header">
                <h2>Tài khoản {index + 1}</h2>
                <button className="admin-delete-couple-btn" onClick={() => removeBankAccount(index)}>
                  Xóa
                </button>
              </div>

              <div className="admin-bank-layout">
                <div className="admin-bank-qr">
                  {account.qrCode ? (
                    <img src={account.qrCode} alt="QR Code" className="admin-qr-preview" />
                  ) : (
                    <div className="admin-qr-placeholder">Chưa có QR</div>
                  )}
                  <button className="admin-upload-btn" onClick={() => handleUploadQR(index)}>
                    {account.qrCode ? 'Đổi QR' : 'Upload QR'}
                  </button>
                </div>

                <div className="admin-form admin-bank-form">
                  <label>
                    Tên chủ tài khoản
                    <input value={account.name} onChange={(e) => updateBankField(index, 'name', e.target.value)} />
                  </label>
                  <label>
                    Ngân hàng
                    <input value={account.bank} onChange={(e) => updateBankField(index, 'bank', e.target.value)} />
                  </label>
                  <label>
                    Số tài khoản
                    <input value={account.accountNumber} onChange={(e) => updateBankField(index, 'accountNumber', e.target.value)} />
                  </label>
                  <label>
                    Chi nhánh
                    <input value={account.branch || ''} onChange={(e) => updateBankField(index, 'branch', e.target.value)} />
                  </label>
                </div>
              </div>
            </div>
          ))}

          <button className="admin-upload-btn gallery-add-btn" onClick={addBankAccount}>
            + Thêm tài khoản
          </button>

          <button className="admin-save-btn" onClick={handleSaveBank} disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu thông tin ngân hàng'}
          </button>
        </div>
      )}

      {activeTab === 'template' && (
        <div className="admin-section">
          {/* Nhạc nền */}
          <div className="admin-card">
            <h2>Nhạc nền</h2>
            <p className="admin-hint">
              Upload file mp3 để nhạc phát được trên <strong>mọi thiết bị kể cả iPhone</strong>.
              {data.music?.audioUrl
                ? <span style={{ color: '#4a7c59' }}> ✓ Đã có nhạc</span>
                : <span style={{ color: '#e63946' }}> Chưa có nhạc</span>}
            </p>
            {data.music?.audioUrl && (
              <audio controls src={data.music.audioUrl} style={{ width: '100%', marginBottom: '0.5rem' }} />
            )}
            <button className="admin-upload-btn" onClick={handleUploadAudio}>
              {data.music?.audioUrl ? 'Đổi nhạc (mp3)' : 'Upload nhạc (mp3)'}
            </button>
          </div>

          <div className="admin-card">
            <h2>Chọn giao diện thiệp cưới</h2>
            <p className="admin-hint">
              Template hiện tại: <strong>{TEMPLATES[data.theme?.templateId]?.name || 'Hồng Vintage'}</strong>
            </p>
            <div className="admin-template-grid">
              {Object.values(TEMPLATES).map((tpl) => {
                const isActive = (data.theme?.templateId || 'vintage-rose') === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    className={`admin-template-card ${isActive ? 'active' : ''}`}
                    onClick={() => handleSaveTemplate(tpl.id)}
                  >
                    {/* Preview màu sắc */}
                    <div className="admin-template-preview">
                      <div
                        className="admin-template-bg"
                        style={{ background: tpl.secondaryColor }}
                      >
                        <div
                          className="admin-template-bar"
                          style={{ background: tpl.primaryColor }}
                        />
                        <div className="admin-template-dots">
                          <span style={{ background: tpl.primaryColor }} />
                          <span style={{ background: tpl.accentColor }} />
                        </div>
                        <div
                          className="admin-template-btn-preview"
                          style={{ background: tpl.primaryColor }}
                        />
                      </div>
                      {/* Effect badge */}
                      <div className="admin-template-effect">
                        {tpl.effect === 'petals' && '🌸'}
                        {tpl.effect === 'snow' && '❄️'}
                        {tpl.effect === 'leaves' && '🍃'}
                        {tpl.effect === 'bubbles' && '🫧'}
                      </div>
                    </div>

                    <div className="admin-template-info">
                      <h3>{tpl.name}</h3>
                      <p>{tpl.description}</p>
                    </div>

                    {isActive && (
                      <div className="admin-template-active-badge">✓ Đang dùng</div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="admin-hint" style={{ marginTop: '1rem' }}>
              Nhấn vào template để áp dụng ngay. Xem trước thiệp để kiểm tra kết quả.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
