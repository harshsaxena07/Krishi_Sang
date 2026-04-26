import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import SchemeDetailCard from '../components/schemes/SchemeDetailCard';
import "../styles/pages/schemes.css";
import MainTopBar from "../components/layout/MainTopBar";

// Backend API endpoint for schemes data
const API_URL = "http://127.0.0.1:5001/api/schemes";

// Filter constants
const FILTER_ALL = 'all';
const FILTER_CENTRAL = 'Central';
const FILTER_STATE = 'State';

export default function Schemes() {

  // Access translation function
  const { t } = useLanguage();

  // State for filter, data, loading, and warning messages
  const [filter, setFilter] = useState(FILTER_ALL);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState("");

  // Fetch schemes from backend with localStorage caching
  useEffect(() => {
    const fetchSchemes = async () => {
      try {

        // Try to load cached data first
        const cached = localStorage.getItem("schemes_cache");

        if (cached) {
          const { data } = JSON.parse(cached);
          setSchemes(data);
          setLoading(false);
        }

        // Fetch fresh data from backend
        const res = await fetch(API_URL);

        if (!res.ok) {
          throw new Error("Failed to fetch schemes");
        }

        const response = await res.json();

        // If backend fallback (local file), show warning
        if (response.source === "local") {
          setWarning(response.message);
        }

        const freshData = response.data || [];

        setSchemes(freshData);

        // Store latest data in cache
        localStorage.setItem("schemes_cache", JSON.stringify({
          data: freshData,
          timestamp: new Date().getTime()
        }));

      } catch (error) {
        console.error("Error fetching schemes:", error);

        // Handle failure case
        setSchemes([]);
        setWarning("Unable to load data");

      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  // Filter schemes based on selected category (optimized using useMemo)
  const filteredSchemes = useMemo(() => {
    if (filter === FILTER_ALL) return schemes;
    return schemes.filter((s) => s.category === filter);
  }, [filter, schemes]);

  return (

    // Main schemes page container
    <div className="page schemes-page schemes-page-wide">
      <MainTopBar />

      <header className="schemes-page-header">
        <span className="schemes-page-badge">{t.schemeBadge}</span>
        <h1 className="schemes-page-title">{t.schemesPageTitle}</h1>
        <p className="schemes-page-subtitle">{t.schemesPageSubtitle}</p>
      </header>

      {/* Filter buttons */}
      <div className="schemes-filters">

        <button
          type="button"
          className={`schemes-filter-btn ${filter === FILTER_ALL ? 'active' : ''}`}
          onClick={() => setFilter(FILTER_ALL)}
        >
          {t.filterAllSchemes}
        </button>

        <button
          type="button"
          className={`schemes-filter-btn ${filter === FILTER_CENTRAL ? 'active' : ''}`}
          onClick={() => setFilter(FILTER_CENTRAL)}
        >
          {t.filterCentral}
        </button>

        <button
          type="button"
          className={`schemes-filter-btn ${filter === FILTER_STATE ? 'active' : ''}`}
          onClick={() => setFilter(FILTER_STATE)}
        >
          {t.filterState}
        </button>

      </div>

      {/* Show warning if backend fallback is used */}
      {warning && (
        <p className="schemes-page-warning">
          {warning}
        </p>
      )}

      {/* Loading state */}
      {loading ? (
        <p className="schemes-page-loading">Loading schemes...</p>
      ) : (

        // Render schemes dynamically using reusable card component
        <div className="schemes-detail-grid">
          {filteredSchemes.map((scheme) => (
            <SchemeDetailCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      )}

    </div>
  );
}
