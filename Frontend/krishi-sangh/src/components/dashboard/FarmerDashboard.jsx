import { Link } from 'react-router-dom';
import { profileData } from '../../data/profile';

// Farmer dashboard component showing profile, activity, and quick info
export default function FarmerDashboard({

  // Default values used if props are not passed
  name = profileData.name,
  lastUpload = 'Tomato Leaf (2 Days Ago)',
  recentPrediction = 'Blight Detected: Apply Fungicide',
}) {

  return (

    // Main farmer dashboard section
    <section className="farmer-dashboard-section">

      {/* Section heading */}
      <div className="section-header">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1.39-2.5c.5.12 1 .18 1.5.18 3.31 0 6-2.69 6-6 0-1.5-.55-2.87-1.46-3.94L17 8z" />
        </svg>
        <span>Farmer Dashboard</span>
      </div>

      {/* Grid layout for dashboard cards */}
      <div className="farmer-cards-grid">

        {/* Profile Card */}
        <div className="farmer-card farmer-card-profile">
          <h3 className="farmer-card-title">Profile</h3>

          <div className="farmer-profile-row">
            <div className="farmer-profile-left">
              <img src={profileData.image} alt="" className="farmer-avatar" />
              <span className="farmer-name">{name}</span>
            </div>

            {/* Navigation to profile page */}
            <Link to="/profile" className="btn btn-secondary btn-with-icon farmer-edit-btn">
              Edit
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Upload History Card */}
        <div className="farmer-card">
          <h3 className="farmer-card-title">Upload History</h3>
          <p className="farmer-detail">Last Upload: {lastUpload}</p>
        </div>

        {/* Prediction Result Card */}
        <div className="farmer-card farmer-card-predictions">
          <h3 className="farmer-card-title">Recent Predictions</h3>

          {/* Shows latest AI prediction result */}
          <p className="farmer-detail farmer-prediction-message">
            <span className="prediction-text">{recentPrediction}</span>

            {/* Success icon */}
            <svg className="prediction-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </p>
        </div>

        {/* Quick Links Card */}
        <div className="farmer-card farmer-card-links">
          <h3 className="farmer-card-title">Quick Links</h3>

          {/* Buttons for fast access to features */}
          <div className="quick-links">

            <button type="button" className="quick-link-pill">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
              Weather Updates
            </button>

            <button type="button" className="quick-link-pill">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              Market Prices
            </button>

          </div>
        </div>

      </div>
    </section>
  );
}