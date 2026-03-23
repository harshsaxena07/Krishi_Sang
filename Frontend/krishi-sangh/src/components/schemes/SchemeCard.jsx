import { useLanguage } from '../../context/LanguageContext';

// Reusable card component to display scheme information
export default function SchemeCard({
  title,
  description,
  image,
  badge,

  // Default values used if props are not passed
  eligibility = 'Small and marginal farmers with valid land records.',
  documents = ['Aadhaar Card', 'Bank details'],
  actionLabel,
}) {

  // Access translation values
  const { t } = useLanguage();

  // Ensure documents is always an array for safe rendering
  const docs = Array.isArray(documents) ? documents : [documents];

  return (

    // Main card container
    <article className="card scheme-card">
      <div className="scheme-card-inner">

        {/* Left side: content */}
        <div className="scheme-card-content">
          <h3>{title}</h3>

          {/* Category badge (Central/State) */}
          <span className="card-badge">{badge || t.schemeBadge}</span>

          <p>{description}</p>

          {/* Eligibility info */}
          <p className="card-meta">
            <strong>{t.eligibility}:</strong> {eligibility}
          </p>

          {/* Required documents */}
          <p className="card-meta">
            <strong>{t.requiredDocuments}:</strong> {docs.join(', ')}
          </p>

          {/* Action buttons */}
          <div className="card-actions">
            <button type="button" className="btn btn-outline">
              {t.details}
            </button>

            <button type="button" className="btn btn-secondary">
              {actionLabel || t.applyNow}
            </button>
          </div>
        </div>

        {/* Right side: image (only shown if available) */}
        {image && (
          <div className="scheme-card-image card-image">
            <img src={image} alt={title} />
          </div>
        )}

      </div>
    </article>
  );
}