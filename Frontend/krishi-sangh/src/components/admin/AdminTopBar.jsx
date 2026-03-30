import { useNavigate } from "react-router-dom";
import "../../styles/adminTopBar.css";

export default function AdminTopBar() {
  const navigate = useNavigate();

  return (
    <div className="admin-topbar">
      
      {/* BACK TO ADMIN DASHBOARD */}
      <button
        className="back-btn"
        onClick={() => navigate("/admin")}
      >
        ← Back to Dashboard
      </button>

    </div>
  );
}