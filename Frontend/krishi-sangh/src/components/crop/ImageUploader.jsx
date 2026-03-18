import { useEffect, useState } from 'react';

export default function ImageUploader({ onUpload }) {
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);

    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });

    onUpload?.(file);
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  return (
    <div
      className={`image-uploader card ${dragging ? 'dragging' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <label className="image-uploader-label">
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="image-uploader-input"
          aria-label="Upload crop image"
        />
        {preview ? (
          <div className="image-uploader-preview">
            <img src={preview} alt="Crop preview" />
          </div>
        ) : (
          <div className="image-uploader-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
            <span>Drop crop image here or click to upload</span>
          </div>
        )}
      </label>
    </div>
  );
}
