import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { languageOptions } from '../../translations';

function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1.39-2.5c.5.12 1 .18 1.5.18 3.31 0 6-2.69 6-6 0-1.5-.55-2.87-1.46-3.94L17 8M12 2c-.25 0-.5.03-.75.06 2.5 2.02 4.25 5 4.25 7.94 0 4.42-3.58 8-8 8-.25 0-.5-.02-.75-.06C2.5 17.98.75 15 .75 12.06.75 6.64 5.89 2 12 2z" />
    </svg>
  );
}

export default function Navbar() {
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

  const handleLogout = () => {
    setMenuOpen(false);
    setProfileOpen(false);
    // TODO: connect auth logout
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink
          to="/"
          className="navbar-brand"
          onClick={() => {
            setMenuOpen(false);
            setProfileOpen(false);
          }}
        >
          <LeafIcon />
          <span>{t.navBrand}</span>
        </NavLink>

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

        <div className="navbar-actions">
          <div className="navbar-lang-switcher" role="group" aria-label="Language">
            {languageOptions.map((opt) => (
              <button
                key={opt.code}
                type="button"
                className={`lang-btn ${language === opt.code ? 'active' : ''}`}
                onClick={() => setLanguage(opt.code)}
                aria-pressed={language === opt.code}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="navbar-profile-menu">
            <button
              type="button"
              className="navbar-profile-btn"
              aria-label="Profile menu"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((prev) => !prev)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </button>

            {profileOpen && (
              <div className="navbar-profile-dropdown" role="menu">
                <Link
                  to="/profile"
                  className="navbar-profile-item"
                  role="menuitem"
                  onClick={() => {
                    setProfileOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  {t.navProfile}
                </Link>
                <button
                  type="button"
                  className="navbar-profile-item"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  {t.navLogout}
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="navbar-toggle"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => {
              setMenuOpen((prev) => !prev);
              setProfileOpen(false);
            }}
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
