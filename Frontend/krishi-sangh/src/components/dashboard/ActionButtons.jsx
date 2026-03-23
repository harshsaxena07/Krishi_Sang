import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

// Custom icon for crop upload feature
function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 15.2c1.65 0 3-1.35 3-3s-1.35-3-3-3-3 1.35-3 3 1.35 3 3 3zM9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
    </svg>
  );
}

// Icon for schemes/documents
function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
    </svg>
  );
}

// Icon for loans/bank section
function BankIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2L2 7v2h2v10h4V9h4v10h4V9h2V7L12 2z" />
    </svg>
  );
}

// Icon for crop advisory (coming soon feature)
function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1.39-2.5c.5.12 1 .18 1.5.18 3.31 0 6-2.69 6-6 0-1.5-.55-2.87-1.46-3.94L17 8z" />
    </svg>
  );
}

export default function ActionButtons() {

  // Access translation keys for multi-language labels
  const { t } = useLanguage();

  // Configuration-driven approach for buttons (clean and scalable)
  const actions = [
    { to: '/crop-detection', labelKey: 'uploadCrop', icon: CameraIcon },
    { to: '/schemes', labelKey: 'govtSchemes', icon: DocumentIcon },
    { to: '/loans', labelKey: 'bankLoanInfo', icon: BankIcon },
    { labelKey: 'cropAdvisory', icon: LeafIcon, comingSoon: true },
  ];

  return (

    // Container for all action buttons
    <div className="action-buttons">

      {/* Dynamically render buttons using map */}
      {actions.map(({ to, labelKey, icon: Icon, comingSoon }) =>

        // If feature is not ready, show disabled-style button
        comingSoon ? (
          <div
            key={labelKey}
            className="action-btn coming-soon"
            aria-disabled="true"
          >
            <Icon />
            <span>{t[labelKey]}</span>
          </div>
        ) : (

          // Otherwise render clickable navigation button
          <Link key={labelKey} to={to} className="action-btn">
            <Icon />
            <span>{t[labelKey]}</span>
          </Link>
        )
      )}
    </div>
  );
}