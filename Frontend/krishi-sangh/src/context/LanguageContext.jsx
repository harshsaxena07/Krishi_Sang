import { createContext, useContext, useState } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext({ language: 'en', setLanguage: () => {}, t: translations.en });

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
