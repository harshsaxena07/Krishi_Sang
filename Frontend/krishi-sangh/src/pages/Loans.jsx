import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import LoanCard from '../components/loans/LoanCard';
import "../styles/pages/loans.css";

const API_URL = "http://127.0.0.1:5001/api/loans";

const FILTERS = ['All Banks', 'SBI', 'HDFC', 'ICICI', 'PNB'];

export default function Loans() {
  const { language } = useLanguage();

  const [filter, setFilter] = useState('All Banks');
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState(""); // FIXED

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

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const cached = localStorage.getItem("loans_cache");

        if (cached) {
          const { data } = JSON.parse(cached);
          setLoans(data);
          setLoading(false);
        }

        const res = await fetch(API_URL);

        if (!res.ok) {
          throw new Error("Failed to fetch loans");
        }

        const response = await res.json();

        if (response.source === "local") {
          setWarning(response.message);
        }

        const freshData = response.data || [];

        setLoans(freshData);

        localStorage.setItem("loans_cache", JSON.stringify({
          data: freshData,
          timestamp: new Date().getTime()
        }));

      } catch (error) {
        console.error("Error fetching loans:", error);
        setWarning("Unable to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const filteredLoans = useMemo(() => {
    if (filter === 'All Banks') return loans;
    return loans.filter((loan) => loan.bank === filter);
  }, [filter, loans]);

  return (
    <div className="page loans-page loans-page-wide">
      <header className="loans-page-header">
        <h1 className="loans-page-title">{copy.title}</h1>
        <p className="loans-page-subtitle">{copy.description}</p>
      </header>

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

      {/* Warning message */}
      {warning && (
        <p style={{ textAlign: "center", color: "orange" }}>
          {warning}
        </p>
      )}

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading loans...</p>
      ) : (
        <div className="loans-detail-grid">
          {filteredLoans.map((loan) => (
            <LoanCard key={loan.id} loan={loan} />
          ))}
        </div>
      )}

      <footer className="loans-page-footer">
        <p>{copy.footer}</p>
      </footer>
    </div>
  );
}