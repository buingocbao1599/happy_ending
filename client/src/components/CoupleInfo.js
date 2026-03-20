import React, { useEffect, useRef } from 'react';

function CoupleInfo({ couple }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    const cards = sectionRef.current?.querySelectorAll('.couple-card');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="couple-section" ref={sectionRef}>
      <h2 className="section-title">Cô Dâu & Chú Rể</h2>

      <div className="couple-container">
        <div className="couple-card fade-in">
          <div className="couple-avatar-large">
            <img src={couple.groom.avatar} alt={couple.groom.fullName} />
          </div>
          <div className="couple-role">Chú Rể</div>
          <h3 className="couple-fullname">{couple.groom.fullName}</h3>
          <p className="couple-parent">{couple.groom.parent}</p>
        </div>

        <div className="couple-heart-divider">
          <span>&#10084;</span>
        </div>

        <div className="couple-card fade-in">
          <div className="couple-avatar-large">
            <img src={couple.bride.avatar} alt={couple.bride.fullName} />
          </div>
          <div className="couple-role">Cô Dâu</div>
          <h3 className="couple-fullname">{couple.bride.fullName}</h3>
          <p className="couple-parent">{couple.bride.parent}</p>
        </div>
      </div>
    </div>
  );
}

export default CoupleInfo;
