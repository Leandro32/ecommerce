"use client";

import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { useEffect } from 'react';

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const detectedLng = localStorage.getItem('i18nextLng') || navigator.language.split('-')[0];
    if (detectedLng && i18n.language !== detectedLng) {
      i18n.changeLanguage(detectedLng);
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
