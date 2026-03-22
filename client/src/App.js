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
import Admin from './components/Admin';
import './assets/css/App.css';
import './assets/css/Admin.css';

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

// Parse URL: /{coupleSlug}?{guestName}
// Ví dụ: /bao_&_phuong?quynh_ia_chay
//        /admin
//        /admin/bao_&_phuong
function parseURL() {
  const pathname = window.location.pathname;
  const search = window.location.search;

  // Admin routes
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const adminSlug = pathname.replace('/admin/', '').replace('/admin', '');
    return { page: 'admin', coupleSlug: adminSlug || null, guestName: '' };
  }

  // Wedding route: /{coupleSlug}?{guestName}
  const coupleSlug = decodeURIComponent(pathname.substring(1)) || null;

  let guestName = '';
  if (search.length > 1) {
    const params = new URLSearchParams(search);
    const toParam = params.get('to');
    if (toParam) {
      guestName = formatGuestName(toParam);
    } else {
      const rawName = decodeURIComponent(search.substring(1).split('&')[0]);
      guestName = formatGuestName(rawName);
    }
  }

  return { page: 'wedding', coupleSlug, guestName };
}

function App() {
  const { page, coupleSlug, guestName } = parseURL();

  if (page === 'admin') {
    return <Admin coupleSlug={coupleSlug} />;
  }

  return <WeddingApp coupleSlug={coupleSlug} guestName={guestName} />;
}

function WeddingApp({ coupleSlug, guestName }) {
  const [weddingData, setWeddingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    // Xác định API URL dựa trên coupleSlug
    const apiUrl = coupleSlug
      ? `/api/wedding/${encodeURIComponent(coupleSlug)}`
      : '/api/wedding';

    const staticUrl = coupleSlug
      ? `/data/couples/${encodeURIComponent(coupleSlug)}/wedding.json`
      : '/data/wedding.json';

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        setWeddingData(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback: đọc static JSON
        fetch(staticUrl)
          .then((res) => {
            if (!res.ok) throw new Error('Not found');
            return res.json();
          })
          .then((data) => {
            setWeddingData(data);
            setLoading(false);
          })
          .catch(() => {
            setError('Không tìm thấy thiệp cưới');
            setLoading(false);
          });
      });
  }, [coupleSlug]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-heart">&#10084;</div>
        <p>Đang mở thiệp cưới...</p>
      </div>
    );
  }

  if (error || !weddingData) {
    return (
      <div className="loading-screen">
        <div className="loading-heart">&#10084;</div>
        <p>{error || 'Không tìm thấy thiệp cưới'}</p>
        <a href="/" style={{ color: '#d4a373', marginTop: '1rem', display: 'block' }}>
          Về trang chủ
        </a>
      </div>
    );
  }

  const { couple, wedding, loveStory, music, bankAccounts, theme } = weddingData;

  // Màn hình "Mở thiệp"
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
        <RSVPForm coupleSlug={coupleSlug} />
      </section>

      <section id="guestbook">
        <Guestbook coupleSlug={coupleSlug} />
      </section>

      <section id="gift">
        <BankTransfer bankAccounts={bankAccounts} />
      </section>

      <Footer couple={couple} />
    </div>
  );
}

export default App;
