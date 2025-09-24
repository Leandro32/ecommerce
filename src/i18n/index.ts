import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
import enCommon from '../locales/en/common.json';
import enProducts from '../locales/en/products.json';
import enCheckout from '../locales/en/checkout.json';
import enNavigation from '../locales/en/navigation.json';

// Spanish translations
import esCommon from '../locales/es/common.json';
import esProducts from '../locales/es/products.json';
import esCheckout from '../locales/es/checkout.json';
import esNavigation from '../locales/es/navigation.json';

// Portuguese translations
import ptCommon from '../locales/pt/common.json';
import ptProducts from '../locales/pt/products.json';
import ptCheckout from '../locales/pt/checkout.json';
import ptNavigation from '../locales/pt/navigation.json';

const resources = {
  en: {
    common: enCommon,
    products: enProducts,
    checkout: enCheckout,
    navigation: enNavigation,
  },
  es: {
    common: esCommon,
    products: esProducts,
    checkout: esCheckout,
    navigation: esNavigation,
  },
  pt: {
    common: ptCommon,
    products: ptProducts,
    checkout: ptCheckout,
    navigation: ptNavigation,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    defaultNS: 'common',
    ns: ['common', 'products', 'checkout', 'navigation'],
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    
    react: {
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
      useSuspense: false,
    },
  });

export default i18n; 