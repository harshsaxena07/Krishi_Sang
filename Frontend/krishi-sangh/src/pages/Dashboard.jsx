import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

import HeroBanner from '../components/dashboard/HeroBanner';
import ActionButtons from '../components/dashboard/ActionButtons';
import SchemeCard from '../components/schemes/SchemeCard';
import LoanCard from '../components/loans/LoanCard';
import FarmerDashboard from '../components/dashboard/FarmerDashboard';

export default function Dashboard() {

  // Language + translation
  const { t, language } = useLanguage();

  // API state (replaces static data)
  const [schemes, setSchemes] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  useEffect(() => {
    const cachedSchemes = localStorage.getItem("schemes");
    const cachedLoans = localStorage.getItem("loans");

    // If data exists in cache, use it instantly
    if (cachedSchemes && cachedLoans) {
      setSchemes(JSON.parse(cachedSchemes));
      setLoans(JSON.parse(cachedLoans));
      setLoading(false);
      return;
    }

    // Otherwise fetch from API
    Promise.all([
      fetch("http://127.0.0.1:5001/api/schemes/").then(res => res.json()),
      fetch("http://127.0.0.1:5001/api/loans").then(res => res.json())
    ])
      .then(([schemesData, loansData]) => {
        const schemesDataParsed = schemesData.data || [];
        const loansDataParsed = loansData.data || [];

        setSchemes(schemesDataParsed);
        setLoans(loansDataParsed);

        // Save to localStorage
        localStorage.setItem("schemes", JSON.stringify(schemesDataParsed));
        localStorage.setItem("loans", JSON.stringify(loansDataParsed));

        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard API error:", err);
        setLoading(false);
      });
  }, []);

  // Loading state
  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  // Normalize loan data (UNCHANGED LOGIC)
  const normalizedLoans = loans.map((loan) => ({
    id: loan.id,
    name:
      language === "hi"
        ? loan.name_hi || loan.name || loan.title
        : loan.name || loan.title,

    bank:
      language === "hi"
        ? loan.bank_hi || loan.bank || loan.badge || t.loanBadge
        : loan.bank || loan.badge || t.loanBadge,

    purpose:
      language === "hi"
        ? loan.description_hi || loan.purpose || loan.description
        : loan.purpose || loan.description,

    eligibility: loan.eligibility || "",
    documents: Array.isArray(loan.documents) ? loan.documents : [],
    officialWebsite: loan.officialWebsite,
    image: loan.image,
  }));

  // Filter central schemes (UNCHANGED LOGIC)
  const centralSchemes = schemes
    .filter((scheme) => (scheme.type || scheme.category) === 'Central')
    .slice(0, 2);

  // Prioritize known banks (UNCHANGED)
  const preferredLoans = normalizedLoans
    .filter((loan) => /SBI|HDFC/i.test(`${loan.bank} ${loan.name}`))
    .slice(0, 2);

  const dashboardLoans =
    preferredLoans.length > 0
      ? preferredLoans
      : normalizedLoans.slice(0, 2);

  return (
    <div className="dashboard-page">

      <HeroBanner />
      <ActionButtons />

      {/* ================= SCHEMES ================= */}
      <section className="schemes-section">
        <div className="section-header">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
          </svg>
          <span>{t.govSchemes}</span>
        </div>

        <div className="schemes-grid">
          {centralSchemes.map((s) => (
            <SchemeCard
              key={s.id}
              title={language === "hi" ? s.name_hi || s.title : s.title}
              description={language === "hi" ? s.description_hi || s.description : s.description}
              badge={language === "hi" ? s.category_hi || s.category : s.category}
              eligibility={language === "hi"
                ? s.description_hi || s.description_long
                : s.description_long}
              documents={s.documents}
              image={s.image}
            />
          ))}
        </div>
      </section>

      {/* ================= LOANS ================= */}
      <section className="loans-section">
        <div className="section-header">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7v2h2v10h4V9h4v10h4V9h2V7L12 2z" />
          </svg>
          <span>{t.bankLoans}</span>
        </div>

        <div className="loans-grid">
          {dashboardLoans.map((loan) => (
            <LoanCard key={loan.id} loan={loan} />
          ))}
        </div>
      </section>

      <FarmerDashboard />

      {/* ================= FOOTER ================= */}
      <footer className="dashboard-footer-image">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&h=700&fit=crop"
          alt="Farm landscape"
        />

        <div className="dashboard-footer-overlay" />

        <div className="dashboard-footer-content">
          <h2 className="dashboard-footer-title">
            {language === "hi"
              ? "तकनीक से किसानों को सशक्त बनाना"
              : "Empowering Farmers with Technology"}
          </h2>

          <p className="dashboard-footer-subtitle">
            {language === "hi"
              ? "स्मार्ट खेती के लिए आधुनिक समाधान"
              : "Smart farming solutions for a better future"}
          </p>

          <Link
            to="/schemes"
            className="btn btn-secondary dashboard-footer-btn"
          >
            {language === "hi" ? "सेवाएं देखें" : "Explore Services"}
          </Link>
        </div>
      </footer>

    </div>
  );
}

