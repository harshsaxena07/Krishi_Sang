import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

// Maximum allowed file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Backend API endpoint for disease detection
const API_URL = "http://127.0.0.1:5001/api/ai/disease-detection";

// Icon for upload area
function UploadIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 20H5c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h4l2-2h2l2 2h4c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2zm-7-4l4-5h-3V8h-2v3H8l4 5z" />
    </svg>
  );
}

export default function ChatWindow() {

  // Access translation text
  const { t } = useLanguage();

  // Reference to hidden file input (used to trigger file picker)
  const fileInputRef = useRef(null);

  // State management for UI behavior
  const [isDragging, setIsDragging] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cleanup preview URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Automatically call backend API when image is selected
  useEffect(() => {
    if (!image) return;

    const sendToBackend = async () => {

      setLoading(true);
      setResult(null);

      // Prepare form data to send image file
      const formData = new FormData();
      formData.append("file", image);

      try {
        // Send POST request to Flask backend
        const res = await fetch(API_URL, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        console.log("API RESPONSE:", data); 

        // Handle backend errors
        if (!res.ok) {
          throw new Error(data.error || "API Error");
        }

        // Store prediction result in state
        setResult({
          disease: data.predicted_disease,
          confidence: data.confidence,
          description: data.description,
          treatment: "Follow proper treatment and consult expert",
        });

      } catch (err) {
        console.error(err);

        // Show fallback error result
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

  // Validate and process uploaded file
  const handleFile = (file) => {
    if (!file) return;

    // Allow only images and restrict size
    if (!file.type.startsWith('image/') || file.size > MAX_FILE_SIZE) return;

    if (preview) URL.revokeObjectURL(preview);

    const url = URL.createObjectURL(file);

    setImage(file);
    setPreview(url);
    setResult(null);
  };

  // Handle file selection from input
  const handleInputChange = (e) => {
    const file = e.target.files && e.target.files[0];
    handleFile(file);
    e.target.value = '';
  };

  // Open file picker manually
  const openFilePicker = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Handle drag and drop upload
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    handleFile(file);
  };

  return (

    // Main disease detection UI container
    <section className="disease-detection-shell">

      {/* Header section */}
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

        {/* If no image selected → show upload UI */}
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

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="detection-file-input"
            />
          </div>

        ) : (

          // If image is uploaded → show preview + result
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