import React, { useEffect, useRef } from 'react';

function EventInfo({ events }) {
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
      { threshold: 0.15 }
    );

    const elements = sectionRef.current?.querySelectorAll('.event-card');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="event-section" ref={sectionRef}>
      <h2 className="section-title">Lịch trình sự kiện</h2>
      <div className="event-timeline">
        {events.map((event, index) => (
          <div key={index} className="event-card fade-in">
            <div className="event-time-badge">
              <span className="event-time">{event.time}</span>
            </div>
            <div className="event-details">
              <h3 className="event-name">{event.name}</h3>
              <p className="event-venue">{event.venue}</p>
              <p className="event-address">{event.address}</p>
              <a
                href={event.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="event-map-link"
              >
                Xem bản đồ &#8599;
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventInfo;
