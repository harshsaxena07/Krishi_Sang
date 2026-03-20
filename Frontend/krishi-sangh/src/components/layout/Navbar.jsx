import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { languageOptions } from '../../translations';

export default function Navbar() {
  //mobile menu open/close
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { to: '/', label: t.navHome },
    { to: '/dashboard', label: t.navDashboard },
    { to: '/chatbot', label: t.navChatbot || 'Disease Detection' },
    { to: '/crop-detection', label: t.navCropDetection || 'Crop Recommendation' },
    { to: '/tool-rental', label: t.navToolRental },
    { to: '/schemes', label: t.navSchemes },
    { to: '/loans', label: t.navLoans },
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">

        {/* LEFT - BRAND */}
        <NavLink to="/" className="navbar-brand">
          <div className="navbar-brand-text">
            <span className="brand-title">KrishiSangh</span>
            <span className="brand-subtitle">A Digital Farming Support System</span>
          </div>
        </NavLink>

        {/* RIGHT SIDE */}
        <div className="navbar-right">

          {/* NAV LINKS */}
          <nav className={`navbar-links ${menuOpen ? 'open' : ''}`}>
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => {
                  setMenuOpen(false);
                  setProfileOpen(false);
                }}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* LANGUAGE */}
          <div className="navbar-lang-switcher">
            {languageOptions.map((opt) => (
              <button
                key={opt.code}
                className={`lang-btn ${language === opt.code ? 'active' : ''}`}
                onClick={() => setLanguage(opt.code)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* PROFILE */}
          <div className="navbar-profile-menu">
            <button
              className="navbar-profile-btn"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </button>

            {profileOpen && (
              <div className="navbar-profile-dropdown">
                <Link to="/profile" className="navbar-profile-item">
                  {t.navProfile}
                </Link>
                <button className="navbar-profile-item">
                  {t.navLogout}
                </button>
              </div>
            )}
          </div>

          {/* MOBILE MENU */}
          <button
            className="navbar-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </button>

        </div>
      </div>
    </header>
  );
}