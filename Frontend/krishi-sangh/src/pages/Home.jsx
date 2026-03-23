import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import "../styles/pages/home.css";

// Wrapper to keep all icons visually consistent across cards
function IconWrapper({ children }) {
  return (
    <span className="home-icon-wrap" aria-hidden="true">
      {children}
    </span>
  );
}

// Custom SVG icons (avoids external icon libraries)
function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m3 10 9-6 9 6" />
      <path d="M4 10h16" />
      <path d="M6 10v8" />
      <path d="M10 10v8" />
      <path d="M14 10v8" />
      <path d="M18 10v8" />
      <path d="M3 18h18" />
    </svg>
  );
}

function SproutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 22v-9" />
      <path d="M7 13c0-3 2-5 5-5" />
      <path d="M17 13c0-3-2-5-5-5" />
      <path d="M6 8c1.5-2 4-3 6-3" />
      <path d="M18 8c-1.5-2-4-3-6-3" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3 4 7v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V7z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function BotIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="7" width="16" height="12" rx="3" />
      <path d="M12 3v4" />
      <circle cx="9" cy="13" r="1" />
      <circle cx="15" cy="13" r="1" />
      <path d="M9 16h6" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a13 13 0 0 1 0 18" />
      <path d="M12 3a13 13 0 0 0 0 18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

// Main homepage component
export default function Home() {

  // Accessing translation function from global context (for multi-language UI)
  const { t } = useLanguage();

  // Services shown on homepage (drives UI dynamically)
  const services = [
    { title: 'Government Schemes', description: 'Access latest farmer welfare schemes', icon: <FileIcon />, link: '/schemes' },
    { title: 'Bank Loans', description: 'Find suitable agricultural loans', icon: <BankIcon />, link: '/loans' },
    { title: 'Crop Recommendation', description: 'AI-based crop suggestions', icon: <SproutIcon />, link: '/crop-detection' },
    { title: 'Disease Detection', description: 'Identify crop diseases instantly', icon: <ShieldIcon />, link: '/chatbot' },
  ];

  // Highlights/strengths section
  const strengths = [
    { title: 'AI-powered farming tools', icon: <BotIcon /> },
    { title: 'Trusted government data', icon: <FileIcon /> },
    { title: 'Easy to use platform', icon: <CheckIcon /> },
    { title: 'Multi-language support', icon: <GlobeIcon /> },
  ];

  // Step-by-step explanation of how platform works
  const steps = [
    { title: 'Enter your data', detail: 'Fill in soil and farm details in simple forms.' },
    { title: 'Get AI recommendations', detail: 'Receive smart suggestions tailored to your farm.' },
    { title: 'Take action', detail: 'Apply insights to improve productivity and reduce risk.' },
  ];

  // Stats section (builds user trust)
  const stats = [
    { value: '10,000+', label: 'Farmers Supported' },
    { value: '500+', label: 'Schemes Listed' },
    { value: '200+', label: 'Tools Available' },
    { value: '95%', label: 'Satisfaction Rate' },
  ];

  // Testimonials from users (UI content)
  const testimonials = [
    { quote: 'KrishiSangh helped me choose the right crop and increased my yield.', name: 'Ramesh Kumar', location: 'Uttar Pradesh' },
    { quote: 'The loan and scheme details are clear and easy to compare in one place.', name: 'Sunita Devi', location: 'Bihar' },
    { quote: 'I now make faster decisions because recommendations are simple and practical.', name: 'Mahesh Patil', location: 'Maharashtra' },
  ];

  return (
    <div className="page home-page home-landing-page">

      {/* Hero section: first impression + navigation */}
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-hero-text">
            <h1>KrishiSangh</h1>
            <p>Digital Farming Support System - Empowering Farmers with Smart Technology</p>

            {/* Navigation handled using React Router (no page reload) */}
            <div className="home-hero-actions">
              <Link to="/dashboard" className="btn btn-secondary">
                {t.homeGoDashboard}
              </Link>

              <Link to="/schemes" className="btn btn-outline home-hero-outline-btn">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services rendered dynamically using map */}
      <section className="home-section">
        <div className="home-section-head">
          <h2>Our Services</h2>
          <p>Everything a farmer needs to make better, faster, and safer decisions.</p>
        </div>

        <div className="home-services-grid">
          {services.map((service) => (
            <Link key={service.title} to={service.link} className="home-service-card">
              <IconWrapper>{service.icon}</IconWrapper>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Strengths section */}
      <section className="home-section">
        <div className="home-section-head">
          <h2>Why Choose KrishiSangh?</h2>
        </div>

        <div className="home-why-grid">
          {strengths.map((item) => (
            <article key={item.title} className="home-why-card">
              <IconWrapper>{item.icon}</IconWrapper>
              <p>{item.title}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Step-by-step flow */}
      <section className="home-section">
        <div className="home-section-head">
          <h2>How It Works</h2>
        </div>

        <div className="home-steps-grid">
          {steps.map((step, index) => (
            <article key={step.title} className="home-step-card">
              <span className="home-step-number">{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.detail}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Stats display */}
      <section className="home-stats-section">
        <div className="home-stats-grid">
          {stats.map((stat) => (
            <article key={stat.label} className="home-stat-card">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="home-section">
        <div className="home-section-head">
          <h2>What Farmers Say</h2>
        </div>

        <div className="home-testimonial-grid">
          {testimonials.map((item) => (
            <article key={item.name + item.location} className="home-testimonial-card">
              <p className="home-testimonial-quote">"{item.quote}"</p>
              <p className="home-testimonial-name">{item.name}</p>
              <p className="home-testimonial-location">{item.location}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Final call-to-action */}
      <section className="home-cta-section">
        <div className="home-cta-content">
          <h2>Start Your Smart Farming Journey Today</h2>

          <Link to="/dashboard" className="btn btn-secondary home-cta-btn">
            {t.homeGoDashboard}
          </Link>
        </div>
      </section>

    </div>
  );
}