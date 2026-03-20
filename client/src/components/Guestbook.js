import React, { useState, useEffect } from 'react';

function formatTime(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

function Guestbook() {
  const [wishes, setWishes] = useState([]);
  const [form, setForm] = useState({ name: '', message: '' });
  const [sending, setSending] = useState(false);

  // Load wishes from API on mount
  useEffect(() => {
    fetch('/api/wishes')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setWishes(data);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;

    setSending(true);
    fetch('/api/wishes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((newWish) => {
        setWishes((prev) => [newWish, ...prev]);
        setForm({ name: '', message: '' });
        setSending(false);
      })
      .catch(() => {
        // Fallback nếu không có server
        setWishes((prev) => [
          { name: form.name, message: form.message, time: new Date().toISOString() },
          ...prev,
        ]);
        setForm({ name: '', message: '' });
        setSending(false);
      });
  };

  return (
    <div className="guestbook-section">
      <h2 className="section-title">Sổ Lưu Bút</h2>
      <p className="guestbook-subtitle">Gửi lời chúc đến cô dâu và chú rể</p>

      <form className="guestbook-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Tên của bạn"
            required
          />
        </div>
        <div className="form-group">
          <textarea
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            placeholder="Viết lời chúc tại đây..."
            rows="3"
            required
          />
        </div>
        <button type="submit" className="guestbook-submit" disabled={sending}>
          {sending ? 'Đang gửi...' : 'Gửi lời chúc ❤'}
        </button>
      </form>

      <div className="wishes-list">
        {wishes.length === 0 && (
          <p className="no-wishes">Hãy là người đầu tiên gửi lời chúc!</p>
        )}
        {wishes.map((wish, index) => (
          <div key={index} className="wish-card">
            <div className="wish-avatar">
              {wish.name.charAt(0).toUpperCase()}
            </div>
            <div className="wish-content">
              <div className="wish-header">
                <strong className="wish-name">{wish.name}</strong>
                <span className="wish-time">{formatTime(wish.time)}</span>
              </div>
              <p className="wish-message">{wish.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Guestbook;
