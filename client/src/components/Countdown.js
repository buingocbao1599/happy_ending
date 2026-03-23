import React, { useState, useEffect } from 'react';
import { calculateTimeLeft } from '../utils';

function Countdown({ targetDate, targetTime }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate, targetTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate, targetTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, targetTime]);

  const units = [
    { label: 'Ngày', value: timeLeft.days },
    { label: 'Giờ', value: timeLeft.hours },
    { label: 'Phút', value: timeLeft.minutes },
    { label: 'Giây', value: timeLeft.seconds },
  ];

  return (
    <div className="countdown-section">
      <h2 className="section-title">Đếm ngược đến ngày cưới</h2>
      <div className="countdown-container">
        {units.map((unit) => (
          <div key={unit.label} className="countdown-item">
            <div className="countdown-number">
              <span className="number-flip">{String(unit.value).padStart(2, '0')}</span>
            </div>
            <span className="countdown-label">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Countdown;
