import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const API_URL = "http://127.0.0.1:5001/api/ai/disease-detection";

function UploadIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 20H5c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h4l2-2h2l2 2h4c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2zm-7-4l4-5h-3V8h-2v3H8l4 5z" />
    </svg>
  );
}

export default function ChatWindow() {
  const { t } = useLanguage();

  const fileInputRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // clean preview
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // call backend when image changes
  useEffect(() => {
    if (!image) return;

    const sendToBackend = async () => {
      setLoading(true);
      setResult(null);

      const formData = new FormData();
      formData.append("file", image);

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        console.log("API RESPONSE:", data); 

        if (!res.ok) {
          console.error("Backend Error:", data);
          throw new Error(data.error || "API Error");
        }
        setResult({
          disease: data.predicted_disease,
          confidence: data.confidence,
          description: data.description,
          treatment: "Follow proper treatment and consult expert",
        });

      } catch (err) {
        console.error(err);
        setResult({
          disease: "Error",
          confidence: "-",
          description: "Unable to process image",
          treatment: "-",
        });
      } finally {
        setLoading(false);
      }
    };

    sendToBackend();
  }, [image]);

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/') || file.size > MAX_FILE_SIZE) return;

    if (preview) URL.revokeObjectURL(preview);

    const url = URL.createObjectURL(file);

    setImage(file);
    setPreview(url);
    setResult(null);
  };

  const handleInputChange = (e) => {
    const file = e.target.files && e.target.files[0];
    handleFile(file);
    e.target.value = '';
  };

  const openFilePicker = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <section className="disease-detection-shell">

      <header className="disease-detection-header">
        <span className="detection-badge">{t.detectionBadge}</span>
        <h1>{t.detectionTitle}</h1>
        <p>{t.detectionSubtitle}</p>
      </header>

      <div className="detection-card">

        <div className="detection-card-head">
          <h2>{t.uploadCardTitle}</h2>
          <p>{t.uploadCardSubtitle}</p>
        </div>

        {!image ? (
          <div
            className={`detection-drop-zone ${isDragging ? 'dragging' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={openFilePicker}
          >
            <UploadIcon />
            <h3>{t.uploadClickText}</h3>
            <p>{t.uploadDragText}</p>

            <button className="btn btn-secondary detection-browse-btn">
              {t.browseFiles}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="detection-file-input"
            />
          </div>
        ) : (
          <div className="detection-result-wrap">

            <div className="detection-preview">
              <img src={preview} alt="preview" />
            </div>

            {loading && <p>Analyzing image...</p>}

            {result && (
              <section className="detection-result-card">

                <h3>{t.detectionResultTitle}</h3>

                <div className="result-top">
                  <div className="result-disease">
                    🦠 {result.disease}
                  </div>

                  <div className="result-confidence">
                    {t.resultConfidenceLabel}:
                    <span className="confidence-badge">
                      {result.confidence}
                    </span>
                  </div>
                </div>

                <div className="result-box">
                  <strong>{t.resultDescriptionLabel}:</strong>
                  <p>{result.description}</p>
                </div>

                <div className="result-box">
                  <strong>{t.resultTreatmentLabel}:</strong>
                  <p>{result.treatment}</p>
                </div>

              </section>
            )}
          </div>
        )}

      </div>
    </section>
  );
}