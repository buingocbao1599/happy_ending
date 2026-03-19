import React, { useState } from 'react';

function MusicPlayer({ embedUrl }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="music-player">
      <button
        className={`music-btn ${visible ? 'playing' : ''}`}
        onClick={() => setVisible(!visible)}
        aria-label={visible ? 'Ẩn nhạc' : 'Bật nhạc'}
      >
        <div className="music-icon">♪</div>
      </button>

      {visible && (
        <div className="music-embed">
          <iframe
            title="Wedding Music"
            scrolling="no"
            width="300"
            height="80"
            src={embedUrl}
            frameBorder="0"
            allow="autoplay"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}

export default MusicPlayer;
