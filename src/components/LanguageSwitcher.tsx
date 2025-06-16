import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';

interface LanguageSwitcherProps {
  className?: string;
  showLabel?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  className = '', 
  showLabel = false 
}) => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <div className={`relative group ${className}`}>
      <button
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 
                   hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 
                   focus:ring-offset-2 rounded-md transition-colors duration-200"
        aria-label="Change language"
      >
        <Icon icon="mdi:web" className="w-4 h-4" />
        <span className="flex items-center gap-1">
          <span>{currentLanguage.flag}</span>
          {showLabel && <span>{currentLanguage.name}</span>}
        </span>
      </button>

      {/* Dropdown menu */}
      <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 
                      rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 
                      group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3
                         hover:bg-gray-50 transition-colors duration-150
                         ${i18n.language === language.code 
                           ? 'bg-blue-50 text-blue-700 font-medium' 
                           : 'text-gray-700'
                         }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span>{language.name}</span>
              {i18n.language === language.code && (
                <span className="ml-auto text-blue-600">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher; 