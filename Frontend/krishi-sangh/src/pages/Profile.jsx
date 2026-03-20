import { profileData } from '../data/profile';
import "../styles/pages/profile.css";

export default function Profile() {
  return (
    <div className="page profile-page">
      <h1>Farmer Profile</h1>
      <div className="card profile-card">
        <div className="profile-header">
          <img src={profileData.image} alt="Profile" className="profile-avatar" />
          <div>
            <h2>{profileData.name}</h2>
            <p className="profile-meta">Member since {profileData.memberSince}</p>
          </div>
        </div>
        <dl className="profile-details">
          <dt>Phone</dt>
          <dd>{profileData.phone}</dd>
          <dt>Village</dt>
          <dd>{profileData.village}</dd>
          <dt>District</dt>
          <dd>{profileData.district}</dd>
          <dt>State</dt>
          <dd>{profileData.state}</dd>
        </dl>
        <button type="button" className="btn btn-secondary">
          Edit Profile
        </button>
      </div>
    </div>
  );
}
