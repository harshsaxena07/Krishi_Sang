import { useLanguage } from '../../context/LanguageContext';

// Detailed card component for displaying full scheme information
export default function SchemeDetailCard({ scheme }) {

  // Access language + translations
  const { language, t } = useLanguage();

  // Handle multilingual name (supports both backend and old frontend keys)
  const name = language === 'hi'
    ? (scheme.name_hi || scheme.nameHi)
    : scheme.name;

  // Category (Central / State) with language support
  const category = language === 'hi'
    ? (scheme.category_hi || scheme.categoryHi)
    : scheme.category;

  // Description (long version for detailed view)
  const description = language === 'hi'
    ? (scheme.description_hi || scheme.descriptionHi)
    : (scheme.description_long || scheme.descriptionLong);

  // Documents list handling for both formats
  const documents = language === 'hi'
    ? (scheme.documents_hi || scheme.documentsHi)
    : scheme.documents;

  // Official link from backend (supports both naming formats)
  const officialLink = scheme.official_url || scheme.officialUrl;

  // Open official scheme page in new tab
  const openOfficial = () => {
    if (officialLink) {
      window.open(officialLink, '_blank', 'noopener,noreferrer');
    }
  };

  // Fallback image if no image is provided
  const imageSrc = scheme.image || "/images/default-scheme.jpg";

  return (

    // Main detailed card container
    <article className="scheme-detail-card card">
      <div className="scheme-detail-card-inner">

        {/* Left side: content */}
        <div className="scheme-detail-content">

          <h3 className="scheme-detail-title">{name}</h3>

          {/* Category badge */}
          <span className="scheme-category-badge">{category}</span>

          <p className="scheme-detail-description">{description}</p>

          {/* Documents section (only if available) */}
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

          {/* Action buttons */}
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

        {/* Right side: image */}
        <div className="scheme-detail-image-wrap">
          <img
            src={imageSrc}
            alt={name}
            className="scheme-detail-image"

            // Fallback image if loading fails
            onError={(e) => {
              e.target.src = "/images/default-scheme.jpg";
            }}
          />
        </div>

      </div>
    </article>
  );
}