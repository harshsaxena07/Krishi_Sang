import { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import SchemeDetailCard from '../components/schemes/SchemeDetailCard';
import { schemes } from '../data/schemes';
import "../styles/pages/schemes.css";

const FILTER_ALL = 'all';
const FILTER_CENTRAL = 'Central';
const FILTER_STATE = 'State';

export default function Schemes() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState(FILTER_ALL);

  const filteredSchemes = useMemo(() => {
    if (filter === FILTER_ALL) return schemes;
    return schemes.filter((s) => s.category === filter);
  }, [filter]);

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

      <div className="schemes-detail-grid">
        {filteredSchemes.map((scheme) => (
          <SchemeDetailCard key={scheme.id} scheme={scheme} />
        ))}
      </div>
    </div>
  );
}
