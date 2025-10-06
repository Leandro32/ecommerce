'use client';

import React from 'react';
import { SWRConfig } from 'swr';
import fetcher from '../../lib/fetcher';
import { AppProvider } from '../context/AppProvider';

interface StoreProvidersProps {
  children: React.ReactNode;
}

const StoreProviders: React.FC<StoreProvidersProps> = ({ children }) => {
  return (
    <SWRConfig value={{ fetcher }}>
      <AppProvider>
        {children}
      </AppProvider>
    </SWRConfig>
  );
};

export default StoreProviders;
