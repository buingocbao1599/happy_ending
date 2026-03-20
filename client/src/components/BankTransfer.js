import React, { useState } from 'react';

function BankTransfer({ bankAccounts }) {
  const [copied, setCopied] = useState(null);
  const [zoomQR, setZoomQR] = useState(null);

  const copyToClipboard = (text, index) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(index);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  if (!bankAccounts || bankAccounts.length === 0) return null;

  return (
    <div className="bank-section">
      <h2 className="section-title">Mừng Cưới</h2>
      <p className="bank-subtitle">
        Thay cho tấm thiệp hồng, nếu muốn gửi quà mừng cho chúng mình, bạn có thể chuyển khoản qua:
      </p>

      <div className="bank-cards">
        {bankAccounts.map((account, index) => (
          <div key={index} className="bank-card">
            <div className="bank-icon">&#127974;</div>
            <h3 className="bank-name">{account.bank}</h3>
            <p className="bank-owner">{account.name}</p>
            {account.branch && (
              <p className="bank-branch">{account.branch}</p>
            )}
            {account.accountNumber && (
              <div className="bank-account">
                <span className="account-number">{account.accountNumber}</span>
                <button
                  className={`copy-btn ${copied === index ? 'copied' : ''}`}
                  onClick={() => copyToClipboard(account.accountNumber, index)}
                >
                  {copied === index ? '✓ Đã copy' : 'Copy'}
                </button>
              </div>
            )}
            {account.qrCode && (
              <div className="bank-qr" onClick={() => setZoomQR(account)}>
                <img src={account.qrCode} alt={`QR ${account.bank}`} />
                <p className="qr-hint">Nhấn để phóng to</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {zoomQR && (
        <div className="qr-lightbox" onClick={() => setZoomQR(null)}>
          <div className="qr-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="qr-lightbox-close" onClick={() => setZoomQR(null)}>
              &times;
            </button>
            <img src={zoomQR.qrCode} alt={`QR ${zoomQR.bank}`} />
            <div className="qr-lightbox-info">
              <h3>{zoomQR.bank}</h3>
              <p>{zoomQR.name}</p>
              {zoomQR.accountNumber && <p className="qr-lightbox-stk">{zoomQR.accountNumber}</p>}
              {zoomQR.branch && <p className="qr-lightbox-branch">{zoomQR.branch}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BankTransfer;
