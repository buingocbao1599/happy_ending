import React, { useEffect, useRef } from 'react';

function LoveStory({ stories }) {
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

    const items = sectionRef.current?.querySelectorAll('.story-item');
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  if (!stories || stories.length === 0) return null;

  return (
    <div className="lovestory-section" ref={sectionRef}>
      <h2 className="section-title">Câu Chuyện Tình Yêu</h2>

      <div className="story-timeline">
        {stories.map((story, index) => (
          <div
            key={index}
            className={`story-item fade-in ${index % 2 === 1 ? 'story-right' : 'story-left'}`}
          >
            <div className="story-date-badge">
              <span className="story-icon">{story.icon || '💕'}</span>
            </div>
            <div className="story-content">
              {story.image && (
                <div className="story-image">
                  <img src={story.image} alt={story.title} />
                </div>
              )}
              <div className="story-date">{story.date}</div>
              <h3 className="story-title">{story.title}</h3>
              <p className="story-description">{story.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoveStory;
