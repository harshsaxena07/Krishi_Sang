import React, { useState } from "react";
import "../../styles/addLoan.css";
import AdminTopBar from "../../components/admin/AdminTopBar";


const initialFormData = {
  name: "",
  name_hi: "",
  bank: "",
  purpose: "",
  purpose_hi: "",
  eligibility: "",
  eligibility_hi: "",
  documents: [""],
  documents_hi: [""],
  official_website: "",
  image: "",
};

function AddLoan() {
  const [formData, setFormData] = useState(initialFormData);

  // ✅ NEW STATES (ADDED)
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle document fields
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

  // Add new document field
  const addDocumentField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  // ✅ UPDATED SUBMIT FUNCTION
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
      const res = await fetch("http://127.0.0.1:5001/api/admin/loans/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setSuccess("✅ Loan added successfully!");
      setFormData(initialFormData);

    } catch (err) {
      console.error(err);
      setError("❌ Failed to add loan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="loan-page">
      <div className="loan-container">
        <AdminTopBar />
        <div className="loan-header">
          <h1>Add New Loan</h1>
          <p>Enter loan details for farmers</p>
        </div>

        {/* ✅ STATUS UI */}
        {loading && (
          <div className="loader-box">
            <div className="spinner"></div>
            <p>Saving loan...</p>
          </div>
        )}

        {success && <div className="success-box">{success}</div>}
        {error && <div className="error-box">{error}</div>}

        <form className="loan-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Loan Name</label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                placeholder="Enter loan name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="name_hi">Hindi Name</label>
              <input
                id="name_hi"
                name="name_hi"
                type="text"
                className="form-input"
                placeholder="ऋण का नाम दर्ज करें"
                value={formData.name_hi}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bank">Bank Name</label>
              <input
                id="bank"
                name="bank"
                type="text"
                className="form-input"
                placeholder="Enter bank name"
                value={formData.bank}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="official_website">Official Website</label>
              <input
                id="official_website"
                name="official_website"
                type="url"
                className="form-input"
                placeholder="https://bank.example.com/loan"
                value={formData.official_website}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="purpose">Purpose</label>
              <textarea
                id="purpose"
                name="purpose"
                className="form-textarea"
                placeholder="Describe the purpose"
                value={formData.purpose}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="purpose_hi">Purpose (Hindi)</label>
              <textarea
                id="purpose_hi"
                name="purpose_hi"
                className="form-textarea"
                placeholder="ऋण का उद्देश्य लिखें"
                value={formData.purpose_hi}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="eligibility">Eligibility</label>
              <textarea
                id="eligibility"
                name="eligibility"
                className="form-textarea"
                placeholder="Eligibility criteria"
                value={formData.eligibility}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="eligibility_hi">Eligibility (Hindi)</label>
              <textarea
                id="eligibility_hi"
                name="eligibility_hi"
                className="form-textarea"
                placeholder="पात्रता मानदंड"
                value={formData.eligibility_hi}
                onChange={handleChange}
                rows={4}
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
                placeholder="https://image.jpg"
                value={formData.image}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Documents</label>
              {formData.documents.map((doc, index) => (
                <input
                  key={index}
                  className="form-input"
                  value={doc}
                  onChange={(e) =>
                    handleDocumentChange("documents", index, e.target.value)
                  }
                />
              ))}
              <button type="button" onClick={() => addDocumentField("documents")}>
                Add Document
              </button>
            </div>

            <div className="form-group">
              <label>Documents (Hindi)</label>
              {formData.documents_hi.map((doc, index) => (
                <input
                  key={index}
                  className="form-input"
                  value={doc}
                  onChange={(e) =>
                    handleDocumentChange("documents_hi", index, e.target.value)
                  }
                />
              ))}
              <button type="button" onClick={() => addDocumentField("documents_hi")}>
                Add Document
              </button>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Saving..." : "Save Loan"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AddLoan;