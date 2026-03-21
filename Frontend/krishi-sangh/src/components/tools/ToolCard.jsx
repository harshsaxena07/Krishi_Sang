import { useLanguage } from '../../context/LanguageContext';

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.11.37 2.3.56 3.58.56a1 1 0 011 1V20a1 1 0 01-1 1C10.3 21 3 13.7 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.28.19 2.47.56 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v13a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 15H5V10h14v9zm0-11H5V6h14v2z" />
    </svg>
  );
}

export default function ToolCard({ tool }) {
  const { language } = useLanguage();

  const isHindi = language === 'hi';

  // Support both backend and old frontend keys
  const name = isHindi
    ? (tool.name_hi || tool.nameHi)
    : tool.name;

  const type = isHindi
    ? (tool.type_hi || tool.typeHi)
    : tool.type;

  const location = isHindi
    ? (tool.location_hi || tool.locationHi)
    : tool.location;

  const owner = isHindi
    ? (tool.owner_hi || tool.ownerHi)
    : tool.owner;

  const features = isHindi
    ? (tool.features_hi || tool.featuresHi)
    : tool.features;

  const price = tool.price_per_day || tool.pricePerDay;

  const labels = isHindi
    ? {
        owner: 'मालिक',
        features: 'विशेषताएं',
        perDay: '/दिन',
        available: 'उपलब्ध',
        rented: 'किराए पर',
        call: 'कॉल',
        bookNow: 'अभी बुक करें',
      }
    : {
        owner: 'Owner',
        features: 'Features',
        perDay: '/day',
        available: 'Available',
        rented: 'Rented',
        call: 'Call',
        bookNow: 'Book Now',
      };

  const imageSrc = tool.image || "/images/default-tool.jpg";

  return (
    <article className="card tool-marketplace-card">

      {/* IMAGE */}
      <div className="tool-marketplace-image-wrap">
        <img
          src={imageSrc}
          alt={name}
          className="tool-marketplace-image"
          onError={(e) => {
            e.target.src = "/images/default-tool.jpg";
          }}
        />
      </div>

      {/* INFO */}
      <div className="tool-marketplace-info">

        <div className="tool-marketplace-title-row">
          <h3>{name}</h3>
          <span className="tool-marketplace-type">{type}</span>
        </div>

        <p className="tool-marketplace-meta">{location}</p>

        <p className="tool-marketplace-meta">
          <strong>{labels.owner}:</strong> {owner}
        </p>

        {/* FEATURES */}
        {features && (
          <div className="tool-marketplace-features">
            <strong>{labels.features}:</strong>
            <ul>
              {features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}

      </div>

      {/* ACTIONS */}
      <div className="tool-marketplace-actions">

        <span className={`tool-availability-badge ${tool.available ? 'available' : 'rented'}`}>
          {tool.available ? labels.available : labels.rented}
        </span>

        {/* PRICE */}
        <p className="tool-marketplace-price">
          &#8377; {price}
          <span>{labels.perDay}</span>
        </p>

        <button type="button" className="btn btn-outline tool-call-btn">
          <PhoneIcon />
          {labels.call}
        </button>

        <button
          type="button"
          className="btn btn-secondary tool-book-btn"
          disabled={!tool.available}
        >
          <CalendarIcon />
          {labels.bookNow}
        </button>

      </div>

    </article>
  );
}