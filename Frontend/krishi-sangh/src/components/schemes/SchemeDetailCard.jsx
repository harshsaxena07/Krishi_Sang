import { useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';

function MicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" />
    </svg>
  );
}

export default function SchemeDetailCard({ scheme }) {
  const { language, t } = useLanguage();
  const speechInProgress = useRef(false);

  const name = language === 'hi' ? scheme.nameHi : scheme.name;
  const category = language === 'hi' ? scheme.categoryHi : scheme.category;
  const description = language === 'hi' ? scheme.descriptionHi : scheme.descriptionLong;
  const documents = language === 'hi' ? scheme.documentsHi : scheme.documents;

  const speak = () => {
    if (speechInProgress.current) return;
    if (!window.speechSynthesis) return;

    speechInProgress.current = true;
    window.speechSynthesis.cancel();

    const lang = language === 'hi' ? 'hi-IN' : 'en-US';
    const text = [
      name,
      description,
      documents.length ? documents.join('. ') : '',
    ].filter(Boolean).join('. ');

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.onend = () => { speechInProgress.current = false; };
    utterance.onerror = () => { speechInProgress.current = false; };
    window.speechSynthesis.speak(utterance);
  };

  const openOfficial = () => {
    if (scheme.officialUrl) window.open(scheme.officialUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <article className="scheme-detail-card card">
      <div className="scheme-detail-card-inner">
        <div className="scheme-detail-content">
          <h3 className="scheme-detail-title">{name}</h3>
          <span className="scheme-category-badge">{category}</span>
          <p className="scheme-detail-description">{description}</p>
          {documents && documents.length > 0 && (
            <div className="scheme-documents">
              <strong className="scheme-documents-label">{t.requiredDocuments}:</strong>
              <ul className="scheme-documents-list">
                {documents.map((doc, i) => (
                  <li key={i}>{doc}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="scheme-detail-actions">
            <button type="button" className="btn btn-outline">
              {t.details}
            </button>
            <button type="button" className="btn btn-secondary" onClick={openOfficial}>
              {t.knowMoreApply}
            </button>
            <button
              type="button"
              className="btn btn-speech"
              onClick={speak}
              title="Listen"
              aria-label="Listen to scheme details"
            >
              <MicIcon />
            </button>
          </div>
        </div>
        <div className="scheme-detail-image-wrap">
          <img src={scheme.image} alt="" className="scheme-detail-image" />
        </div>
      </div>
    </article>
  );
}
