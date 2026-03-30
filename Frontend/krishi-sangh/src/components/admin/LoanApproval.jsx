import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/loanApproval.css";
import AdminTopBar from "../../components/admin/AdminTopBar";

function LoanApproval() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const navigate = useNavigate(); // ✅ navigation added

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5001/api/admin/loan-approval/");
      if (!res.ok) throw new Error("API not responding");

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
      console.error("Approve error:", err);
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
      console.error("Reject error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <section className="loan-page">
      <AdminTopBar rightButtonText="Back to Dashboard" rightPath="/admin" />

      {/* HEADER */}
      <div className="loan-header">
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

      <div className="loan-container">
        {loading ? (
          <div className="loader">
            <div className="spinner"></div>
            <p>Fetching loan requests from database...</p>
          </div>
        ) : loans.length === 0 ? (
          <div className="empty-state">
            <h2>No Loan Requests</h2>
            <p>All loan approvals are completed</p>
          </div>
        ) : (
          loans.map((loan) => (
            <div key={loan.id} className="loan-card">

              <div className="loan-right">
                <img
                  src={loan.image || "/images/logo.png"}
                  alt={loan.name}
                />
              </div>

              <div className="loan-left">
                <h2 className="loan-title">{loan.name}</h2>
                <span className="loan-bank">{loan.bank}</span>
                <p className="loan-description">{loan.purpose}</p>

                <div className="loan-actions">
                  <button onClick={() => setSelectedLoan(loan)}>
                    Details
                  </button>

                  <button
                    className="approve-btn"
                    onClick={() => handleApprove(loan.id)}
                    disabled={actionLoading !== null}
                  >
                    {actionLoading === loan.id + "_approve" ? (
                      <span className="btn-loading">
                        <span className="btn-loader"></span>
                        Approving...
                      </span>
                    ) : (
                      "Approve"
                    )}
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => handleReject(loan.id)}
                    disabled={actionLoading !== null}
                  >
                    {actionLoading === loan.id + "_reject" ? (
                      <span className="btn-loading">
                        <span className="btn-loader"></span>
                        Rejecting...
                      </span>
                    ) : (
                      "Reject"
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

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