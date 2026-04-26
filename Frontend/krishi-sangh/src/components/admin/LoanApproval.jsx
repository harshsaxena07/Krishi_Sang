import React, { useEffect, useState } from "react";
import "../../styles/loanApproval.css";
import AdminTopBar from "../../components/admin/AdminTopBar";
import { useNavigate } from "react-router-dom";

function LoanApproval() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5001/api/admin/loan-approval/");
      const data = await res.json();

      setLoans(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching loans:", err);
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (loanId) => {
    setActionLoading(loanId + "_approve");

    try {
      await fetch(
        `http://localhost:5001/api/admin/loan-approval/approve/${loanId}`,
        { method: "POST" }
      );

      setLoans((prev) => prev.filter((loan) => loan.id !== loanId));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (loanId) => {
    setActionLoading(loanId + "_reject");

    try {
      await fetch(
        `http://localhost:5001/api/admin/loan-approval/reject/${loanId}`,
        { method: "DELETE" }
      );

      setLoans((prev) => prev.filter((loan) => loan.id !== loanId));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <section className="loan-page">
      <div className="loan-container">
        <div className="back-btn-wrapper">
          <button onClick={() => navigate("/admin")} className="back-btn">
            ← Back to Dashboard
          </button>
        </div>

        {/* HEADER */}
        <div className="loan-header-box">
          <div className="loan-header-text">
            <h1>Loan Approval Dashboard</h1>
            <p>Manage and review all farmer loan requests efficiently</p>
          </div>

          <div className="loan-header-stats">
            <div className="stat-box">
              <span className="stat-number">{loans.length}</span>
              <span className="stat-label">Pending Requests</span>
            </div>

            <div className="stat-box">
              <span className="stat-number">Admin</span>
              <span className="stat-label">Role Access</span>
            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="loader">
            <div className="spinner"></div>
            <p>Fetching loan requests...</p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && loans.length === 0 && (
          <div className="empty-state">
            <h2>No Loan Requests</h2>
            <p>All loan approvals are completed</p>
          </div>
        )}

        {/* CARDS */}
        {!loading && loans.length > 0 && (
          <div className="loan-grid">
            {loans.map((loan) => (
              <div key={loan.id} className="loan-card">

                <img
                  className="loan-image"
                  src={loan.image || "/images/logo.png"}
                  alt={loan.name}
                />

                <div className="loan-content">
                  <h3>{loan.name}</h3>
                  <span className="loan-bank">{loan.bank}</span>
                  <p>{loan.purpose}</p>
                </div>

                <div className="loan-actions">
                  <button onClick={() => setSelectedLoan(loan)}>
                    Details
                  </button>

                  <button
                    className="approve-btn"
                    onClick={() => handleApprove(loan.id)}
                    disabled={actionLoading !== null}
                  >
                    {actionLoading === loan.id + "_approve"
                      ? "Processing..."
                      : "Approve"}
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => handleReject(loan.id)}
                    disabled={actionLoading !== null}
                  >
                    {actionLoading === loan.id + "_reject"
                      ? "Processing..."
                      : "Reject"}
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* MODAL */}
      {selectedLoan && (
        <div className="modal-overlay" onClick={() => setSelectedLoan(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedLoan.name}</h2>
            <p><strong>Bank:</strong> {selectedLoan.bank}</p>
            <p><strong>Purpose:</strong> {selectedLoan.purpose}</p>
            <p><strong>Eligibility:</strong> {selectedLoan.eligibility}</p>

            <button onClick={() => setSelectedLoan(null)}>Close</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default LoanApproval;