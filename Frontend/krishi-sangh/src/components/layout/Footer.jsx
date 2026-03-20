import "../../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* LEFT */}
        <div className="footer-left">
          <h2 className="footer-logo">KrishiSangh</h2>
          <p className="footer-tagline">
            A Digital Farming Support System helping farmers with smart tools,
            crop insights, and modern agricultural solutions.
          </p>
        </div>

        {/* CENTER */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <a href="/">Home</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/schemes">Schemes</a>
          <a href="/loans">Loans</a>
        </div>

        {/* RIGHT */}
        <div className="footer-contact">
          <h3>Contact</h3>
          <p>📍 India</p>
          <p>📧 support@krishisangh.com</p>
          <p>📞 +91 XXXXX XXXXX</p>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 KrishiSangh. All rights reserved.
      </div>
    </footer>
  );
}