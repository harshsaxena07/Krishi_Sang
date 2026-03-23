import { useLanguage } from '../../context/LanguageContext';

// Static image used on the right side of the hero banner
const HERO_IMAGE = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=500&fit=crop';

export default function HeroBanner() {

  // Access translation values (for dynamic text like welcome message)
  const { t } = useLanguage();

  return (

    // Main hero section (top banner of dashboard)
    <section className="dashboard-hero" aria-label="Welcome banner">

      {/* Wrapper to control layout (text + image side by side) */}
      <div className="dashboard-hero-content">

        {/* Left side: welcome text */}
        <div className="dashboard-hero-text">
          <h1>{t.welcome}</h1>
          <p>{t.empower}</p>
        </div>

        {/* Right side: image */}
        <div className="dashboard-hero-image">
          <img
            src={HERO_IMAGE}
            alt="Farmer holding basket of vegetables in farm field"
          />
        </div>

      </div>
    </section>
  );
}