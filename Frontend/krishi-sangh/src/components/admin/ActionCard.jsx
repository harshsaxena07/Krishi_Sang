import { Link } from "react-router-dom";

export default function ActionCard({ title, description, ctaLabel, to }) {
  return (
    <Link to={to} className="admin-action-link" aria-label={title}>
      <div className="admin-card admin-action-card">
        <div>
          <h3 className="admin-card-title">{"\u{1F331}"} {title}</h3>
          <p className="admin-action-text">{description}</p>
        </div>
        <span className="admin-action-cta">{ctaLabel}</span>
      </div>
    </Link>
  );
}