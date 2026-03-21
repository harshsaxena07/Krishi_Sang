import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import SchemeDetailCard from '../components/schemes/SchemeDetailCard';
import "../styles/pages/schemes.css";

const API_URL = "http://127.0.0.1:5001/api/schemes";

const FILTER_ALL = 'all';
const FILTER_CENTRAL = 'Central';
const FILTER_STATE = 'State';

export default function Schemes() {
  const { t } = useLanguage();

  const [filter, setFilter] = useState(FILTER_ALL);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState("");

  // Fetch schemes with caching
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const cached = localStorage.getItem("schemes_cache");

        if (cached) {
          const { data } = JSON.parse(cached);
          setSchemes(data);
          setLoading(false);
        }

        const res = await fetch(API_URL);

        if (!res.ok) {
          throw new Error("Failed to fetch schemes");
        }

        const response = await res.json();

        if (response.source === "local") {
          setWarning(response.message);
        }

        const freshData = response.data || [];

        setSchemes(freshData);

        localStorage.setItem("schemes_cache", JSON.stringify({
          data: freshData,
          timestamp: new Date().getTime()
        }));

      } catch (error) {
        console.error("Error fetching schemes:", error);
        setSchemes([]);
        setWarning("Unable to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  // Filter logic
  const filteredSchemes = useMemo(() => {
    if (filter === FILTER_ALL) return schemes;
    return schemes.filter((s) => s.category === filter);
  }, [filter, schemes]);

  return (
    <div className="page schemes-page schemes-page-wide">
      <header className="schemes-page-header">
        <h1 className="schemes-page-title">{t.schemesPageTitle}</h1>
        <p className="schemes-page-subtitle">{t.schemesPageSubtitle}</p>
      </header>

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

      {/* Warning */}
      {warning && (
        <p style={{ textAlign: "center", color: "orange" }}>
          {warning}
        </p>
      )}

      {/* Loading */}
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading schemes...</p>
      ) : (
        <div className="schemes-detail-grid">
          {filteredSchemes.map((scheme) => (
            <SchemeDetailCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      )}
    </div>
  );
}