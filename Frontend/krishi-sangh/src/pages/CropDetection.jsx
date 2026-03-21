import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import "../styles/pages/crop.css";

const INITIAL_FORM = {
  nitrogen: '',
  phosphorus: '',
  potassium: '',
  ph: '',
};

const API_URL = "http://127.0.0.1:5001/api/ai/crop-recommendation";

export default function CropDetection() {
  const { t } = useLanguage();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setShowResult(false);

    try {
      console.log("Sending Data:", formData);

      const res = await fetch(API_URL, {
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

      const data = await res.json();

      console.log("API RESPONSE:", data);

      if (!res.ok) {
        console.error("Backend Error:", data);
        throw new Error(data.error || "Error");
      }

      setResult({
        crop: data.recommended_crop,
        description: data.description,
        confidence: "High",
      });

      setShowResult(true);

    } catch (err) {
      console.error("Frontend Error:", err);

      setResult({
        crop: "Error",
        description: "Could not get result",
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

        <header className="crop-recommendation-header">
          <span className="crop-reco-badge">{t.cropRecoBadge}</span>
          <h1>{t.cropRecoTitle}</h1>
          <p>{t.cropRecoSubtitle}</p>
        </header>

        <div className="crop-reco-card">

          <div className="crop-reco-card-head">
            <h2>{t.cropRecoCardTitle}</h2>
            <p>{t.cropRecoCardSubtitle}</p>
          </div>

          <form className="crop-reco-form" onSubmit={handleSubmit}>

            <div className="crop-reco-grid">

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

            <button type="submit" className="btn btn-secondary crop-reco-submit">
              {loading ? "Analyzing..." : t.cropRecoSubmit}
            </button>

          </form>

          {showResult && result && (
            <section className="crop-reco-result">

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