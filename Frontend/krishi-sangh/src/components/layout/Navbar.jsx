import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { languageOptions } from '../../translations';

// ✅ Clerk import
import { useClerk } from "@clerk/clerk-react";

export default function Navbar() {
  // state for mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // state for profile dropdown
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { language, setLanguage, t } = useLanguage();

  // ✅ Clerk logout function
  const { signOut } = useClerk();

  // navigation links
  const navLinks = [
    { path: '/', label: t.navHome },
    { path: '/dashboard', label: t.navDashboard },
    { path: '/chatbot', label: t.navChatbot || 'Disease Detection' },
    { path: '/crop-detection', label: t.navCropDetection || 'Crop Recommendation' },
    { path: '/tool-rental', label: t.navToolRental },
    { path: '/schemes', label: t.navSchemes },
    { path: '/loans', label: t.navLoans },
  ];

  // handle link click (close menus)
  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  // ✅ handle logout
  const handleLogout = async () => {
    await signOut();
    setIsProfileOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">

        {/* Brand */}
        <NavLink to="/" className="navbar-brand">
          <div className="navbar-brand-text">
            <span className="brand-title">KrishiSangh</span>
            <span className="brand-subtitle">A Digital Farming Support System</span>
          </div>
        </NavLink>

        <div className="navbar-right">

          {/* Navigation Links */}
          <nav className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={handleLinkClick}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Language Switcher */}
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

          {/* Profile Menu */}
          <div className="navbar-profile-menu">
            <button
              className="navbar-profile-btn"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </button>

            {isProfileOpen && (
              <div className="navbar-profile-dropdown">
                <Link
                  to="/profile"
                  className="navbar-profile-item"
                  onClick={handleLinkClick}
                >
                  {t.navProfile}
                </Link>

                {/* ✅ Working Logout */}
                <button
                  className="navbar-profile-item"
                  onClick={handleLogout}
                >
                  {t.navLogout}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="navbar-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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