import React, { useState } from "react";
import "../../styles/addScheme.css";
import AdminTopBar from "../../components/admin/AdminTopBar";


const initialFormData = {
  title: "",
  name: "",
  name_hi: "",
  category: "",
  category_hi: "",
  description: "",
  description_long: "",
  description_hi: "",
  documents: [""],
  documents_hi: [""],
  official_url: "",
  image: "",
};

function AddScheme() {
  const [formData, setFormData] = useState(initialFormData);

  // ✅ NEW STATES (ADDED SAFELY)
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Handle scalar field updates.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle updates for dynamic document fields.
  const handleDocumentChange = (field, index, value) => {
    setFormData((prev) => {
      const updated = [...prev[field]];
      updated[index] = value;
      return {
        ...prev,
        [field]: updated,
      };
    });
  };

  // Append a new input row for document arrays.
  const addDocumentField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    const payload = {
      ...formData,
      documents: formData.documents.filter((item) => item.trim() !== ""),
      documents_hi: formData.documents_hi.filter((item) => item.trim() !== ""),
    };

    try {
      const res = await fetch("http://127.0.0.1:5001/api/admin/schemes/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setSuccess("✅ Scheme added successfully!");
      setFormData(initialFormData);

    } catch (err) {
      setError("❌ Failed to add scheme");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="scheme-page">
      <div className="scheme-container">
        <AdminTopBar rightButtonText="Add Loan" rightPath="/admin/add-loan" />
        
        <header>
          <h1>Add New Scheme</h1>
          <p>Enter scheme details for farmers</p>
        </header>

        {/* ✅ STATUS UI */}
        {loading && (
          <div className="loader-box">
            <div className="spinner"></div>
            <p>Saving scheme...</p>
          </div>
        )}

        {success && <div className="success-box">{success}</div>}
        {error && <div className="error-box">{error}</div>}

        <form className="scheme-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                className="form-input"
                placeholder="Enter scheme title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                placeholder="Enter scheme name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name_hi">Name (Hindi)</label>
              <input
                id="name_hi"
                name="name_hi"
                type="text"
                className="form-input"
                placeholder="योजना का नाम दर्ज करें"
                value={formData.name_hi}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                id="category"
                name="category"
                type="text"
                className="form-input"
                placeholder="Enter category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category_hi">Category (Hindi)</label>
              <input
                id="category_hi"
                name="category_hi"
                type="text"
                className="form-input"
                placeholder="श्रेणी दर्ज करें"
                value={formData.category_hi}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="official_url">Official URL</label>
              <input
                id="official_url"
                name="official_url"
                type="url"
                className="form-input"
                placeholder="https://example.gov.in/scheme"
                value={formData.official_url}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="description">Short Description</label>
              <input
                id="description"
                name="description"
                type="text"
                className="form-input"
                placeholder="Brief summary of the scheme"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description_hi">Short Description (Hindi)</label>
              <input
                id="description_hi"
                name="description_hi"
                type="text"
                className="form-input"
                placeholder="संक्षिप्त विवरण दर्ज करें"
                value={formData.description_hi}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="image">Image URL</label>
              <input
                id="image"
                name="image"
                type="url"
                className="form-input"
                placeholder="https://images.example.com/scheme.jpg"
                value={formData.image}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="description_long">Long Description</label>
              <textarea
                id="description_long"
                name="description_long"
                className="form-textarea"
                placeholder="Add full details"
                value={formData.description_long}
                onChange={handleChange}
                rows={5}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Documents</label>
              {formData.documents.map((doc, index) => (
                <input
                  key={index}
                  type="text"
                  className="form-input"
                  placeholder={`Document ${index + 1}`}
                  value={doc}
                  onChange={(e) =>
                    handleDocumentChange("documents", index, e.target.value)
                  }
                />
              ))}
              <button
                type="button"
                className="add-btn"
                onClick={() => addDocumentField("documents")}
              >
                Add Document
              </button>
            </div>

            <div className="form-group">
              <label>Documents (Hindi)</label>
              {formData.documents_hi.map((doc, index) => (
                <input
                  key={index}
                  type="text"
                  className="form-input"
                  placeholder={`दस्तावेज़ ${index + 1}`}
                  value={doc}
                  onChange={(e) =>
                    handleDocumentChange("documents_hi", index, e.target.value)
                  }
                />
              ))}
              <button
                type="button"
                className="add-btn"
                onClick={() => addDocumentField("documents_hi")}
              >
                Add Document
              </button>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Saving..." : "Save Scheme"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AddScheme;