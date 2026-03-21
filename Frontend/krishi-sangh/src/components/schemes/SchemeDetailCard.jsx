import { useLanguage } from '../../context/LanguageContext';

export default function SchemeDetailCard({ scheme }) {
  const { language, t } = useLanguage();

  // support both backend and old frontend keys
  const name = language === 'hi'
    ? (scheme.name_hi || scheme.nameHi)
    : scheme.name;

  const category = language === 'hi'
    ? (scheme.category_hi || scheme.categoryHi)
    : scheme.category;

  const description = language === 'hi'
    ? (scheme.description_hi || scheme.descriptionHi)
    : (scheme.description_long || scheme.descriptionLong);

  const documents = language === 'hi'
    ? (scheme.documents_hi || scheme.documentsHi)
    : scheme.documents;

  const officialLink = scheme.official_url || scheme.officialUrl;

  const openOfficial = () => {
    if (officialLink) {
      window.open(officialLink, '_blank', 'noopener,noreferrer');
    }
  };

  const imageSrc = scheme.image || "/images/default-scheme.jpg";

  return (
    <article className="scheme-detail-card card">
      <div className="scheme-detail-card-inner">

        <div className="scheme-detail-content">
          <h3 className="scheme-detail-title">{name}</h3>

          <span className="scheme-category-badge">{category}</span>

          <p className="scheme-detail-description">{description}</p>

          {/* documents */}
          {documents && documents.length > 0 && (
            <div className="scheme-documents">
              <strong className="scheme-documents-label">
                {t.requiredDocuments}:
              </strong>

              <ul className="scheme-documents-list">
                {documents.map((doc, index) => (
                  <li key={index}>{doc}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="scheme-detail-actions">
            <button type="button" className="btn btn-outline">
              {t.details}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={openOfficial}
              disabled={!officialLink}
            >
              {t.knowMoreApply}
            </button>
          </div>
        </div>

        {/* image */}
        <div className="scheme-detail-image-wrap">
          <img
            src={imageSrc}
            alt={name}
            className="scheme-detail-image"
            onError={(e) => {
              e.target.src = "/images/default-scheme.jpg";
            }}
          />
        </div>

      </div>
    </article>
  );
}