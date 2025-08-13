import React, { createContext, useState, ReactNode } from 'react';

type Language = 'en' | 'gu';

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
    language: 'en',
    setLanguage: () => {},
});

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [language, setLanguage] = useState<Language>((localStorage.getItem('language') as Language) || 'en');

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};
