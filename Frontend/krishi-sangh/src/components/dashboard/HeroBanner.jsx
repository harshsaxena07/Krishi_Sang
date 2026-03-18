import { useLanguage } from '../../context/LanguageContext';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=500&fit=crop';

export default function HeroBanner() {
  const { t } = useLanguage();

  return (
    <section className="dashboard-hero" aria-label="Welcome banner">
      <div className="dashboard-hero-content">
        <div className="dashboard-hero-text">
          <h1>{t.welcome}</h1>
          <p>{t.empower}</p>
        </div>
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
