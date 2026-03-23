import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

// Importing reusable UI components for dashboard sections
import HeroBanner from '../components/dashboard/HeroBanner';
import ActionButtons from '../components/dashboard/ActionButtons';
import SchemeCard from '../components/schemes/SchemeCard';
import LoanCard from '../components/loans/LoanCard';
import FarmerDashboard from '../components/dashboard/FarmerDashboard';

// Static data sources (can be replaced with API in future)
import { schemes } from '../data/schemes';
import { loans } from '../data/loans';

export default function Dashboard() {

  // Access translation function from global context
  const { t } = useLanguage();

  // Basic check to ensure data exists before rendering
  const hasData = Array.isArray(schemes) && Array.isArray(loans);

  // Show fallback UI if data is not available
  if (!hasData) {
    return <div>Loading...</div>;
  }

  // Normalize loan data to maintain consistent structure across UI
  const normalizedLoans = loans.map((loan) => ({
    id: loan.id,
    name: loan.name || loan.title || 'Loan',
    bank: loan.bank || loan.badge || t.loanBadge || 'Loan',
    purpose: loan.purpose || loan.description || '',
    eligibility: loan.eligibility || '',
    documents: Array.isArray(loan.documents) ? loan.documents : [],
    officialWebsite: loan.officialWebsite,
    image: loan.image,
  }));

  // Filter only central government schemes and limit to 2 items
  const centralSchemes = schemes
    .filter((scheme) => (scheme.type || scheme.category) === 'Central')
    .slice(0, 2);

  // Prioritize well-known banks like SBI or HDFC using regex matching
  const preferredLoans = normalizedLoans
    .filter((loan) => /SBI|HDFC/i.test(`${loan.bank} ${loan.name}`))
    .slice(0, 2);

  // If preferred loans not found, fallback to first 2 available loans
  const dashboardLoans = preferredLoans.length > 0
    ? preferredLoans
    : normalizedLoans.slice(0, 2);

  return (
    <div className="dashboard-page">

      {/* Top banner section */}
      <HeroBanner />

      {/* Quick action buttons for navigation */}
      <ActionButtons />

      {/* Government schemes section */}
      <section className="schemes-section">
        <div className="section-header">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
          </svg>
          <span>{t.govSchemes}</span>
        </div>

        {/* Dynamically render scheme cards */}
        <div className="schemes-grid">
          {centralSchemes.map((s) => (
            <SchemeCard
              key={s.id}
              title={s.title}
              description={s.description}
              badge={s.category}
              eligibility={s.descriptionLong}
              documents={s.documents}
              image={s.image}
            />
          ))}
        </div>
      </section>

      {/* Loan section */}
      <section className="loans-section">
        <div className="section-header">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2L2 7v2h2v10h4V9h4v10h4V9h2V7L12 2z" />
          </svg>
          <span>{t.bankLoans}</span>
        </div>

        {/* Dynamically render loan cards */}
        <div className="loans-grid">
          {dashboardLoans.map((loan) => (
            <LoanCard
              key={loan.id}
              loan={loan}
            />
          ))}
        </div>
      </section>

      {/* Additional farmer-focused dashboard content */}
      <FarmerDashboard />

      {/* Footer section with background image and CTA */}
      <footer className="dashboard-footer-image">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&h=700&fit=crop"
          alt="Farm landscape"
        />

        {/* Overlay for better text readability */}
        <div className="dashboard-footer-overlay" />

        {/* Call-to-action content */}
        <div className="dashboard-footer-content">
          <h2 className="dashboard-footer-title">Empowering Farmers with Technology</h2>
          <p className="dashboard-footer-subtitle">Smart farming solutions for a better future</p>

          {/* Navigation button */}
          <Link to="/schemes" className="btn btn-secondary dashboard-footer-btn">
            Explore Services
          </Link>
        </div>
      </footer>
    </div>
  );
}