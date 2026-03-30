import { useNavigate } from "react-router-dom";
import "../../styles/mainTopBar.css";

export default function MainTopBar() {
  const navigate = useNavigate();

  return (
    <div className="main-topbar">
      
      {/* BACK TO MAIN DASHBOARD */}
      <button
        className="back-btn"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

    </div>
  );
}