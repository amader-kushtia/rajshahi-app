import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'bn' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (bn: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      return (localStorage.getItem('kushtia_app_lang') as Language) || 'bn';
    } catch {
      return 'bn';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('kushtia_app_lang', lang);
    } catch (e) {
      console.warn('Error saving language preference:', e);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  const t = (bn: string, en: string): string => {
    return language === 'en' ? en : bn;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
