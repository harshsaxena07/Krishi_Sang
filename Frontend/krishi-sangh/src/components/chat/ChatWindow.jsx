import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import MainTopBar from "../layout/MainTopBar";

// Maximum allowed file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Backend API endpoint for disease detection
const API_URL = "http://127.0.0.1:5001/api/ai/disease-detection";

// Icon for upload area
function UploadIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
          disease: data.disease,
          confidence: data.confidence,
          description: data.description,
          treatment: data.treatment,
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
      <MainTopBar />

      <header className="disease-detection-header">
        <span className="detection-badge">{t.detectionBadge}</span>
        <h1>{t.detectionTitle}</h1>
        <p>{t.detectionSubtitle}</p>
      </header>

      <div className="detection-layout">
        <div className="detection-card upload-card">

          <div className="detection-card-head">
            <span className="detection-step-label">Upload</span>
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
              <div className="upload-icon-wrap">
                <UploadIcon />
              </div>
              <h3>{t.uploadClickText}</h3>
              <p>{t.uploadDragText}</p>

              <button type="button" className="btn btn-secondary detection-browse-btn">
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

            <div className="detection-preview-panel">
              <div className="detection-preview">
                <img src={preview} alt="preview" />
              </div>

              <button
                type="button"
                className="btn btn-outline detection-change-btn"
                onClick={openFilePicker}
              >
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
          )}

        </div>

        <section className="detection-chat-card" aria-live="polite">
          <div className="chat-window-header">
            <div>
              <span className="detection-step-label">AI Result</span>
              <h2>{t.detectionResultTitle}</h2>
            </div>
            <span className={`chat-status ${loading ? 'is-loading' : result ? 'is-ready' : ''}`}>
              {loading ? 'Analyzing' : result ? 'Ready' : 'Waiting'}
            </span>
          </div>

          <div className="chat-messages">
            {!image && (
              <div className="chat-message system-message">
                <div className="message-bubble">
                  <strong>Upload a crop image</strong>
                  <p>Select or drag a plant image to receive disease detection and treatment guidance.</p>
                </div>
              </div>
            )}

            {image && (
              <div className="chat-message user-message">
                <div className="message-bubble">
                  <strong>Image uploaded</strong>
                  <p>Your crop image has been sent for analysis.</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="chat-message system-message">
                <div className="message-bubble loading-bubble">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <p>Analyzing image...</p>
                </div>
              </div>
            )}

            {result && (
              <div className="chat-message system-message result-message">
                <div className="message-bubble result-bubble">
                  <div className="result-header">
                    <span>{t.resultDiseaseLabel || 'Disease'}</span>
                    <strong>{result.disease}</strong>
                  </div>

                  <div className="result-confidence">
                    <span>{t.resultConfidenceLabel}</span>
                    <strong className="confidence-badge">{result.confidence}</strong>
                  </div>

                  <div className="result-section">
                    <h3>{t.resultDescriptionLabel}</h3>
                    <p>{result.description}</p>
                  </div>

                  <div className="result-section">
                    <h3>{t.resultTreatmentLabel}</h3>
                    <p>{result.treatment}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
