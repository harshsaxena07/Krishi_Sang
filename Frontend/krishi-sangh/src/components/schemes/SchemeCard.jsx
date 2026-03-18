import { useLanguage } from '../../context/LanguageContext';

export default function SchemeCard({
  title,
  description,
  image,
  badge,
  eligibility = 'Small and marginal farmers with valid land records.',
  documents = ['Aadhaar Card', 'Bank details'],
  actionLabel,
}) {
  const { t } = useLanguage();
  const docs = Array.isArray(documents) ? documents : [documents];

  return (
    <article className="card scheme-card">
      <div className="scheme-card-inner">
        <div className="scheme-card-content">
          <h3>{title}</h3>
          <span className="card-badge">{badge || t.schemeBadge}</span>
          <p>{description}</p>
          <p className="card-meta"><strong>{t.eligibility}:</strong> {eligibility}</p>
          <p className="card-meta"><strong>{t.requiredDocuments}:</strong> {docs.join(', ')}</p>
          <div className="card-actions">
            <button type="button" className="btn btn-outline">
              {t.details}
            </button>
            <button type="button" className="btn btn-secondary">
              {actionLabel || t.applyNow}
            </button>
          </div>
        </div>
        {image && (
          <div className="scheme-card-image card-image">
            <img src={image} alt={title} />
          </div>
        )}
      </div>
    </article>
  );
}
