import React, { useEffect, useRef } from 'react';

function FloatingPetals() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createPetal = () => {
      const petal = document.createElement('div');
      petal.className = 'petal';

      const size = Math.random() * 15 + 10;
      const startX = Math.random() * 100;
      const duration = Math.random() * 6 + 6;
      const delay = Math.random() * 3;
      const rotation = Math.random() * 360;

      petal.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${startX}%;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        transform: rotate(${rotation}deg);
        opacity: ${Math.random() * 0.6 + 0.3};
      `;

      container.appendChild(petal);

      setTimeout(() => {
        petal.remove();
      }, (duration + delay) * 1000);
    };

    const interval = setInterval(createPetal, 800);

    for (let i = 0; i < 8; i++) {
      createPetal();
    }

    return () => clearInterval(interval);
  }, []);

  return <div ref={containerRef} className="floating-petals" />;
}

export default FloatingPetals;
