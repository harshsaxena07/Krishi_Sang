import { useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function LoanCard({ loan }) {
  if (!loan) {
    return null;
  }

  const { language } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);
  const speechInProgress = useRef(false);

  const isHindi = language === 'hi';

  // Multilingual support (backend + old frontend)
  const name = isHindi
    ? (loan.name_hi || loan.nameHi || loan.name)
    : loan.name;

  const purpose = isHindi
    ? (loan.purpose_hi || loan.purposeHi || loan.purpose)
    : loan.purpose;

  const eligibility = isHindi
    ? (loan.eligibility_hi || loan.eligibilityHi || loan.eligibility)
    : loan.eligibility;

  const documents = isHindi
    ? (loan.documents_hi || loan.documentsHi || [])
    : (Array.isArray(loan.documents) ? loan.documents : []);

  const ui = isHindi
    ? {
        eligibility: 'पात्रता',
        requiredDocuments: 'आवश्यक दस्तावेज',
        details: 'विवरण',
        knowMoreApply: 'और जानें / आवेदन करें',
      }
    : {
        eligibility: 'Eligibility',
        requiredDocuments: 'Required Documents',
        details: 'Details',
        knowMoreApply: 'Know More / Apply',
      };

  const officialLink = loan.official_website || loan.officialWebsite;

  const openOfficialWebsite = () => {
    if (officialLink) {
      window.open(officialLink, '_blank', 'noopener,noreferrer');
    }
  };

  const imageSrc = loan.image || "/images/default-loan.jpg";

  return (
    <article className="card scheme-detail-card loan-detail-card">
      <div className="scheme-detail-card-inner loan-detail-card-inner">

        <div className="scheme-detail-content loan-detail-content">
          <h3 className="scheme-detail-title">{name}</h3>
          <span className="scheme-category-badge">{loan.bank}</span>
          <p className="scheme-detail-description">{purpose}</p>

          {showDetails && (
            <>
              <div className="scheme-documents">
                <strong className="scheme-documents-label">{ui.eligibility}:</strong>
                <p className="loan-eligibility-text">{eligibility}</p>
              </div>

              <div className="scheme-documents">
                <strong className="scheme-documents-label">{ui.requiredDocuments}:</strong>
                <ul className="scheme-documents-list">
                  {documents.map((doc, i) => (
                    <li key={`${loan.id}-doc-${i}`}>{doc}</li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <div className="scheme-detail-actions loan-detail-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowDetails((prev) => !prev)}
            >
              {ui.details}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={openOfficialWebsite}
              disabled={!officialLink}
            >
              {ui.knowMoreApply}
            </button>
          </div>
        </div>

        <div className="scheme-detail-image-wrap loan-detail-image-wrap">
          <img
            src={imageSrc}
            alt={name}
            className="scheme-detail-image loan-detail-image"
            onError={(e) => {
              e.target.src = "/images/default-loan.jpg";
            }}
          />
        </div>

      </div>
    </article>
  );
}