import { useLanguage } from '../../context/LanguageContext';

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.11.37 2.3.56 3.58.56a1 1 0 011 1V20a1 1 0 01-1 1C10.3 21 3 13.7 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.28.19 2.47.56 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v13a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 15H5V10h14v9zm0-11H5V6h14v2z" />
    </svg>
  );
}

export default function ToolCard({ tool }) {
  const { language } = useLanguage();

  const isHindi = language === 'hi';
  const name = isHindi ? tool.nameHi : tool.name;
  const type = isHindi ? tool.typeHi : tool.type;
  const location = isHindi ? tool.locationHi : tool.location;
  const owner = isHindi ? tool.ownerHi : tool.owner;
  const features = isHindi ? tool.featuresHi : tool.features;

  const labels = isHindi
    ? {
        owner: '\u092e\u093e\u0932\u093f\u0915',
        rating: '\u0930\u0947\u091f\u093f\u0902\u0917',
        features: '\u0935\u093f\u0936\u0947\u0937\u0924\u093e\u090f\u0902',
        perDay: '/\u0926\u093f\u0928',
        available: '\u0909\u092a\u0932\u092c\u094d\u0927',
        rented: '\u0915\u093f\u0930\u093e\u090f \u092a\u0930',
        call: '\u0915\u0949\u0932',
        bookNow: '\u0905\u092d\u0940 \u092c\u0941\u0915 \u0915\u0930\u0947\u0902',
      }
    : {
        owner: 'Owner',
        rating: 'Rating',
        features: 'Features',
        perDay: '/day',
        available: 'Available',
        rented: 'Rented',
        call: 'Call',
        bookNow: 'Book Now',
      };

  return (
    <article className="card tool-marketplace-card">
      <div className="tool-marketplace-image-wrap">
        <img src={tool.image} alt={name} className="tool-marketplace-image" />
      </div>

      <div className="tool-marketplace-info">
        <div className="tool-marketplace-title-row">
          <h3>{name}</h3>
          <span className="tool-marketplace-type">{type}</span>
        </div>

        <p className="tool-marketplace-meta">{location}</p>
        <p className="tool-marketplace-meta">
          <strong>{labels.owner}:</strong> {owner}
        </p>
        <p className="tool-marketplace-meta">
          <strong>{labels.rating}:</strong> {tool.rating} / 5
        </p>

        <div className="tool-marketplace-features">
          <strong>{labels.features}:</strong>
          <ul>
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="tool-marketplace-actions">
        <span className={`tool-availability-badge ${tool.available ? 'available' : 'rented'}`}>
          {tool.available ? labels.available : labels.rented}
        </span>

        <p className="tool-marketplace-price">
          ?{tool.pricePerDay}
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
