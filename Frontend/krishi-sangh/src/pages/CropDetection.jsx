import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import "../styles/pages/crop.css";

const INITIAL_FORM = {
  nitrogen: '',
  phosphorus: '',
  potassium: '',
  ph: '',
};

const API_URL = "http://127.0.0.1:5000/api/ai/crop-recommendation";

export default function CropDetection() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setShowResult(false);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          N: parseFloat(formData.nitrogen),
          P: parseFloat(formData.phosphorus),
          K: parseFloat(formData.potassium),
          ph: parseFloat(formData.ph),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "API Error");
      }

      setResult({
        crop: data.recommended_crop,
        description: data.description,
        confidence: "High",
      });

      setShowResult(true);

    } catch (error) {
      console.error(error);

      setResult({
        crop: "Error",
        description: "Failed to get recommendation",
        confidence: "-",
      });

      setShowResult(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page crop-recommendation-page">
      <section className="crop-recommendation-shell">
        
        {/* HEADER */}
        <header className="crop-recommendation-header">
          <span className="crop-reco-badge">{t.cropRecoBadge}</span>
          <h1>{t.cropRecoTitle}</h1>
          <p>{t.cropRecoSubtitle}</p>
        </header>

        {/* CARD */}
        <div className="crop-reco-card">

          <div className="crop-reco-card-head">
            <h2>{t.cropRecoCardTitle}</h2>
            <p>{t.cropRecoCardSubtitle}</p>
          </div>

          {/* FORM */}
          <form className="crop-reco-form" onSubmit={handleSubmit}>
            <div className="crop-reco-grid">

              {/* Nitrogen */}
              <label className="crop-reco-field">
                <span>{t.cropRecoNitrogenLabel}</span>
                <div className="crop-reco-input-wrap">
                  <input
                    type="number"
                    name="nitrogen"
                    value={formData.nitrogen}
                    onChange={handleChange}
                    placeholder={t.cropRecoNitrogenPlaceholder}
                    required
                  />
                  <small>{t.cropRecoNpkUnit}</small>
                </div>
              </label>

              {/* Phosphorus */}
              <label className="crop-reco-field">
                <span>{t.cropRecoPhosphorusLabel}</span>
                <div className="crop-reco-input-wrap">
                  <input
                    type="number"
                    name="phosphorus"
                    value={formData.phosphorus}
                    onChange={handleChange}
                    placeholder={t.cropRecoPhosphorusPlaceholder}
                    required
                  />
                  <small>{t.cropRecoNpkUnit}</small>
                </div>
              </label>

              {/* Potassium */}
              <label className="crop-reco-field">
                <span>{t.cropRecoPotassiumLabel}</span>
                <div className="crop-reco-input-wrap">
                  <input
                    type="number"
                    name="potassium"
                    value={formData.potassium}
                    onChange={handleChange}
                    placeholder={t.cropRecoPotassiumPlaceholder}
                    required
                  />
                  <small>{t.cropRecoNpkUnit}</small>
                </div>
              </label>

              {/* pH */}
              <label className="crop-reco-field">
                <span>{t.cropRecoPhLabel}</span>
                <div className="crop-reco-input-wrap">
                  <input
                    type="number"
                    step="0.1"
                    name="ph"
                    value={formData.ph}
                    onChange={handleChange}
                    placeholder={t.cropRecoPhPlaceholder}
                    required
                  />
                  <small>{t.cropRecoPhUnit}</small>
                </div>
              </label>

            </div>

            {/* BUTTON */}
            <button type="submit" className="btn btn-secondary crop-reco-submit">
              {loading ? "🔄 Analyzing..." : t.cropRecoSubmit}
            </button>
          </form>

          {/* RESULT */}
          {showResult && result && (
            <section className="crop-reco-result" aria-live="polite">
              
              <h3>{t.cropRecoResultTitle}</h3>

              <div className="result-main">
                <div className="result-crop">
                  🌱 {result.crop}
                </div>

                <div className="result-confidence">
                  {t.cropRecoResultConfidenceLabel}:
                  <span className="confidence-badge">
                    {result.confidence}
                  </span>
                </div>
              </div>

              <div className="result-description">
                <strong>{t.cropRecoResultReasonLabel}:</strong>
                <p>{result.description}</p>
              </div>

            </section>
          )}

        </div>
      </section>
    </div>
  );
}