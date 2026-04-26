import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import '../styles/pages/home.css';

function IconWrapper({ children }) {
  return (
    <span className="home-icon-wrap" aria-hidden="true">
      {children}
    </span>
  );
}

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

export default function Home() {
  const { t, language } = useLanguage();

  const isHindi = language === 'hi';

  const services = [
    {
      title: isHindi ? 'सरकारी योजनाएँ' : 'Government Schemes',
      tag: isHindi ? 'नई योजनाएँ' : 'Latest Updates',
      description: isHindi
        ? 'केंद्र और राज्य सरकार की योजनाओं को एक ही जगह पर आसानी से तुलना करें।'
        : 'Explore central and state schemes in one place with clear eligibility and document requirements.',
      icon: <FileIcon />,
      link: '/schemes',
      image: '/images/pmkishaan.jpg',
    },
    {
      title: isHindi ? 'बैंक लोन' : 'Bank Loans',
      tag: isHindi ? 'सही वित्त विकल्प' : 'Finance Options',
      description: isHindi
        ? 'आपके लिए उपयुक्त बैंक ऋण योजनाएँ देखें और महत्वपूर्ण शर्तों को समझें।'
        : 'Compare agricultural loan products and choose funding that matches your crop and season needs.',
      icon: <BankIcon />,
      link: '/loans',
      image: '/images/sbi.png',
    },
    {
      title: isHindi ? 'फसल सुझाव' : 'Crop Recommendation',
      tag: isHindi ? 'AI सहायता' : 'AI Advisory',
      description: isHindi
        ? 'मिट्टी और खेत की जानकारी के आधार पर बेहतर फसल का सुझाव पाएँ।'
        : 'Get data-driven crop suggestions tailored to your land, season, and soil profile.',
      icon: <SproutIcon />,
      link: '/crop-detection',
      image: '/images/fasalbima.jpg',
    },
    {
      title: isHindi ? 'रोग पहचान' : 'Disease Detection',
      tag: isHindi ? 'तुरंत पहचान' : 'Quick Diagnosis',
      description: isHindi
        ? 'पत्ती की तस्वीर अपलोड करके समस्या पहचानें और सुरक्षा के सुझाव पाएँ।'
        : 'Upload crop images to quickly identify diseases and receive practical treatment guidance.',
      icon: <ShieldIcon />,
      link: '/chatbot',
      image: '/images/fieldmaster.jpg',
    },
  ];

  const strengths = [
    { title: isHindi ? 'AI आधारित उपकरण' : 'AI-powered farming tools', icon: <BotIcon /> },
    { title: isHindi ? 'विश्वसनीय सरकारी डेटा' : 'Trusted government data', icon: <FileIcon /> },
    { title: isHindi ? 'सरल और तेज उपयोग' : 'Easy and fast to use', icon: <CheckIcon /> },
    { title: isHindi ? 'बहुभाषी समर्थन' : 'Multi-language support', icon: <GlobeIcon /> },
  ];

  const steps = [
    {
      title: isHindi ? 'अपना डेटा दर्ज करें' : 'Enter your data',
      detail: isHindi
        ? 'मिट्टी और खेत की जानकारी सरल फॉर्म में भरें।'
        : 'Fill in soil and farm details using simple forms.',
    },
    {
      title: isHindi ? 'AI सुझाव प्राप्त करें' : 'Get AI recommendations',
      detail: isHindi
        ? 'आपके खेत के अनुसार स्मार्ट सुझाव प्राप्त करें।'
        : 'Receive practical recommendations tailored to your farm.',
    },
    {
      title: isHindi ? 'कार्रवाई करें' : 'Take action',
      detail: isHindi
        ? 'सुझावों को अपनाकर लागत घटाएँ और उत्पादन बढ़ाएँ।'
        : 'Use recommendations to improve output and reduce risk.',
    },
  ];

  const stats = [
    { value: '10,000+', label: isHindi ? 'किसान समर्थित' : 'Farmers Supported' },
    { value: '500+', label: isHindi ? 'योजनाएँ सूचीबद्ध' : 'Schemes Listed' },
    { value: '200+', label: isHindi ? 'उपकरण उपलब्ध' : 'Tools Available' },
    { value: '95%', label: isHindi ? 'संतुष्टि दर' : 'Satisfaction Rate' },
  ];

  const testimonials = [
    {
      quote: isHindi
        ? 'KrishiSangh से सही फसल चुनने में मदद मिली और उत्पादन बढ़ा।'
        : 'KrishiSangh helped me choose the right crop and increased my yield.',
      name: 'Ramesh Kumar',
      location: 'Uttar Pradesh',
    },
    {
      quote: isHindi
        ? 'ऋण और योजनाओं की तुलना बहुत स्पष्ट और आसान है।'
        : 'The loan and scheme details are clear and easy to compare in one place.',
      name: 'Sunita Devi',
      location: 'Bihar',
    },
    {
      quote: isHindi
        ? 'AI सुझावों की वजह से खेती के निर्णय तेज़ और बेहतर हुए।'
        : 'I now make faster decisions because recommendations are simple and practical.',
      name: 'Mahesh Patil',
      location: 'Maharashtra',
    },
  ];

  return (
    <div className="page home-page home-landing-page">
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-hero-text">
            <span className="home-hero-kicker">KrishiSangh Platform</span>
            <h1>KrishiSangh</h1>
            <p>
              {isHindi
                ? 'डिजिटल खेती समर्थन प्रणाली - स्मार्ट टेक्नोलॉजी के साथ किसानों को सशक्त बनाना'
                : 'Digital Farming Support System - Empowering Farmers with Smart Technology'}
            </p>

            <div className="home-hero-actions">
              <Link to="/dashboard" className="btn btn-secondary">
                {t.homeGoDashboard}
              </Link>
              <Link to="/schemes" className="btn btn-outline home-hero-outline-btn">
                {isHindi ? 'सेवाएँ देखें' : 'Explore Services'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-head">
          <h2>{isHindi ? 'हमारी सेवाएँ' : 'Our Services'}</h2>
          <p>
            {isHindi
              ? 'खेती से जुड़े निर्णयों के लिए एक व्यवस्थित, भरोसेमंद और आधुनिक प्लेटफ़ॉर्म।'
              : 'A professional set of services designed to support key farming decisions.'}
          </p>
        </div>

        <div className="home-services-grid">
          {services.map((service) => (
            <article key={service.title} className="home-service-card">
              <div className="home-service-image-wrap">
                <img
                  src={service.image}
                  alt={service.title}
                  className="home-service-image"
                  loading="lazy"
                />
              </div>

              <div className="home-service-content">
                <div className="home-service-top">
                  <IconWrapper>{service.icon}</IconWrapper>
                  <span className="home-service-tag">{service.tag}</span>
                </div>

                <h3>{service.title}</h3>
                <p>{service.description}</p>

                <div className="home-service-actions">
                  <Link to={service.link} className="btn btn-outline">
                    {isHindi ? 'विवरण' : 'Details'}
                  </Link>
                  <Link to={service.link} className="btn btn-secondary">
                    {isHindi ? 'जानें / आवेदन करें' : 'Know More / Apply'}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-head">
          <h2>{isHindi ? 'क्यों चुनें?' : 'Why Choose KrishiSangh?'}</h2>
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

      <section className="home-section">
        <div className="home-section-head">
          <h2>{isHindi ? 'कैसे काम करता है' : 'How It Works'}</h2>
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

      <section className="home-section">
        <div className="home-section-head">
          <h2>{isHindi ? 'किसान क्या कहते हैं' : 'What Farmers Say'}</h2>
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

      <section className="home-cta-section">
        <div className="home-cta-content">
          <h2>
            {isHindi ? 'आज ही अपनी स्मार्ट खेती यात्रा शुरू करें' : 'Start Your Smart Farming Journey Today'}
          </h2>

          <Link to="/dashboard" className="btn btn-secondary home-cta-btn">
            {t.homeGoDashboard}
          </Link>
        </div>
      </section>
    </div>
  );
}
