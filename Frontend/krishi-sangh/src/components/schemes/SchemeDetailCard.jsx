import { useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';

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

            <button
              type="button"
              className="btn btn-secondary"
              onClick={openOfficial}
            >
              {t.knowMoreApply}
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