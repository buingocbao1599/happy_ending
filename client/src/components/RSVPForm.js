import React, { useState } from 'react';

function RSVPForm() {
  const [form, setForm] = useState({
    name: '',
    attending: 'yes',
    guests: 1,
    note: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send to backend API
    console.log('RSVP submitted:', form);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rsvp-section">
        <h2 className="section-title">Xác Nhận Tham Dự</h2>
        <div className="rsvp-success">
          <div className="success-icon">&#10084;</div>
          <h3>Cảm ơn bạn!</h3>
          <p>Chúng tôi đã nhận được xác nhận của bạn.</p>
          <p>Hẹn gặp bạn trong ngày vui!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rsvp-section">
      <h2 className="section-title">Xác Nhận Tham Dự</h2>
      <p className="rsvp-subtitle">
        Sự hiện diện của bạn là niềm vinh hạnh của chúng tôi
      </p>

      <form className="rsvp-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Họ và tên</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nhập họ tên của bạn"
            required
          />
        </div>

        <div className="form-group">
          <label>Bạn có tham dự không?</label>
          <div className="radio-group">
            <label className={`radio-btn ${form.attending === 'yes' ? 'active' : ''}`}>
              <input
                type="radio"
                name="attending"
                value="yes"
                checked={form.attending === 'yes'}
                onChange={handleChange}
              />
              <span>&#10084; Sẽ tham dự</span>
            </label>
            <label className={`radio-btn ${form.attending === 'no' ? 'active' : ''}`}>
              <input
                type="radio"
                name="attending"
                value="no"
                checked={form.attending === 'no'}
                onChange={handleChange}
              />
              <span>Rất tiếc không thể</span>
            </label>
          </div>
        </div>

        {form.attending === 'yes' && (
          <div className="form-group">
            <label htmlFor="guests">Số khách đi cùng</label>
            <select
              id="guests"
              name="guests"
              value={form.guests}
              onChange={handleChange}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} người
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="note">Lời nhắn</label>
          <textarea
            id="note"
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Ghi chú thêm (không bắt buộc)"
            rows="3"
          />
        </div>

        <button type="submit" className="rsvp-submit">
          Gửi xác nhận
        </button>
      </form>
    </div>
  );
}

export default RSVPForm;
