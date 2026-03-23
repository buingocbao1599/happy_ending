import React, { useEffect, useRef } from 'react';

// Cấu hình cho từng loại hiệu ứng
const EFFECT_CONFIG = {
  petals: {
    className: 'floating-petal',
    containerClass: 'floating-effect-container',
    interval: 800,
    initialCount: 8,
    minSize: 10,
    maxSize: 15,
    minDuration: 6,
    maxDuration: 6,
    fromBottom: false,
    colors: null, // dùng CSS
  },
  snow: {
    className: 'floating-snow',
    containerClass: 'floating-effect-container',
    interval: 600,
    initialCount: 12,
    minSize: 4,
    maxSize: 10,
    minDuration: 8,
    maxDuration: 7,
    fromBottom: false,
    colors: null,
  },
  leaves: {
    className: 'floating-leaf',
    containerClass: 'floating-effect-container',
    interval: 1000,
    initialCount: 6,
    minSize: 12,
    maxSize: 18,
    minDuration: 7,
    maxDuration: 5,
    fromBottom: false,
    colors: ['#4a7c59', '#5a9e70', '#3a6248', '#6db88a', '#f4a261'],
  },
  bubbles: {
    className: 'floating-bubble',
    containerClass: 'floating-effect-container',
    interval: 1200,
    initialCount: 6,
    minSize: 15,
    maxSize: 35,
    minDuration: 8,
    maxDuration: 6,
    fromBottom: true,
    colors: null,
  },
};

function FloatingEffect({ type = 'petals' }) {
  const containerRef = useRef(null);
  const config = EFFECT_CONFIG[type] || EFFECT_CONFIG.petals;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createParticle = () => {
      const el = document.createElement('div');
      el.className = config.className;

      const size = Math.random() * config.maxSize + config.minSize;
      const posX = Math.random() * 100;
      const duration = Math.random() * config.maxDuration + config.minDuration;
      const delay = Math.random() * 2;
      const rotation = Math.random() * 360;

      let styles = `
        width: ${size}px;
        height: ${size}px;
        left: ${posX}%;
        animation-name: ${getAnimationName(type)};
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        transform: rotate(${rotation}deg);
        opacity: ${Math.random() * 0.5 + 0.4};
      `;

      if (config.fromBottom) {
        styles += `bottom: -${size + 10}px; top: auto;`;
      }

      if (config.colors) {
        const color = config.colors[Math.floor(Math.random() * config.colors.length)];
        styles += `background: ${color};`;
      }

      el.style.cssText = styles;
      container.appendChild(el);

      setTimeout(() => {
        el.remove();
      }, (duration + delay) * 1000 + 500);
    };

    // Tạo ngay ban đầu
    for (let i = 0; i < config.initialCount; i++) {
      setTimeout(() => createParticle(), i * 150);
    }

    const interval = setInterval(createParticle, config.interval);
    return () => clearInterval(interval);
  }, [type]);

  return <div ref={containerRef} className={config.containerClass} />;
}

function getAnimationName(type) {
  const map = {
    petals: 'petalFall',
    snow: 'snowFall',
    leaves: 'leafFall',
    bubbles: 'bubbleRise',
  };
  return map[type] || 'petalFall';
}

export default FloatingEffect;
