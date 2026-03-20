import React from 'react';

function Footer({ couple }) {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-heart">&#10084;</div>
        <h3 className="footer-names">
          {couple.groom.lastName} & {couple.bride.lastName}
        </h3>
        <p className="footer-thanks">
          Cảm ơn bạn đã ghé thăm thiệp cưới của chúng mình!
        </p>
        <div className="footer-divider"></div>
        <p className="footer-copyright">
          Made with &#10084; &bull; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
