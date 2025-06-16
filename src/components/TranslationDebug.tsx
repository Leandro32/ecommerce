import React from 'react';
import { useTranslation } from 'react-i18next';

const TranslationDebug: React.FC = () => {
  const { t, i18n } = useTranslation(['navigation', 'common', 'products']);

  return (
    <div className="p-4 bg-gray-100 border rounded-lg m-4">
      <h3 className="font-bold text-lg mb-3">Translation Debug</h3>
      <div className="space-y-2 text-sm">
        <p><strong>Current Language:</strong> {i18n.language}</p>
        <p><strong>Navigation Home:</strong> {t('navigation:main.home')}</p>
        <p><strong>Navigation Products:</strong> {t('navigation:main.products')}</p>
        <p><strong>Common Search:</strong> {t('common:buttons.search')}</p>
        <p><strong>Products All:</strong> {t('products:titles.allProducts')}</p>
        <div className="mt-2">
          <strong>Test Buttons:</strong>
          <div className="flex gap-2 mt-1">
            <button 
              onClick={() => i18n.changeLanguage('en')}
              className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
            >
              EN
            </button>
            <button 
              onClick={() => i18n.changeLanguage('es')}
              className="px-2 py-1 bg-green-500 text-white rounded text-xs"
            >
              ES
            </button>
            <button 
              onClick={() => i18n.changeLanguage('pt')}
              className="px-2 py-1 bg-purple-500 text-white rounded text-xs"
            >
              PT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationDebug; 