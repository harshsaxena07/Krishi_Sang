import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import ToolCard from '../components/tools/ToolCard';

const tools = [
  {
    id: '1',
    name: 'Mahindra 575 DI Tractor',
    nameHi: '\u092e\u0939\u093f\u0902\u0926\u094d\u0930\u093e 575 DI \u091f\u094d\u0930\u0948\u0915\u094d\u091f\u0930',
    type: 'Tractors',
    typeHi: '\u091f\u094d\u0930\u0948\u0915\u094d\u091f\u0930',
    pricePerDay: 2500,
    rating: 4.8,
    available: true,
    location: 'Nashik, Maharashtra',
    locationHi: '\u0928\u093e\u0936\u093f\u0915, \u092e\u0939\u093e\u0930\u093e\u0937\u094d\u091f\u094d\u0930',
    owner: 'Suresh Patil',
    ownerHi: '\u0938\u0941\u0930\u0947\u0936 \u092a\u093e\u091f\u093f\u0932',
    features: ['45 HP Engine', 'Power Steering', 'Fuel Efficient'],
    featuresHi: ['45 HP \u0907\u0902\u091c\u0928', '\u092a\u093e\u0935\u0930 \u0938\u094d\u091f\u0940\u092f\u0930\u093f\u0902\u0917', '\u0908\u0902\u0927\u0928 \u092c\u091a\u0924'],
    image: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0d2d1f?w=1200&h=900&fit=crop',
  },
  {
    id: '2',
    name: 'John Deere Harvester',
    nameHi: '\u091c\u0949\u0928 \u0921\u0940\u092f\u0930 \u0939\u093e\u0930\u094d\u0935\u0947\u0938\u094d\u091f\u0930',
    type: 'Harvesters',
    typeHi: '\u0939\u093e\u0930\u094d\u0935\u0947\u0938\u094d\u091f\u0930',
    pricePerDay: 4200,
    rating: 4.6,
    available: true,
    location: 'Indore, Madhya Pradesh',
    locationHi: '\u0907\u0902\u0926\u094c\u0930, \u092e\u0927\u094d\u092f \u092a\u094d\u0930\u0926\u0947\u0936',
    owner: 'Ravi Chouhan',
    ownerHi: '\u0930\u0935\u093f \u091a\u094c\u0939\u093e\u0928',
    features: ['Fast Crop Cutting', 'Low Grain Loss', 'Operator Cabin'],
    featuresHi: ['\u0924\u0947\u091c \u092b\u0938\u0932 \u0915\u091f\u093e\u0908', '\u0915\u092e \u0905\u0928\u093e\u091c \u0928\u0941\u0915\u0938\u093e\u0928', '\u0911\u092a\u0930\u0947\u091f\u0930 \u0915\u0948\u092c\u093f\u0928'],
    image: 'https://images.unsplash.com/photo-1683835512900-4b59374f2074?w=1200&h=900&fit=crop',
  },
  {
    id: '3',
    name: 'Sonalika Rotavator Pro',
    nameHi: '\u0938\u094b\u0928\u093e\u0932\u093f\u0915\u093e \u0930\u094b\u091f\u093e\u0935\u0947\u091f\u0930 \u092a\u094d\u0930\u094b',
    type: 'Rotavators',
    typeHi: '\u0930\u094b\u091f\u093e\u0935\u0947\u091f\u0930',
    pricePerDay: 1800,
    rating: 4.7,
    available: false,
    location: 'Nagpur, Maharashtra',
    locationHi: '\u0928\u093e\u0917\u092a\u0941\u0930, \u092e\u0939\u093e\u0930\u093e\u0937\u094d\u091f\u094d\u0930',
    owner: 'Anita Deshmukh',
    ownerHi: '\u0905\u0928\u093f\u0924\u093e \u0926\u0947\u0936\u092e\u0941\u0916',
    features: ['Heavy Duty Blades', 'Depth Control', 'Quick Attachment'],
    featuresHi: ['\u0939\u0947\u0935\u0940 \u0921\u094d\u092f\u0942\u091f\u0940 \u092c\u094d\u0932\u0947\u0921\u094d\u0938', '\u0917\u0939\u0930\u093e\u0908 \u0915\u0902\u091f\u094d\u0930\u094b\u0932', '\u0915\u094d\u0935\u093f\u0915 \u0905\u091f\u0948\u091a\u092e\u0947\u0902\u091f'],
    image: 'https://images.unsplash.com/photo-1625245488616-009066d60f2d?w=1200&h=900&fit=crop',
  },
  {
    id: '4',
    name: 'New Holland Tractor 5620',
    nameHi: '\u0928\u094d\u092f\u0942 \u0939\u0949\u0932\u0948\u0902\u0921 \u091f\u094d\u0930\u0948\u0915\u094d\u091f\u0930 5620',
    type: 'Tractors',
    typeHi: '\u091f\u094d\u0930\u0948\u0915\u094d\u091f\u0930',
    pricePerDay: 3000,
    rating: 4.5,
    available: true,
    location: 'Meerut, Uttar Pradesh',
    locationHi: '\u092e\u0947\u0930\u0920, \u0909\u0924\u094d\u0924\u0930 \u092a\u094d\u0930\u0926\u0947\u0936',
    owner: 'Imran Khan',
    ownerHi: '\u0907\u092e\u0930\u093e\u0928 \u0916\u093e\u0928',
    features: ['55 HP Engine', 'Dual Clutch', 'Hydraulic Lift'],
    featuresHi: ['55 HP \u0907\u0902\u091c\u0928', '\u0921\u094d\u092f\u0942\u0905\u0932 \u0915\u094d\u0932\u091a', '\u0939\u093e\u0907\u0921\u094d\u0930\u094b\u0932\u093f\u0915 \u0932\u093f\u092b\u094d\u091f'],
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=1200&h=900&fit=crop',
  },
  {
    id: '5',
    name: 'Kubota Smart Harvester',
    nameHi: '\u0915\u0941\u092c\u094b\u091f\u093e \u0938\u094d\u092e\u093e\u0930\u094d\u091f \u0939\u093e\u0930\u094d\u0935\u0947\u0938\u094d\u091f\u0930',
    type: 'Harvesters',
    typeHi: '\u0939\u093e\u0930\u094d\u0935\u0947\u0938\u094d\u091f\u0930',
    pricePerDay: 3900,
    rating: 4.4,
    available: false,
    location: 'Ludhiana, Punjab',
    locationHi: '\u0932\u0941\u0927\u093f\u092f\u093e\u0928\u093e, \u092a\u0902\u091c\u093e\u092c',
    owner: 'Gurpreet Singh',
    ownerHi: '\u0917\u0941\u0930\u092a\u094d\u0930\u0940\u0924 \u0938\u093f\u0902\u0939',
    features: ['Compact Design', 'Low Maintenance', 'GPS Ready'],
    featuresHi: ['\u0915\u0902\u092a\u0948\u0915\u094d\u091f \u0921\u093f\u091c\u093c\u093e\u0907\u0928', '\u0915\u092e \u092e\u0947\u0902\u091f\u0947\u0928\u0947\u0902\u0938', 'GPS \u0930\u0947\u0921\u0940'],
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=900&fit=crop',
  },
  {
    id: '6',
    name: 'FieldMaster Rotavator 7ft',
    nameHi: '\u092b\u0940\u0932\u094d\u0921\u092e\u093e\u0938\u094d\u091f\u0930 \u0930\u094b\u091f\u093e\u0935\u0947\u091f\u0930 7ft',
    type: 'Rotavators',
    typeHi: '\u0930\u094b\u091f\u093e\u0935\u0947\u091f\u0930',
    pricePerDay: 1600,
    rating: 4.9,
    available: true,
    location: 'Bhopal, Madhya Pradesh',
    locationHi: '\u092d\u094b\u092a\u093e\u0932, \u092e\u0927\u094d\u092f \u092a\u094d\u0930\u0926\u0947\u0936',
    owner: 'Pooja Verma',
    ownerHi: '\u092a\u0942\u091c\u093e \u0935\u0930\u094d\u092e\u093e',
    features: ['7ft Working Width', 'Smooth Soil Mixing', 'Strong Gearbox'],
    featuresHi: ['7ft \u0935\u0930\u094d\u0915\u093f\u0902\u0917 \u0935\u093f\u0921\u094d\u0925', '\u0938\u094d\u092e\u0942\u0925 \u0938\u0949\u092f\u0932 \u092e\u093f\u0915\u094d\u0938\u093f\u0902\u0917', '\u092e\u091c\u092c\u0942\u0924 \u0917\u093f\u092f\u0930\u092c\u0949\u0915\u094d\u0938'],
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&h=900&fit=crop',
  },
];

const CATEGORY_FILTERS = ['all', 'Tractors', 'Harvesters', 'Rotavators'];

export default function ToolRental() {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');

  const labels = language === 'hi'
    ? {
        back: '\u0921\u0948\u0936\u092c\u094b\u0930\u094d\u0921 \u092a\u0930 \u0935\u093e\u092a\u0938',
        title: '\u0915\u0943\u0937\u093f \u0909\u092a\u0915\u0930\u0923 \u0915\u093f\u0930\u093e\u090f \u092a\u0930 \u0932\u0947\u0902',
        description:
          '\u0905\u092a\u0928\u0947 \u0928\u091c\u093c\u0926\u0940\u0915\u0940 \u0915\u093f\u0938\u093e\u0928\u094b\u0902 \u0914\u0930 \u0909\u092a\u0915\u0930\u0923 \u092e\u093e\u0932\u093f\u0915\u094b\u0902 \u0938\u0947 \u092a\u0947\u0936\u0947\u0935\u0930 \u0938\u094d\u0924\u0930 \u0915\u0947 \u091f\u094d\u0930\u0948\u0915\u094d\u091f\u0930, \u0939\u093e\u0930\u094d\u0935\u0947\u0938\u094d\u091f\u0930 \u0914\u0930 \u0930\u094b\u091f\u093e\u0935\u0947\u091f\u0930 \u0915\u093f\u0930\u093e\u090f \u092a\u0930 \u092c\u0941\u0915 \u0915\u0930\u0947\u0902\u0964',
        filters: {
          all: '\u0938\u092d\u0940 \u0909\u092a\u0915\u0930\u0923',
          Tractors: '\u091f\u094d\u0930\u0948\u0915\u094d\u091f\u0930',
          Harvesters: '\u0939\u093e\u0930\u094d\u0935\u0947\u0938\u094d\u091f\u0930',
          Rotavators: '\u0930\u094b\u091f\u093e\u0935\u0947\u091f\u0930',
        },
      }
    : {
        back: 'Back to Dashboard',
        title: 'Rent Farm Tools',
        description:
          'Browse professional farm equipment listings from nearby owners and book tractors, harvesters, and rotavators with confidence.',
        filters: {
          all: 'All Tools',
          Tractors: 'Tractors',
          Harvesters: 'Harvesters',
          Rotavators: 'Rotavators',
        },
      };

  const filteredTools = useMemo(() => {
    if (activeCategory === 'all') return tools;
    return tools.filter((tool) => tool.type === activeCategory);
  }, [activeCategory]);

  return (
    <div className="page tool-rental-page tool-marketplace-page">
      <Link to="/dashboard" className="tool-marketplace-back btn btn-outline">
        {labels.back}
      </Link>

      <header className="tool-marketplace-header">
        <h1>{labels.title}</h1>
        <p className="page-intro">{labels.description}</p>
      </header>

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

      <div className="tool-marketplace-list">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
