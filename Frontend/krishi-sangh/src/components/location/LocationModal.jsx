import { useEffect, useState } from "react";
import "../../styles/location.css";

const CITY_LOCATIONS = {
  dehradun: { lat: 30.3165, lng: 78.0322 },
  haridwar: { lat: 29.9457, lng: 78.1642 },
  rishikesh: { lat: 30.0869, lng: 78.2676 },
};

export default function LocationModal({ onLocationSelected }) {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleUseLocation = () => {
    setError("");

    if (!navigator.geolocation) {
      setShowManualInput(true);
      setError("Location access is not available in this browser.");
      return;
    }

    setIsDetecting(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsDetecting(false);
        onLocationSelected({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setIsDetecting(false);
        setShowManualInput(true);
        setError("Location access was denied. Enter your city to continue.");
      }
    );
  };

  const handleManualSubmit = (event) => {
    event.preventDefault();

    const mappedLocation = CITY_LOCATIONS[city.trim().toLowerCase()];

    if (!mappedLocation) {
      setError("Please enter Dehradun, Haridwar, or Rishikesh.");
      return;
    }

    onLocationSelected(mappedLocation);
  };

  return (
    <div className="location-modal-overlay" role="presentation">
      <section
        className="location-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-modal-title"
      >
        <h2 id="location-modal-title">Allow Location Access</h2>
        <p>We need your location to show nearby products</p>

        <button
          className="location-primary-btn"
          type="button"
          onClick={handleUseLocation}
          disabled={isDetecting}
        >
          {isDetecting ? "Detecting location..." : "Use My Location"}
        </button>

        {showManualInput && (
          <form className="location-manual-form" onSubmit={handleManualSubmit}>
            <label htmlFor="manual-city">Enter your city</label>
            <input
              id="manual-city"
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Dehradun"
              autoComplete="address-level2"
            />
            <button className="location-primary-btn" type="submit">
              Continue
            </button>
          </form>
        )}

        {error && <p className="location-modal-error">{error}</p>}
      </section>
    </div>
  );
}
