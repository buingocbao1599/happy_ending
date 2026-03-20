import React, { useState, useEffect, useRef } from 'react';

function Gallery({ photos }) {
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });
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
      { threshold: 0.1 }
    );

    const items = sectionRef.current?.querySelectorAll('.gallery-item');
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (!lightbox.open) return;
      if (e.key === 'Escape') setLightbox({ open: false, index: 0 });
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft') navigate(-1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const navigate = (dir) => {
    setLightbox((prev) => ({
      open: true,
      index: (prev.index + dir + photos.length) % photos.length,
    }));
  };

  if (!photos || photos.length === 0) return null;

  return (
    <div className="gallery-section" ref={sectionRef}>
      <h2 className="section-title">Album Ảnh Cưới</h2>

      <div className="gallery-grid">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="gallery-item fade-in"
            onClick={() => setLightbox({ open: true, index })}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <img src={photo} alt={`Ảnh cưới ${index + 1}`} loading="lazy" />
            <div className="gallery-overlay">
              <span className="gallery-zoom">&#128269;</span>
            </div>
          </div>
        ))}
      </div>

      {lightbox.open && (
        <div className="lightbox" onClick={() => setLightbox({ open: false, index: 0 })}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightbox({ open: false, index: 0 })}>
              &times;
            </button>
            <button className="lightbox-nav lightbox-prev" onClick={() => navigate(-1)}>
              &#10094;
            </button>
            <img src={photos[lightbox.index]} alt={`Ảnh ${lightbox.index + 1}`} />
            <button className="lightbox-nav lightbox-next" onClick={() => navigate(1)}>
              &#10095;
            </button>
            <div className="lightbox-counter">
              {lightbox.index + 1} / {photos.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
