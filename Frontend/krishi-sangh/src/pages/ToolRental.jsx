import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import ToolCard from '../components/tools/ToolCard';
import "../styles/pages/tools.css";

// Backend API endpoint for tools
const API_URL = "http://127.0.0.1:5001/api/tools";

// Category filters for tools
const CATEGORY_FILTERS = ['all', 'Tractors', 'Harvesters', 'Rotavators'];

export default function ToolRental() {

  const { language } = useLanguage();

  const [activeCategory, setActiveCategory] = useState('all');
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState("");

  //FIXED: added addBtn
  const labels = language === 'hi'
    ? {
        back: 'डैशबोर्ड पर वापस',
        title: 'कृषि उपकरण किराए पर लें',
        description:
          'अपने नज़दीकी किसानों और उपकरण मालिकों से पेशेवर स्तर के ट्रैक्टर, हार्वेस्टर और रोटावेटर किराए पर बुक करें।',
        filters: {
          all: 'सभी उपकरण',
          Tractors: 'ट्रैक्टर',
          Harvesters: 'हार्वेस्टर',
          Rotavators: 'रोटावेटर',
        },
        addBtn: '+ उपकरण जोड़ें'
      }
    : {
        back: 'Back to Dashboard',
        title: 'Rent Farm Tools',
        description:
          'Browse professional farm equipment listings from nearby owners.',
        filters: {
          all: 'All Tools',
          Tractors: 'Tractors',
          Harvesters: 'Harvesters',
          Rotavators: 'Rotavators',
        },
        addBtn: '+ Add Your Tool'
      };

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const cached = localStorage.getItem("tools_cache");

        if (cached) {
          const { data } = JSON.parse(cached);
          setTools(data);
          setLoading(false);
        }

        const res = await fetch(API_URL);

        if (!res.ok) {
          throw new Error("Failed to fetch tools");
        }

        const response = await res.json();

        if (response.source === "local") {
          setWarning(response.message);
        }

        const freshData = response.data || [];

        setTools(freshData);

        localStorage.setItem("tools_cache", JSON.stringify({
          data: freshData,
          timestamp: new Date().getTime()
        }));

      } catch (error) {
        console.error("Error fetching tools:", error);
        setTools([]);
        setWarning("Unable to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  const filteredTools = useMemo(() => {
    if (activeCategory === 'all') return tools;
    return tools.filter((tool) => tool.type === activeCategory);
  }, [activeCategory, tools]);

  return (

    <div className="page tool-rental-page tool-marketplace-page">

      {/* FIXED HEADER ROW */}
      <div className="tool-header-row">

        <Link to="/dashboard" className="tool-marketplace-back btn btn-outline">
          {labels.back}
        </Link>

        <button
          className="add-tool-btn"
          onClick={() => window.location.href = "/add-tool"}
        >
          {labels.addBtn}
        </button>

      </div>

      {/* Page header */}
      <header className="tool-marketplace-header">
        <h1>{labels.title}</h1>
        <p className="page-intro">{labels.description}</p>
      </header>

      {/* Filters */}
      <div className="schemes-filters tool-marketplace-filters">
        {CATEGORY_FILTERS.map((category) => (
          <button
            key={category}
            type="button"
            className={`schemes-filter-btn tool-filter-btn ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {labels.filters[category]}
          </button>
        ))}
      </div>

      {/* Warning */}
      {warning && (
        <p style={{ textAlign: "center", color: "orange" }}>
          {warning}
        </p>
      )}

      {/* Loading */}
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading tools...</p>
      ) : (
        <div className="tool-marketplace-list">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}

    </div>
  );
}