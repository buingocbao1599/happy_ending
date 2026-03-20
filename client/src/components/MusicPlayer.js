import React, { useState, useEffect } from 'react';

function MusicPlayer({ embedUrl, autoPlay }) {
  const [playing, setPlaying] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);

  // Auto play nhạc ngầm khi mở thiệp
  useEffect(() => {
    if (autoPlay) {
      setPlaying(true);
    }
  }, [autoPlay]);

  const toggle = () => {
    if (playing) {
      // Tắt nhạc — ẩn iframe hoàn toàn
      setPlaying(false);
      setShowEmbed(false);
    } else {
      // Bật nhạc
      setPlaying(true);
      setShowEmbed(false);
    }
  };

  const toggleEmbed = () => {
    setShowEmbed(!showEmbed);
  };

  return (
    <div className="music-player">
      <button
        className={`music-btn ${playing ? 'playing' : ''}`}
        onClick={toggle}
        onDoubleClick={toggleEmbed}
        aria-label={playing ? 'Tắt nhạc' : 'Bật nhạc'}
      >
        <div className="music-icon">♪</div>
      </button>

      {/* iframe luôn ẩn khi phát nhạc, chỉ hiện khi double click */}
      {playing && (
        <div className={`music-embed ${showEmbed ? '' : 'music-hidden'}`}>
          <iframe
            title="Wedding Music"
            scrolling="no"
            width="300"
            height="166"
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
