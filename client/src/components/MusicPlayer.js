import React, { useState, useRef } from 'react';

// audioUrl (file mp3 trực tiếp): dùng <audio> — hoạt động trên iOS Safari
// embedUrl (SoundCloud): dùng iframe — chỉ đáng tin cậy trên desktop
function MusicPlayer({ embedUrl, audioUrl }) {
  const [playing, setPlaying] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const audioRef = useRef(null);

  const hasDirectAudio = !!audioUrl;

  const toggle = () => {
    if (hasDirectAudio) {
      // <audio> element: gọi play()/pause() trực tiếp trong event handler
      // → iOS Safari cho phép vì đây là user gesture trực tiếp
      if (playing) {
        audioRef.current?.pause();
        setPlaying(false);
      } else {
        audioRef.current?.play().catch(() => {});
        setPlaying(true);
      }
    } else {
      // iframe SoundCloud fallback (desktop)
      if (playing) {
        setPlaying(false);
        setShowEmbed(false);
      } else {
        setPlaying(true);
      }
    }
  };

  const toggleEmbed = () => {
    if (!hasDirectAudio) setShowEmbed((s) => !s);
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

      {/* Audio trực tiếp — hoạt động trên mọi thiết bị kể cả iOS */}
      {hasDirectAudio && (
        <audio ref={audioRef} src={audioUrl} loop preload="none" />
      )}

      {/* iframe SoundCloud — fallback khi không có audioUrl */}
      {!hasDirectAudio && playing && (
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
