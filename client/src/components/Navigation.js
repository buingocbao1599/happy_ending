import React, { useState, useEffect } from 'react';

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: '♥' },
    { id: 'couple', label: 'Cặp đôi', icon: '💑' },
    { id: 'lovestory', label: 'Chuyện tình', icon: '💕' },
    { id: 'events', label: 'Sự kiện', icon: '📍' },
    { id: 'gallery', label: 'Album', icon: '📸' },
    { id: 'rsvp', label: 'Tham dự', icon: '✉' },
    { id: 'gift', label: 'Mừng cưới', icon: '🎁' },
  ];

  useEffect(() => {
    const sectionIds = ['home', 'couple', 'lovestory', 'events', 'gallery', 'rsvp', 'gift'];

    const handleScroll = () => {
      setScrolled(window.scrollY > 100);

      const scrollPosition = window.scrollY + window.innerHeight / 3;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`navigation ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => scrollTo(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navigation;
