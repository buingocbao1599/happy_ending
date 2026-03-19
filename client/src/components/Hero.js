import React, { useEffect, useRef } from 'react';

function Hero({ couple, wedding, guestName }) {
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = heroRef.current?.querySelectorAll('.fade-in');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="hero" ref={heroRef}>
      <div className="hero-overlay" />
      <div
        className="hero-background"
        style={{ backgroundImage: `url(${couple.coverPhoto})` }}
      />

      <div className="hero-content">
        {guestName && (
          <div className="guest-greeting fade-in">
            <p className="greeting-text">{wedding.greetingText}</p>
            <p className="guest-name">{guestName}</p>
          </div>
        )}

        <div className="couple-names fade-in">
          <h1 className="groom-name">{couple.groom.fullName}</h1>
          <span className="ampersand">&amp;</span>
          <h1 className="bride-name">{couple.bride.fullName}</h1>
        </div>

        <div className="wedding-date fade-in">
          <div className="ornament">&#10053;</div>
          <p className="date-text">
            {new Date(wedding.date).toLocaleDateString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className="lunar-date">{wedding.lunarDate}</p>
        </div>

        <p className="wedding-description fade-in">{wedding.description}</p>

        <div className="hero-avatars fade-in">
          <div className="avatar-wrapper groom-avatar">
            <img src={couple.groom.avatar} alt={couple.groom.fullName} />
          </div>
          <div className="avatar-heart">&#10084;</div>
          <div className="avatar-wrapper bride-avatar">
            <img src={couple.bride.avatar} alt={couple.bride.fullName} />
          </div>
        </div>

        <a href="#events" className="scroll-down fade-in">
          <span>Xem chi tiết</span>
          <div className="scroll-arrow">&#8964;</div>
        </a>
      </div>
    </div>
  );
}

export default Hero;
