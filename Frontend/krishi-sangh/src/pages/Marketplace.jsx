import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import MainTopBar from "../components/layout/MainTopBar";
import LocationModal from "../components/location/LocationModal";
import { useLocation } from "../hooks/useLocation";
import "../styles/pages/marketplace.css";
import "../styles/location.css";

const FILTER_ALL = "All";
const FILTER_FERTILIZERS = "Fertilizers";
const FILTER_PESTICIDES = "Pesticides";

const FILTERS = [FILTER_ALL, FILTER_FERTILIZERS, FILTER_PESTICIDES];

export default function Marketplace() {
  const { language } = useLanguage();
  const {
    lat,
    lng,
    loading: locationLoading,
    saveLocation,
    clearLocation,
  } = useLocation();

  const [filter, setFilter] = useState(FILTER_ALL);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Language content
  const copy =
    language === "hi"
      ? {
          badge: "\u0915\u0943\u0937\u093f \u092c\u093e\u091c\u093e\u0930",
          title: "\u0909\u0930\u094d\u0935\u0930\u0915 \u0914\u0930 \u0915\u0940\u091f\u0928\u093e\u0936\u0915 \u092e\u093e\u0930\u094d\u0915\u0947\u091f\u092a\u094d\u0932\u0947\u0938",
          subtitle: "\u0935\u093f\u0936\u094d\u0935\u0938\u0928\u0940\u092f \u092a\u094d\u0932\u0947\u091f\u092b\u0949\u0930\u094d\u092e \u0938\u0947 \u0915\u0943\u0937\u093f \u0909\u0924\u094d\u092a\u093e\u0926 \u0916\u094b\u091c\u0947\u0902",
          filters: {
            All: "\u0938\u092d\u0940",
            Fertilizers: "\u0909\u0930\u094d\u0935\u0930\u0915",
            Pesticides: "\u0915\u0940\u091f\u0928\u093e\u0936\u0915",
          },
          buy: "\u0916\u0930\u0940\u0926\u0947\u0902",
          loading: "\u0932\u094b\u0921 \u0939\u094b \u0930\u0939\u093e \u0939\u0948...",
        }
      : {
          badge: "Marketplace",
          title: "Fertilizers & Pesticides Marketplace",
          subtitle: "Trusted agricultural products from verified platforms",
          filters: {
            All: "All",
            Fertilizers: "Fertilizers",
            Pesticides: "Pesticides",
          },
          buy: "Buy Now",
          loading: "Loading products...",
        };

  useEffect(() => {
    if (!locationLoading && (lat == null || lng == null)) {
      setShowLocationModal(true);
    }
  }, [lat, lng, locationLoading]);

  const handleLocationSelected = (nextLocation) => {
    saveLocation(nextLocation);
    setShowLocationModal(false);
  };

  const handleChangeLocation = () => {
    clearLocation();
    setProducts([]);
    setWarning("");
    setShowLocationModal(true);
  };

  // Fetch products
  useEffect(() => {
    if (lat == null || lng == null) return;

    let isActive = true;

    const fetchProducts = async () => {
      setLoading(true);
      setWarning("");

      try {
        const res = await fetch(`http://127.0.0.1:5001/api/marketplace/nearby?lat=${lat}&lng=${lng}`);
        if (!res.ok) {
          console.error("Marketplace API returned non-OK status:", res.status);
        }

        const response = await res.json();
        const products = response.data || [];

        console.log("API RESPONSE:", response);
        console.log("PRODUCTS:", products);
        console.log("LAT LNG:", lat, lng);

        if (!isActive) return;

        setProducts(products);
        setWarning("");
      } catch (err) {
        console.error("Error fetching marketplace products:", err);
        if (isActive) {
          setProducts([]);
          setWarning("Unable to load nearby marketplace data");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isActive = false;
    };
  }, [lat, lng]);

  // Filter logic
  const filteredProducts = useMemo(() => {
    if (filter === FILTER_ALL) return products;
    return products.filter((p) =>
      p.type?.toLowerCase() === filter.toLowerCase()
    );
  }, [filter, products]);

  const displayProducts =
    products.length > 0 && filteredProducts.length === 0
      ? products
      : filteredProducts;

  return (
    <div className="page marketplace-page marketplace-page-wide">
      <MainTopBar />

      {showLocationModal && (
        <LocationModal onLocationSelected={handleLocationSelected} />
      )}

      <header className="marketplace-page-header">
        {lat != null && lng != null && (
          <div className="marketplace-header-actions">
            <button
              className="marketplace-change-location-btn"
              type="button"
              onClick={handleChangeLocation}
            >
              Change Location
            </button>
          </div>
        )}

        <span className="marketplace-page-badge">{copy.badge}</span>
        <h1 className="marketplace-page-title">{copy.title}</h1>
        <p className="marketplace-page-subtitle">{copy.subtitle}</p>
      </header>

      {/* Filters */}
      <div className="marketplace-filters">
        {FILTERS.map((item) => (
          <button
            key={item}
            className={`marketplace-filter-btn ${
              filter === item ? "active" : ""
            }`}
            onClick={() => setFilter(item)}
          >
            {copy.filters[item]}
          </button>
        ))}
      </div>

      {/* Warning */}
      {warning && (
        <p className="marketplace-page-warning">
          {warning}
        </p>
      )}

      {/* Loading */}
      {locationLoading || loading ? (
        <p className="marketplace-page-loading">
          {loading ? "Loading nearby products..." : copy.loading}
        </p>
      ) : displayProducts.length === 0 ? (
        <p className="marketplace-empty-state">No products available near you</p>
      ) : (
        <div className="marketplace-detail-grid">
          {displayProducts.map((item) => {
            const title = language === "hi" && item.name_hi ? item.name_hi : item.name;
            const description = language === "hi" && item.description_hi ? item.description_hi : item.description;
            const benefits =
              language === "hi" && item.benefits_hi && item.benefits_hi.length > 0
                ? item.benefits_hi
                : item.benefits || [];
            const distanceValue = Number(item.distance);
            const distanceText = Number.isFinite(distanceValue)
              ? distanceValue.toFixed(2)
              : null;
            const reviewsLabel = language === "hi" ? "\u0938\u092e\u0940\u0915\u094d\u0937\u093e\u090f\u0902" : "reviews";
            const distanceLabel = language === "hi" ? "\u0915\u093f\u092e\u0940 \u0926\u0942\u0930" : "km away";
            const storeLocation = [item.store, item.city].filter(Boolean).join(", ");

            return (
              <article key={item.id} className="marketplace-card">
                <div className="marketplace-image-wrap">
                  <img
                    src={item.image}
                    alt={title}
                    onError={(e) =>
                      (e.target.src =
                        "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=60")
                    }
                  />
                </div>

                <div className="marketplace-content">
                  <div className="marketplace-card-head">
                    <h3>{title}</h3>
                    <div className="price">{item.price}</div>
                  </div>

                  <div className="marketplace-meta-row">
                    <span className="badge">{item.company}</span>
                    <span className="product-type-badge">{item.type}</span>
                  </div>

                  <div className="rating-row">
                    <span className="star-icon" aria-hidden="true">{"\u2605"}</span>
                    <span>
                      {item.rating} ({item.reviews} {reviewsLabel})
                    </span>
                  </div>

                  <p className="desc">{description}</p>

                  <ul className="benefits">
                    {benefits.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>

                  {(storeLocation || distanceText) && (
                    <div className="store-info">
                      {storeLocation && <div>{"\uD83D\uDCCD"} {storeLocation}</div>}
                      {distanceText && (
                        <div className="distance">
                          {"\uD83E\uDDED"} {distanceText} {distanceLabel}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="platform">
                    {language === "hi" ? `\u0909\u092a\u0932\u092c\u094d\u0927 \u0939\u0948 ${item.platform}` : `Available on ${item.platform}`}
                  </div>

                  <button
                    className="buy-btn"
                    onClick={() => window.open(item.link, "_blank")}
                  >
                    {copy.buy}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <style>
        {`
          .marketplace-card .marketplace-card-head {
            gap: 0.45rem;
          }

          .marketplace-card .price {
            padding: 0.18rem 0;
          }

          .rating-row {
            display: flex;
            align-items: center;
            gap: 6px;
            font-weight: 500;
            margin: 6px 0;
            color: #475569;
            font-size: 0.9rem;
            line-height: 1.4;
          }

          .star-icon {
            color: #f4c430;
            font-size: 1rem;
            line-height: 1;
          }

          .store-info {
            display: grid;
            gap: 4px;
            font-size: 13px;
            color: #555;
            margin-top: 8px;
            padding: 0.72rem 0.8rem;
            border: 1px solid rgba(46, 125, 50, 0.12);
            border-radius: 12px;
            background: rgba(240, 253, 244, 0.78);
            line-height: 1.45;
          }

          .distance {
            font-size: 12px;
            color: #2e7d32;
            font-weight: 500;
          }
        `}
      </style>
    </div>
  );
}
