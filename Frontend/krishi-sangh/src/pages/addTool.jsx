import { useState } from "react";
import "../styles/pages/addTool.css";

export default function AddTool() {
  const [form, setForm] = useState({
    name: "",
    type: "",
    location: "",
    price: "",
    owner: "",
    phone: "",
    registration: "",
    description: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  // ✅ NEW STATES (ADDED ONLY)
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, image: null }));
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    const fileInput = document.getElementById("tool-image-input");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    console.log("🔥 NEW CODE RUNNING");
    e.preventDefault();

    // ✅ START LOADING
    setLoading(true);
    setSuccess(false);
    setErrorMsg("");

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("type", form.type);
      formData.append("location", form.location);
      formData.append("price", form.price);
      formData.append("owner", form.owner);
      formData.append("phone", form.phone);
      formData.append("registration", form.registration);
      formData.append("description", form.description);

      const fileInput = document.getElementById("tool-image-input");
      if (fileInput && fileInput.files[0]) {
        formData.append("image", fileInput.files[0]);
      }

      const response = await fetch(
        "http://127.0.0.1:5001/api/admin/tool-requests/request",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit tool");
      }

      // ✅ SUCCESS
      setSuccess(true);

      // OPTIONAL: reset form after success
      setForm({
        name: "",
        type: "",
        location: "",
        price: "",
        owner: "",
        phone: "",
        registration: "",
        description: "",
        image: null,
      });
      setPreview(null);
    } catch (error) {
      console.error(error);
      setErrorMsg("Error submitting tool. Please try again.");
    } finally {
      // ✅ STOP LOADING
      setLoading(false);
    }
  };

  return (
    <div className="page add-tool-page">
      <section className="add-tool-shell">
        
        {/* HEADER */}
        <header className="add-tool-header">
          <span className="add-tool-badge">Tool Rental</span>
          <h1>Add Your Farming Tool</h1>
          <p>List your equipment and earn by renting it to nearby farmers.</p>
        </header>

        {/* CARD */}
        <div className="add-tool-card">
          <div className="add-tool-card-head">
            <h2>Tool Details</h2>
            <p>Fill in the details below</p>
          </div>

          {/* ✅ SUCCESS MESSAGE */}
          {success && (
            <div className="success-msg">
              ✅ Tool added successfully!
            </div>
          )}

          {/* ❌ ERROR MESSAGE */}
          {errorMsg && (
            <div className="error-msg">
              {errorMsg}
            </div>
          )}

          <form className="add-tool-form" onSubmit={handleSubmit}>
            <div className="add-tool-grid">

              <label className="add-tool-field">
                <span>Tool Name</span>
                <div className="input-wrap">
                  <input
                    name="name"
                    placeholder="e.g. Mahindra Tractor 575"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </label>

              <label className="add-tool-field">
                <span>Tool Type</span>
                <div className="input-wrap">
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Tool Type</option>
                    <option>Tractor</option>
                    <option>Harvester</option>
                    <option>Rotavator</option>
                    <option>Seeder</option>
                    <option>Plough</option>
                  </select>
                </div>
              </label>

              <label className="add-tool-field">
                <span>Location</span>
                <div className="input-wrap">
                  <input
                    name="location"
                    placeholder="City, State"
                    value={form.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </label>

              <label className="add-tool-field">
                <span>Price per Day</span>
                <div className="input-wrap">
                  <input
                    type="number"
                    name="price"
                    placeholder="Enter price"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                  <small>₹ / day</small>
                </div>
              </label>

              <label className="add-tool-field">
                <span>Owner Name</span>
                <div className="input-wrap">
                  <input
                    name="owner"
                    placeholder="Owner name"
                    value={form.owner}
                    onChange={handleChange}
                    required
                  />
                </div>
              </label>

              <label className="add-tool-field">
                <span>Phone Number</span>
                <div className="input-wrap">
                  <input
                    name="phone"
                    placeholder="Enter phone number"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </label>

              <label className="add-tool-field full">
                <span>Vehicle Registration Number</span>
                <div className="input-wrap">
                  <input
                    name="registration"
                    placeholder="e.g. UK07 AB 1234"
                    value={form.registration}
                    onChange={handleChange}
                    required
                  />
                </div>
              </label>

              <label className="add-tool-field full">
                <span>Description</span>
                <div className="input-wrap">
                  <textarea
                    name="description"
                    placeholder="Condition, usage, extra details..."
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>
              </label>
            </div>

            {/* IMAGE */}
            <div className="image-upload-container">
              <input 
                type="file" 
                name="image" 
                id="tool-image-input" 
                onChange={handleChange} 
                accept="image/*" 
              />
              
              <label htmlFor="tool-image-input" className="upload-label">
                <div className="custom-browse-text">Browse Files</div>
              </label>

              {preview && (
                <div className="image-preview-wrapper">
                  <img src={preview} alt="preview" className="image-preview" />
                  <button type="button" className="remove-img-btn" onClick={removeImage}>&times;</button>
                </div>
              )}
            </div>

            {/* ✅ BUTTON WITH LOADER */}
            <button type="submit" className="add-tool-submit" disabled={loading}>
              {loading ? "⏳ Adding Tool..." : "Submit Tool"}
            </button>

          </form>
        </div>
      </section>
    </div>
  );
}