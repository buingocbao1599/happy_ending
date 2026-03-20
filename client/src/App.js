import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import CoupleInfo from './components/CoupleInfo';
import LoveStory from './components/LoveStory';
import EventInfo from './components/EventInfo';
import Gallery from './components/Gallery';
import RSVPForm from './components/RSVPForm';
import Guestbook from './components/Guestbook';
import BankTransfer from './components/BankTransfer';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import FloatingPetals from './components/FloatingPetals';
import MusicPlayer from './components/MusicPlayer';
import './assets/css/App.css';

// Chuyển "bạn_đạt" → "Bạn Đạt"
function formatGuestName(raw) {
  return raw
    .replace(/_/g, ' ')
    .replace(/\+/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .trim();
}

function App() {
  const [weddingData, setWeddingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guestName, setGuestName] = useState('');
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    // Hỗ trợ 2 format URL:
    // 1. /?bạn_đạt  → tên = "Bạn Đạt"
    // 2. /?to=bạn_đạt → tên = "Bạn Đạt"
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const toParam = params.get('to');

    if (toParam) {
      setGuestName(formatGuestName(toParam));
    } else if (search.length > 1) {
      // Lấy phần sau dấu ? (bỏ ký tự ?)
      const rawName = decodeURIComponent(search.substring(1).split('&')[0]);
      setGuestName(formatGuestName(rawName));
    }

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

  const { couple, wedding, loveStory, music, bankAccounts, theme } = weddingData;

  // Màn hình "Mở thiệp" — khi ấn nút, trình duyệt cho phép autoplay nhạc
  if (!opened) {
    return (
      <div
        className="invite-cover"
        style={{
          '--primary': theme.primaryColor,
          '--secondary': theme.secondaryColor,
          '--accent': theme.accentColor,
        }}
      >
        <div className="invite-cover-content">
          <div className="invite-ornament">&#10053;</div>
          <p className="invite-label">Thiệp Mời</p>
          <h1 className="invite-couple">
            {couple.groom.lastName} & {couple.bride.lastName}
          </h1>
          {guestName && (
            <div className="invite-guest">
              <p className="invite-greeting">{wedding.greetingText}</p>
              <p className="invite-guest-name">{guestName}</p>
            </div>
          )}
          <button className="invite-open-btn" onClick={() => setOpened(true)}>
            Mở Thiệp &#10084;
          </button>
          <p className="invite-hint">Nhấn để mở thiệp cưới</p>
        </div>
      </div>
    );
  }

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
      <MusicPlayer embedUrl={music.embedUrl} autoPlay />

      <section id="home">
        <Hero couple={couple} wedding={wedding} guestName={guestName} />
      </section>

      <section id="couple">
        <CoupleInfo couple={couple} />
      </section>

      <section id="countdown">
        <Countdown targetDate={wedding.date} targetTime={wedding.time} />
      </section>

      <section id="lovestory">
        <LoveStory stories={loveStory} />
      </section>

      <section id="events">
        <EventInfo events={wedding.events} />
      </section>

      <section id="gallery">
        <Gallery photos={couple.photos} />
      </section>

      <section id="rsvp">
        <RSVPForm />
      </section>

      <section id="guestbook">
        <Guestbook />
      </section>

      <section id="gift">
        <BankTransfer bankAccounts={bankAccounts} />
      </section>

      <Footer couple={couple} />
    </div>
  );
}

export default App;
