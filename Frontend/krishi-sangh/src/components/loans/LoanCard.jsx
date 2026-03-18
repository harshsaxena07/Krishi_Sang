import { useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

function MicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" />
    </svg>
  );
}

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
        listen: '\u0938\u0941\u0928\u0947\u0902',
      }
    : {
        eligibility: 'Eligibility',
        requiredDocuments: 'Required Documents',
        details: 'Details',
        knowMoreApply: 'Know More / Apply',
        listen: 'Listen',
      };

  const speak = () => {
    if (speechInProgress.current) return;
    if (!window.speechSynthesis) return;

    speechInProgress.current = true;
    window.speechSynthesis.cancel();

    const text = [
      loan.name,
      loan.purpose,
      `${ui.eligibility}: ${loan.eligibility}`,
      `${ui.requiredDocuments}: ${documents.join('. ')}`,
    ].join('. ');

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.9;
    utterance.onend = () => {
      speechInProgress.current = false;
    };
    utterance.onerror = () => {
      speechInProgress.current = false;
    };

    window.speechSynthesis.speak(utterance);
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
            <button type="button" className="btn btn-outline" onClick={() => setShowDetails((prev) => !prev)}>
              {ui.details}
            </button>
            <button type="button" className="btn btn-secondary" onClick={openOfficialWebsite}>
              {ui.knowMoreApply}
            </button>
            <button
              type="button"
              className="btn btn-speech"
              onClick={speak}
              title={ui.listen}
              aria-label={ui.listen}
            >
              <MicIcon />
            </button>
          </div>
        </div>

        <div className="scheme-detail-image-wrap loan-detail-image-wrap">
          <img src={loan.image} alt={loan.name} className="scheme-detail-image loan-detail-image" />
        </div>
      </div>
    </article>
  );
}
