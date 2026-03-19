import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import Navigation from './components/Navigation';
import FloatingPetals from './components/FloatingPetals';
import MusicPlayer from './components/MusicPlayer';
import EventInfo from './components/EventInfo';
import './assets/css/App.css';

function App() {
  const [weddingData, setWeddingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guestName, setGuestName] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('to');
    if (name) setGuestName(decodeURIComponent(name));

    fetch('/api/wedding')
      .then((res) => res.json())
      .then((data) => {
        setWeddingData(data);
        setLoading(false);
      })
      .catch(() => {
        fetch('/data/wedding.json')
          .then((res) => res.json())
          .then((data) => {
            setWeddingData(data);
            setLoading(false);
          });
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-heart">&#10084;</div>
        <p>Đang mở thiệp cưới...</p>
      </div>
    );
  }

  const { couple, wedding, music, theme } = weddingData;

  return (
    <div
      className="app"
      style={{
        '--primary': theme.primaryColor,
        '--secondary': theme.secondaryColor,
        '--accent': theme.accentColor,
      }}
    >
      <FloatingPetals />
      <Navigation />
      <MusicPlayer embedUrl={music.embedUrl} />

      <section id="home">
        <Hero
          couple={couple}
          wedding={wedding}
          guestName={guestName}
        />
      </section>

      <section id="countdown">
        <Countdown targetDate={wedding.date} targetTime={wedding.time} />
      </section>

      <section id="events">
        <EventInfo events={wedding.events} />
      </section>
    </div>
  );
}

export default App;
