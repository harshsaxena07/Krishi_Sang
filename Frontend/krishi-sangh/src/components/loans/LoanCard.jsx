import { useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function LoanCard({ loan }) {
  if (!loan) {
    return null;
  }

  const { language } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);
  const speechInProgress = useRef(false);
  const documents = Array.isArray(loan.documents) ? loan.documents : [];

  const ui = language === 'hi'
    ? {
        eligibility: '\u092a\u093e\u0924\u094d\u0930\u0924\u093e',
        requiredDocuments: '\u0906\u0935\u0936\u094d\u092f\u0915 \u0926\u0938\u094d\u0924\u093e\u0935\u0947\u091c',
        details: '\u0935\u093f\u0935\u0930\u0923',
        knowMoreApply: '\u0914\u0930 \u091c\u093e\u0928\u0947\u0902 / \u0906\u0935\u0947\u0926\u0928 \u0915\u0930\u0947\u0902',
      }
    : {
        eligibility: 'Eligibility',
        requiredDocuments: 'Required Documents',
        details: 'Details',
        knowMoreApply: 'Know More / Apply',
      };

  const openOfficialWebsite = () => {
    if (loan.officialWebsite) {
      window.open(loan.officialWebsite, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <article className="card scheme-detail-card loan-detail-card">
      <div className="scheme-detail-card-inner loan-detail-card-inner">

        <div className="scheme-detail-content loan-detail-content">
          <h3 className="scheme-detail-title">{loan.name}</h3>
          <span className="scheme-category-badge">{loan.bank}</span>
          <p className="scheme-detail-description">{loan.purpose}</p>

          {showDetails && (
            <>
              <div className="scheme-documents">
                <strong className="scheme-documents-label">{ui.eligibility}:</strong>
                <p className="loan-eligibility-text">{loan.eligibility}</p>
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
            >
              {ui.knowMoreApply}
            </button>
          </div>
        </div>

        <div className="scheme-detail-image-wrap loan-detail-image-wrap">
          <img
            src={loan.image}
            alt={loan.name}
            className="scheme-detail-image loan-detail-image"
          />
        </div>

      </div>
    </article>
  );
}