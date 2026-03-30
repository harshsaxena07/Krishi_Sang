import { useEffect, useState } from "react";
import "../../styles/toolApproval.css";
import AdminTopBar from "../../components/admin/AdminTopBar";

export default function ToolApproval() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [processingType, setProcessingType] = useState(null);

  const BASE_URL = "http://127.0.0.1:5001";

  useEffect(() => {
    fetch(`${BASE_URL}/api/admin/tools/pending`)
      .then((res) => res.json())
      .then((data) => {
        setTools(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleAction = async (toolId, action) => {
    try {
      setProcessingId(toolId);
      setProcessingType(action); 

      await fetch(`${BASE_URL}/api/admin/tools/${action}/${toolId}`, {
        method: "POST",
      });

      setTools((prev) => prev.filter((tool) => tool.id !== toolId));
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
      setProcessingType(null);
    }
  };

  const getImageUrl = (tool) => {
    if (!tool.image) {
      return "https://via.placeholder.com/600x340?text=No+Image";
    }
    return `${BASE_URL}/uploads/${tool.image}`;
  };

  return (
    <section className="tool-page">
      <AdminTopBar rightButtonText="Add Loan" rightPath="/admin/add-loan" />
      <div className="tool-header-box">
        <div className="tool-header-text">
          <h1>Tool Approval Dashboard</h1>
          <p>Review and manage submitted farming tools efficiently</p>
        </div>

        <div className="tool-header-stats">
          <div className="stat-box">
            <span className="stat-number">{tools.length}</span>
            <span className="stat-label">Pending Tools</span>
          </div>

          <div className="stat-box">
            <span className="stat-number">Admin</span>
            <span className="stat-label">Role Access</span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="tool-container">

        {loading && (
          <div className="loader">
            <div className="spinner"></div>
            <p>Loading pending tools...</p>
          </div>
        )}

        {!loading && tools.length === 0 && (
          <div className="empty-state">
            <h2>No Pending Tools</h2>
            <p>All tools have been reviewed</p>
          </div>
        )}

        {!loading && tools.length > 0 && (
          <div className="tool-grid">
            {tools.map((tool) => (
              <div className="tool-card" key={tool.id}>

                <img
                  className="tool-image"
                  src={getImageUrl(tool)}
                  alt={tool.name}
                />

                <div className="tool-content">
                  <h3>{tool.name}</h3>
                  <p>{tool.description}</p>

                  <p><strong>Price:</strong> ₹ {tool.price}</p>
                  <p><strong>Location:</strong> {tool.location}</p>
                </div>

                <div className="tool-actions">
                  <button
                    className="approve-btn"
                    onClick={() => handleAction(tool.id, "approve")}
                    disabled={processingId === tool.id && processingType === "approve"}
                  >
                    {processingId === tool.id && processingType === "approve"
                      ? "Processing..."
                      : "Approve"}
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => handleAction(tool.id, "reject")}
                    disabled={processingId === tool.id && processingType === "reject"}
                  >
                    {processingId === tool.id && processingType === "reject"
                      ? "Processing..."
                      : "Reject"}
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}