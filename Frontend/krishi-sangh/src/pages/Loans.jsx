import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import LoanCard from '../components/loans/LoanCard';
import "../styles/pages/loans.css";

// Backend API endpoint for loans
const API_URL = "http://127.0.0.1:5001/api/loans";

// Filter options for banks
const FILTERS = ['All Banks', 'SBI', 'HDFC', 'ICICI', 'PNB'];

export default function Loans() {

  // Access selected language
  const { language } = useLanguage();

  // State for filter, data, loading, and warning
  const [filter, setFilter] = useState('All Banks');
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState("");

  // Language-based UI content (manual i18n handling)
  const copy = language === 'hi'
    ? {
        title: 'बैंक ऋण योजनाएं',
        description:
          'किसानों के लिए विशेष रूप से बनाई गई विभिन्न बैंक ऋण योजनाएं देखें और अपनी कृषि आवश्यकताओं के लिए आसानी से वित्त प्राप्त करें।',
        filters: {
          'All Banks': 'सभी बैंक',
          SBI: 'एसबीआई',
          HDFC: 'एचडीएफसी',
          ICICI: 'आईसीआईसीआई',
          PNB: 'पीएनबी',
        },
        footer: 'KrishiSangh किसान वित्त सहायता',
      }
    : {
        title: 'Bank Loan Schemes',
        description:
          'Explore various bank loan schemes designed specifically for farmers.',
        filters: {
          'All Banks': 'All Banks',
          SBI: 'SBI',
          HDFC: 'HDFC',
          ICICI: 'ICICI',
          PNB: 'PNB',
        },
        footer: 'KrishiSangh Farmer Finance Support',
      };

  // Fetch loan data with caching
  useEffect(() => {
    const fetchLoans = async () => {
      try {

        // Load cached data first for faster UI
        const cached = localStorage.getItem("loans_cache");

        if (cached) {
          const { data } = JSON.parse(cached);
          setLoans(data);
          setLoading(false);
        }

        // Fetch fresh data from backend
        const res = await fetch(API_URL);

        if (!res.ok) {
          throw new Error("Failed to fetch loans");
        }

        const response = await res.json();

        // Show warning if backend is using fallback data
        if (response.source === "local") {
          setWarning(response.message);
        }

        const freshData = response.data || [];

        setLoans(freshData);

        // Update cache
        localStorage.setItem("loans_cache", JSON.stringify({
          data: freshData,
          timestamp: new Date().getTime()
        }));

      } catch (error) {
        console.error("Error fetching loans:", error);

        // Show error message
        setWarning("Unable to load data");

      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  // Filter loans based on selected bank (optimized using useMemo)
  const filteredLoans = useMemo(() => {
    if (filter === 'All Banks') return loans;
    return loans.filter((loan) => loan.bank === filter);
  }, [filter, loans]);

  return (

    // Main loans page container
    <div className="page loans-page loans-page-wide">

      {/* Page header */}
      <header className="loans-page-header">
        <h1 className="loans-page-title">{copy.title}</h1>
        <p className="loans-page-subtitle">{copy.description}</p>
      </header>

      {/* Filter buttons */}
      <div className="loans-filters">
        {FILTERS.map((bank) => (
          <button
            key={bank}
            className={`loan-filter-btn ${filter === bank ? 'active' : ''}`}
            onClick={() => setFilter(bank)}
          >
            {copy.filters[bank]}
          </button>
        ))}
      </div>

      {/* Warning message (fallback or error) */}
      {warning && (
        <p style={{ textAlign: "center", color: "orange" }}>
          {warning}
        </p>
      )}

      {/* Loading state */}
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading loans...</p>
      ) : (

        // Render loans dynamically using LoanCard
        <div className="loans-detail-grid">
          {filteredLoans.map((loan) => (
            <LoanCard key={loan.id} loan={loan} />
          ))}
        </div>
      )}

      {/* Footer section */}
      <footer className="loans-page-footer">
        <p>{copy.footer}</p>
      </footer>

    </div>
  );
}